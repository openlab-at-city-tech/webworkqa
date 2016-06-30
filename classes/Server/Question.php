<?php

namespace WeBWorK\Server;

/**
 * Question CRUD.
 */
class Question implements Util\SaveableAsWPPost {
	protected $p;

	protected $id = 0;

	protected $problem_id;

	protected $author_id;
	protected $content;
	protected $tried;
	protected $post_date;

	protected $vote_count = null;

	public function __construct( $id = null ) {
		$this->p = new Util\WPPost( $this );
		$this->p->set_post_type( 'webwork_question' );

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
		$this->id = $id;
	}

	public function set_author_id( $author_id ) {
		$this->author_id = $author_id;
	}

	public function set_content( $content ) {
		$this->content = $content;
	}

	public function set_tried( $tried ) {
		$this->tried = $tried;
	}

	public function set_post_date( $date ) {
		$this->post_date = $date;
	}

	public function set_problem_id( $problem_id ) {
		if ( $problem_id ) {
			$this->problem_id = (int) $problem_id;
		}
	}

	public function set_problem_text( $problem_text ) {
		$this->problem_text = $problem_text;
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

	public function get_tried() {
		return $this->tried;
	}

	public function get_post_date() {
		return $this->post_date;
	}

	public function get_problem_id() {
		return $this->problem_id;
	}

	public function get_problem_text() {
		return $this->problem_text;
	}

	public function get_author_avatar() {
		return $this->p->get_author_avatar();
	}

	public function get_author_name() {
		return $this->p->get_author_name();
	}

	/**
	 * Get vote count.
	 *
	 * @todo Lazy-load when null.
	 *
	 * @return int
	 */
	public function get_vote_count() {
		return $this->vote_count;
	}

	public function save() {
		$saved = $this->p->save();

		if ( $saved ) {
			$this->set_id( $saved );

			update_post_meta( $this->get_id(), 'webwork_problem_id', $this->get_problem_id() );
			update_post_meta( $this->get_id(), 'webwork_tried', $this->get_tried() );
			update_post_meta( $this->get_id(), 'webwork_problem_text', $this->get_problem_text() );

			$this->populate();
		}

		return (bool) $saved;
	}

	public function delete() {
		return $this->p->delete();
	}

	protected function populate() {
		if ( $this->p->populate() ) {
			$problem_id = get_post_meta( $this->get_id(), 'webwork_problem_id', true );
			$this->set_problem_id( $problem_id );

			$tried = get_post_meta( $this->get_id(), 'webwork_tried', true );
			$this->set_tried( $tried );

			$problem_text = get_post_meta( $this->get_id(), 'webwork_problem_text', true );
			$this->set_problem_text( $problem_text );
		}
	}
}
