<?php

namespace WeBWorK\BuddyPress;

class BPGroupExtension extends \BP_Group_Extension {
	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$args = array(
			'slug' => 'webwork', // todo: abstract
			'name' => _x( 'WeBWorK', 'group extension name', 'webwork' ),
			'access' => 'member',
		);

		parent::init( $args );
	}

	/**
	 * Main tab display.
	 *
	 * @since 1.0.0
	 */
	public function display( $group_id = null ) {
		// todo set up template stack so I can use bp_get_template_part().
		require_once( WEBWORK_PLUGIN_DIR . '/templates/form.php' );
	}
}
