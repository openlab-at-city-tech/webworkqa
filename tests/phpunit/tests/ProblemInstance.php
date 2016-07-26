<?php

/**
 * @group problem_instance
 */
class WeBWork_Tests_ProblemInstance extends WeBWorK_UnitTestCase {
	public function test_successful_save_for_new_item() {
		$p = self::factory()->problem->create();

		$course_url = 'http://example.com/myCourse/foo';
		$problem_url = 'foo';
		$problem_set = 'set';
		$problem = 'pid';

		$instance = new \WeBWorK\Server\ProblemInstance();
		$instance->set_problem_id( $p );
		$instance->set_remote_course_url( $course_url );
		$instance->set_remote_problem_url( $problem_url );
		$instance->set_remote_problem_set( $problem_set );
		$instance->set_remote_problem( $problem );
		$instance->set_course( 'myCourse' );

		$saved = $instance->save();

		$this->assertTrue( $saved );

		$new_instance = new \WeBWorK\Server\ProblemInstance( $instance->get_id() );
		$this->assertSame( $p, $new_instance->get_problem_id() );
		$this->assertSame( $course_url, $new_instance->get_remote_course_url() );
		$this->assertSame( $problem_url, $new_instance->get_remote_problem_url() );
		$this->assertSame( $problem_set, $new_instance->get_remote_problem_set() );
		$this->assertSame( $problem, $new_instance->get_remote_problem() );
		$this->assertSame( 'myCourse', $new_instance->get_course() );
	}

	public function test_successful_save_for_existing_item() {
		$p = self::factory()->problem->create();
		$pi = self::factory()->problem_instance->create();

		$course_url = 'foo';
		$problem_url = 'foo';
		$problem_set = 'set';
		$problem = 'pid';

		$instance = new \WeBWorK\Server\ProblemInstance( $pi );
		$instance->set_problem_id( $p );
		$instance->set_remote_course_url( $course_url );
		$instance->set_remote_problem_url( $problem_url );
		$instance->set_remote_problem_set( $problem_set );
		$instance->set_remote_problem( $problem );
		$instance->set_course( 'myCourse' );

		$saved = $instance->save();

		$this->assertTrue( $saved );

		$new_instance = new \WeBWorK\Server\ProblemInstance( $pi );
		$this->assertSame( $p, $new_instance->get_problem_id() );
		$this->assertSame( $course_url, $new_instance->get_remote_course_url() );
		$this->assertSame( $problem_url, $new_instance->get_remote_problem_url() );
		$this->assertSame( $problem_set, $new_instance->get_remote_problem_set() );
		$this->assertSame( $problem, $new_instance->get_remote_problem() );
		$this->assertSame( 'myCourse', $new_instance->get_course() );
	}

	public function test_exists_false() {
		$p = new \WeBWorK\Server\ProblemInstance( 999 );
		$this->assertFalse( $p->exists() );
	}

	public function test_exists_true() {
		$p = self::factory()->problem_instance->create();

		$instance = new \WeBWorK\Server\ProblemInstance( $p );

		$this->assertTrue( $instance->exists() );
	}

	public function test_delete_should_fail_when_question_does_not_exist() {
		$instance = new \WeBWorK\Server\ProblemInstance( 999 );
		$this->assertFalse( $instance->exists() );

		$this->assertFalse( $instance->delete() );
	}

	public function test_delete_success() {
		$pi = self::factory()->problem->create();

		$instance = new \WeBWorK\Server\ProblemInstance( $pi );
		$this->assertTrue( $instance->exists() );

		$this->assertTrue( $instance->delete() );

		$instance_2 = new \WeBWorK\Server\ProblemInstance( $pi );
		$this->assertFalse( $instance_2->exists() );
	}
}
