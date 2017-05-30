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

	public static function set_up_app() {
		$ww_problem = false;
		if ( is_page( 'webwork' ) ) {
			$ww_problem = true;
		} else {
			$ww_problem = get_query_var( 'ww_problem' );
		}

		wp_enqueue_script( 'webwork-scaffold', plugins_url() . '/webwork/assets/js/webwork-scaffold.js', array( 'jquery' ) );
		wp_enqueue_script( 'webwork-app', plugins_url() . '/webwork/build/index.js' );

		$route_base = get_option( 'home' );
		$route_base = preg_replace( '|https?://[^/]+/|', '', $route_base );

		// @todo Centralize this logic.
		$main_site_url = apply_filters( 'webwork_server_site_base', get_option( 'home' ) );
		$rest_api_endpoint = set_url_scheme( trailingslashit( $main_site_url ) . 'wp-json/webwork/v1/' );

		// @todo Abstract.
		$post_data = null;
		$ww_problem_text = '';
		if ( ! empty( $_GET['post_data_key'] ) ) {
			$post_data = get_blog_option( 1, $_GET['post_data_key'] );
			//$ww_problem_text = base64_decode( $post_data['pg_object'] );
		}

		// @todo This is awful.
		$clients = get_blog_option( 1, 'webwork_clients' );
		$remote_course_url = array_search( get_current_blog_id(), $clients );

		$user_is_admin = current_user_can( 'edit_others_posts' );
		$user_is_admin = apply_filters( 'webwork_user_is_admin', $user_is_admin );

		wp_localize_script( 'webwork-app', 'WWData', array(
			'client_name' => get_option( 'blogname' ),
			'page_base' => trailingslashit( set_url_scheme( get_option( 'home' ) ) ),
			'problem_id' => $ww_problem,
			'remote_course_url' => $remote_course_url,
			'rest_api_nonce' => wp_create_nonce( 'wp_rest' ),
			'rest_api_endpoint' => $rest_api_endpoint,
			'route_base' => trailingslashit( $route_base ),
			'user_can_ask_question' => is_user_logged_in(), // todo
			'user_can_post_response' => is_user_logged_in(), // todo
			'user_can_vote' => is_user_logged_in(), // todo
			'user_is_admin' => $user_is_admin,
		) );

		wp_enqueue_style( 'font-awesome', plugins_url() . '/webwork/lib/font-awesome/css/font-awesome.min.css' );
		wp_enqueue_style( 'webwork-app', plugins_url() . '/webwork/assets/css/app.css', array( 'font-awesome' ) );
		wp_enqueue_style( 'webwork-react-select', plugins_url() . '/webwork/assets/css/select.css' );

		wp_register_script( 'webwork-mathjax-loader', WEBWORK_PLUGIN_URL . '/assets/js/webwork-mathjax-loader.js' );

		$webwork_mathjax_loader_strings = array(
			'mathjax_src' => esc_url( 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML-full' ),
		);
		wp_localize_script( 'webwork-mathjax-loader', 'WeBWorK_MathJax', $webwork_mathjax_loader_strings );

		wp_enqueue_script( 'webwork-mathjax-loader' );
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
			}

			// @todo This is awful.
			$clients = get_blog_option( 1, 'webwork_clients' );
			$remote_course_url = array_search( get_current_blog_id(), $clients );

			wp_localize_script( 'webwork-app', 'WWData', array(
				'problem_id' => $ww_problem,
				'problem_text' => $ww_problem_text,
				'remote_course_url' => $remote_course_url,
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
				'mathjax_src' => esc_url( 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML-full' ),
			);
			wp_localize_script( 'webwork-mathjax-loader', 'WeBWorK_MathJax', $webwork_mathjax_loader_strings );

			wp_enqueue_script( 'webwork-mathjax-loader' );
		}

		return $content;
	}
}
