<?php

namespace WeBWorK;

/**
 * Route a request based on course URL and other POST data.
 */
class Router {
	/**
	 * Raw referer for the request.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	protected $remote_referer_url;

	/**
	 * Remote class URL for the request.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	protected $remote_class_url;

	/**
	 * Post data key.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	protected $post_data_key;

	/**
	 * Post data, as passed to the request.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected $post_data;

	/**
	 * WeBWorK user name corresponding to the current request.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	protected $webwork_user = '';

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

	public function set_post_data( $data ) {
		$this->post_data = $data;
	}

	public function go() {
		// Set up initial data. How this works depends on whether we're coming directly from WW.
		// This is a POST coming directly from WeBWorK.
		if ( ! empty( $_POST ) ) {
			$this->set_post_data( $_POST );
			$this->set_remote_class_url( wp_unslash( $_SERVER['HTTP_REFERER'] ) );
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
		if ( ! is_user_logged_in() ) {
			$redirect_url = add_query_arg( array(
				'webwork' => 1,
				'webwork_user' => $this->webwork_user,
				'remote_class_url' => $this->remote_class_url,
			), home_url() );
			wp_safe_redirect( wp_login_url( $redirect_url ) );
			die();
		}

		$class = $this->set_up_webwork_class();
		if ( ! $class || ! $class->is_set_up() ) {
			return;
		}

		// Authorization.
		if ( ! $class->current_user_can_post() ) {
			return;
		}

		// Get a redirect URL from the integration.
		$redirect = $class->get_integration_url();

		// Append the post_data_key so that the integration can fetch the posted data.
		$redirect = add_query_arg( 'post_data_key', $this->post_data_key, $redirect );

		wp_safe_redirect( $redirect );
		die();
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
	 * Find local WP webwork_class object by remote_class_url.
	 *
	 * @since 1.0.0
	 *
	 * @return bool|WP_Post
	 */
	protected function set_up_webwork_class() {
		$query = new \WP_Query( array(
			'post_type' => 'webwork_class',
			'meta_query' => array(
				array(
					'key' => 'webwork_remote_class_url',
					'value' => $this->remote_class_url,
				),
			),
			'no_found_rows' => true,
			'update_post_term_cache' => false,
			'fields' => 'ids',
		) );

		$retval = false;
		if ( ! empty( $query->posts ) ) {
			$wwclass = new WWClass( $query->posts[0] );
			if ( $wwclass->exists() ) {
				$retval = $wwclass;
			}
		}

		return $retval;
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
			if ( ! empty( $this->post_data[ $key ] ) ) {
				$subpath .= trailingslashit( $this->post_data[ $key ] );
			}
		}

		$this->remote_referer_url = $parts['scheme'] . '://' . $parts['host'] . $parts['path'];

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

		return untrailingslashit( $retval );
	}
}
