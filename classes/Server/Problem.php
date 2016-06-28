<?php

namespace WeBWorK\Server;

/**
 * Problem CRUD.
 */
class Problem implements Util\SaveableAsWPPost {
	protected $p;

	protected $id = 0;

	protected $problem_id;

	protected $author_id;
	protected $content;
	protected $remote_url;
	protected $post_date;

	public function __construct( $id = null ) {
		$this->p = new Util\WPPost( $this );
		$this->p->set_post_type( 'webwork_problem' );

		$this->latex = new Util\LaTeX();

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

	public function set_id( int $id ) {
		$this->id = $id;
	}

	public function set_author_id( int $author_id ) {
		$this->author_id = $author_id;
	}

	public function set_content( $content ) {
		$this->content = $content;
	}

	public function set_remote_url( $remote_url ) {
		$this->remote_url = $remote_url;
	}

	public function set_post_date( $date ) {
		$this->post_date = $date;
	}

	public function get_id() {
		return $this->id;
	}

	public function get_author_id() {
		return $this->author_id;
	}

	public function get_content() {
		$parsed = $this->latex->clean( $this->content );
		$this->content_with_placeholders = $parsed['text'];
		$this->maths = $parsed['maths'];
		return $this->content_with_placeholders;
	}

	public function get_maths() {
		return $this->maths;
	}

	public function get_excerpt() {
		$content = $this->get_content();

		$content = strip_tags( $content );

		return wp_trim_words( $content, 55, '...' );
	}

	public function get_post_date() {
		return $this->post_date;
	}

	public function get_remote_url() {
		return $this->remote_url;
	}

	public function get_author_avatar() {
		return $this->p->get_author_avatar();
	}

	public function get_author_name() {
		return $this->p->get_author_name();
	}

	public function save() {
		$saved = $this->p->save();

		if ( $saved ) {
			$this->set_id( $saved );

			update_post_meta( $this->get_id(), 'webwork_remote_problem_url', $this->get_remote_url() );

			$this->populate();
		}

		return (bool) $saved;
	}

	public function delete() {
		return $this->p->delete();
	}

	protected function populate() {
		if ( $this->p->populate() ) {
			$remote_url = get_post_meta( $this->get_id(), 'webwork_remote_problem_url', true );
			$this->set_remote_url( $remote_url );
		}
	}
}
