<?php

namespace WeBWorK\Integration;

class BPGroupForum implements \WeBWorK\Integration {
	/**
	 * Constructor.
	 *
	 * Responsible for setting up the Group Extension.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		bp_register_group_extension( '\WeBWork\BuddyPress\BPGroupExtension' );
	}

	/**
	 * Get a group object by ID.
	 *
	 * @since 1.0.0
	 *
	 * @return \BP_Groups_Group
	 */
	public function get_object_by_id( $id ) {
		return groups_get_group( array( 'group_id' => $id ) );
	}

	/**
	 * Can the current user post to the given group?
	 *
	 * @since 1.0.0
	 *
	 * @param int $group_id ID of the group.
	 * @return bool
	 */
	public function current_user_can_post( $group_id ) {
		return is_user_logged_in() && groups_is_user_member( bp_loggedin_user_id(), $group_id );
	}

	/**
	 * Get the URL of the WeBWorK integration for a given group.
	 *
	 * @since 1.0.0
	 *
	 * @param int $group_id ID of the group
	 * @return string
	 */
	public function get_integration_url( $group_id ) {
		$group = $this->get_object_by_id( $group_id );
		if ( ! $group ) {
			return '';
		}

		$group_permalink = bp_get_group_permalink( $group );

		return trailingslashit( $group_permalink ) . trailingslashit( 'webwork' );
	}

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
	public function post_question( $wp_object_id, $post_data ) {
		// @todo ??
		$post_title = sprintf( 'Question about %s #%s', $post_data['problem_set'], $post_data['problem'] );

		$forum_ids = bbp_get_group_forum_ids( $wp_object_id );
		if ( empty( $forum_ids ) ) {
			// @todo better error reporting
			return false;
		}

		$forum_id = reset( $forum_ids );

		$topic_data = array(
			'post_author' => bp_loggedin_user_id(),
			'post_title' => $post_title,
			'post_content' => $post_data['text'],
			'post_parent' => $forum_id,
		);

		$topic_id = bbp_insert_topic( $topic_data );

		if ( ! $topic_id ) {
			return false;
		}

		add_post_meta( $topic_id, 'webwork_problem_set', $post_data['problem_set'] );
		add_post_meta( $topic_id, 'webwork_problem', $post_data['problem'] );

		return $topic_id;
	}

	/**
	 * Get the current WWClass ID.
	 *
	 * @since 1.0.0
	 *
	 * @return int
	 */
	public static function get_current_object_id() {
		return bp_get_current_group_id();
	}
}
