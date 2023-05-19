<?php

/**
 * @group response
 */
class WeBWorK_Tests_Vote_Response extends WeBWorK_UnitTestCase {
	public function test_results_should_be_response_objects() {
		$r = self::factory()->response->create(
			array(
				'post_content' => 'foo',
				'post_author'  => 123,
				'question_id'  => 456,
			)
		);

		$q     = new \WeBWorK\Server\Response\Query( array() );
		$found = $q->get();

		$this->assertNotEmpty( $found );

		$response = reset( $found );

		$this->assertSame( $r, $response->get_id() );
		$this->assertSame( 'foo', $response->get_content() );
		$this->assertSame( 123, $response->get_author_id() );
		$this->assertSame( 456, $response->get_question_id() );
	}

	public function test_get_by_question_id__in() {
		$r1 = self::factory()->response->create(
			array(
				'question_id' => 3,
			)
		);

		$r2 = self::factory()->response->create(
			array(
				'question_id' => 4,
			)
		);

		$r3 = self::factory()->response->create(
			array(
				'question_id' => 5,
			)
		);

		$q     = new \WeBWorK\Server\Response\Query(
			array(
				'question_id__in' => array( 3, 5 ),
			)
		);
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $r1, $r3 ), $ids );
	}

	public function test_results_should_be_ordered_by_vote_count() {
		$r1 = self::factory()->response->create_and_get(
			array(
				'question_id' => 3,
			)
		);

		$r2 = self::factory()->response->create_and_get(
			array(
				'question_id' => 3,
			)
		);

		$r3 = self::factory()->response->create_and_get(
			array(
				'question_id' => 3,
			)
		);

		self::factory()->vote->create_many( 2, array( 'item' => $r1 ) );
		self::factory()->vote->create_many( 1, array( 'item' => $r2 ) );
		self::factory()->vote->create_many( 3, array( 'item' => $r3 ) );

		$q     = new \WeBWorK\Server\Response\Query(
			array(
				'question_id' => 3,
			)
		);
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $r3->get_id(), $r1->get_id(), $r2->get_id() ), $ids );
	}

	public function test_results_should_be_ordered_by_post_date_when_vote_counts_are_the_same() {
		$now = time();

		$r1 = self::factory()->response->create_and_get(
			array(
				'question_id' => 3,
				'post_date'   => gmdate( 'Y-m-d H:i:s', $now - 50 ),
			)
		);

		$r2 = self::factory()->response->create_and_get(
			array(
				'question_id' => 3,
				'post_date'   => gmdate( 'Y-m-d H:i:s', $now - 40 ),
			)
		);

		$r3 = self::factory()->response->create_and_get(
			array(
				'question_id' => 3,
				'post_date'   => gmdate( 'Y-m-d H:i:s', $now - 60 ),
			)
		);

		$r4 = self::factory()->response->create_and_get(
			array(
				'question_id' => 3,
				'post_date'   => gmdate( 'Y-m-d H:i:s', $now - 30 ),
			)
		);

		self::factory()->vote->create_many( 1, array( 'item' => $r1 ) );
		self::factory()->vote->create_many( 2, array( 'item' => $r2 ) );
		self::factory()->vote->create_many( 1, array( 'item' => $r3 ) );
		self::factory()->vote->create_many( 1, array( 'item' => $r4 ) );

		$q     = new \WeBWorK\Server\Response\Query(
			array(
				'question_id' => 3,
			)
		);
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $r2->get_id(), $r3->get_id(), $r1->get_id(), $r4->get_id() ), $ids );
	}
}
