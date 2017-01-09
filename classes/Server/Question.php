<?php

namespace WeBWorK\Server;

/**
 * Question CRUD.
 */
class Question implements Util\SaveableAsWPPost, Util\Voteable {
	protected $p;
	protected $pf;

	protected $id = 0;

	protected $problem_id;
	protected $problem_set;
	protected $course;
	protected $section;
	protected $problem_text;

	protected $author_id;
	protected $content;
	protected $tried;
	protected $post_date;

	public function __construct( $id = null ) {
		$this->p = new Util\WPPost( $this );
		$this->p->set_post_type( 'webwork_question' );

		$this->pf = new Util\ProblemFormatter();

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
		$this->problem_text = $problem_text;
	}

	public function set_vote_count( $vote_count ) {
		$this->vote_count = (int) $vote_count;
	}

	public function set_client_url( $client_url ) {
		$this->client_url = $client_url;
	}

	public function set_client_name( $client_name ) {
		$this->client_name = $client_name;
	}

	public function get_id() {
		return $this->id;
	}

	public function get_author_id() {
		return $this->author_id;
	}

	public function get_content( $format = 'mathjax' ) {
		$content = $this->content;
		if ( 'mathjax' === $format ) {
			$content = $this->pf->replace_latex_escape_characters( $content );
		}

		$content = $this->pf->strip_illegal_markup( $content );

		return $content;
	}

	public function get_tried( $format = 'mathjax' ) {
		$tried = $this->tried;
		if ( 'mathjax' === $format ) {
			$tried = $this->pf->replace_latex_escape_characters( $tried );
		}

		$tried = $this->pf->strip_illegal_markup( $tried );

		return $tried;
	}

	public function get_problem_text( $format = 'mathjax' ) {
		$problem_text = $this->problem_text;
		if ( 'mathjax' === $format ) {
			$problem_text = $this->pf->replace_latex_escape_characters( $problem_text );
		}

		$problem_text = $this->pf->strip_illegal_markup( $problem_text, 'extended' );

		return $problem_text;
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

	public function get_author_avatar() {
		return $this->p->get_author_avatar();
	}

	public function get_author_name() {
		return $this->p->get_author_name();
	}

	public function get_client_url() {
		return $this->client_url;
	}

	public function get_client_name() {
		return $this->client_name;
	}

	/**
	 * @todo Do something better than this.
	 */
	public function get_url( $client_url ) {
		return trailingslashit( $client_url ) . '#/problem/' . $this->get_problem_id() . '/question-' . $this->get_id();
	}

	/**
	 * Get whether the question has an answer.
	 *
	 * @since 1.0.0
	 *
	 * @param $force_query Whether to skip metadata cache. Default false.
	 * @return bool
	 */
	public function get_has_answer( $force_query = false) {
		$question_id = $this->get_id();
		$has_answer = get_post_meta( $question_id, 'webwork_has_answer', true );
		if ( $force_query || '' === $has_answer ) {
			$response_query = new Response\Query( array(
				'question_id__in' => array( $question_id ),
				'is_answer' => true,
			) );
			$responses = $response_query->get();

			$has_answer = ! empty( $responses );
			update_post_meta( $question_id, 'webwork_has_answer', (int) $has_answer );
		}

		return (bool) $has_answer;
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
				'question_id__in' => array( $question_id ),
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

	/**
	 * Get instructor email.
	 *
	 * Instructor matching currently happens via a hardcoded config list.
	 *
	 * @return string
	 */
	public function get_instructor_email() {
		$email = '';

		$section = $this->get_section();

		$instructor_map = apply_filters( 'webwork_section_instructor_map', array() );
		if ( isset( $instructor_map[ $section ] ) ) {
			$email = $instructor_map[ $section ];
		}

		return $email;
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


			$tried = $this->get_tried();
			$tried = $this->pf->convert_delims( $tried );
			$tried = $this->pf->swap_latex_escape_characters( $tried );
			update_post_meta( $this->get_id(), 'webwork_tried', $tried );

			$problem_text = $this->get_problem_text();
			$problem_text = $this->pf->convert_delims( $problem_text );
			$problem_text = $this->pf->swap_latex_escape_characters( $problem_text );
			update_post_meta( $this->get_id(), 'webwork_problem_text', $problem_text );

			// Refresh vote count.
			$this->get_vote_count( true );

			$this->populate();
		}

		$this->send_notifications();

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
			$this->set_problem_text( $problem_text );
		}
	}

	/**
	 * Send notifications.
	 */
	protected function send_notifications() {
		$this->send_notification_to_instructor();
	}

	/**
	 * Send an email notification to the course instructor.
	 */
	protected function send_notification_to_instructor() {
		$instructor_email = $this->get_instructor_email();
		$section = $this->get_section();

		$question_author_id = $this->get_author_id();
		$question_author = new \WP_User( $question_author_id );
		if ( ! $question_author->exists() ) {
			return;
		}

		// Don't send instructors an email about their own questions.
		if ( $question_author->user_email === $instructor_email ) {
			return;
		}

		$email = new Util\Email();
		$email->set_client_name( $this->get_client_name() );
		$email->set_recipient( $instructor_email );
		$email->set_subject( sprintf( __( '%1$s has posted a question in the course %2$s', 'webwork' ), $question_author->display_name, $section ) );

		$message = sprintf(
			__( '%1$s has posted a question in your course %2$s.

To read and reply, visit %3$s.', 'webwork' ),
			$question_author->display_name,
			$section,
			$this->get_url( $this->get_client_url() )
		);
		$email->set_message( $message );

		$email->send();
	}
}
