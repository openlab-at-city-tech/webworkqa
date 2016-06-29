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

		$problems_endpoint = new Server\Problem\Endpoint();
		add_action( 'rest_api_init', array( $problems_endpoint, 'register_routes' ) );

		$questions_endpoint = new Server\Question\Endpoint();
		add_action( 'rest_api_init', array( $questions_endpoint, 'register_routes' ) );

		$responses_endpoint = new Server\Response\Endpoint();
		add_action( 'rest_api_init', array( $responses_endpoint, 'register_routes' ) );

		$votes_endpoint = new Server\Vote\Endpoint();
		add_action( 'rest_api_init', array( $votes_endpoint, 'register_routes' ) );

		add_action( 'template_redirect', array( $this, 'catch_post' ) );
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

	/**
	 * @todo This will only work for individual problems. Will need to differentiate for other uses.
	 * @todo Redirect afterward, break up logic into separate items, etc.
	 * @todo Forbid multiple problems for a given WW-individuated problem.
	 */
	public function catch_post() {
		// @todo
		if ( ! is_page( 'webwork' ) ) {
			return;
		}

		if ( ! isset( $_POST ) ) {
			return;
		}

		// @todo Check permissions against target site - maybe share logic with endpoints.
		if ( ! is_user_logged_in() ) {
			return;
		}

		$pg_object = wp_unslash( $_POST['pg_object'] );

		$problem = new Server\Problem();

		// @todo test data is already decoded, but it won't be in the production app.
		$problem->set_content( $pg_object );

		$problem_library_id = $problem->get_library_id();

		$problem->set_author_id( get_current_user_id() );

		// @todo I think this has to be fetched from referer URL.
		$problem->set_remote_url( 'http://example.com/test-url' );

		$problem->save();

		print_r( $problem ); die();
	}
}
