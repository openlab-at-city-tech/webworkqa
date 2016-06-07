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

		$data = array(
			'problem' => $post,
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
