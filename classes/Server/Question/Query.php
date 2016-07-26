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

	public function __construct( $args = array() ) {
		$this->r = array_merge( array(
			'problem_id' => null,
			'orderby' => 'votes',
			'order' => 'ASC',
			'answered' => null,
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
		$args = array_merge( $this->r, array(
			'post_type' => 'webwork_question',
			'update_post_term_cache' => false,
			'meta_query' => array(),
			'posts_per_page' => -1,
		) );

		if ( $this->r['problem_id'] ) {
			$args['meta_query']['problem_id'] = array(
				'key' => 'webwork_problem_id',
				'value' => intval( $this->r['problem_id'] ),
			);
		}

		if ( null !== $this->r['answered'] ) {
			// @todo Make this less awful.
			$r_query = new \WeBWorK\Server\Response\Query( array(
				'is_answer' => true,
			) );
			$is_answer_responses = $r_query->get();

			$has_answer_ids = array( 0 );
			foreach ( $is_answer_responses as $is_answer_response ) {
				$has_answer_ids[] = $is_answer_response->get_question_id();
			}

			$op = $this->r['answered'] ? 'post__in' : 'post__not_in';
			$args[ $op ] = $has_answer_ids;
		}

		$question_query = new \WP_Query( $args );
		$_questions = $question_query->posts;

		$questions = array();
		foreach ( $_questions as $_question ) {
			$questions[ $_question->ID ] = new \WeBWorK\Server\Question( $_question->ID );
		}

		if ( 'votes' === $this->r['orderby'] ) {
			$questions = $this->sorter->sort_by_votes( $questions );
		}

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
