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
	}
}
