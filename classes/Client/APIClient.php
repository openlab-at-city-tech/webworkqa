<?php

namespace WeBWorK\Client;

/**
 * API client.
 *
 * Contains wrappers for API requests.
 *
 * @since 1.0.0
 */
class APIClient {
	public function __construct() {
		$this->set_endpoint();
	}

	protected function set_endpoint() {
		// @todo non-multisite support
		if ( is_multisite() ) {
			$root = get_blog_option( 1, 'home' );
		} else {
			$root = get_option( 'home' );
		}

		$this->endpoint = $root . '/wp-json/wp/v2/';
		//var_dump( $this->endpoint );
	}

//	public function
}
