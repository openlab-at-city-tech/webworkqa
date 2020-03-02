<?php

/**
 * @group vote
 */
class WeBWork_Tests_Vote extends WeBWorK_UnitTestCase {
	public function test_successful_save_for_existing_item() {
		$i = new MockVoteable( 10 );
		self::factory()->vote->create(
			array(
				'user_id' => 5,
				'item'    => $i,
				'value'   => 15,
			)
		);

		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( $i );
		$v->populate();

		$v->set_value( 20 );

		$saved = $v->save();

		$this->assertTrue( $saved );

		$v2 = new \WeBWorK\Server\Vote();
		$v2->set_user_id( 5 );
		$v2->set_item( $i );
		$v2->populate();

		$this->assertSame( 20, $v2->get_value() );
	}

	public function test_successful_save_for_new_item() {
		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( new MockVoteable( 10 ) );
		$v->set_value( 15 );

		$saved = $v->save();

		$this->assertTrue( $saved );
	}

	public function test_exists_false() {
		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( new MockVoteable( 10 ) );
		$v->populate();

		$this->assertFalse( $v->exists() );
	}

	public function test_exists_true() {
		self::factory()->vote->create(
			array(
				'user_id' => 5,
				'item'    => new MockVoteable( 10 ),
				'value'   => 15,
			)
		);

		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( new MockVoteable( 10 ) );
		$v->populate();

		$this->assertTrue( $v->exists() );
	}

	public function test_creation_sets_values_properly() {
		self::factory()->vote->create(
			array(
				'user_id' => 5,
				'item'    => new MockVoteable( 10 ),
				'value'   => 15,
			)
		);

		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( new MockVoteable( 10 ) );
		$v->populate();

		$this->assertSame( 5, $v->get_user_id() );
		$this->assertSame( 10, $v->get_item_id() );
		$this->assertSame( 15, $v->get_value() );
	}

	public function test_delete_should_fail_when_vote_does_not_exist() {
		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( new MockVoteable( 10 ) );
		$v->populate();

		$this->assertFalse( $v->exists() );
		$this->assertFalse( $v->delete() );
	}

	public function test_delete_success() {
		self::factory()->vote->create(
			array(
				'user_id' => 5,
				'item'    => new MockVoteable( 10 ),
				'value'   => 15,
			)
		);

		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( new MockVoteable( 10 ) );
		$v->populate();

		$this->assertTrue( $v->exists() );
		$this->assertTrue( $v->delete() );

		$v2 = new \WeBWorK\Server\Vote();
		$v2->set_user_id( 5 );
		$v2->set_item( new MockVoteable( 10 ) );
		$v2->populate();
		$this->assertFalse( $v2->exists() );
	}
}
