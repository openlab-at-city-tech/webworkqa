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

		$_responses = get_posts( $args );

		$responses = array();
		foreach ( $_responses as $_response ) {
			$responses[] = new \WeBWorK\Server\Response( $_response->ID );
		}

		return $responses;
	}
}
