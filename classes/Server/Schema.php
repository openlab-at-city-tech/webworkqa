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
		$this->register_taxonomies();
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

	/**
	 * Register taxonomies.
	 *
	 * - webwork_problem_id (webwork_question)
	 * - webwork_problem_set (webwork_question)
	 * - webwork_course (webwork_question)
	 *
	 * @since 1.0.0
	 */
	public function register_taxonomies() {
		register_taxonomy( 'webwork_problem_id', 'webwork_question', array(
			'public' => false,
		) );

		register_taxonomy( 'webwork_problem_set', 'webwork_question', array(
			'public' => false,
		) );

		register_taxonomy( 'webwork_course', 'webwork_question', array(
			'public' => false,
		) );

		register_taxonomy( 'webwork_section', 'webwork_question', array(
			'public' => false,
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
