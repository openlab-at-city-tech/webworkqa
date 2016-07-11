<?php

namespace WeBWorK\Server\ProblemInstance;

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
			'problem_id' => null,
			'remote_course_url' => null,
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
			'post_type' => 'webwork_probinstance',
			'update_post_term_cache' => false,
			'meta_query' => array(),
			'posts_per_page' => -1,
			'orderby' => 'post_date',
			'order' => 'DESC',
		);

		if ( null !== $this->r['problem_id'] ) {
			if ( empty( $this->r['problem_id'] ) ) {
				$problem_id = 0;
			} else {
				$problem_id = intval( $this->r['problem_id'] );
			}

			$args['meta_query'][] = array(
				'key' => 'webwork_problem_id',
				'value' => $problem_id,
			);
		}

		if ( null !== $this->r['remote_course_url'] ) {
			$args['meta_query'][] = array(
				'key' => 'webwork_problem_instance_remote_course_url',
				'value' => $this->r['remote_course_url'],
			);
		}

		$instance_query = new \WP_Query( $args );
		$_instances = $instance_query->posts;

		$instances = array();
		foreach ( $_instances as $_instance ) {
			$instances[ $_instance->ID ] = new \WeBWorK\Server\ProblemInstance( $_instance->ID );
		}

		return $instances;
	}
}
