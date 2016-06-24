<?php

namespace WeBWorK\Server;

/**
 * API Endpoint.
 *
 * @todo better failure if no wp-api
 */
class Endpoint extends \WP_Rest_Controller {
	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		$version = '1';
		$namespace = 'webwork/v' . $version;

		$base = 'problems';

		register_rest_route( $namespace, '/' . $base . '/(?P<id>\d+)', array(
			array(
				'methods' => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_item' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args' => array(

				),
			),
			/*
			array(
				'methods'         => WP_REST_Server::CREATABLE,
				'callback'        => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( true ),
			),
			*/
		) );
	}

	public function get_item( $request ) {
		$params = $request->get_params();

		$problem_id = $params['id'];

		$post = get_post( $problem_id );
		$problem = array(
			'title' => $post->post_title,
			'content' => $post->post_content,
			'ID' => $post->ID,
		);

		$_questions = get_posts( array(
			'post_type' => 'webwork_question',
			'meta_query' => array(
				array(
					'key' => 'webwork_problem_id',
					'value' => $problem_id,
				),
			),
			'posts_per_page' => -1,
		) );

		$questions = array();
		$scores = array();
		$counter = 0;
		foreach ( $_questions as $question ) {
			$author = get_userdata( $question->post_author );
			$questions[ $question->ID ] = array(
				'title' => $question->post_title,
				'content' => $question->post_content,
				'isMyQuestion' => is_user_logged_in() && $question->post_author == get_current_user_id(),
				'authorAvatar' => get_avatar_url( $question->post_author, array(
					'size' => 80,
				) ),
				'authorName' => $author->display_name,
			);

			// todo
			$counter++;
		}

		$questions_by_id = array_keys( $questions );

		// todo find a better way to do this
		$scores = array();
		foreach ( $questions_by_id as $qid ) {
			$vq = new Vote\Query( array(
				'item_id' => $qid,
				'user_id__not_in' => array( get_current_user_id() ),
			) );

			$q_votes = $vq->get();
			$score = 0;
			foreach ( $q_votes as $q_vote ) {
				$score += $q_vote->get_value();
			}

			$scores[ $qid ] = $score;
		}

		$vote_query = new Vote\Query( array(
			'user_id' => get_current_user_id(),
		) );
		$vote_data = $vote_query->get();

		$votes = array();
		foreach ( $vote_data as $vote ) {
			if ( 1 === $vote->get_value() ) {
				$value = 'up';
			} else {
				$value = 'down';
			}

			$votes[ $vote->get_item_id() ] = $value;
		}

		$response_query = new Response\Query( array(
			'question_id__in' => $questions_by_id,
		) );
		$_responses = $response_query->get();

		$responses = array();
		$answered = array();
		foreach ( $_responses as $response ) {
			$response_id = $response->get_id();
			$responses[ $response_id ] = array(
				'responseId' => $response_id,
				'content' => $response->get_content(),
				'authorAvatar' => $response->get_author_avatar(),
				'authorName' => $response->get_author_name(),
			);

			if ( $response->get_is_answer() ) {
				$answered[ $response_id ] = 1;
			}
		}

		$response_id_map = array();
		foreach ( $_responses as $response ) {
			$r_question_id = $response->get_question_id();
			$response_id_map[ $r_question_id ][] = $response->get_id();
		}

		$data = array(
			'answered' => $answered,
			'problem' => $problem,
			'questions' => $questions,
			'questionsById' => $questions_by_id,
			'responseIdMap' => $response_id_map,
			'responses' => $responses,
			'scores' => $scores,
			'votes' => $votes,
		);

		return $data;

	}

	public function get_items_permissions_check( $request ) {
		return true;
	}

	public function create_item( $request ) {

	}

	public function create_item_permissions_check( $request ) {
		return true;
	}
}
