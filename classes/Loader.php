<?php

namespace WeBWorK;

/**
 * Plugin loader.
 *
 * @since 1.0.0
 */
class Loader {
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
		$this->schema = new Schema();
		$this->includes();

		add_action( 'template_redirect', array( $this, 'catch_post' ) );

		add_action( 'bp_init', array( $this, 'set_up_buddypress' ) );
	}

	/**
	 * @todo distinguish between webwork=1 and wp-login.php redirects? POST will not always be available
	 */
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

	/**
	 * Include required files.
	 *
	 * @since 1.0.0
	 */
	protected function includes() {
		include WEBWORK_PLUGIN_DIR . '/includes/template.php';
	}

	/**
	 * Set up BuddyPress integration.
	 *
	 * @since 1.0.0
	 */
	public function set_up_buddypress() {
		if ( bp_is_active( 'groups' ) ) {
			bp_register_group_extension( '\WeBWork\BuddyPress\BPGroupExtension' );
		}
	}
}
