<?php

namespace WeBWorK\Server;

/**
 * Response CRUD.
 */
class Response {
	protected $id;
	protected $post;

	protected $question_id;
	protected $is_answer;

	protected $author_id;
	protected $content;

	public function __construct( $id = null ) {
		if ( $id ) {
			$this->set_id( $id );
			$this->populate();
		}
	}

	/**
	 * Whether the response exists in the database.
	 */
	public function exists() {
		return (bool) $this->id;
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

	public function set_question_id( $question_id ) {
		if ( $question_id ) {
			$this->question_id = (int) $question_id;
		}
	}

	public function set_is_answer( $is_answer ) {
		$this->is_answer = (bool) $is_answer;
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

	public function get_question_id() {
		return $this->question_id;
	}

	public function get_is_answer() {
		return $this->is_answer;
	}

	public function save() {
		$args = array();

		if ( $this->exists() ) {
			$args['ID'] = $this->get_id();
		}

		$args['post_content'] = $this->get_content();
		$args['post_author'] = $this->get_author_id();

		if ( $this->exists() ) {
			$saved = wp_update_post( $args );
		} else {
			$saved = wp_insert_post( $args );

			if ( $saved && ! is_wp_error( $saved ) ) {
				$this->set_id( $saved );
			}
		}

		if ( $this->id ) {
			update_post_meta( $this->id, 'webwork_question_id', $this->get_question_id() );
			update_post_meta( $this->id, 'webwork_question_answer', $this->get_is_answer() );
		}

		if ( $saved ) {
			$this->populate();
			return true;
		}

		return false;
	}

	public function delete() {
		global $wpdb;

		if ( ! $this->exists() ) {
			return false;
		}

		$deleted = wp_trash_post( $this->id );

		if ( $deleted ) {
			$this->id = null;
		}

		return (bool) $deleted;
	}

	protected function populate( $post = null ) {
		if ( ! $post ) {
			$post = get_post( $this->id );
		}

		if ( ! $post ) {
			$this->id = null;
			return;
		}

		$this->post = $post;

		// WP post properties.
		$this->set_author_id( $this->post->post_author );
		$this->set_content( $this->post->post_content );

		$question_id = get_post_meta( $this->post->ID, 'webwork_question_id', true );
		$this->set_question_id( $question_id );

		$question_answer = get_post_meta( $this->post->ID, 'webwork_question_answer', true );
		$this->set_is_answer( $question_answer );
	}
}
