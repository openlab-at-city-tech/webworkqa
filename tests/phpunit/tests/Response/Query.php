<?php

/**
 * @group response
 */
class WeBWorK_Tests_Vote_Response extends WeBWorK_UnitTestCase {
	public function test_results_should_be_response_objects() {
		$r = self::factory()->response->create( array(
			'post_content' => 'foo',
			'post_author' => 123,
			'is_answer' => true,
			'question_id' => 456,
		) );

		$q = new \WeBWorK\Server\Response\Query( array() );
		$found = $q->get();

		$this->assertNotEmpty( $found );

		$response = reset( $found );

		$this->assertSame( $r, $response->get_id() );
		$this->assertSame( 'foo', $response->get_content() );
		$this->assertSame( 123, $response->get_author_id() );
		$this->assertTrue( $response->get_is_answer() );
		$this->assertSame( 456, $response->get_question_id() );
	}

	public function test_get_by_question_id__in() {
		$r1 = self::factory()->response->create( array(
			'question_id' => 3,
		) );

		$r2 = self::factory()->response->create( array(
			'question_id' => 4,
		) );

		$r3 = self::factory()->response->create( array(
			'question_id' => 5,
		) );

		$q = new \WeBWorK\Server\Response\Query( array(
			'question_id__in' => array( 3, 5 ),
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $r1, $r3 ), $ids );
	}
}