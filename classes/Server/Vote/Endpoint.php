<?php

namespace WeBWorK\Server\Vote;

/**
 * Vote API endpoint.
 */
class Endpoint extends \WP_Rest_Controller {
	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		$version = '1';
		$namespace = 'webwork/v' . $version;

		$base = 'votes';

		register_rest_route( $namespace, '/' . $base, array(
			array(
				'methods' => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args' => $this->get_collection_params(),
			),
			array(
				'methods'         => \WP_REST_Server::CREATABLE,
				'callback'        => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'            => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
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
			'user_id' => array(
				'description'       => 'Votes placed by a given user',
				'type'              => 'integer',
				'sanitize_callback' => 'intval',
			),
			'item_id' => array(
				'description'       => 'Item whose votes are being fetched',
				'type'              => 'integer',
				'sanitize_callback' => 'intval',
			),
			'type' => array(
				'description'       => 'Vote return type ("count" or "object")',
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}

	public function get_items( $request ) {
		return array();
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
		$params = $request->get_params();

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

	public function get_item_schema() {
		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'type' => 'object',
			'properties' => array(
				'user_id' => array(
					'type' => 'integer',
				),
				'item_id' => array(
					'type' => 'integer',
				),
				'value' => array(
					'type' => 'string',
				),
			),
			'required' => array(
				'item_id',
				'value',
			),
		);

		return $schema;
	}
}
