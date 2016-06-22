<?php

namespace WeBWorK\Server;

/**
 * Response CRUD.
 */
class Response {
	protected $id;

	protected $question_id;
	protected $is_answer;

	protected $author_id;
	protected $content;
	protected $post_date;

	protected $vote_count = null;

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

	public function set_post_date( $date ) {
		// @todo validate? I think there's a WP ticket about it.
		$this->post_date = $date;
	}

	public function set_question_id( $question_id ) {
		if ( $question_id ) {
			$this->question_id = (int) $question_id;
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
		return get_avatar_url( $this->get_author_id(), array(
			'size' => 60,
		) );
	}

	public function get_author_name() {
		$userdata = get_userdata( $this->get_author_id() );
		return $userdata->display_name;
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
		$args = array(
			'post_type' => 'webwork_response',
			'post_status' => 'publish',
		);

		if ( $this->exists() ) {
			$args['ID'] = $this->get_id();
		}

		$args['post_content'] = $this->get_content();
		$args['post_author'] = $this->get_author_id();

		if ( null !== $this->get_post_date() ) {
			// todo gmt
			$args['post_date'] = $this->get_post_date();
		}

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

		// WP post properties.
		$this->set_author_id( $post->post_author );
		$this->set_content( $post->post_content );
		$this->set_post_date( $post->post_date );

		$question_id = get_post_meta( $post->ID, 'webwork_question_id', true );
		$this->set_question_id( $question_id );

		$question_answer = get_post_meta( $post->ID, 'webwork_question_answer', true );
		$this->set_is_answer( $question_answer );
	}
}
