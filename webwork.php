<?php
/*
Plugin Name: WeBWorK for WordPress
Version: 0.1-alpha
Description: Integration between WeBWorK and WordPress
Author: Boone Gorges
Author URI: https://boone.gorg.es
Plugin URI: https://openlab.citytech.cuny.edu
Text Domain: webwork
Domain Path: /languages
*/

define( 'WEBWORK_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WEBWORK_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Bootstrap.
 *
 * Loaded early to avoid race conditions with BuddyPress (bp_init).
 *
 * @since 1.0.0
 */
function webwork_init() {
	if ( version_compare( phpversion(), '5.3', '<' ) ) {
		add_action( 'admin_notices', create_function( '', "echo '<div class=\"error\"><p>" . __( 'WeBWorK for WordPress requires PHP 5.3 to function properly. Please upgrade PHP or deactivate WeBWorK for WordPress.', 'webwork' ) . "</p></div>';" ) );
		return;
	}

	if ( version_compare( $GLOBALS['wp_version'], '4.4', '<' ) ) {
		add_action( 'admin_notices', create_function( '', "echo '<div class=\"error\"><p>" . __( 'WeBWorK for WordPress requires WordPress 4.4 to function properly. Please upgrade WordPress or deactivate WeBWorK for WordPress.', 'webwork' ) . "</p></div>';" ) );
		return;
	}

	spl_autoload_register( 'webwork_autoload_register' );

	$GLOBALS['webwork'] = \WeBWorK\Loader::init();
}
add_action( 'init', 'webwork_init', 5 );

/**
 * Autoload logic.
 *
 * @since 1.0.0
 */
function webwork_autoload_register( $class ) {
	$prefix = 'WeBWorK\\';

	// Get the relative class name.
	$relative_class = substr( $class, strlen( $prefix ) );

	$base_dir = dirname( __FILE__ ) . '/classes/';

	$file = $base_dir . str_replace( '\\', '/', $relative_class . '.php' );

	if ( file_exists( $file ) ) {
		require $file;
	}
}
