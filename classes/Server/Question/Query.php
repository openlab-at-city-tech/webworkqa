<?php

namespace WeBWorK\Server\Question;

/**
 * Question query.
 *
 * @since 1.0.0
 */
class Query {
	protected $r;

	public function __construct( $args = array() ) {
		$this->r = array_merge( array(
			'problem_id' => null,
			'problem_set' => null,
			'course' => null,
			'section' => null,
			'question_id' => null,
			'offset' => 0,
			'orderby' => 'votes',
			'order' => 'ASC',
			'answered' => null,
			'last_question' => null,
			'max_results' => 10,
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
			'post_type' => 'webwork_question',
			'update_post_term_cache' => false,
			'meta_query' => array(),
			'posts_per_page' => -1,
			'tax_query' => array(),
		);

		if ( $this->r['problem_id'] ) {
			$args['tax_query']['problem_id'] = array(
				'taxonomy' => 'webwork_problem_id',
				'terms' => (array) $this->r['problem_id'],
				'field' => 'name',
			);
		}

		$filter_taxonomies = array( 'problem_set', 'course', 'section' );
		foreach ( $filter_taxonomies as $filter_taxonomy ) {
			if ( null !== $this->r[ $filter_taxonomy ] ) {
				$args['tax_query'][ $filter_taxonomy ] = array(
					'taxonomy' => 'webwork_' . $filter_taxonomy,
					'terms' => (array) $this->r[ $filter_taxonomy ],
					'field' => 'name',
				);
			}
		}

		if ( null !== $this->r['question_id'] ) {
			// Supports arrays.
			if ( ! is_array( $this->r['question_id'] ) ) {
				$q_ids = array( $this->r['question_id'] );
			}

			$q_ids = array_map( 'intval', $q_ids );

			$args['post__in'] = $q_ids;
		}

		if ( null !== $this->r['answered'] && 'all' !== $this->r['answered'] ) {
			if ( 'answered' === $this->r['answered'] ) {
				$args['meta_query']['answered'] = array(
					'key' => 'webwork_has_answer',
					'value' => '1',
				);
			} elseif ( 'unanswered' === $this->r['answered'] ) {
				$args['meta_query']['answered'] = array(
					'relation' => 'AND',
					array(
						'key' => 'webwork_response_count',
						'value' => '0',
						'compare' => '=',
						'type' => 'NUMERIC',
					),
					array(
						'key' => 'webwork_has_answer',
						'value' => '0',
					),
				);
			} elseif ( 'in-progress' === $this->r['answered'] ) {
				$args['meta_query']['answered'] = array(
					'relation' => 'AND',
					array(
						'key' => 'webwork_response_count',
						'value' => '1',
						'compare' => '>=',
						'type' => 'NUMERIC',
					),
					array(
						'key' => 'webwork_has_answer',
						'value' => '0',
					),
				);
			}
		}

		if ( 'votes' === $this->r['orderby'] || 'response_count' === $this->r['orderby'] ) {
			if ( 'votes' === $this->r['orderby'] ) {
				$key = 'webwork_vote_count';
			} elseif ( 'response_count' === $this->r['orderby'] ) {
				$key = 'webwork_response_count';
			}

			$clause_key = "{$this->r['orderby']}_orderby";

			$args['meta_query'][ $clause_key ] = array(
				'key' => $key,
				'compare' => 'EXISTS',
				'type' => 'SIGNED',
			);

			$args['orderby'] = array(
				$clause_key => $this->r['order'],
				'post_date' => 'ASC',
			);
		} elseif ( $this->r['orderby'] ) {
			$args['orderby'] = $this->r['orderby'];
		}

		if ( $this->r['order'] ) {
			$args['order'] = $this->r['order'];
		}

		$args['offset'] = $this->r['offset'];
		$args['posts_per_page'] = $this->r['max_results'];

		$question_query = new \WP_Query( $args );
		$_questions = $question_query->posts;

		$questions = array();
		foreach ( $_questions as $_question ) {
			$questions[ $_question->ID ] = new \WeBWorK\Server\Question( $_question->ID );
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
				'postDate' => $q->get_post_date(),
				'problemId' => $q->get_problem_id(),
				'problemSet' => $q->get_problem_set(),
				'course' => $q->get_course(),
				'section' => $q->get_section(),
				'problemText' => $q->get_problem_text(),
				'isMyQuestion' => is_user_logged_in() && $q->get_author_id() == get_current_user_id(),
				'authorAvatar' => $q->get_author_avatar(),
				'authorId' => $q->get_author_id(),
				'authorName' => $q->get_author_name(),
				'responseCount' => $q->get_response_count(),
				'voteCount' => $q->get_vote_count(),
				'hasAnswer' => $q->get_has_answer(),
			);
		}

		return $formatted;
	}

	public function get_all_filter_options() {
		return array(
			'course'     => $this->get_filter_options( 'course' ),
			'section'    => $this->get_filter_options( 'section' ),
			'problemSet' => $this->get_filter_options( 'problem_set' ),
			'answered'   => $this->get_filter_options( 'answered' ),
		);
	}

	public function get_filter_options( $filter ) {
		$options = array();

		switch ( $filter ) {
			// can repurpose for other taxonomies - concatenate tax name
			case 'course' :
			case 'section' :
			case 'problem_set' :
				$terms = get_terms( array(
					'taxonomy' => 'webwork_' . $filter,
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

				$options[] = array(
					'name' => __( 'Show All', 'webwork' ),
					'value' => '',
				);
			break;

			case 'answered' :
				return array(
					array(
						'name' => __( 'Show Answered', 'webwork' ),
						'value' => 'answered',
					),
					array(
						'name' => __( 'Show Unanswered', 'webwork' ),
						'value' => 'unanswered',
					),
					array(
						'name' => __( 'Show In-Progress', 'webwork' ),
						'value' => 'in-progress',
					),
					array(
						'name' => __( 'Show All', 'webwork' ),
						'value' => 'all',
					),
				);
			break;
		}

		return $options;
	}
}
