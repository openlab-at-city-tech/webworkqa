<?php

class WeBWorK_Tests_Factory_For_Vote extends WP_UnitTest_Factory_For_Thing {
	public function __construct( $factory = null ) {
		parent::__construct( $factory );
		$this->default_generation_definitions = array(
			'user_id' => new WP_UnitTest_Generator_Sequence( '%d' ),
			'item_id' => new WP_UnitTest_Generator_Sequence( '%d' ),
			'value' => new WP_UnitTest_Generator_Sequence( '%d' ),
		);
	}

	public function create_object( $args ) {
		$vote = new \WeBWorK\Server\Vote( $args['user_id'], $args['item_id'] );
		$vote->set_value( $args['value'] );
		$vote->save();

		return $vote->get_id();
	}

	public function update_object( $user_id, $fields ) {
		$fields['ID'] = $user_id;
		return wp_update_user( $fields );
	}

	public function get_object_by_id( $user_id ) {
		return new WP_User( $user_id );
	}
}
