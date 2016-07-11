<?php

namespace WeBWorK\Server;

/**
 * Problem Instance CRUD.
 */
class ProblemInstance implements Util\SaveableAsWPPost {
	protected $p;
	protected $id = 0;

	protected $content = '';
	protected $author_id = 0;
	protected $post_date;

	protected $problem_id = 0;
	protected $remote_course_url;
	protected $remote_problem_url;
	protected $remote_problem_set;
	protected $remote_problem;

	public function __construct( $id = null ) {
		$this->p = new Util\WPPost( $this );
		$this->p->set_post_type( 'webwork_probinstance' );

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

	public function set_post_date( $post_date ) {
		$this->post_date = $post_date;
	}

	public function set_problem_id( $problem_id ) {
		$this->problem_id = (int) $problem_id;
	}

	public function set_remote_course_url( $course_url ) {
		$this->remote_course_url = $course_url;
	}

	public function set_remote_problem_url( $problem_url ) {
		$this->remote_problem_url = $problem_url;
	}

	public function set_remote_problem_set( $problem_set ) {
		$this->remote_problem_set = $problem_set;
	}

	public function set_remote_problem( $problem ) {
		$this->remote_problem = $problem;
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

	public function get_remote_course_url() {
		return $this->remote_course_url;
	}

	public function get_remote_problem_url() {
		return $this->remote_problem_url;
	}

	public function get_remote_problem_set() {
		return $this->remote_problem_set;
	}

	public function get_remote_problem() {
		return $this->remote_problem;
	}

	public function get_problem_id() {
		return $this->problem_id;
	}

	public function save() {
		$this->p->set( 'post_title', 'Problem Instance' );

		$saved = $this->p->save();

		if ( $saved ) {
			$this->set_id( $saved );

			update_post_meta( $this->get_id(), 'webwork_problem_id', $this->get_problem_id() );
			update_post_meta( $this->get_id(), 'webwork_problem_instance_remote_course_url', $this->get_remote_course_url() );
			update_post_meta( $this->get_id(), 'webwork_problem_instance_remote_problem_url', $this->get_remote_problem_url() );
			update_post_meta( $this->get_id(), 'webwork_problem_instance_remote_problem_set', $this->get_remote_problem_set() );
			update_post_meta( $this->get_id(), 'webwork_problem_instance_remote_problem', $this->get_remote_problem() );

			$this->populate();
		}

		return (bool) $saved;
	}

	public function delete() {
		return $this->p->delete();
	}

	protected function populate() {
		// @todo Some/all of these should be lazy-loaded.
		if ( $this->p->populate() ) {
			$problem_id = get_post_meta( $this->get_id(), 'webwork_problem_id', true );
			$this->set_problem_id( $problem_id );

			$remote_course_url = get_post_meta( $this->get_id(), 'webwork_problem_instance_remote_course_url', true );
			$this->set_remote_course_url( $remote_course_url );

			$remote_problem_url = get_post_meta( $this->get_id(), 'webwork_problem_instance_remote_problem_url', true );
			$this->set_remote_problem_url( $remote_problem_url );

			$remote_problem_set = get_post_meta( $this->get_id(), 'webwork_problem_instance_remote_problem_set', true );
			$this->set_remote_problem_set( $remote_problem_set );

			$remote_problem = get_post_meta( $this->get_id(), 'webwork_problem_instance_remote_problem', true );
			$this->set_remote_problem( $remote_problem );
		}
	}
}
