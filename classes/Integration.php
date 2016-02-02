<?php

namespace WeBWorK;

/**
 * Integration interface.
 *
 * An Integration describes a link between a standardized webwork_class CPT object and a particular WordPress object
 * type. For example, a BPGroup Integration links webwork_class objects to BuddyPress groups.
 *
 * @since 1.0.0
 */
interface Integration {
	/**
	 * Get an object by ID.
	 *
	 * @since 1.0.0
	 */
	public function get_object_by_id( $id );

	/**
	 * Can the current user post to the given object?
	 *
	 * @since 1.0.0
	 *
	 * @param int $wp_object_id
	 * @return bool
	 */
	public function current_user_can_post( $wp_object_id );

	/**
	 * Get a integration URL.
	 *
	 * This URL is used to redirect from the generic webwork=1 handler to the specific UI corresponding
	 * to the integration.
	 *
	 * @since 1.0.0
	 *
	 * @param int $wp_object_id
	 * @return string
	 */
	public function get_integration_url( $wp_object_id );

	/**
	 * Post a question.
	 *
	 * @since 1.0.0
	 *
	 * @param int   $wp_object_id
	 * @param array $post_data {
	 *     @type string $text
	 *     @type int    $problem
	 *     @type int    $problem_set
	 * }
	 * @return bool
	 */
	public function post_question( $wp_object_id, $post_data );

	/**
	 * Get the current object ID.
	 *
	 * @since 1.0.0
	 *
	 * @return int
	 */
	public static function get_current_object_id();
}
