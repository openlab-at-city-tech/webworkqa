<?php

/**
 * @group problem_instance
 */
class WeBWorK_Tests_ProblemInstance_Query extends WeBWorK_UnitTestCase {
	public function test_results_should_be_problem_instance_objects() {
		$i = self::factory()->problem_instance->create();

		$query = new \WeBWorK\Server\ProblemInstance\Query( array() );
		$found = $query->get();

		$this->assertNotEmpty( $found );

		$instance = reset( $found );

		$this->assertSame( $i, $instance->get_id() );
	}

	public function test_get_by_problem_id() {
		$p1 = self::factory()->problem->create();
		$p2 = self::factory()->problem->create();

		$pi1 = self::factory()->problem_instance->create( array(
			'problem_id' => $p1,
		) );
		$pi2 = self::factory()->problem_instance->create( array(
			'problem_id' => $p2,
		) );

		$q = new \WeBWorK\Server\ProblemInstance\Query( array(
			'problem_id' => $p2,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $pi2 ), $ids );
	}

	public function test_get_by_remote_course_url() {
		$c1 = 'foo';
		$c2 = 'bar';

		$pi1 = self::factory()->problem_instance->create( array(
			'remote_course_url' => $c1,
		) );
		$pi2 = self::factory()->problem_instance->create( array(
			'remote_course_url' => $c2,
		) );

		$q = new \WeBWorK\Server\ProblemInstance\Query( array(
			'remote_course_url' => $c2,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $pi2 ), $ids );
	}
}
