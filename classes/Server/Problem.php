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
	protected $raw_content;
	protected $content;
	protected $remote_url;
	protected $post_date;

	protected $problem_text;
	protected $library_id;

	protected $maths = array();

	public function __construct( $id = null ) {
		$this->p = new Util\WPPost( $this );
		$this->p->set_post_type( 'webwork_problem' );

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
		$this->id = $id;
	}

	public function set_author_id( $author_id ) {
		$this->author_id = $author_id;
	}

	public function set_content( $content ) {
		$this->raw_content = $content;

		$this->set_library_id( null );
	}

	public function set_remote_url( $remote_url ) {
		$this->remote_url = $remote_url;
	}

	public function set_post_date( $date ) {
		$this->post_date = $date;
	}

	public function set_library_id( $library_id ) {
		$this->library_id = $library_id;
	}

	public function get_id() {
		return $this->id;
	}

	public function get_author_id() {
		return $this->author_id;
	}

	public function get_clean_content() {
		$parsed = $this->pf->clean( $this->raw_content );
		$this->content_with_placeholders = $parsed['text'];
		$this->maths = $parsed['maths'];
		$this->inputs = $parsed['inputs'];
		return $this->content_with_placeholders;
	}

	public function get_content() {
		return $this->raw_content;
	}

	public function get_maths() {
		return $this->maths;
	}

	public function get_inputs() {
		return $this->inputs;
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

	/**
	 * Gets the WeBWorK OPL ID for the problem.
	 *
	 * Fetches it out of the content, if not found in meta.
	 *
	 * @todo Must be saved in meta, so that we can query by it later.
	 *
	 * @return string|bool False on failure, ID on success.
	 */
	public function get_library_id() {
		if ( null === $this->library_id	) {
			$content = $this->raw_content;

			// @todo Is this reliable?
			$regex = '|Library[^<]+\.pg|';
			if ( preg_match( $regex, $content, $matches ) ) {
				$library_id = $matches[0];
				$this->set_library_id( $matches[0] );
			}
		}

		return $this->library_id;
	}

	public function save() {
		// Don't allow Library ID to be saved with post content. This is a hack.
		$regex = '|Library[^<]+\.pg|';
		$this->raw_content = preg_replace( $regex, '', $this->raw_content );

		$saved = $this->p->save();

		if ( $saved ) {
			$this->set_id( $saved );

			update_post_meta( $this->get_id(), 'webwork_remote_problem_url', $this->get_remote_url() );
			update_post_meta( $this->get_id(), 'webwork_library_id', $this->get_library_id() );

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
			$remote_url = get_post_meta( $this->get_id(), 'webwork_remote_problem_url', true );
			$this->set_remote_url( $remote_url );

			$library_id = get_post_meta( $this->get_id(), 'webwork_library_id', true );
			$this->set_library_id( $library_id );
		}
	}
}
