<?php

namespace WeBWorK;

/**
 * Data schema.
 *
 * CPTs, etc.
 *
 * @since 1.0.0
 */
class Schema {
	/**
	 * By the time this is fired, 'init' should be done.
	 */
	public function __construct() {
		$this->register_post_types();
	}

	/**
	 * Register post type.
	 *
	 * The webwork_class object is a WP representation of a WW class object. The two are always in one-to-one
	 * correspondence. A webwork_class object is used as a bridge to a "primary" WP object, such as a site or a
	 * BuddyPress group.
	 *
	 * There are three critical pieces of postmeta for each WeBWorK class:
	 * - 'webwork_object_type' can be 'site', 'bp_group', etc.
	 * - 'webwork_object_id' is the numeric ID of the associated WP object. With 'object_type', is a unique identifier.
	 * - 'webwork_remote_class_url' is the URL of the course in WeBWorK.
	 *
	 * @since 1.0.0
	 */
	protected function register_post_types() {
		$labels = array(
			'name' => __( 'WeBWorK Classes', 'webwork' ),
			'singular_name' => __( 'WeBWorK Class', 'webwork' ),
			'add_new_item' => __( 'Add New WeBWorK Class', 'webwork' ),
			'edit_item' => __( 'Edit WeBWorK Class', 'webwork' ),
			'new_item' => __( 'New WeBWorK Class', 'webwork' ),
			'view_item' => __( 'View WeBWorK Class', 'webwork' ),
			'search_items' => __( 'Search WeBWorK Classes', 'webwork' ),
			'not_found' => __( 'No WeBWorK Classes found', 'webwork' ),
			'not_found_in_trash' => __( 'No WeBWorK Classes found in Trash.', 'webwork' ),
		);

		register_post_type( 'webwork_class', array(
			'label' => __( 'WebWorK Classes', 'webwork' ),
			'labels' => $labels,
			'public' => true, // todo This should be false
		) );
	}
}
