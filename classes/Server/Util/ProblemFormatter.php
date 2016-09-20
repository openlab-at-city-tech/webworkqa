<?php

namespace WeBWorK\Server\Util;

/**
 * Problem formatting utilities.
 */
class ProblemFormatter {
	protected $mathjax_delim_regex = '|(<script type="math/tex([^"]*)">)(.*?)(</script>)|s';

	/**
	 * Default allowed tags for content.
	 *
	 * Some content types may be more permissive.
	 */
	protected $allowed_tags = array(
		'a' => array(
			'href' => true,
		),
		'b' => array(),
		'em' => array(),
		'i' => array(),
		'strong' => array(),
	);

	public function clean( $text ) {
		$parsed = $this->strip_inputs( $text );
		$parsed = $this->convert_delims( $parsed );
//		$parsed = $this->replace_latex_escape_characters( $parsed );
//		$parsed = $this->generate_placeholders( $parsed );
		$parsed = $this->remove_script_tags( $parsed );
		$parsed = str_replace( '<span class="MathJax_Preview">[math]</span>', '', $parsed );

		$parsed = trim( $parsed );

		// <P>(1 point)
		// @todo Does this happen in all questions?
		$parsed = preg_replace( '/^<[pP][ >][^>]*>\([0-9]+ points?\)/', '', $parsed );

		// Tag cleanup.
		$parsed = preg_replace( '|<br ?/?>|i', "\n", $parsed );
		$parsed = preg_replace( '|</?[pbi]>|i', '', $parsed );
		$parsed = preg_replace( '|</?blockquote>|i', '', $parsed );

		$parsed = $this->collapse_line_breaks( $parsed );
		$parsed = $this->strip_knowls( $parsed );
		$parsed = $this->convert_anchors( $parsed );

		return $parsed;
	}

	public function clean_problem_from_webwork( $text ) {
		$text = $this->remove_script_tags( $text );
		$text = $this->remove_style_tags( $text );
		$text = $this->strip_inputs( $text );
		$text = $this->swap_latex_escape_characters( $text );
		$text = $this->convert_delims( $text );
		$text = str_replace( '<span class="MathJax_Preview">[math]</span>', '', $text );

		$text = trim( $text );

		// <P>(1 point)
		// @todo Does this happen in all questions?
		$text = preg_replace( '/^<[pP][ >][^>]*>\([0-9]+ points?\)/', '', $text );

		// Tag cleanup.
		$text = preg_replace( '|<br ?/?>|i', "\n", $text );
		$text = preg_replace( '|</?[pbi]>|i', '', $text );
		$text = preg_replace( '|</?blockquote>|i', '', $text );

		$text = $this->collapse_line_breaks( $text );
		$text = $this->strip_knowls( $text );
		$text = $this->convert_anchors( $text );
		$text = $this->strip_p_tags( $text );

		return $text;
	}

	public function strip_inputs( $text ) {
		// Remove hidden inputs.
		$text = preg_replace( '|<input[^>]+type="?hidden"?[^>]*> ?|i', '', $text );

		// Replace regular inputs with ___.
		$text = preg_replace( '|\n+<input|i', ' <input', $text );
		$text = preg_replace( '|<input[^>]+> *|i', '___ ', $text );

		return $text;
	}


	public function strip_illegal_markup( $text, $allowed_html_set = 'normal' ) {
		$text = $this->remove_script_tags( $text, 'all' );
		$text = $this->remove_style_tags( $text );

		$allowed_tags = $this->allowed_tags;
		if ( 'extended' === $allowed_html_set ) {
			// Positioning.
			$allowed_tags['center'] = array();
			$allowed_tags['div'] = array(
				'class' => true,
				'id' => true,
			);

			// Headers.
			$allowed_tags['h3'] = array(
				'class' => true,
				'id' => true,
			);

			// Lists.
			$allowed_tags['li'] = array();
			$allowed_tags['ol'] = array();
			$allowed_tags['ul'] = array();

			// Tables.
			$allowed_tags['table'] = array();
			$allowed_tags['thead'] = array();
			$allowed_tags['tbody'] = array();
			$allowed_tags['tr'] = array();
			$allowed_tags['th'] = array();
			$allowed_tags['td'] = array();

			// Images.
			$allowed_tags['img'] = array(
				'src' => true,
			);
		}

		return wp_kses( $text, $allowed_tags );
	}

