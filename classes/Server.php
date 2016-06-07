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

		$this->endpoint = new Server\Endpoint();
		add_action( 'rest_api_init', array( $this->endpoint, 'register_routes' ) );
	}
}
