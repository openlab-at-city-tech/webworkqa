<?php

namespace WeBWorK;

/**
 * Server.
 *
 * @since 1.0.0
 */
class Server {
	public function __construct() {
		$this->schema = new Server\Schema();
		$this->schema->init();

		// temp
		$this->check_table();

		$this->endpoint = new Server\Endpoint();
		add_action( 'rest_api_init', array( $this->endpoint, 'register_routes' ) );

		$votes_endpoint = new Server\Vote\Endpoint();
		add_action( 'rest_api_init', array( $votes_endpoint, 'register_routes' ) );

		$questions_endpoint = new Server\Question\Endpoint();
		add_action( 'rest_api_init', array( $questions_endpoint, 'register_routes' ) );

		$responses_endpoint = new Server\Response\Endpoint();
		add_action( 'rest_api_init', array( $responses_endpoint, 'register_routes' ) );
	}

	private function check_table() {
		global $wpdb;

		$table_prefix = $wpdb->get_blog_prefix( 1 );
		$show = $wpdb->get_var( "SHOW TABLES LIKE '{$table_prefix}'" );
		if ( ! $show ) {
			$schema = $this->schema->get_votes_schema();

			if ( ! function_exists( 'dbDelta' ) ) {
				require ABSPATH . '/wp-admin/includes/upgrade.php';
			}

			dbDelta( array( $schema ) );
		}
	}
}
