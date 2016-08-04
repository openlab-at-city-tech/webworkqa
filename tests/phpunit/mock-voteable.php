<?php

class MockVoteable implements \WeBWorK\Server\Util\Voteable {
	public function __construct( $item_id = null ) {
		$this->item_id = $item_id;
	}

	public function get_vote_count( $force_query = false ) {

	}

	public function get_id() {
		return (int) $this->item_id;
	}
}
