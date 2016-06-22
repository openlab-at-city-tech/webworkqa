<?php

namespace WeBWorK\Server\Response;

/**
 * Response query.
 *
 * @since 1.0.0
 */
class Query {
	protected $r;

	public function __construct( $args ) {
		$this->r = array_merge( array(
			'question_id__in' => null,
			'orderby' => 'votes',
		), $args );
	}

	/**
	 * Get responses.
	 *
	 * @since 1.0.0
	 *
	 * @return array|int
	 */
	public function get() {
		$args = array(
			'post_type' => 'webwork_response',
			'update_post_term_cache' => false,
			'meta_query' => array(),
			'posts_per_page' => -1,
		);

		if ( $this->r['question_id__in'] ) {
			$args['meta_query']['question_id__in'] = array(
				'key' => 'webwork_question_id',
				'value' => array_map( 'intval', $this->r['question_id__in'] ),
				'compare' => 'IN',
			);
		}

		// Default behavior is to sort by vote count first, then by post_date.
		$args['orderby'] = array(
			'post_date' => 'DESC',
		);

		$response_query = new \WP_Query( $args );
		$_responses = $response_query->posts;

		$responses = array();
		foreach ( $_responses as $_response ) {
			$responses[ $_response->ID ] = new \WeBWorK\Server\Response( $_response->ID );
		}

		$response_ids = wp_list_pluck( $_responses, 'ID' );
		if ( $response_ids ) {
			$response_vote_query = new \WeBWorK\Server\Vote\Query( array( 'item_id__in' => $response_ids ) );
			$response_votes = $response_vote_query->get();

			$counts = array_fill_keys( $response_ids, 0 );
			foreach ( $response_votes as $vote ) {
				$item_id = $vote->get_item_id();
				$counts[ $item_id ]++;
			}

			// @todo Make sorting configurable.
			arsort( $counts );
			$sorted_responses = array();
			foreach ( $counts as $response_id => $count ) {
				$response = $responses[ $response_id ];
				$response->set_vote_count( $counts[ $response_id ] );
				$sorted_responses[] = $response;
			}

			$responses = $sorted_responses;
		}

		return $responses;
	}
}
