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

		/*
		register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)', array(
			array(
				'methods'         => \WP_REST_Server::EDITABLE,
				'callback'        => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::EDITABLE ),
			),
		) );
		*/
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
		$problem_text = $params['problem_text'];

		$question = new \WeBWorK\Server\Question();

		$question->set_author_id( get_current_user_id() );
		$question->set_content( $content );
		$question->set_tried( $tried );
		$question->set_problem_id( $problem_id );
		$question->set_problem_text( $problem_text );

		if ( $question->save() ) {
			// @todo Should use Query::get_for_endpoint() for this.
			$retval = array(
				'questionId' => $question->get_id(),
				'content' => $question->get_content(),
				'tried' => $question->get_tried(),
				'authorAvatar' => $question->get_author_avatar(),
				'authorName' => $question->get_author_name(),
				'problemText' => $question->get_problem_text(),
				'problemMaths' => $question->get_maths(),
				'problemInputs' => $question->get_inputs(),
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

	public function get_items( $request ) {
		$params = $request->get_params();
		$keys = array( 'orderby', 'order' );

		$args = array();
		foreach ( $keys as $k ) {
			if ( isset( $params[ $k ] ) ) {
				$args[ $k ] = $params[ $k ];
			}
		}

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
