<?php

namespace WeBWorK\Server\Question;

/**
 * Question API endpoint.
 */
class Endpoint extends \WP_Rest_Controller {
	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		$version = '1';
		$namespace = 'webwork/v' . $version;

		$base = 'questions';

		register_rest_route( $namespace, '/' . $base, array(
			array(
				'methods'         => \WP_REST_Server::CREATABLE,
				'callback'        => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
			),
			array(
				'methods' => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::READABLE ),
			),
		) );

		register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)', array(
			array(
				'methods'         => \WP_REST_Server::EDITABLE,
				'callback'        => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::EDITABLE ),
			),
		) );
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

		$problem_data = null;
		if ( isset( $params['post_data_key'] ) ) {
			$post_data_key = $params['post_data_key'];
			$problem_data = get_option( $post_data_key );

			// Don't ever keep this data around.
			delete_option( $post_data_key );
		}

		// Try fetching another question from the same problem.
		if ( ! $problem_data ) {
			$query = new Query( array(
				'problem_id' => $problem_id,
			) );

			$questions = $query->get();

			foreach ( $questions as $q ) {
				if ( $q->get_problem_text() ) {
					$problem_data = array(
						'problem_id' => $q->get_problem_id(),
						'problem_set' => $q->get_problem_set(),
						'course' => $q->get_course(),
						'section' => $q->get_section(),
						'problem_text' => $q->get_problem_text(),
					);

					break;
				}
			}
		}

		$question = new \WeBWorK\Server\Question();

		$question->set_author_id( get_current_user_id() );
		$question->set_content( $content );
		$question->set_tried( $tried );
		$question->set_problem_id( $problem_data['problem_id'] );
		$question->set_problem_set( $problem_data['problem_set'] );
		$question->set_course( $problem_data['course'] );
		$question->set_section( $problem_data['section'] );
		$question->set_problem_text( $problem_data['problem_text'] );
		$question->set_client_url( $params['client_url'] );
		$question->set_client_name( $params['client_name'] );

		if ( $question->save() ) {
			$query = new Query( array(
				'question_id' => $question->get_id(),
			) );

			$results = $query->get_for_endpoint();

			// @todo not found?
			$retval = reset( $results );

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

		$question = new \WeBWorK\Server\Question( $params['id'] );

		$retval = false;
		if ( $question->exists() ) {
			$question->set_content( $params['content'] );
			$question->set_tried( $params['tried'] );
			$retval = $question->save();
		}

		$response = rest_ensure_response( $retval );

		if ( $retval ) {
			$response->set_status( 200 );
		} else {
			$response->set_status( 500 );
		}

		return $response;
	}

	public function get_items( $request ) {
		$params = $request->get_params();
		$keys = array(
			'orderby',
			'order',
			'answered',
			'course',
			'section',
			'lastQuestion',
			'maxResults',
		);

		$args = array();
		foreach ( $keys as $k ) {
			if ( isset( $params[ $k ] ) ) {
				$args[ $k ] = $params[ $k ];
			}
		}

		// Programming
		if ( isset( $params['problemSet'] ) ) {
			$args['problem_set'] = $params['problemSet'];
		}

		$args['offset'] = (int) $params['offset'];
		$args['max_results'] = (int) $params['maxResults'];

		$q = new Query( $args );

		$questions = $q->get_for_endpoint();

		$retval = array(
			'questionIds' => array_keys( $questions ),
			'questions' => $questions,
		);

		$response = rest_ensure_response( $retval );

		return $response;
	}

	// @todo
	public function get_items_permissions_check( $request ) {
		return true;
	}

	public function update_item_permissions_check( $request ) {
		$params = $request->get_params();
		return current_user_can( 'edit_post', $params['id'] );
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
