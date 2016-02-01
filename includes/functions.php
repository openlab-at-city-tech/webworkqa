<?php

/**
 * Miscellaneous utility functions.
 *
 * @since 1.0.0
 */

/**
 * Wrapper for easy access to global object.
 *
 * @since 1.0.0
 *
 * @return WeBWorK
 */
function webwork() {
	return $GLOBALS['webwork'];
}

/**
 * Get the WWClass object for a set of params.
 *
 * @since 1.0.0
 */
function webwork_get_wwclass( $args = array() ) {
	if ( empty( $args['object_type'] ) || empty( $args['object_id'] ) ) {
		return false;
	}

	$qargs = array(
		'post_type' => 'webwork_class',
		'no_found_rows' => true,
		'update_post_term_cache' => false,
		'fields' => 'ids',
	);

	$qargs['meta_query'] = array(
		'relation' => 'OR',
		'webwork_object_id' => array(
			'key' => 'webwork_object_id',
			'value' => $args['object_id'],
		),
		'webwork_object_type' => array(
			'key' => 'webwork_object_type',
			'value' => $args['object_type'],
		),
	);

	$query = new WP_Query( $qargs );

	$retval = false;
	if ( ! empty( $query->posts ) ) {
		$wwclass = new \WeBWorK\WWClass( $query->posts[0] );
		if ( $wwclass->exists() ) {
			$retval = $wwclass;
		}
	}

	return $retval;
}

/**
 * Register an integration.
 *
 * @since 1.0.0
 */
function webwork_register_integration( $args ) {
}
