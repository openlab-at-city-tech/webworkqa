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
		$ww_problem = false;
		if ( is_page( 'webwork' ) ) {
			$ww_problem = true;
		} else {
			$ww_problem = get_query_var( 'ww_problem' );
		}

		if ( $ww_problem ) {
			$content = '<div id="webwork-app"></div>';
			wp_enqueue_script( 'webwork-app', plugins_url() . '/webwork/build/index.js' );

			$route_base = get_option( 'home' );
			$route_base = preg_replace( '|https?://[^/]+/|', '', $route_base );

			// @todo Centralize this logic.
			$main_site_url = get_blog_option( 1, 'home' );
			$rest_api_endpoint = trailingslashit( $main_site_url ) . 'wp-json/webwork/v1/';

			// @todo Abstract.
			$post_data = null;
			$ww_problem_text = '';
			if ( ! empty( $_GET['post_data_key'] ) ) {
				$post_data = get_blog_option( 1, $_GET['post_data_key'] );
				$ww_problem_text = base64_decode( $post_data['pg_object'] );
			//	$pf = new Server\Util\ProblemFormatter();
			}
			//$ww_problem_text = isset( $_POST['pg_object'] ) ? base64_decode( $_POST['pg_object'] ) : '';

			wp_localize_script( 'webwork-app', 'WWData', array(
				'problem_id' => $ww_problem,
				'problem_text' => $ww_problem_text,
				'rest_api_nonce' => wp_create_nonce( 'wp_rest' ),
				'rest_api_endpoint' => $rest_api_endpoint,
				'route_base' => trailingslashit( $route_base ) . 'webwork/',
				'user_can_ask_question' => is_user_logged_in(), // todo
				'user_can_post_response' => is_user_logged_in(), // todo
				'user_can_vote' => is_user_logged_in(), // todo
			) );

			wp_enqueue_style( 'webwork-app', plugins_url() . '/webwork/assets/css/app.css' );

			wp_register_script( 'webwork-mathjax-loader', WEBWORK_PLUGIN_URL . '/assets/js/webwork-mathjax-loader.js' );

			$webwork_mathjax_loader_strings = array(
				'mathjax_src' => esc_url( 'https://cdn.mathjax.org/mathjax/latest/unpacked/MathJax.js?config=TeX-MML-AM_HTMLorMML-full' ),
			);
			wp_localize_script( 'webwork-mathjax-loader', 'WeBWorK_MathJax', $webwork_mathjax_loader_strings );

			wp_enqueue_script( 'webwork-mathjax-loader' );
		}

		return $content;
	}
}
