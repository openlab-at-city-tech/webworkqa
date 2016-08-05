<?php

namespace WeBWorK\Server\Util;

/**
 * Problem formatting utilities.
 */
class ProblemFormatter {
	public function clean( $text ) {
		$parsed = $this->strip_inputs( $text );
		$parsed = $this->replace_latex_escape_characters( $parsed );
		$parsed = $this->generate_placeholders( $parsed );
		$parsed['text'] = $this->remove_script_tags( $parsed['text'] );
		$parsed['text'] = str_replace( '<span class="MathJax_Preview">[math]</span>', '', $parsed['text'] );

		$parsed['text'] = trim( $parsed['text'] );

		// <P>(1 point)
		// @todo Does this happen in all questions?
		$parsed['text'] = preg_replace( '/^<[pP][ >][^>]*>\([0-9]+ points?\)/', '', $parsed['text'] );

		// Tag cleanup.
		$parsed['text'] = preg_replace( '|<br ?/?>|i', "\n", $parsed['text'] );
		$parsed['text'] = preg_replace( '|</?[pbi]>|i', '', $parsed['text'] );
		$parsed['text'] = preg_replace( '|</?blockquote>|i', '', $parsed['text'] );

		$parsed['text'] = $this->collapse_line_breaks( $parsed['text'] );
		$parsed['text'] = $this->strip_knowls( $parsed['text'] );
		$parsed['text'] = $this->convert_anchors( $parsed['text'] );

		return $parsed;
	}

	public function strip_inputs( $text ) {
		// Remove hidden inputs.
		$text = preg_replace( '|<input[^>]+type="?hidden"?[^>]*> ?|', '', $text );

		// Replace regular inputs with ___.
		$text = preg_replace( '|\n+<input|', ' <input', $text );
		$text = preg_replace( '|<input[^>]+> *|', '___ ', $text );

		return $text;
	}

	public function remove_script_tags( $text ) {
		$text = preg_replace( '|<script type="text[^>]+>[^<]+</script>|', '', $text );
		return $text;
	}

	public function generate_placeholders( $text ) {
		$clean_text = $text;

		$retval = $this->generate_placeholders_for_maths( $text );
		$clean_text = $retval['text'];

		$retval['text'] = $clean_text;

		return $retval;
	}

	public function generate_placeholders_for_maths( $text ) {
		$retval = array(
			'text' => '',
			'maths' => array(),
		);

		$clean_text = $text;

		// $text may be slashed. Ugh.
		$clean_text = str_replace( '\"', '"', $clean_text );

		$regex = '|<script type="math/tex[^>]+>(.*?)</script>|s';

		if ( preg_match_all( $regex, $clean_text, $matches ) ) {
			$matches_wrapped   = $matches[0];
			$matches_unwrapped = $matches[1];

			foreach ( $matches_wrapped as $key => $mw ) {
				$clean_text = str_replace( $mw, '{{{math_' . $key . '}}}', $clean_text );
			}

			foreach ( $matches_wrapped as $key => $mw ) {
				if ( false !== strpos( $mw, 'mode=display' ) ) {
					$display = 'block';
				} else {
					$display = 'inline';
				}

				$retval['maths'][ $key ] = array(
					// May be slashed.
					'math' => str_replace( '\\\\', '\\', $matches_unwrapped[ $key ] ),
					'display' => $display,
				);
			}
		}

		$retval['text'] = $clean_text;

		return $retval;
	}

	public function swap_latex_escape_characters( $text ) {
		$regex = '|(<script type="math/tex[^>]+>)(.*?)(</script>)|s';
		$text = preg_replace_callback( $regex, function( $matches ) {
			$tex = str_replace( '\\', '{{{LATEX_ESCAPE_CHARACTER}}}', $matches[2] );
			return $matches[1] . $tex . $matches[3];
		}, $text );

		return $text;
	}

	public function replace_latex_escape_characters( $text ) {
		return str_replace( '{{{LATEX_ESCAPE_CHARACTER}}}', '\\', $text );
	}

	public function get_library_id_from_text( $text ) {
		$regex = '|[[a-zA-Z0-9\-_/]+\.pg|';
		preg_match( $regex, $text, $matches );

		$library_id = false;
		if ( $matches ) {
			$library_id = $matches[0];
		}

		return $library_id;
	}

	public function strip_library_id_from_text( $text ) {
		$library_id = $this->get_library_id_from_text( $text );

		if ( $library_id ) {
			// Any tags that contain nothing but the ID should be stripped too.
			$regex = '|(<[^>]+>)+' . preg_quote( $library_id ) . '(</[a-zA-Z0-9]+>)+|';
			$text = preg_replace( $regex, '', $text );
		}

		return $text;
	}

	public function strip_p_tags( $text ) {
		$text = str_replace( array( '<p>', '</p>', '<P>', '</P>' ), '', $text );
		$text = preg_replace( '|<p [^>]+>|i', '', $text );
		return $text;
	}

	/**
	 * Collapse line breaks.
	 */
	public function collapse_line_breaks( $text ) {
		// Normalize line endings.
		$text = preg_replace( '~\R~u', "\r\n", $text );

		// Not the best, er, algorithm.
		$parts = explode( "\r\n", $text );

		$new_parts = array();
		$emp = true;
		foreach ( $parts as $key => $line ) {
			$line = trim( $line );

			if ( $line ) {
				$emp = false;
				$new_parts[] = $line;
			} elseif ( ! $emp ) {
				$emp = true;
				$new_parts[] = $line;
			}
		}

		return implode( "\r\n", $new_parts );
	}

	/**
	 * Weird things that come from WeBWorK.
	 */
	public function strip_knowls( $text ) {
		$regex = '|<a [^>]+ knowl ?=[^>]+>.*?</a>|';
		$text = preg_replace( $regex, '', $text );

		return $text;
	}

	/**
	 * Convert anchors to plain text.
	 */
	public function convert_anchors( $text ) {
		$regex = '|<a [^>]+>(.*?)</a>|';
		$text = preg_replace( $regex, '\1', $text );
		return $text;
	}
}
