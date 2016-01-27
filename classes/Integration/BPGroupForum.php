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
