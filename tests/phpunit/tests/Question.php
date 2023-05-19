<?php

/**
 * @group question
 */
class WeBWork_Tests_Question extends WeBWorK_UnitTestCase {
	public function test_successful_save_for_existing_item() {
		$q = self::factory()->question->create(
			array(
				'problem_id' => 15,
				'tried'      => 'foo tried',
			)
		);

		$question = new \WeBWorK\Server\Question( $q );

		$question->set_content( 'foo' );
		$question->set_tried( 'bar tried' );
		$question->set_problem_id( 20 );

		$saved = $question->save();

		$this->assertTrue( $saved );

		$new_question = new \WeBWorK\Server\Question( $q );
		$this->assertSame( 'foo', $new_question->get_content() );
		$this->assertSame( '20', $new_question->get_problem_id() );
		$this->assertSame( 'bar tried', $new_question->get_tried() );
	}

	public function test_successful_save_for_new_item() {
		$question = new \WeBWorK\Server\Question();

		$question->set_content( 'foo' );
		$question->set_problem_id( 20 );

		$saved = $question->save();

		$this->assertTrue( $saved );

		$new_question = new \WeBWorK\Server\Question( $question->get_id() );
		$this->assertSame( 'foo', $new_question->get_content() );
		$this->assertSame( '20', $new_question->get_problem_id() );
	}

	public function test_exists_false() {
		$q = new \WeBWorK\Server\Question( 999 );
		$this->assertFalse( $q->exists() );
	}

	public function test_exists_true() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$this->assertTrue( $question->exists() );
	}

	public function test_delete_should_fail_when_question_does_not_exist() {
		$question = new \WeBWorK\Server\Question( 999 );
		$this->assertFalse( $question->exists() );

		$this->assertFalse( $question->delete() );
	}

	public function test_delete_success() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );
		$this->assertTrue( $question->exists() );

		$this->assertTrue( $question->delete() );

		$question_2 = new \WeBWorK\Server\Question( $q );
		$this->assertFalse( $question_2->exists() );
	}

	public function test_vote_count_should_default_to_zero() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$this->assertSame( 0, $question->get_vote_count() );
	}

	public function test_vote_count() {
		$q = self::factory()->question->create_and_get();

		self::factory()->vote->create(
			array(
				'user_id' => 5,
				'item'    => $q,
				'value'   => 1,
			)
		);

		$this->assertSame( 1, $q->get_vote_count() );
	}

	public function test_vote_count_should_be_cached_in_meta() {
		$q = self::factory()->question->create_and_get();

		self::factory()->vote->create(
			array(
				'user_id' => 5,
				'item'    => $q,
				'value'   => 1,
			)
		);

		// Danger - testing implementation details :-/
		$this->assertEquals( 1, get_post_meta( $q->get_id(), 'webwork_vote_count', true ) );
	}

	public function test_deleting_vote_should_invalidate_cache() {
		$q = self::factory()->question->create_and_get();

		self::factory()->vote->create(
			array(
				'user_id' => 5,
				'item'    => $q,
				'value'   => 1,
			)
		);

		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( $q );
		$v->populate();

		$v->delete();

		$this->assertSame( 0, $q->get_vote_count() );
	}

	public function test_set_post_date() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$new_date = '2015-05-05 05:05:05';
		$question->set_post_date( $new_date );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $new_date, $question2->get_post_date() );
	}

	public function test_set_problem_id() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$problem_id = 'foo';
		$question->set_problem_id( $problem_id );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $problem_id, $question2->get_problem_id() );
	}

	public function test_set_problem_set() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$problem_set = 'foo';
		$question->set_problem_set( $problem_set );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $problem_set, $question2->get_problem_set() );
	}

	public function test_set_course() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$course = 'foo';
		$question->set_course( $course );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $course, $question2->get_course() );
	}

	public function test_get_response_count() {
		$q = self::factory()->question->create_and_get();

		$r = new \WeBWorK\Server\Response();
		$r->set_question_id( $q->get_id() );
		$r->save();

		$this->assertSame( 1, $q->get_response_count() );
	}

	public function test_get_response_count_should_return_0_for_no_responses() {
		$q = self::factory()->question->create_and_get();

		$this->assertSame( 0, $q->get_response_count() );
	}

	public function test_response_count_cache_should_be_invalidated_on_new_response() {
		$q = self::factory()->question->create_and_get();

		$this->assertSame( 0, $q->get_response_count() );

		$r = new \WeBWorK\Server\Response();
		$r->set_question_id( $q->get_id() );
		$r->save();

		$this->assertSame( 1, $q->get_response_count() );
	}

	public function test_response_count_cache_should_be_invalidated_on_deleted_response() {
		$q = self::factory()->question->create_and_get();

		$r = new \WeBWorK\Server\Response();
		$r->set_question_id( $q->get_id() );
		$r->save();

		$this->assertSame( 1, $q->get_response_count() );

		$r->delete();

		$this->assertSame( 0, $q->get_response_count() );
	}

	public function test_get_has_answer_false() {
		$q = self::factory()->question->create_and_get();

		$r = new \WeBWorK\Server\Response();
		$r->set_question_id( $q->get_id() );
		$r->save();

		$this->assertFalse( $q->get_has_answer() );
	}

	public function test_get_url() {
		$problem_id = 'foo-bar';
		$q          = self::factory()->question->create_and_get(
			array(
				'problem_id' => $problem_id,
			)
		);

		$expected = 'http://' . WP_TESTS_DOMAIN . '/#:problemId=foo-bar:questionId=' . $q->get_id();
		$this->assertSame( $expected, $q->get_url( 'http://' . WP_TESTS_DOMAIN ) );
	}

	public function test_fetch_external_assets_for_text() {
		$q = self::factory()->question->create_and_get(
			array(
				'problem_id' => 15,
			)
		);

		$upload_dir = wp_upload_dir();

		// just in case
		$this->deleteDir( $upload_dir['path'] );
		wp_mkdir_p( $upload_dir['path'] );

		$src  = 'https://teleogistic.net/files/2016/09/output.gif';
		$text = sprintf( 'Foo bar <a href="%s"><img src="%s" /></a> foo bar', $src, $src );
		$q->set_problem_text( $text );

		$q->fetch_external_assets();

		$expected_url = str_replace( 'https://teleogistic.net/files/2016/09', $upload_dir['url'], $src );
		$this->assertStringContainsString( $expected_url, $q->get_problem_text() );
		$this->assertStringNotContainsString( $src, $q->get_problem_text() );
		$this->assertFileExists( $upload_dir['path'] . '/' . basename( $src ) );
	}

	public static function deleteDir( $dir_path ) {
		if ( ! is_dir( $dir_path ) ) {
			throw new InvalidArgumentException( "$dir_path must be a directory" );
		}

		if ( substr( $dir_path, strlen( $dir_path ) - 1, 1 ) !== '/' ) {
			$dir_path .= '/';
		}

		$files = glob( $dir_path . '*', GLOB_MARK );
		foreach ( $files as $file ) {
			if ( is_dir( $file ) ) {
				self::deleteDir( $file );
			} else {
				unlink( $file );
			}
		}

		rmdir( $dir_path );
	}
}
