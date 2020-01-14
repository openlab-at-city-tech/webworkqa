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

		add_shortcode( 'webwork', array( $this, 'shortcode_cb' ) );

		add_filter( 'login_message', array( $this, 'filter_login_message' ) );
	}

	public function shortcode_cb() {
		$deps = array();
		if ( is_user_logged_in() ) {
			$plupload_settings_filter = function( $params ) {
				$extensions = array( 'jpg', 'jpeg', 'jpe', 'png', 'gif' );
				$params['filters']['mime_types'][0]['extensions'] = implode( ',', $extensions );
				return $params;
			};

			add_filter( 'plupload_default_settings', $plupload_settings_filter );

			wp_enqueue_media();

			remove_filter( 'plupload_default_settings', $plupload_settings_filter );
		}

		wp_enqueue_script( 'webwork-scaffold', plugins_url() . '/webwork/assets/js/webwork-scaffold.js', array( 'jquery' ) );
		wp_enqueue_script( 'webwork-app', plugins_url() . '/webwork/build/index.js', $deps );
		wp_set_script_translations( 'webwork-app', 'webwork' );

		$route_base = get_option( 'home' );
		$route_base = preg_replace( '|https?://[^/]+/|', '', $route_base );

		$server_site_id = apply_filters( 'webwork_server_site_id', get_current_blog_id() );

		// @todo Centralize this logic.
		$main_site_url = apply_filters( 'webwork_server_site_base', get_option( 'home' ) );
		$rest_api_endpoint = set_url_scheme( trailingslashit( $main_site_url ) . 'wp-json/webwork/v1/' );

		// @todo Abstract.
		$post_data = null;
		$ww_problem_text = '';
		if ( ! empty( $_GET['post_data_key'] ) ) {
			$post_data = get_blog_option( $server_site_id, $_GET['post_data_key'] );
			//$ww_problem_text = base64_decode( $post_data['pg_object'] );
		}

		// @todo This is awful.
		$clients = get_blog_option( $server_site_id, 'webwork_clients', array() );
		$remote_course_url = array_search( get_current_blog_id(), $clients );

		$user_is_admin = webwork_user_is_admin();

		// @todo Truly awful.
		$switched = false;
		if ( get_current_blog_id() !== $server_site_id ) {
			switch_to_blog( $server_site_id );
			$switched = true;
		}

		$q = new \WeBWorK\Server\Question\Query();
		$filter_options = $q->get_all_filter_options();

		if ( $switched ) {
			restore_current_blog();
		}

		/**
		 * Filters the "intro text" at the top of the directory.
		 *
		 * Leave empty to use the default.
		 *
		 * @param string
		 */
		$intro_text = apply_filters( 'webwork_intro_text', '' );

		/**
		 * Filters the sidebar intro text.
		 *
		 * @param string
		 */
		$sidebar_intro_text = apply_filters( 'webwork_sidebar_intro_text', 'Use the filters below to navigate the questions that have been posted. You can select questions by course, section, or a specific WeBWorK problem set.' );

		/**
		 * Filters the moment.js "format'.
		 *
		 * Defaults to 'MMMM D, YYYY'.
		 *
		 * See https://momentjs.com/docs/.
		 *
		 * @param string
		 */
		$moment_format = apply_filters( 'webwork_moment_format', 'MMMM D, YYYY' );

		/**
		 * Filters the "Incomplete" message content.
		 *
		 * @param string
		 */
		$incomplete_text = apply_filters( 'webwork_incomplete_question_text', 'This question does not contain enough detail for a useful response to be provided.' );

		wp_localize_script( 'webwork-app', 'WWData', array(
			'client_name' => get_option( 'blogname' ),
			'filter_options' => $filter_options,
			'incompleteQuestionText' => $incomplete_text,
			'introText' => $intro_text,
			'momentFormat' => $moment_format,
			'page_base' => trailingslashit( set_url_scheme( get_option( 'home' ) ) ),
			'problem_id' => $ww_problem,
			'remote_course_url' => $remote_course_url,
			'rest_api_nonce' => wp_create_nonce( 'wp_rest' ),
			'rest_api_endpoint' => $rest_api_endpoint,
			'sidebarIntroText' => $sidebar_intro_text,
			'route_base' => trailingslashit( $route_base ),
			'user_can_ask_question' => is_user_logged_in(), // todo
			'user_can_post_response' => is_user_logged_in(), // todo
			'user_can_subscribe' => is_user_logged_in(), // todo
			'user_can_vote' => is_user_logged_in(), // todo
			'user_id' => get_current_user_id(),
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

		$markup  = '<div class="wrapper section-inner">';
		$markup .=   '<div id="webwork-app" class="webwork-app">';
		$markup .=     __( 'Loading...', 'webwork' );
		$markup .=	 '</div><!-- .content-area -->';
		$markup .= '</div>';

		return $markup;
	}

	public function filter_the_content( $content ) {
		return $content;
		$ww_problem = false;
		if ( is_page( 'webwork' ) ) {
			$ww_problem = true;
		} else {
			$ww_problem = get_query_var( 'ww_problem' );
		}

		if ( $ww_problem ) {
			$content = '<div id="webwork-app"></div>';
			wp_enqueue_script( 'webwork-app', plugins_url() . '/webwork/build/index.js', array( 'wp-i18n' ) );

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

	public function filter_login_message( $message ) {
		if ( empty( $_GET['is-webwork-redirect'] ) ) {
			return $message;
		}

		$site_name = get_option( 'blogname' );
		$message = sprintf(
			esc_html__( 'You have been directed to %s from WeBWorK. Before posting a question, you must log in using your %s credentials.' ),
			esc_html( $site_name ),
			esc_html( $site_name )
		);

		/**
		 * Filters the WeBWorK login redirect message.
		 *
		 * @param string $message
		 */
		$message = apply_filters( 'webwork_login_redirect_message', $message );

		$retval = '<p class="message">' . $message . '</p>';

		return $retval;
	}
}
