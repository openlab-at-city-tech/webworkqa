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
			'problem_set' => null,
			'question_id' => null,
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
			'tax_query' => array(),
		) );

		if ( $this->r['problem_id'] ) {
			$args['meta_query']['problem_id'] = array(
				'key' => 'webwork_problem_id',
				'value' => $this->r['problem_id'],
			);
		}

		if ( null !== $this->r['problem_set'] ) {
			$args['tax_query']['problem_set'] = array(
				'taxonomy' => 'webwork_problem_set',
				'terms' => (array) $this->r['problem_set'],
				'field' => 'name',
			);
		}

		if ( null !== $this->r['question_id'] ) {
			// Supports arrays.
			if ( ! is_array( $this->r['question_id'] ) ) {
				$q_ids = array( $this->r['question_id'] );
			}

			$q_ids = array_map( 'intval', $q_ids );

			$args['post__in'] = $q_ids;
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
				'isMyQuestion' => is_user_logged_in() && $q->get_author_id() == get_current_user_id(),
				'authorAvatar' => $q->get_author_avatar(),
				'authorName' => $q->get_author_name(),
			);
		}

		return $formatted;
	}

	public function get_all_filter_options() {
		$problemSet = array(
			array(
				'value' => 'foo',
				'name' => 'Foo',
			),
		);

		return array(
			'course' => $problemSet,
			'section' => $problemSet,
			'problemSet' => $this->get_filter_options( 'problem_set' ),
			'answeredQuestions' => $problemSet,
			'unansweredQuestions' => $problemSet,
		);
	}

	public function get_filter_options( $filter ) {
		$options = array();

		switch ( $filter ) {
			// can repurpose for other taxonomies - concatenate tax name
			case 'problem_set' :
				$terms = get_terms( array(
					'taxonomy' => 'webwork_problem_set',
					'hide_empty' => true,
					'orderby' => 'name',
					'order' => 'ASC',
				) );

				foreach ( $terms as $term ) {
					$options[] = array(
						'name' => $term->name,
						'value' => $term->name,
					);
				}
			break;

		}

		return $options;
	}
}
