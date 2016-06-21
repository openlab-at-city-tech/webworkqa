<?php

namespace WeBWorK\Server\Response;

/**
 * Response API endpoint.
 */
class Endpoint extends \WP_Rest_Controller {
	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		$version = '1';
		$namespace = 'webwork/v' . $version;

		$base = 'responses';

		register_rest_route( $namespace, '/' . $base, array(
			array(
				'methods'         => \WP_REST_Server::CREATABLE,
				'callback'        => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
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
	public function get_collection_params() {
		return array(
			'is_answer' => array(
				'description'       => 'Whether a response is an answer to its question',
				'type'              => 'boolean',
				'sanitize_callback' => 'boolval',
			),
		);
	}

	public function create_item( $request ) {
		$params = $request->get_params();
		_b( $params );
		die();

		$item_id   = $params['item_id'];
		$raw_value = $params['value'];

		$value = null;
		if ( 'up' === $raw_value ) {
			$value = 1;
		} elseif ( 'down' === $raw_value ) {
			$value = -1;
		}

		$vote = new \WeBWorK\Server\Vote( get_current_user_id(), $item_id );

		// Don't allow duplicate votes.
		// This is not really RESTful. On a successful lookup, perform an update.
		$retval = false;
		if ( $vote->exists() && $value === $vote->get_value() ) {
			// do something
		} elseif ( $value ) {
			$vote->set_value( $value );
			$retval = $vote->save();
		} elseif ( $vote->exists() ) {
			$retval = $vote->delete();
		}

		$response = rest_ensure_response( $retval );

		if ( $retval ) {
			$response->set_status( 201 );
		} else {
			// We return 200 anyway. Not sure how to give good error feedback here.
			$response->set_status( 200 );
		}

		return $response;
	}

	public function create_item_permissions_check( $request ) {
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

	public function update_item_permissions_check( $request ) {
		if ( ! is_user_logged_in() ) {
			return false;
		}

		$params = $request->get_params();
		if ( ! isset( $params['id'] ) ) {
			return false;
		}

		$response_id = $params['id'];
		$response = new \WeBWorK\Server\Response( $response_id );

		if ( ! $response->exists() ) {
			return false;
		}

		$question_id = $response->get_question_id();
		if ( ! $question_id ) {
			return false;
		}

		// @todo modeling
		$question = get_post( $question_id );
		if ( ! $question ) {
			return false;
		}

		return $question->post_author == get_current_user_id();
	}

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
