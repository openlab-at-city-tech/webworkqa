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
		$this->assertSame( 456, $question->get_problem_id() );
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
		$q1 = self::factory()->question->create( array(
			'problem_id' => 3,
		) );

		$q2 = self::factory()->question->create( array(
			'problem_id' => 3,
		) );

		$q3 = self::factory()->question->create( array(
			'problem_id' => 3,
		) );

		self::factory()->vote->create_many( 2, array( 'item_id' => $q1 ) );
		self::factory()->vote->create_many( 1, array( 'item_id' => $q2 ) );
		self::factory()->vote->create_many( 3, array( 'item_id' => $q3 ) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'problem_id' => 3,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $q3, $q1, $q2 ), $ids );
	}

	public function test_results_should_be_ordered_by_post_date_when_vote_counts_are_the_same() {
		$now = time();

		$q1 = self::factory()->question->create( array(
			'problem_id' => 3,
			'post_date' => date( 'Y-m-d H:i:s', $now - 50 ),
		) );

		$q2 = self::factory()->question->create( array(
			'problem_id' => 3,
			'post_date' => date( 'Y-m-d H:i:s', $now - 40 ),
		) );

		$q3 = self::factory()->question->create( array(
			'problem_id' => 3,
			'post_date' => date( 'Y-m-d H:i:s', $now - 60 ),
		) );

		$q4 = self::factory()->question->create( array(
			'problem_id' => 3,
			'post_date' => date( 'Y-m-d H:i:s', $now - 30 ),
		) );

		self::factory()->vote->create_many( 1, array( 'item_id' => $q1 ) );
		self::factory()->vote->create_many( 2, array( 'item_id' => $q2 ) );
		self::factory()->vote->create_many( 1, array( 'item_id' => $q3 ) );
		self::factory()->vote->create_many( 1, array( 'item_id' => $q4 ) );

		$q = new \WeBWorK\Server\Question\Query( array(
			'problem_id' => 3,
		) );
		$found = $q->get();

		$ids = array();
		foreach ( $found as $f ) {
			$ids[] = $f->get_id();
		}

		$this->assertSame( array( $q2, $q3, $q1, $q4 ), $ids );
	}
}
