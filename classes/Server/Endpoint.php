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
		) );

		$questions = array();
		$votes = array();
		$scores = array();
		$counter = 0;
		foreach ( $_questions as $question ) {
			$questions[ $question->ID ] = array(
				'title' => $question->post_title,
				'content' => $question->post_content,
			);

			// todo
			$counter++;
			$vote = $counter % 2 ? 'up' : 'down';
			$votes[ $question->ID ] = $vote;

			$scores[ $question->ID ] = rand( 0, 10 );
		}

		$questions_by_id = array_keys( $questions );

		$data = array(
			'problem' => $problem,
			'questions' => $questions,
			'questionsById' => $questions_by_id,
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
