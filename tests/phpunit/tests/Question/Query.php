<?php

/**
 * @group question
 */
class WeBWorK_Tests_Question_Query extends WeBWorK_UnitTestCase {
	public function test_results_should_be_question_objects() {
		$q = self::factory()->question->create( array(
			'content' => 'foo',
			'tried' => 'bar',
			'post_author' => 123,
			'problem_id' => 456,
		) );

		$query = new \WeBWorK\Server\Question\Query( array() );
		$found = $query->get();

		$this->assertNotEmpty( $found );

		$question = reset( $found );

		$this->assertSame( $q, $question->get_id() );
		$this->assertSame( 'foo', $question->get_content() );
		$this->assertSame( 'bar', $question->get_tried() );
		$this->assertSame( 123, $question->get_author_id() );
		$this->assertSame( '456', $question->get_problem_id() );
	}

	public function test_get_by_problem_id() {
		$q1 = self::factory()->question->create( array(
			'problem_id' => 3,
		) );

		$q2 = self::factory()->question->create( array(
			'problem_id' => 4,
		) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'problem_id' => 4,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $q2 ), $ids );
	}

	public function test_get_by_problem_set() {
		$q1 = self::factory()->question->create_and_get();
		$q1->set_problem_set( 'foo' );
		$q1->save();

		$q2 = self::factory()->question->create_and_get();
		$q2->set_problem_set( 'bar' );
		$q2->save();

		$q = new \WeBWorK\Server\Question\Query( array(
			'problem_set' => 'bar',
		) );

		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $q2->get_id() ), $ids );
	}

	public function test_get_by_course() {
		$q1 = self::factory()->question->create_and_get();
		$q1->set_course( 'foo' );
		$q1->save();

		$q2 = self::factory()->question->create_and_get();
		$q2->set_course( 'bar' );
		$q2->save();

		$q = new \WeBWorK\Server\Question\Query( array(
			'course' => 'bar',
		) );

		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $q2->get_id() ), $ids );
	}

	public function test_get_by_section() {
		$q1 = self::factory()->question->create_and_get();
		$q1->set_section( 'foo' );
		$q1->save();

		$q2 = self::factory()->question->create_and_get();
		$q2->set_section( 'bar' );
		$q2->save();

		$q = new \WeBWorK\Server\Question\Query( array(
			'section' => 'bar',
		) );

		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $q2->get_id() ), $ids );
	}

	public function test_get_by_question_id() {
		$q1 = self::factory()->question->create();
		$q2 = self::factory()->question->create();

		$q = new \WeBWorK\Server\Question\Query( array(
			'question_id' => $q2,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $q2 ), $ids );
	}

	public function test_get_by_answered_true() {
		$q1 = self::factory()->question->create();
		$q2 = self::factory()->question->create();

		$r1a = self::factory()->response->create( array(
			'question_id' => $q1,
		) );
		$r1b = self::factory()->response->create( array(
			'question_id' => $q1,
		) );
		$r2a = self::factory()->response->create( array(
			'question_id' => $q2,
			'is_answer' => true,
		) );
		$r2b = self::factory()->response->create( array(
			'question_id' => $q2,
		) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'answered' => true,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $q2 ), $ids );
	}

	public function test_get_by_answered_false() {
		$q1 = self::factory()->question->create();
		$q2 = self::factory()->question->create();

		$r1a = self::factory()->response->create( array(
			'question_id' => $q1,
		) );
		$r1b = self::factory()->response->create( array(
			'question_id' => $q1,
		) );
		$r2a = self::factory()->response->create( array(
			'question_id' => $q2,
			'is_answer' => true,
		) );
		$r2b = self::factory()->response->create( array(
			'question_id' => $q2,
		) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'answered' => false,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertEqualSets( array( $q1 ), $ids );
	}

	public function test_results_should_be_ordered_by_vote_count() {
		$q1 = self::factory()->question->create_and_get( array(
			'problem_id' => 3,
		) );

		$q2 = self::factory()->question->create_and_get( array(
			'problem_id' => 3,
		) );

		$q3 = self::factory()->question->create_and_get( array(
			'problem_id' => 3,
		) );

		self::factory()->vote->create_many( 2, array( 'item' => $q1 ) );
		self::factory()->vote->create_many( 1, array( 'item' => $q2 ) );
		self::factory()->vote->create_many( 3, array( 'item' => $q3 ) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'problem_id' => 3,
			'order' => 'DESC',
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $q3->get_id(), $q1->get_id(), $q2->get_id() ), $ids );
	}

	public function test_results_should_be_ordered_by_post_date_when_vote_counts_are_the_same() {
		$now = time();

		$q1 = self::factory()->question->create_and_get( array(
			'problem_id' => 3,
			'post_date' => date( 'Y-m-d H:i:s', $now - 50 ),
		) );

		$q2 = self::factory()->question->create_and_get( array(
			'problem_id' => 3,
			'post_date' => date( 'Y-m-d H:i:s', $now - 40 ),
		) );

		$q3 = self::factory()->question->create_and_get( array(
			'problem_id' => 3,
			'post_date' => date( 'Y-m-d H:i:s', $now - 60 ),
		) );

		$q4 = self::factory()->question->create_and_get( array(
			'problem_id' => 3,
			'orderby' => 'votes',
			'order' => 'DESC',
			'post_date' => date( 'Y-m-d H:i:s', $now - 30 ),
		) );

		self::factory()->vote->create_many( 1, array( 'item' => $q1 ) );
		self::factory()->vote->create_many( 2, array( 'item' => $q2 ) );
		self::factory()->vote->create_many( 1, array( 'item' => $q3 ) );
		self::factory()->vote->create_many( 1, array( 'item' => $q4 ) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'problem_id' => 3,
			'orderby' => 'votes',
			'order' => 'DESC',
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $q2->get_id(), $q3->get_id(), $q1->get_id(), $q4->get_id() ), $ids );
	}

	public function test_orderby_post_date_desc() {
		$now = time();

		$q1 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 50 ),
		) );

		$q2 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 40 ),
		) );

		$q3 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 60 ),
		) );

		$q4 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 30 ),
		) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'orderby' => 'post_date',
			'order' => 'DESC',
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $q4->get_id(), $q2->get_id(), $q1->get_id(), $q3->get_id() ), $ids );
	}

	public function test_orderby_post_date_asc() {
		$now = time();

		$q1 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 50 ),
		) );

		$q2 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 40 ),
		) );

		$q3 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 60 ),
		) );

		$q4 = self::factory()->question->create_and_get( array(
			'post_date' => date( 'Y-m-d H:i:s', $now - 30 ),
		) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'orderby' => 'post_date',
			'order' => 'ASC',
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $q3->get_id(), $q1->get_id(), $q2->get_id(), $q4->get_id() ), $ids );
	}

	public function test_orderby_response_count() {
		$now = time();

		$questions = self::factory()->question->create_many( 3 );

		self::factory()->response->create_many( 2, array( 'question_id' => $questions[0] ) );
		self::factory()->response->create_many( 1, array( 'question_id' => $questions[1] ) );
		self::factory()->response->create_many( 3, array( 'question_id' => $questions[2] ) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'orderby' => 'response_count',
			'order' => 'DESC',
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $questions[2], $questions[0], $questions[1] ), $ids );
	}

	public function test_get_filter_options_for_problem_set() {
		$q = new \WeBWorK\Server\Question\Query();

		$q1 = self::factory()->question->create_and_get();
		$q1->set_problem_set( 'foo' );
		$q1->save();

		$q2 = self::factory()->question->create_and_get();
		$q2->set_problem_set( 'bar' );
		$q2->save();

		// 'baz' will be empty.
		$q2 = self::factory()->question->create_and_get();
		$q2->set_problem_set( 'baz' );
		$q2->save();
		$q2->set_problem_set( 'bar' );
		$q2->save();

		$found = $q->get_filter_options( 'problem_set' );

		$expected = array(
			array(
				'name' => 'bar',
				'value' => 'bar',
			),
			array(
				'name' => 'foo',
				'value' => 'foo',
			),
		);

		$this->assertSame( $expected, $found );
	}
}
