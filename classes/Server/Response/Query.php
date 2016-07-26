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
			'is_answer' => null,
		), $args );

		$this->sorter = new \WeBWorK\Server\Util\QuerySorter();
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
			'orderby' => 'post_date',
			'order' => 'ASC',
		);

		if ( null !== $this->r['question_id__in'] ) {
			if ( array() === $this->r['question_id__in'] ) {
				$question_id__in = array( 0 );
			} else {
				$question_id__in = array_map( 'intval', $this->r['question_id__in'] );
			}

			$args['meta_query']['question_id__in'] = array(
				'key' => 'webwork_question_id',
				'value' => $question_id__in,
				'compare' => 'IN',
			);
		}

		if ( null !== $this->r['is_answer'] ) {
			if ( $this->r['is_answer'] ) {
				$args['meta_query']['is_answer'] = array(
					'key' => 'webwork_question_answer',
					'value' => '1',
				);
			} else {
				// SOS
				$is_answer_args = $this->r;
				$is_answer_args['is_answer'] = true;
				$is_answer_args['orderby'] = 'post_date';
				$is_answer_query = new Query( $is_answer_args );
				$is_answers = $is_answer_query->get();

				$not_in = array();
				foreach ( $is_answers as $is_answer ) {
					$not_in[] = $is_answer->get_id();
				}

				$args['post__not_in'] = $not_in;
			}
		}

		$response_query = new \WP_Query( $args );
		$_responses = $response_query->posts;

		$responses = array();
		foreach ( $_responses as $_response ) {
			$responses[ $_response->ID ] = new \WeBWorK\Server\Response( $_response->ID );
		}

		if ( 'votes' === $this->r['orderby'] ) {
			$responses = $this->sorter->sort_by_votes( $responses );
		}

		return $responses;
	}

	public function get_for_endpoint() {
		$responses = $this->get();

		$formatted = array();
		foreach ( $responses as $r ) {
			$response_id = $r->get_id();
			$formatted[ $response_id ] = array(
				'responseId' => $response_id,
				'content' => $r->get_content(),
				'questionId' => $r->get_question_id(),
				'authorAvatar' => $r->get_author_avatar(),
				'authorName' => $r->get_author_name(),
				'authorUserType' => $r->get_author_type_label(),
				'isAnswer' => $r->get_is_answer(),
			);
		}

		return $formatted;
	}
}
