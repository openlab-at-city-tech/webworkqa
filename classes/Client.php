<?php

namespace WeBWorK;

/**
 * Client.
 *
 * @since 1.0.0
 */
class Client {
	public function __construct() {
		$this->api_client = new \WeBWorK\Client\APIClient();

		add_filter( 'the_content', array( $this, 'filter_the_content' ) );
	}

	public function filter_the_content( $content ) {
		if ( ! empty( $_GET['do_webwork'] ) ) {
			$content = '<div id="webwork-app"></div>';
			wp_enqueue_script( 'webwork-app', plugins_url() . '/webwork/build/widget.js', array( 'jquery' ) );
		}

		return $content;
	}
}
