<?php

namespace WeBWorK\Server;

/**
 * Question CRUD.
 */
class Question implements Util\SaveableAsWPPost, Util\Voteable {
	protected $p;

	protected $id = 0;

	protected $problem_id;
	protected $problem_set;
	protected $course;
	protected $section;

	protected $tex;

	protected $author_id;
	protected $content;
	protected $tried;
	protected $post_date;

	public function __construct( $id = null ) {
		$this->p = new Util\WPPost( $this );
		$this->p->set_post_type( 'webwork_question' );

		$this->tex = new Util\TeXObject();

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

	public function set_tried( $tried ) {
		$this->tried = $tried;
	}

	public function set_post_date( $date ) {
		$this->post_date = $date;
	}

	public function set_problem_id( $problem_id ) {
		$this->problem_id = $problem_id;
	}

	public function set_problem_set( $problem_set ) {
		$this->problem_set = $problem_set;
	}

	public function set_course( $course ) {
		$this->course = $course;
	}

	public function set_section( $section ) {
		$this->section = $section;
	}

	public function set_problem_text( $problem_text ) {
		$this->tex->set_raw_text( $problem_text );
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
		return (string) $this->problem_id;
	}

	public function get_problem_set() {
		return (string) $this->problem_set;
	}

	public function get_course() {
		return (string) $this->course;
	}

	public function get_section() {
		return (string) $this->section;
	}

	public function get_problem_text() {
		return $this->tex->get_text_for_endpoint();
	}

	public function get_maths() {
		return $this->tex->get_maths_for_endpoint();
	}

	public function get_author_avatar() {
		return $this->p->get_author_avatar();
	}

	public function get_author_name() {
		return $this->p->get_author_name();
	}

	/**
	 * Get response count.
	 *
	 * @since 1.0.0
	 *
	 * @param $force_query Whether to skip metadata cache. Default false.
	 * @return int
	 */
	public function get_response_count( $force_query = false ) {
		$question_id = $this->get_id();
		$count = get_post_meta( $question_id, 'webwork_response_count', true );
		if ( $force_query || '' === $count ) {
			$response_query = new Response\Query( array(
				'question_id' => $question_id,
			) );
			$responses = $response_query->get();

			$count = count( $responses );
			update_post_meta( $question_id, 'webwork_response_count', $count );
		}

		return intval( $count );
	}

	/**
	 * Get vote count.
	 *
	 * @param int $force_query Whether to skip the metadata cache.
	 * @return int
	 */
	public function get_vote_count( $force_query = false ) {
		return $this->p->get_vote_count( $force_query );
	}

	public function save() {
		$saved = $this->p->save();

		if ( $saved ) {
			$this->set_id( $saved );

			$post_id = $this->get_id();

			wp_set_object_terms( $post_id, array( $this->get_problem_id() ), 'webwork_problem_id' );
			wp_set_object_terms( $post_id, array( $this->get_problem_set() ), 'webwork_problem_set' );
			wp_set_object_terms( $post_id, array( $this->get_course() ), 'webwork_course' );
			wp_set_object_terms( $post_id, array( $this->get_section() ), 'webwork_section' );


			update_post_meta( $this->get_id(), 'webwork_tried', $this->get_tried() );
			update_post_meta( $this->get_id(), 'webwork_problem_text', $this->tex->get_text_for_database() );

			// Refresh vote count.
			$this->get_vote_count( true );

			$this->populate();
		}

		return (bool) $saved;
	}

	public function delete() {
		return $this->p->delete();
	}

	protected function populate() {
		if ( $this->p->populate() ) {
			$post_id = $this->get_id();

			$problem_sets = get_the_terms( $post_id, 'webwork_problem_set' );
			if ( $problem_sets ) {
				$problem_set = reset( $problem_sets )->name;
			} else {
				$problem_set = '';
			}
			$this->set_problem_set( $problem_set );

			$problem_ids = get_the_terms( $post_id, 'webwork_problem_id' );
			if ( $problem_ids ) {
				$problem_id = reset( $problem_ids )->name;
			} else {
				$problem_id = '';
			}
			$this->set_problem_id( $problem_id );

			$courses = get_the_terms( $post_id, 'webwork_course' );
			if ( $courses ) {
				$course = reset( $courses )->name;
			} else {
				$course = '';
			}
			$this->set_course( $course );

			$sections = get_the_terms( $post_id, 'webwork_section' );
			if ( $sections ) {
				$section = reset( $sections )->name;
			} else {
				$section = '';
			}
			$this->set_section( $section );

			$tried = get_post_meta( $this->get_id(), 'webwork_tried', true );
			$this->set_tried( $tried );

			$problem_text = get_post_meta( $this->get_id(), 'webwork_problem_text', true );
			$this->tex->set_swapped_text( $problem_text );
		}
	}
}
