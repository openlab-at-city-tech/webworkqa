<?php

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

$github_temp = getenv( 'RUNNER_TEMP' );
if ( $github_temp ) {
	$_tests_dir = $github_temp . '/wordpress-tests-lib';
}

require_once $_tests_dir . '/includes/functions.php';

function _manually_load_plugin() {
	global $wpdb;

	require dirname( dirname( dirname( __FILE__ ) ) ) . '/webwork.php';
	spl_autoload_register( 'webwork_autoload_register' );

	require_once ABSPATH . '/wp-admin/includes/upgrade.php';

	$schema       = new \WeBWorK\Server\Schema();
	$votes_schema = $schema->get_votes_schema();
	dbDelta( $votes_schema );

}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

require $_tests_dir . '/includes/bootstrap.php';

require dirname( __FILE__ ) . '/factory.php';
require dirname( __FILE__ ) . '/testcase.php';
require dirname( __FILE__ ) . '/mock-voteable.php';
