<?php

namespace WeBWorK\Server;

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
	public function init() {
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
		register_post_type( 'webwork_class', array(
			'label' => __( 'WebWorK Classes', 'webwork' ),
			'labels' => array(
				'name' => __( 'WeBWorK Classes', 'webwork' ),
				'singular_name' => __( 'WeBWorK Class', 'webwork' ),
				'add_new_item' => __( 'Add New WeBWorK Class', 'webwork' ),
				'edit_item' => __( 'Edit WeBWorK Class', 'webwork' ),
				'new_item' => __( 'New WeBWorK Class', 'webwork' ),
				'view_item' => __( 'View WeBWorK Class', 'webwork' ),
				'search_items' => __( 'Search WeBWorK Classes', 'webwork' ),
				'not_found' => __( 'No WeBWorK Classes found', 'webwork' ),
				'not_found_in_trash' => __( 'No WeBWorK Classes found in Trash.', 'webwork' ),
			),
			'public' => true, // todo This should be false
		) );

		// Caps should map to a custom function, which will determine whether it's an API request, and if so, will do an appropriate client check (current_user_can_for_blog(), maybe), and otherwise will fall through to default. I guess?
		register_post_type( 'webwork_problem', array(
			'label' => __( 'WebWorK Problems', 'webwork' ),
			'labels' => array(
				'name' => __( 'WeBWorK Problems', 'webwork' ),
				'singular_name' => __( 'WeBWorK Problem', 'webwork' ),
				'add_new_item' => __( 'Add New WeBWorK Problem', 'webwork' ),
				'edit_item' => __( 'Edit WeBWorK Problem', 'webwork' ),
				'new_item' => __( 'New WeBWorK Problem', 'webwork' ),
				'view_item' => __( 'View WeBWorK Problem', 'webwork' ),
				'search_items' => __( 'Search WeBWorK Problems', 'webwork' ),
				'not_found' => __( 'No WeBWorK Problems found', 'webwork' ),
				'not_found_in_trash' => __( 'No WeBWorK Problems found in Trash.', 'webwork' ),
			),
			'public' => true, // todo This should be false
		) );

		register_post_type( 'webwork_probinstance', array(
			'label' => __( 'WebWorK Problem Instance', 'webwork' ),
			'labels' => array(
				'name' => __( 'WeBWorK Problem Instance', 'webwork' ),
				'singular_name' => __( 'WeBWorK Problem Instance', 'webwork' ),
				'add_new_item' => __( 'Add New WeBWorK Problem Instance', 'webwork' ),
				'edit_item' => __( 'Edit WeBWorK Problem Instance', 'webwork' ),
				'new_item' => __( 'New WeBWorK Problem Instance', 'webwork' ),
				'view_item' => __( 'View WeBWorK Problem Instance', 'webwork' ),
				'search_items' => __( 'Search WeBWorK Problem Instances', 'webwork' ),
				'not_found' => __( 'No WeBWorK Problem Instances found', 'webwork' ),
				'not_found_in_trash' => __( 'No WeBWorK Problem Instances found in Trash.', 'webwork' ),
			),
			'public' => false, // todo This should be false
			'show_in_rest' => false,
		) );

		register_post_type( 'webwork_question', array(
			'label' => __( 'WebWorK Question', 'webwork' ),
			'labels' => array(
				'name' => __( 'WeBWorK Question', 'webwork' ),
				'singular_name' => __( 'WeBWorK Question', 'webwork' ),
				'add_new_item' => __( 'Add New WeBWorK Question', 'webwork' ),
				'edit_item' => __( 'Edit WeBWorK Question', 'webwork' ),
				'new_item' => __( 'New WeBWorK Question', 'webwork' ),
				'view_item' => __( 'View WeBWorK Question', 'webwork' ),
				'search_items' => __( 'Search WeBWorK Questions', 'webwork' ),
				'not_found' => __( 'No WeBWorK Questions found', 'webwork' ),
				'not_found_in_trash' => __( 'No WeBWorK Questions found in Trash.', 'webwork' ),
			),
			'public' => true, // todo This should be false
			'show_in_rest' => true,
			'rest_base' => 'questions',
		) );

		register_post_type( 'webwork_response', array(
			'label' => __( 'WebWorK Response', 'webwork' ),
			'labels' => array(
				'name' => __( 'WeBWorK Responses', 'webwork' ),
				'singular_name' => __( 'WeBWorK Response', 'webwork' ),
				'add_new_item' => __( 'Add New WeBWorK Response', 'webwork' ),
				'edit_item' => __( 'Edit WeBWorK Response', 'webwork' ),
				'new_item' => __( 'New WeBWorK Response', 'webwork' ),
				'view_item' => __( 'View WeBWorK Response', 'webwork' ),
				'search_items' => __( 'Search WeBWorK Responses', 'webwork' ),
				'not_found' => __( 'No WeBWorK Responses found', 'webwork' ),
				'not_found_in_trash' => __( 'No WeBWorK Responses found in Trash.', 'webwork' ),
			),
			'public' => true, // todo This should be false
			'show_in_rest' => true,
			'rest_base' => 'responses',
		) );
	}

	public function get_votes_schema() {
		global $wpdb;

		// todo
		$root_site = 1;

		$charset_collate = $wpdb->get_charset_collate();
		$table_prefix    = $wpdb->get_blog_prefix( $root_site );

		$sql = "CREATE TABLE {$table_prefix}webwork_votes (
			id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
			user_id bigint(20) NOT NULL,
			item_id bigint(20) NOT NULL,
			value bigint(20),
			KEY item_id (item_id),
			KEY user_id (user_id),
			KEY value (value)
		) {$charset_collate};";

		return $sql;
	}
}
