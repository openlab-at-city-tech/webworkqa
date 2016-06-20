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
		$this->rewrites = new \WeBWorK\Client\Rewrites();

		add_filter( 'the_content', array( $this, 'filter_the_content' ) );
	}

	public function filter_the_content( $content ) {
		$ww_problem = get_query_var( 'ww_problem' );
		if ( $ww_problem ) {
			$content = '<div id="webwork-app"></div>';
			wp_enqueue_script( 'webwork-app', plugins_url() . '/webwork/build/index.js' );
			wp_localize_script( 'webwork-app', 'WWData', array(
				'problem_id' => $ww_problem,
				'rest_api_nonce' => wp_create_nonce( 'wp_rest' ),
				'user_can_ask_question' => is_user_logged_in(), // todo
				'user_can_post_response' => is_user_logged_in(), // todo
				'user_can_vote' => is_user_logged_in(), // todo
			) );

			wp_enqueue_style( 'webwork-app', plugins_url() . '/webwork/assets/css/app.css' );
		}

		return $content;
	}
}
