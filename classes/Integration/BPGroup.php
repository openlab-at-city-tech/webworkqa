<?php

namespace WeBWorK\Integration;

class BPGroup implements \WeBWorK\Integration {
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

		// Todo what should these slugs look like?
		return trailingslashit( $group_permalink ) . trailingslashit( 'webwork' );
	}
}
