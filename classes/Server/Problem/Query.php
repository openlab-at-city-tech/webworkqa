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
		$this->r = array_merge( array(), $args );
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
			$formatted[ $problem_id ] = array(
				'problemId' => $problem_id,
				'content' => $p->get_content(),
				'excerpt' => $p->get_excerpt(),
				'remoteUrl' => $p->get_remote_url(),
				'authorAvatar' => $p->get_author_avatar(),
				'authorName' => $p->get_author_name(),
			);
		}

		return $formatted;
	}
}
