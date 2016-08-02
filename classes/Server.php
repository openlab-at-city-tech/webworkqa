<?php

namespace WeBWorK;

/**
 * Server.
 *
 * @since 1.0.0
 */
class Server {
	protected $post_data;
	protected $remote_class_url;
	protected $webwork_user;

	public function __construct() {
		if ( ! class_exists( 'WP_REST_Controller' ) ) {
			add_action( 'admin_notices', create_function( '', "echo '<div class=\"error\"><p>" . __( 'WeBWorK for WordPress requires the WP-API plugin to function properly. Please install WP-API or deactivate WeBWorK for WordPress.', 'webwork' ) . "</p></div>';" ) );
			return;
		}

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
	 */
	public function catch_post() {
		// @todo
                if ( empty( $_GET['webwork'] ) || '1' != $_GET['webwork'] ) {
                        return;
                }

		/**
		 * Logic:
		 *
		 * 1. Store post data
		 * 2. If user is not logged in, redirect to login with post_data query arg.
		 * 3. If (or once) user is logged in, parse Library ID (problemId) from pg_object.
		 *    a. If question exists with that problemId, redirect to problem view
		 *    b. If question doesn't exist with that problemId, redirect to dummy view
		 *    In either case, keep the post_data query arg.
		 * 4. Be sure to store post_data key when processing question, because that metadata must be saved with the question item.
		 */

		if ( ! empty( $_POST ) ) {
			$post_data = $this->sanitize_post_data();
			$this->set_remote_class_url( $post_data['remote_problem_url'] );
			$this->set_post_data( $post_data );
		} else {
			if ( isset( $_GET['remote_class_url'] ) ) {
				$this->set_remote_class_url( wp_unslash( $_GET['remote_class_url'] ) );
			}

			if ( isset( $_GET['webwork_user'] ) ) {
				$this->webwork_user = wp_unslash( $_GET['webwork_user'] );
			}

			if ( $this->webwork_user ) {
				$key = $this->get_post_data_option_key();
				$post_data = get_option( $key );

				if ( $post_data ) {
					$this->set_post_data( $post_data );

					// This data should never be reused across redirects.
					delete_option( $key );
				}
			}
		}

		// Store the submitted post data, so it's available after a redirect.
		$this->store_post_data();

		// For the time being, all requests must be authenticated.
		// @todo Check permissions against client site - maybe share logic with endpoints.
		if ( ! is_user_logged_in() ) {
			$redirect_url = add_query_arg( array(
				'webwork' => 1,
				'webwork_user' => $this->webwork_user,
				'remote_class_url' => $this->remote_class_url,
			), home_url() );
			wp_safe_redirect( wp_login_url( $redirect_url ) );
			die();
		}

		$ww_client_site_base = $this->get_client_site_base();

		$problem_slug = $post_data['problem_id'];
		$redirect_to = $ww_client_site_base . '#/problem/' . $problem_slug;
		$redirect_to = add_query_arg( 'post_data_key', $this->post_data_key, $redirect_to );
		wp_safe_redirect( $redirect_to );
	}

	public function sanitize_post_data() {
		$data = array(
			'webwork_user'   => wp_unslash( $_POST['user'] ),
			'problem_set'    => wp_unslash( $_POST['set'] ),
			'problem_number' => wp_unslash( $_POST['problem'] ),
			'problem_id' => '',
			'problem_text' => '',
		);

		$remote_problem_url = wp_unslash( $_SERVER['HTTP_REFERER'] );

		$url_parts = $this->sanitize_class_url( $remote_problem_url );

		$data['remote_course_url'] = $url_parts['base'];
		$data['remote_problem_url'] = remove_query_arg( array( 'user', 'effectiveUser', 'key' ), $remote_problem_url );

		$data['webwork_user'] = $_POST['user'];

		// Split pg_object into discreet problem data.
		$raw_text = $_POST['pg_object'];

		// Do not unslash. wp_insert_post() expocts slashed. A nightmare.
		$text = base64_decode( $raw_text );

		$pf = new Server\Util\ProblemFormatter();
		$text = $pf->remove_script_tags( $text );
		$text = $pf->strip_inputs( $text );
		$text = $pf->swap_latex_escape_characters( $text );

		$data['problem_id'] = $pf->get_library_id_from_text( $text );

		$text = $pf->strip_library_id_from_text( $text );
		$text = $pf->strip_p_tags( $text );

		$data['problem_text'] = $text;

		return $data;
	}

	public function set_post_data( $data ) {
		$this->post_data = $data;
	}

	/**
	 * Sanitize a remote class URL.
	 *
	 * @since 1.0.0
	 *
	 * @param string $raw_url Raw URL from the HTTP_REFERER header.
	 * @return array URL parts.
	 */
	public function sanitize_class_url( $raw_url ) {
		$parts = parse_url( $raw_url );

		// Raw URL may contain a set and problem subpath.
		$subpath = '';
		foreach ( array( 'set', 'problem' ) as $key ) {
			if ( ! empty( $_POST[ $key ] ) ) {
				$subpath .= trailingslashit( $_POST[ $key ] );
			}
		}

		$this->remote_referer_url = $parts['scheme'] . '://' . $parts['host'] . $parts['path'];

		if ( $subpath && $subpath === substr( $parts['path'], -strlen( $subpath ) ) ) {
			$base = substr( $parts['path'], 0, -strlen( $subpath ) );
		} else {
			$base = $parts['path'];
		}

		$course = $section = '';
		$base_parts = explode( '/', trim( $base ) );
		$base_parts = array_filter( $base_parts );
		if ( $base_parts ) {
			$section = end( $base_parts );

			$section_parts = explode( '-', $section );
			$course = reset( $section_parts );
		}

		$base = trailingslashit( $parts['scheme'] . '://' . $parts['host'] . $base );

		$retval = array(
			'base' => $base,
			'effectiveUser' => '',
			'user' => '',
			'key' => '',
			'course' => $course,
			'section' => $section,
		);

		if ( ! empty( $parts['query'] ) ) {
			parse_str( $parts['query'], $query );
			foreach ( (array) $query as $k => $v ) {
				$retval[ $k ] = $v;
			}
		}

		return $retval;
	}

	/**
	 * Set the course URL for the request.
	 *
	 * @since 1.0.0
	 *
	 * @param string $remote_class_url
	 */
	public function set_remote_class_url( $remote_class_url ) {
		$url_parts = $this->sanitize_class_url( $remote_class_url );
		$this->remote_class_url = $url_parts['base'];
		$this->webwork_user = $url_parts['user'];
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

	/**
	 * Get the key to be used when storing the POST data in the options table.
	 *
	 * @todo Does this need to use a timestamp? Seems like probably not?
	 *
	 * @since 1.0.0
	 *
	 * @param array $args {
	 *     @type string $ip   IP address. Falls back on REMOTE_ADDR.
	 *     @type string $user WW user name. Falls back on $this->webwork_user.
	 * }
	 * @return string
	 */
	protected function get_post_data_option_key( $args = array() ) {
		if ( isset( $args['ip'] ) ) {
			$ip = $args['ip'];
		} elseif ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip = wp_unslash( $_SERVER['REMOTE_ADDR'] );
		} else {
			$ip = '';
		}

		if ( isset( $args['user'] ) ) {
			$user = $args['user'];
		} else {
			$user = $this->webwork_user;
		}

		// If neither $ip or $user is available, don't store the data.
		if ( ! $ip && ! $user ) {
			return false;
		}

		return 'webwork_post_data_' . md5( $ip . $user );
	}

	/**
	 * Store POST and other data that will be needed after redirect.
	 *
	 * @since 1.0.0
	 */
	public function store_post_data() {
		$this->post_data_key = $this->get_post_data_option_key();

		// Store the remote class URL for later use.
		$this->post_data['remote_class_url']   = $this->remote_class_url;
		$this->post_data['remote_referer_url'] = $this->remote_referer_url;

		update_option( $this->post_data_key, $this->post_data );
	}

	public function get_server_site_base() {
		return apply_filters( 'webwork_server_site_base', get_option( 'home' ) );
	}

	public function get_client_site_base() {
		return apply_filters( 'webwork_client_site_base', get_option( 'home' ) );
	}
}
