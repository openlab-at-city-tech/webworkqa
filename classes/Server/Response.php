<?php

namespace WeBWorK\Server;

/**
 * Response CRUD.
 */
class Response implements Util\SaveableAsWPPost, Util\Voteable {
	protected $p;

	protected $id;

	protected $question_id;
	protected $question;
	protected $is_answer;

	protected $author_id;
	protected $content;
	protected $post_date;

	protected $vote_count = null;

	public function __construct( $id = null ) {
		$this->p = new Util\WPPost( $this );
		$this->p->set_post_type( 'webwork_response' );

		if ( $id ) {
			$this->set_id( $id );
			$this->populate();
		}
	}

	/**
	 * Whether the response exists in the database.
	 */
	public function exists() {
		return $this->id > 0;
	}

	public function set_id( $id ) {
		$this->id = (int) $id;
	}

	public function set_author_id( $author_id ) {
		$this->author_id = (int) $author_id;
	}

	public function set_content( $content ) {
		$this->content = $content;
	}

	public function set_post_date( $date ) {
		$this->post_date = $date;
	}

	public function set_question_id( $question_id ) {
		if ( $question_id ) {
			$this->question_id = (int) $question_id;
			$this->question = new Question( $question_id );
		}
	}

	public function set_is_answer( $is_answer ) {
		$this->is_answer = (bool) $is_answer;
	}

	public function set_vote_count( $vote_count ) {
		$this->vote_count = (int) $vote_count;
	}

	public function get_id() {
		return $this->id;
	}

	public function get_author_id() {
		return $this->author_id;
	}

	public function get_content() {
		return $this->content;
	}

	public function get_post_date() {
		return $this->post_date;
	}

	public function get_question_id() {
		return $this->question_id;
	}

	public function get_is_answer() {
		return $this->is_answer;
	}

	public function get_author_avatar() {
		return $this->p->get_author_avatar();
	}

	public function get_author_name() {
		return $this->p->get_author_name();
	}

	public function get_author_type_label() {
		return apply_filters( 'webwork_author_type_label', '', $this->get_author_id() );
	}

	/**
	 * Get vote count.
	 *
	 * @param $force_query Whether to skip the metadata cache.
	 * @return int
	 */
	public function get_vote_count( $force_query = false ) {
		return $this->p->get_vote_count( $force_query );
	}

	public function save() {
		$saved = $this->p->save();

		if ( $saved ) {
			update_post_meta( $this->get_id(), 'webwork_question_id', $this->get_question_id() );
			update_post_meta( $this->get_id(), 'webwork_question_answer', $this->get_is_answer() );

			$this->get_vote_count();

			// Bust question response count cache.
			$this->question->get_response_count( true );

			$this->populate();
		}

		return (bool) $saved;
	}

	public function delete() {
		$deleted = $this->p->delete();

		if ( $deleted ) {
			// Bust question response count cache.
			$this->question->get_response_count( true );
		}

		return $deleted;
	}

	protected function populate( $post = null ) {
		if ( $this->p->populate() ) {
			$question_id = get_post_meta( $this->get_id(), 'webwork_question_id', true );
			$this->set_question_id( $question_id );

			$question_answer = get_post_meta( $this->get_id(), 'webwork_question_answer', true );
			$this->set_is_answer( $question_answer );
		}
	}
}
