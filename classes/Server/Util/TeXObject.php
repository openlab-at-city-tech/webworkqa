<?php

namespace WeBWorK\Server\Util;

/**
 * Object representing a chunk of text containing LaTeX.
 *
 * @since 1.0.0
 */
class TeXObject {
	protected $raw_text;
	protected $swapped_text;

	protected $text_for_endpoint;
	protected $maths_for_endpoint;
	protected $inputs_for_endpoint;

	public function __construct() {
		$this->pf = new ProblemFormatter();
	}

	public function set_raw_text( $text ) {
		$this->raw_text = $text;
	}

	public function set_swapped_text( $text ) {
		$this->swapped_text = $text;
	}

	public function get_text_for_database() {
		return $this->pf->swap_latex_escape_characters( $this->raw_text );
	}

	public function get_text_for_endpoint() {
		if ( null == $this->text_for_endpoint ) {
			$this->parse_for_endpoint( $this->swapped_text );
		}

		return $this->text_for_endpoint;
	}

	public function get_maths_for_endpoint() {
		if ( null == $this->maths_for_endpoint ) {
			$this->parse_for_endpoint( $this->swapped_text );
		}

		return $this->maths_for_endpoint;
	}

	public function get_inputs_for_endpoint() {
		if ( null == $this->inputs_for_endpoint ) {
			$this->parse_for_endpoint( $this->swapped_text );
		}

		return $this->inputs_for_endpoint;
	}

	protected function parse_for_endpoint( $swapped_text ) {
		$clean = $this->pf->clean( $swapped_text );

		$this->text_for_endpoint = $clean['text'];
		$this->maths_for_endpoint = $clean['maths'];
		$this->inputs_for_endpoint = $clean['inputs'];
	}
}
