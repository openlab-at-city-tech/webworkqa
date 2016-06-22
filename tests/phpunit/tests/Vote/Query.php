<?php

/**
 * @group vote
 */
class WeBWorK_Tests_Vote_Query extends WeBWorK_UnitTestCase {
	public function test_get_by_item_id() {
		$i1 = 5;
		$i2 = 6;

		$u1 = 8;
		$u2 = 9;

		$v1 = self::factory()->vote->create( array(
			'item_id' => $i1,
			'user_id' => $u1,
		) );

		$v2 = self::factory()->vote->create( array(
			'item_id' => $i2,
			'user_id' => $u2,
		) );

		$q = new \WeBWorK\Server\Vote\Query( array(
			'item_id' => $i2,
		) );

		$found = $q->get();

		$this->assertSame( 1, count( $found ) );

		$first = reset( $found );
		$this->assertSame( $v2, $first->get_id() );
	}

	public function test_get_by_item_id__in() {
		$i1 = 5;
		$i2 = 6;
		$i3 = 7;

		$u1 = 8;
		$u2 = 9;

		$v1 = self::factory()->vote->create( array(
			'item_id' => $i1,
			'user_id' => $u1,
		) );

		$v2 = self::factory()->vote->create( array(
			'item_id' => $i2,
			'user_id' => $u2,
		) );

		$v3 = self::factory()->vote->create( array(
			'item_id' => $i3,
			'user_id' => $u2,
		) );

		$q = new \WeBWorK\Server\Vote\Query( array(
			'item_id__in' => array( $i1, $i3 ),
		) );

		$found = $q->get();

		$this->assertSame( 2, count( $found ) );

		$found_ids = array();
		foreach ( $found as $f ) {
			$found_ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $v1, $v3 ), $found_ids );
	}

	public function test_get_by_user_id() {
		$i1 = 5;
		$i2 = 6;

		$u1 = 8;
		$u2 = 9;

		$v1 = self::factory()->vote->create( array(
			'item_id' => $i1,
			'user_id' => $u1,
		) );

		$v2 = self::factory()->vote->create( array(
			'item_id' => $i2,
			'user_id' => $u2,
		) );

		$q = new \WeBWorK\Server\Vote\Query( array(
			'user_id' => $u1,
		) );

		$found = $q->get();

		$this->assertSame( 1, count( $found ) );

		$first = reset( $found );
		$this->assertSame( $v1, $first->get_id() );
	}

	public function test_get_count() {
		$i1 = 5;
		$i2 = 6;

		$u1 = 8;
		$u2 = 9;

		$v1 = self::factory()->vote->create( array(
			'item_id' => $i1,
			'user_id' => $u1,
		) );

		$v2 = self::factory()->vote->create( array(
			'item_id' => $i2,
			'user_id' => $u2,
		) );

		$q = new \WeBWorK\Server\Vote\Query( array(
			'user_id' => $u1,
		) );

		$found = $q->get( 'count' );

		$this->assertSame( 1, $found );
	}

	public function test_get_by_exclude_user_id() {
		$i1 = 5;
		$i2 = 6;

		$u1 = 8;
		$u2 = 9;

		$v1 = self::factory()->vote->create( array(
			'item_id' => $i1,
			'user_id' => $u1,
		) );

		$v2 = self::factory()->vote->create( array(
			'item_id' => $i2,
			'user_id' => $u2,
		) );

		$q = new \WeBWorK\Server\Vote\Query( array(
			'user_id__not_in' => array( $u1 ),
		) );

		$found = $q->get();

		$this->assertSame( 1, count( $found ) );

		$first = reset( $found );
		$this->assertSame( $v2, $first->get_id() );
	}
}
