<?php

/**
 * @group problem
 */
class WeBWork_Tests_Problem extends WeBWorK_UnitTestCase {
	public function test_successful_save_for_existing_item() {
		$p = self::factory()->problem->create( array(
			'content' => 'bar',
			'remote_url' => 'http://example.com/my-webwork-problem',
		) );

		$problem = new \WeBWorK\Server\Problem( $p );

		$problem->set_content( 'foo' );
		$problem->set_author_id( 123 );
		$problem->set_remote_url( 'http://example.com/example-problem' );

		$saved = $problem->save();

		$this->assertTrue( $saved );

		$new_problem = new \WeBWorK\Server\Problem( $problem->get_id() );
		$this->assertSame( $p, $new_problem->get_id() );
		$this->assertSame( 'foo', $new_problem->get_content() );
		$this->assertSame( 123, $new_problem->get_author_id() );
		$this->assertSame( 'http://example.com/example-problem', $new_problem->get_remote_url() );
	}

	public function test_successful_save_for_new_item() {
		$problem = new \WeBWorK\Server\Problem();

		$problem->set_content( 'foo' );
		$problem->set_author_id( 123 );
		$problem->set_remote_url( 'http://example.com/example-problem' );

		$saved = $problem->save();

		$this->assertTrue( $saved );

		$new_problem = new \WeBWorK\Server\Problem( $problem->get_id() );
		$this->assertSame( 'foo', $new_problem->get_content() );
		$this->assertSame( 123, $new_problem->get_author_id() );
		$this->assertSame( 'http://example.com/example-problem', $new_problem->get_remote_url() );
	}

	public function test_exists_false() {
		$p = new \WeBWorK\Server\Problem( 999 );
		$this->assertFalse( $p->exists() );
	}

	public function test_exists_true() {
		$p = self::factory()->problem->create();

		$problem = new \WeBWorK\Server\Problem( $p );

		$this->assertTrue( $problem->exists() );
	}

	public function test_delete_should_fail_when_question_does_not_exist() {
		$problem = new \WeBWorK\Server\Problem( 999 );
		$this->assertFalse( $problem->exists() );

		$this->assertFalse( $problem->delete() );
	}

	public function test_delete_success() {
		$p = self::factory()->problem->create();

		$problem = new \WeBWorK\Server\Problem( $p );
		$this->assertTrue( $problem->exists() );

		$this->assertTrue( $problem->delete() );

		$problem_2 = new \WeBWorK\Server\Problem( $p );
		$this->assertFalse( $problem_2->exists() );
	}

	public function test_set_post_date() {
		$p = self::factory()->problem->create();

		$problem = new \WeBWorK\Server\Problem( $p );

		$new_date = '2015-05-05 05:05:05';
		$problem->set_post_date( $new_date );

		$this->assertTrue( $problem->save() );

		$problem2 = new \WeBWorK\Server\Problem( $p );
		$this->assertSame( $new_date, $problem2->get_post_date() );
	}
}
