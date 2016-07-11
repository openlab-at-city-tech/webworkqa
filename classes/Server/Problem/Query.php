<?php

namespace WeBWorK\Server\Problem;

/**
 * Problem query.
 *
 * @since 1.0.0
 */
class Query {
	protected $r;

	protected $sorter;

	public function __construct( $args = array() ) {
		$this->r = array_merge( array(
			'problem_id__in' => null,
			'library_id' => null,
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
			'post_type' => 'webwork_problem',
			'update_post_term_cache' => false,
			'meta_query' => array(),
			'posts_per_page' => -1,
			'orderby' => 'post_date',
			'order' => 'DESC',
		);

		if ( is_array( $this->r['problem_id__in'] ) ) {
			if ( empty( $this->r['problem_id__in'] ) ) {
				$problem_id__in = array( 0 );
			} else {
				$problem_id__in = array_map( 'intval', $this->r['problem_id__in'] );
			}

			$args['post__in'] = $problem_id__in;
		}

		if ( null !== $this->r['library_id'] ) {
			$args['meta_query'][] = array(
				'key' => 'webwork_library_id',
				'value' => $this->r['library_id'],
			);
		}

		$problem_query = new \WP_Query( $args );
		$_problems = $problem_query->posts;

		$problems = array();
		foreach ( $_problems as $_problem ) {
			$problems[ $_problem->ID ] = new \WeBWorK\Server\Problem( $_problem->ID );
		}

		return $problems;
	}

	public function get_for_endpoint() {
		$problems = $this->get();

		$formatted = array();
		foreach ( $problems as $p ) {
			$problem_id = $p->get_id();
			$formatted_problem = array(
				'problemId' => $problem_id,
				'content' => $p->get_clean_content(),
				'inputs' => $p->get_inputs(),
				'libraryId' => $p->get_library_id(),
				'maths' => $p->get_maths(),
				'authorAvatar' => $p->get_author_avatar(),
				'authorName' => $p->get_author_name(),
				'instances' => array(),
			);

			$instances = $p->get_instances();
			foreach ( $instances as $instance ) {
				$course_url = $instance->get_remote_course_url();
				$formatted_problem['instances'][ $course_url ] = array(
					'remoteProblemUrl' => $instance->get_remote_problem_url(),
					'remoteProblemSet' => $instance->get_remote_problem_set(),
					'remoteProblem' => $instance->get_remote_problem(),
				);
			}

			$formatted[ $problem_id ] = $formatted_problem;
		}

		return $formatted;
	}
}
