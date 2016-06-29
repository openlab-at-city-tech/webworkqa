<?php

/**
 * @group problem
 */
class WeBWorK_Tests_Problem_Query extends WeBWorK_UnitTestCase {
	public function test_results_should_be_problem_objects() {
		$p = self::factory()->problem->create( array(
			'content' => 'foo',
			'post_author' => 123,
		) );

		$query = new \WeBWorK\Server\Problem\Query( array() );
		$found = $query->get();

		$this->assertNotEmpty( $found );

		$problem = reset( $found );

		$this->assertSame( $p, $problem->get_id() );
		$this->assertSame( 'foo', $problem->get_content() );
		$this->assertSame( 123, $problem->get_author_id() );
	}

	public function test_get_by_problem_id__in() {
		$p1 = self::factory()->problem->create();
		$p2 = self::factory()->problem->create();

		$q = new \WeBWorK\Server\Problem\Query( array(
			'problem_id__in' => array( $p2 ),
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $p2 ), $ids );
	}

	public function test_get_by_library_id() {
		$p1 = self::factory()->problem->create();
		$p2 = self::factory()->problem->create();

		add_post_meta( $p1, 'webwork_library_id', 'foo' );
		add_post_meta( $p2, 'webwork_library_id', 'bar' );

		$q = new \WeBWorK\Server\Problem\Query( array(
			'library_id' => array( 'bar' ),
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $p2 ), $ids );
	}
}
