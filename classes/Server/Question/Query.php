<?php

namespace WeBWorK\Server\Question;

/**
 * Question query.
 *
 * @since 1.0.0
 */
class Query {
	protected $r;

	protected $sorter;

	public function __construct( $args ) {
		$this->r = array_merge( array(
			'problem_id' => null,
			'orderby' => 'votes',
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
			'post_type' => 'webwork_question',
			'update_post_term_cache' => false,
			'meta_query' => array(),
			'posts_per_page' => -1,
			'orderby' => 'post_date',
			'order' => 'DESC',
		);

		if ( $this->r['problem_id'] ) {
			$args['meta_query']['problem_id'] = array(
				'key' => 'webwork_problem_id',
				'value' => intval( $this->r['problem_id'] ),
			);
		}

		$question_query = new \WP_Query( $args );
		$_questions = $question_query->posts;

		$questions = array();
		foreach ( $_questions as $_question ) {
			$questions[ $_question->ID ] = new \WeBWorK\Server\Question( $_question->ID );
		}

		$questions = $this->sorter->sort_by_votes( $questions );

		return $questions;
	}
}