	public function remove_script_tags( $text, $all = 'all' ) {
		$text = preg_replace( '|<script type="text[^>]+>[^<]+</script>|m', '', $text );
		if ( 'all' === $all ) {
			$text = preg_replace( '|<script[^>]*>.*?</script>|s', '', $text );
		}
		return $text;
	}

	public function remove_style_tags( $text ) {
		$text = preg_replace( '|<style[^>]+>[^<]+</style>|s', '', $text );
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

	public function convert_delims( $text ) {
		// \begin{math} etc
		$regex = ';\\\\begin\{(math|displaymath)\}(.*?)\\\\end\{\1\};s';
		$text = preg_replace_callback( $regex, function( $matches ) {
			if ( 'displaymath' === $matches[1] ) {
				$odelim = '{{{LATEX_DELIM_DISPLAY_OPEN}}}';
				$cdelim = '{{{LATEX_DELIM_DISPLAY_CLOSE}}}';
			} else {
				$odelim = '{{{LATEX_DELIM_INLINE_OPEN}}}';
				$cdelim = '{{{LATEX_DELIM_INLINE_CLOSE}}}';
			}

			return sprintf(
				'%s%s%s',
				$odelim,
				$matches[2],
				$cdelim
			);
		}, $text );

		// <script type="math/jax">
		$regex = $this->mathjax_delim_regex;
		$text = preg_replace_callback( $regex, function( $matches ) {
			if ( false !== strpos( $matches[2], 'mode=display' ) ) {
				$odelim = '{{{LATEX_DELIM_DISPLAY_OPEN}}}';
				$cdelim = '{{{LATEX_DELIM_DISPLAY_CLOSE}}}';
			} else {
				$odelim = '{{{LATEX_DELIM_INLINE_OPEN}}}';
				$cdelim = '{{{LATEX_DELIM_INLINE_CLOSE}}}';
			}

			return sprintf(
				'%s%s%s',
				$odelim,
				$matches[3],
				$cdelim
			);
		}, $text );

		$regex = ';\$latex([^\$]+)\$;s';
		$text = preg_replace_callback( $regex, function( $matches ) {
			if ( false !== strpos( $matches[1], "\n" ) ) {
				$odelim = '{{{LATEX_DELIM_DISPLAY_OPEN}}}';
				$cdelim = '{{{LATEX_DELIM_DISPLAY_CLOSE}}}';
			} else {
				$odelim = '{{{LATEX_DELIM_INLINE_OPEN}}}';
				$cdelim = '{{{LATEX_DELIM_INLINE_CLOSE}}}';
			}

			return sprintf(
				'%s%s%s',
				$odelim,
				$matches[1],
				$cdelim
			);
		}, $text );

		return $text;
	}

	public function swap_latex_escape_characters( $text ) {
		$regex = ';(\{\{\{LATEX_DELIM_((?:DISPLAY)|(?:INLINE))_OPEN\}\}\})(.*?)(\{\{\{LATEX_DELIM_\2_CLOSE\}\}\});s';
		$text = preg_replace_callback( $regex, function( $matches ) {
			$tex = str_replace( '\\', '{{{LATEX_ESCAPE_CHARACTER}}}', $matches[3] );
			return $matches[1] . $tex . $matches[4];
		}, $text );

		return $text;
	}

	public function convert_delims_to_mathjax( $text ) {
		$search = array(
			'{{{LATEX_DELIM_INLINE_OPEN}}}',
			'{{{LATEX_DELIM_INLINE_CLOSE}}}',
			'{{{LATEX_DELIM_DISPLAY_OPEN}}}',
			'{{{LATEX_DELIM_DISPLAY_CLOSE}}}',
		);

		$replace = array(
			'<script type="math/tex">',
			'</script>',
			'<script type="math/tex; mode=display">',
			'</script>',
		);

		return str_replace( $search, $replace, $text );
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
			$regex = '|(<[^>]+>)*' . preg_quote( $library_id ) . '(</[a-zA-Z0-9]+>)*|';
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
