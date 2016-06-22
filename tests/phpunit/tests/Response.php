<?php

/**
 * @group response
 */
class WeBWork_Tests_Response extends WeBWorK_UnitTestCase {
	public function test_successful_save_for_existing_item() {
		$r = self::factory()->response->create( array(
			'is_answer' => true,
			'question_id' => 15,
		) );

		$response = new \WeBWorK\Server\Response( $r );

		$response->set_content( 'foo' );
		$response->set_question_id( 20 );
		$response->set_is_answer( false );

		$saved = $response->save();

		$this->assertTrue( $saved );

		$new_response = new \WeBWorK\Server\Response( $r );
		$this->assertSame( 'foo', $new_response->get_content() );
		$this->assertSame( 20, $new_response->get_question_id() );
		$this->assertFalse( $new_response->get_is_answer() );
	}

	public function test_successful_save_for_new_item() {
		$response = new \WeBWorK\Server\Response();

		$response->set_content( 'foo' );
		$response->set_question_id( 20 );
		$response->set_is_answer( false );

		$saved = $response->save();

		$this->assertTrue( $saved );

		$new_response = new \WeBWorK\Server\Response( $response->get_id() );
		$this->assertSame( 'foo', $new_response->get_content() );
		$this->assertSame( 20, $new_response->get_question_id() );
		$this->assertFalse( $new_response->get_is_answer() );
	}

	public function test_exists_false() {
		$v = new \WeBWorK\Server\Response( 999 );
		$this->assertFalse( $v->exists() );
	}

	public function test_exists_true() {
		$r = self::factory()->response->create();

		$response = new \WeBWorK\Server\Response( $r );

		$this->assertTrue( $response->exists() );
	}

	public function test_delete_should_fail_when_response_does_not_exist() {
		$response = new \WeBWorK\Server\Response( 999 );
		$this->assertFalse( $response->exists() );

		$this->assertFalse( $response->delete() );
	}

	public function test_delete_success() {
		$r = self::factory()->response->create();

		$response = new \WeBWorK\Server\Response( $r );
		$this->assertTrue( $response->exists() );

		$this->assertTrue( $response->delete() );

		$response_2 = new \WeBWorK\Server\Vote( $r );
		$this->assertFalse( $response_2->exists() );
	}

	public function test_vote_count_should_default_to_zero() {
		$this->markTestSkipped( 'todo' );

		$r = self::factory()->response->create();

		$response = new \WeBWorK\Server\Response( $r );

		$this->assertSame( 0, $response->get_vote_count() );
	}

	public function test_set_post_date() {
		$r = self::factory()->response->create();

		$response = new \WeBWorK\Server\Response( $r );

		$new_date = '2015-05-05 05:05:05';
		$response->set_post_date( $new_date );

		$this->assertTrue( $response->save() );

		$response2 = new \WeBWorK\Server\Response( $r );
		$this->assertSame( $new_date, $response2->get_post_date() );
	}
}
