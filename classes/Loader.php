<?php

namespace WeBWorK;

/**
 * Plugin loader.
 *
 * @since 1.0.0
 */
class Loader {
	/**
	 * Integrations.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected $integrations = array();

	/**
	 * Singleton bootstrap.
	 *
	 * @since 1.0.0
	 */
	public static function init() {
		static $instance;

		if ( null === $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * Private constructor.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		if ( 1 === get_current_blog_id() ) {
			$this->server = new Server();
//			$this->schema = new Schema();
//			$this->schema->init();
		} else {
			$this->client = new Client();
		}


		$this->api = new APIClient();

		$this->includes();
		$this->register_assets();

		add_action( 'template_redirect', array( $this, 'catch_post' ) );
		add_action( 'template_redirect', array( $this, 'catch_question' ) );

		add_action( 'bp_init', array( $this, 'set_up_buddypress' ) );

		/**
		 * Fires when the WeBWorK plugin has been set up.
		 *
		 * @since 1.0.0
		 */
		do_action( 'webwork_init' );
	}

	public function catch_post() {
		if ( ! empty( $_GET['webwork'] ) && '1' == $_GET['webwork'] ) {
			$router = new Router();
			$router->go();
			return;

			/**
			 * Router:
			 *
			 * - Top-level security: IP whitelist, etc.
			 * - Get the course URL from $_SERVER['HTTP_REFERER']
			 * - Get WP object (CPT) associated with course URL (todo uniqueness?)
			 * - Authentication flow. Log-in auth can be handled by centralized service, but WP objects
			 *   will require different authorization (group membership vs blog membership).
			 * - Send $_POST data to be processed by object-type handler
			 */
			if ( ! isset( $_SERVER['HTTP_REFERER'] ) ) {
				return;
			}

			$remote_class_url = stripslashes( $_SERVER['HTTP_REFERER'] );

			$router = new Router();
			$router->set_remote_class_url( $remote_class_url );
			$router->set_post_data( $_POST );
			$router->go();
		}
	}

	// @todo move to Router.
	public function catch_question() {
		if ( empty( $_POST['webwork-question-wp-object-id'] ) || empty( $_POST['webwork-question-wp-object-type'] ) ) {
			return;
		}

		$object_id = intval( $_POST['webwork-question-wp-object-id'] );
		$object_type = wp_unslash( $_POST['webwork-question-wp-object-type'] );

		if ( empty( $_POST['webwork-question-nonce'] ) ) {
			return;
		}

		// CSRF protection.
		$nonce = wp_unslash( $_POST['webwork-question-nonce'] );
		if ( ! wp_verify_nonce( $nonce, 'webwork_question' ) ) {
			return;
		}

		// Authn.
		$wwclass = webwork_get_wwclass( array(
			'object_type' => $object_type,
			'object_id' => $object_id,
		) );

		if ( ! $wwclass || ! $wwclass->current_user_can_post() ) {
			return;
		}

		$post_data = array(
			'subject' => isset( $_POST['webwork-question-subject'] ) ? wp_unslash( $_POST['webwork-question-subject'] ) : '',
			'tried' => isset( $_POST['webwork-question-tried'] ) ? wp_unslash( $_POST['webwork-question-tried'] ) : '',
			'text' => isset( $_POST['webwork-question-text'] ) ? wp_unslash( $_POST['webwork-question-text'] ) : '',
			'problem' => isset( $_POST['webwork-question-problem'] ) ? intval( $_POST['webwork-question-problem'] ) : null,
			'problem_set' => isset( $_POST['webwork-question-problem-set'] ) ? wp_unslash( $_POST['webwork-question-problem-set'] ) : null,
		);

		$redirect_to = $wwclass->post_question( $post_data );

                if ( $redirect_to ) {
                        wp_safe_redirect( $redirect_to );
                        die();
                }
	}

	/**
	 * Include required files.
	 *
	 * @since 1.0.0
	 */
	protected function includes() {
		include WEBWORK_PLUGIN_DIR . '/includes/functions.php';
		include WEBWORK_PLUGIN_DIR . '/includes/template.php';
	}

	/**
	 * Register assets.
	 *
	 * @since 1.0.0
	 */
	protected function register_assets() {
		// Scripts.
		wp_register_script( 'webwork-form-js', WEBWORK_PLUGIN_URL . 'assets/js/webwork-form.js', array( 'jquery' ) );

		$webwork_form_js_strings = array(
			'hide_problem' => esc_html__( 'Hide problem', 'webwork' ),
			'show_problem' => esc_html__( 'Show problem', 'webwork' ),
			'hide_related' => esc_html__( 'Hide related questions', 'webwork' ),
			'show_related' => esc_html__( 'Show related questions', 'webwork' ),
		);
		wp_localize_script( 'webwork-form-js', 'WeBWorK', $webwork_form_js_strings );

		wp_register_script( 'webwork-mathjax-loader', WEBWORK_PLUGIN_URL . '/assets/js/webwork-mathjax-loader.js' );

		$webwork_mathjax_loader_strings = array(
			'mathjax_src' => esc_url( 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML-full' ),
		);
		wp_localize_script( 'webwork-mathjax-loader', 'WeBWorK_MathJax', $webwork_mathjax_loader_strings );

		// Styles.
		wp_register_style( 'webwork-form-css', WEBWORK_PLUGIN_URL . 'assets/css/webwork-form.css' );
	}

	/**
	 * Set up BuddyPress integration.
	 *
	 * @since 1.0.0
	 */
	public function set_up_buddypress() {
		if ( bp_is_active( 'groups' ) ) {
			bp_register_group_extension( '\WeBWork\BuddyPress\BPGroupExtension' );
			$this->register_integration( 'bp_group_forum', '\WeBWorK\Integration\BPGroupForum' );
		}
	}

	/**
	 * Get integrations.
	 *
	 * @since 1.0.0
	 */
	public function get_integrations() {
		return $this->integrations;
	}

	/**
	 * Register an integration.
	 *
	 * Does not verify that integration class exists.
	 *
	 * @since 1.0.0
	 */
	public function register_integration( $name, $class ) {
		$this->integrations[ $name ] = $class;
	}
}
