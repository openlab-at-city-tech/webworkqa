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
			'order' => 'ASC',
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

	public function get_for_endpoint() {
		$questions = $this->get();

		$formatted = array();
		foreach ( $questions as $q ) {
			$question_id = $q->get_id();
			$formatted[ $question_id ] = array(
				'questionId' => $question_id,
				'content' => $q->get_content(),
				'tried' => $q->get_tried(),
				'problemId' => $q->get_problem_id(),
				'problemText' => $q->get_problem_text(),
				'problemMaths' => $q->get_maths(),
				'problemInputs' => $q->get_inputs(),
				'isMyQuestion' => is_user_logged_in() && $q->get_author_id() == get_current_user_id(),
				'authorAvatar' => $q->get_author_avatar(),
				'authorName' => $q->get_author_name(),
			);
		}

		return $formatted;
	}
}
