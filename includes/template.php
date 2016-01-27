<?php

/**
 * Template functions.
 *
 * @since 1.0.0
 */

/**
 * Get the post_data corresponding to the current query var.
 *
 * @since 1.0.0
 *
 * @return bool|array
 */
function webwork_get_current_post_data() {
	$data = false;

	if ( isset( $_GET['post_data_key'] ) ) {
		// Todo need a way to clean up old values from options table.
		// Maybe: put in non-persistent cache, and delete immediately.
		$data = get_option( wp_unslash( $_GET['post_data_key'] ) );
		if ( ! $data ) {
			$data = false;
		}

		// Decode 'pg_object', which is an HTML representation of the question.
		if ( isset( $data['pg_object'] ) ) {
			$data['pg_object'] = base64_decode( $data['pg_object'] );
		}
	}

	return $data;
}

/**
 * Clean the contents of the 'pg_object' for display in the WP context.
 *
 * Also enqueues necessary script.
 *
 * We remove the WeBWorK script loader in favor of our own.
 *
 * @since 1.0.0
 */
function webwork_prepare_pg_object( $o ) {
	wp_enqueue_script( 'webwork-mathjax-config', 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML' );

	// Thought about using DOMDocument but it is awful.
	return preg_replace( '|<script type="text/javascript">.*?</script>|s', '', $o );
}

/**
 * Get the current wwclass object.
 *
 * @since 1.0.0
 *
 * @return bool|\WeBWorK\WWClass
 */
function webwork_get_current_wwclass() {
	$current_object_id = 0;
	$current_object_type = '';
	foreach ( webwork()->get_integrations() as $key => $class ) {
		$current_object_id = $class::get_current_object_id();
		if ( $current_object_id ) {
			$current_object_type = $key;
			break;
		}
	}

	if ( ! $current_object_id ) {
		return false;
	}

	$query = new \WP_Query( array(
		'post_type' => 'webwork_class',
		'meta_query' => array(
			'relation' => 'OR',
			'webwork_object_id' => array(
				'key' => 'webwork_object_id',
				'value' => $current_object_id,
			),
			'webwork_object_type' => array(
				'key' => 'webwork_object_type',
				'value' => $current_object_type,
			),
		),
		'no_found_rows' => true,
		'update_post_term_cache' => false,
		'fields' => 'ids',
	) );

	$retval = false;
	if ( ! empty( $query->posts ) ) {
		$wwclass = new \WeBWorK\WWClass( $query->posts[0] );
		if ( $wwclass->exists() ) {
			$retval = $wwclass;
		}
	}

	return $retval;
}
