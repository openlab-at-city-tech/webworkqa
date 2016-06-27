<?php

class WeBWorK_Tests_Factory_For_Vote extends WP_UnitTest_Factory_For_Thing {
	public function __construct( $factory = null ) {
		parent::__construct( $factory );
		$this->default_generation_definitions = array(
			'user_id' => new WP_UnitTest_Generator_Sequence( '%d' ),
			'item_id' => new WP_UnitTest_Generator_Sequence( '%d' ),
			'value' => new WP_UnitTest_Generator_Sequence( '%d' ),
		);
	}

	public function create_object( $args ) {
		$vote = new \WeBWorK\Server\Vote( $args['user_id'], $args['item_id'] );
		$vote->set_value( $args['value'] );
		$vote->save();

		return $vote->get_id();
	}

	public function update_object( $user_id, $fields ) {
		$fields['ID'] = $user_id;
		return wp_update_user( $fields );
	}

	public function get_object_by_id( $user_id ) {
		return new WP_User( $user_id );
	}
}

class WeBWorK_Tests_Factory_For_Response extends WP_UnitTest_Factory_For_Post {
	public function create_object( $args ) {
		$post_id = parent::create_object( $args );

		if ( ! $post_id || is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$response = new \WeBWorK\Server\Response( $post_id );
		$clean_response = clone $response;

		$is_answer = isset( $args['is_answer'] ) ? (bool) $args['is_answer'] : false;
		$response->set_is_answer( $is_answer );

		$question_id = isset( $args['question_id'] ) ? (int) $args['question_id'] : false;
		if ( $question_id ) {
			$response->set_question_id( $question_id );
		}

		if ( isset( $args['post_date'] ) ) {
			$response->set_post_date( $args['post_date'] );
		}

		if ( $clean_response != $response ) {
			$response->save();
		}

		return $post_id;
	}

	public function get_object_by_id( $post_id ) {
		$response = new \WeBWorK\Server\Response( $post_id );
		return $response;
	}
}

class WeBWorK_Tests_Factory_For_Question extends WP_UnitTest_Factory_For_Post {
	public function create_object( $args ) {
		$post_id = parent::create_object( $args );

		if ( ! $post_id || is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$question = new \WeBWorK\Server\Question( $post_id );
		$clean_question = clone $question;

		$problem_id = isset( $args['problem_id'] ) ? (int) $args['problem_id'] : false;
		if ( $problem_id ) {
			$question->set_problem_id( $problem_id );
		}

		$content = isset( $args['content'] ) ? $args['content'] : '';
		$question->set_content( $content );

		$tried = isset( $args['tried'] ) ? $args['tried'] : '';
		$question->set_tried( $tried );

		if ( isset( $args['post_date'] ) ) {
			$question->set_post_date( $args['post_date'] );
		}

		if ( $clean_question != $question ) {
			$question->save();
		}

		return $post_id;
	}

	public function get_object_by_id( $post_id ) {
		$response = new \WeBWorK\Server\Question( $post_id );
		return $response;
	}
}

class WeBWorK_Tests_Factory_For_Problem extends WP_UnitTest_Factory_For_Post {
	public function create_object( $args ) {
		$post_id = parent::create_object( $args );

		if ( ! $post_id || is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$problem = new \WeBWorK\Server\Problem( $post_id );
		$clean_problem = clone $problem;

		$content = isset( $args['content'] ) ? $args['content'] : '';
		$problem->set_content( $content );

		$remote_problem_url = isset( $args['remote_url'] ) ? $args['remote_url'] : '';
		$problem->set_remote_url( $remote_problem_url );

		if ( isset( $args['post_date'] ) ) {
			$problem->set_post_date( $args['post_date'] );
		}

		if ( $clean_problem != $problem ) {
			$problem->save();
		}

		return $post_id;
	}

	public function get_object_by_id( $post_id ) {
		$problem = new \WeBWorK\Server\Problem( $post_id );
		return $problem;
	}
}
