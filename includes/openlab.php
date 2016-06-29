<?php

/**
 * OpenLab-specific functionality.
 *
 * @todo Should be moved to a separate plugin.
 */

function openlab_webwork_author_type_label( $label, $user_id ) {
	$account_type = xprofile_get_field_data( 'Account Type', $user_id );
	if ( $account_type ) {
		$label = $account_type;
	}
	return $label;
}
add_filter( 'webwork_author_type_label', 'openlab_webwork_author_type_label', 10, 2 );
