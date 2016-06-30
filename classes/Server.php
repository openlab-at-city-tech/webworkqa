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
                if ( empty( $_GET['webwork'] ) || '1' != $_GET['webwork'] ) {
                        return;
                }
		if ( ! is_page( 'webwork' ) ) {
//			return;
		}

		if ( ! isset( $_POST ) ) {
			return;
		}

		// @todo Check permissions against target site - maybe share logic with endpoints.
		if ( ! is_user_logged_in() ) {
			return;
		}

		// @todo This should come from referer.
		$source_parts = $this->sanitize_class_url( $_SERVER['HTTP_REFERER'] );
		$source = $source_parts['base'];

		$problem = new Server\Problem();

		// @todo test data is already decoded, but it won't be in the production app.
		// Do not unslash. wp_insert_post() expocts slashed. A nightmare.
		$problem->set_content( $_POST['pg_object'] );
		$problem_library_id = $problem->get_library_id();

		// Route to existing problem, if it exists.
		$pq = new Server\Problem\Query( array(
			'library_id' => $problem_library_id,
		) );
		$matches = $pq->get();

		if ( $matches ) {
			$problem_id = reset( array_keys( $matches ) );
		} else {
			$problem->set_author_id( get_current_user_id() );

			// @todo I think this has to be fetched from referer URL.
			$problem->set_remote_url( 'http://example.com/test-url' );

			$problem->save();

			$problem_id = $problem->get_id();
		}

		// Get Client base URL from $source (the blog URL)
		$client_id = $this->get_client_from_course_url( $source );

		$client_base = get_blog_option( $client_id, 'home' );
		$client_url = trailingslashit( $client_base ) . 'webwork/problems/' . $existing_problem_id;
		wp_safe_redirect( $client_url );
		die();
	}

	/**
	 * Sanitize a remote class URL.
	 *
	 * @since 1.0.0
	 *
	 * @param string $raw_url Raw URL from the HTTP_REFERER header.
	 * @return array URL parts.
	 */
	protected function sanitize_class_url( $raw_url ) {
		$parts = parse_url( $raw_url );

		// Raw URL may contain a set and problem subpath.
		$subpath = '';
		foreach ( array( 'set', 'problem' ) as $key ) {
			if ( ! empty( $_POST[ $key ] ) ) {
				$subpath .= trailingslashit( $_POST[ $key ] );
			}
		}

//		$this->remote_referer_url = $parts['scheme'] . '://' . $parts['host'] . $parts['path'];

		if ( $subpath && $subpath === substr( $parts['path'], -strlen( $subpath ) ) ) {
			$base = substr( $parts['path'], 0, -strlen( $subpath ) );
		} else {
			$base = $parts['path'];
		}

		$base = trailingslashit( $parts['scheme'] . '://' . $parts['host'] . $base );

		$retval = array(
			'base' => $base,
			'effectiveUser' => '',
			'user' => '',
			'key' => '',
		);

		if ( ! empty( $parts['query'] ) ) {
			parse_str( $parts['query'], $query );
			foreach ( (array) $query as $k => $v ) {
				$retval[ $k ] = $v;
			}
		}

		return $retval;
	}

	protected function get_client_from_course_url( $course_url ) {
		// @todo We need a better way to do this.
		$clients = get_option( 'webwork_clients', array() );

		$client = 0;
		if ( isset( $clients[ $course_url ] ) ) {
			$client = $clients[ $course_url ];
		}

		return (int) $client;
	}
}
