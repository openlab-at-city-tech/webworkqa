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
		$root = get_blog_option( 1, 'home' );

		$this->endpoint = $root . '/wp-json/wp/v2/';
		//var_dump( $this->endpoint );
	}

//	public function
}
