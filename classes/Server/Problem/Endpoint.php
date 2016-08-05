<?php

namespace WeBWorK\Server\Problem;

/**
 * Problem API endpoint.
 */
class Endpoint extends \WP_Rest_Controller {
	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		$version = '1';
		$namespace = 'webwork/v' . $version;

		$base = 'problems';

		register_rest_route( $namespace, '/' . $base . '/?', array(
			array(
				'methods' => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_item' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::READABLE ),
			),
		) );
	}

	public function get_item( $request ) {
		$params = $request->get_params();

		$problem_id = $params['problem_id'];

		$post_data = array();
		if ( isset( $params['post_data_key'] ) ) {
			$post_data = get_option( $params['post_data_key'] );
		}

		$question_query = new \WeBWork\Server\Question\Query( array(
			'problem_id' => $problem_id,
			'orderby' => $params['orderby'],
			'order' => 'DESC',
		) );
		$questions = $question_query->get_for_endpoint();

		if ( ! $questions && $post_data ) {
			// Fake a problem from post data.
			$pf = new \WeBWorK\Server\Util\ProblemFormatter();

			$text = $post_data['problem_text'];
			$parsed = $pf->clean( $text );

			$problem = array(
				'problemId' => $problem_id,
				'libraryId' => $problem_id,
				'content' => $parsed['text'],
				'maths' => $parsed['maths'],
			);
		} else {
			/**
			 * If the current user has posted a question, use its data for problem.
			 *
			 * Start at the end of the array, since the first one is most likely
			 * to have a value (it came directly from WeBWorK).
			 */
			$my_question = null;
			foreach ( array_reverse( $questions ) as $question ) {
				if ( $question['isMyQuestion'] ) {
					$my_question = $question;
					_b( $my_question );
					break;
				}
			}

			if ( $my_question && ! empty( $my_question['problemText'] ) ) {
				$problem = array(
					'problemId' => $problem_id,
					'libraryId' => $problem_id,
					'content' => $my_question['problemText'],
					'maths' => $my_question['problemMaths'],
				);
			} else {
				// Just use the first one created.
				$the_question = end( $questions );
				$problem = array(
					'problemId' => $problem_id,
					'libraryId' => $problem_id,
					'content' => $the_question['problemText'],
					'maths' => $the_question['problemMaths'],
				);
			}
		}

		$questions_by_id = array_keys( $questions );

		$response_query = new \WeBWork\Server\Response\Query( array(
			'question_id__in' => $questions_by_id,
		) );
		$responses = $response_query->get_for_endpoint();

		$response_id_map = array();
		$response_ids = $questions_by_id;
		foreach ( $responses as $response ) {
			$r_question_id = $response['questionId'];
			$response_id_map[ $r_question_id ][] = $response['responseId'];
			$response_ids[] = $response['responseId'];
		}

		// todo find a better way to do this
		$scores = array();
		foreach ( $questions_by_id as $qid ) {
			$vq = new \WeBWork\Server\Vote\Query( array(
				'item_id' => $qid,
				'user_id__not_in' => array( get_current_user_id() ),
			) );

			$q_votes = $vq->get();
			$score = 0;
			foreach ( $q_votes as $q_vote ) {
				$score += $q_vote->value;
			}

			$scores[ $qid ] = $score;
		}

		$vote_query = new \WeBWork\Server\Vote\Query( array(
			'user_id' => get_current_user_id(),
			'item_id__in' => array_merge( $questions_by_id, $response_ids ),
		) );
		$vote_data = $vote_query->get();

		$votes = array();
		foreach ( $vote_data as $vote ) {
			if ( 1 == $vote->value ) {
				$value = 'up';
			} else {
				$value = 'down';
			}

			$votes[ $vote->item_id ] = $value;
		}

		$data = array(
			'filterOptions' => $question_query->get_all_filter_options(),
			'problems' => array( $problem_id => $problem ),
			'questions' => $questions,
			'questionsById' => $questions_by_id,
			'responseIdMap' => $response_id_map,
			'responses' => $responses,
			'scores' => $scores,
			'votes' => $votes,
		);

		return $data;
	}

	/**
	 * Get the query params for collections.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	/*
	public function get_collection_params() {
		return array(
			'is_answer' => array(
				'description'       => 'Whether a response is an answer to its question',
				'type'              => 'boolean',
				'sanitize_callback' => 'boolval',
			),
		);
	}
	*/

	public function create_item( $request ) {
		$params = $request->get_params();

		$problem_id = $params['problem_id'];
		$content = $params['content'];
		$tried = $params['tried'];

		$question = new \WeBWorK\Server\Question();

		$question->set_author_id( get_current_user_id() );
		$question->set_content( $content );
		$question->set_tried( $tried );
		$question->set_problem_id( $problem_id );

		if ( $question->save() ) {
			$retval = array(
				'questionId' => $question->get_id(),
				'content' => $question->get_content(),
				'tried' => $question->get_tried(),
				'authorAvatar' => $question->get_author_avatar(),
				'authorName' => $question->get_author_name(),
			);

			$r = rest_ensure_response( $retval );
			$r->set_status( 201 );
		} else {
			$r = rest_ensure_response( false );
			$r->set_status( 500 );
		}

		return $r;
	}

	public function create_item_permissions_check( $request ) {
		// @todo make this better
		return is_user_logged_in();
	}

	public function update_item( $request ) {
		$retval = false;

		$params = $request->get_params();
		if ( isset( $params['id'] ) && isset( $params['is_answer'] ) ) {
			$response = new \WeBWorK\Server\Response( $params['id'] );
			if ( $response->exists() ) {
				$response->set_is_answer( $params['is_answer'] );
				$retval = $response->save();
			}
		}

		$response = rest_ensure_response( $retval );

		if ( $retval ) {
			$response->set_status( 200 );
		} else {
			$response->set_status( 500 );
		}

		return $response;
	}

	// @todo
	public function get_items_permissions_check( $request ) {
		return true;
	}

	// @todo
	public function update_item_permissions_check( $request ) {
		return is_user_logged_in();
	}

	// @todo here and Response
	public function get_item_schema() {
		$schema = array(
			'$schema' => 'http://json-schema.org/draft-04/schema#',
			'type' => 'object',
			'properties' => array(
				'is_answer' => array(
					'type' => 'boolean',
				),
			),
		);

		return $schema;
	}
}
