<?php

namespace WeBWorK\Server\Util;

/**
 * LaTeX utilities.
 */
class LaTeX {
	public function clean( $text ) {
		$parsed = $this->generate_placeholders( $text );
		$parsed['text'] = $this->remove_script_tags( $parsed['text'] );
		$parsed['text'] = str_replace( '<span class="MathJax_Preview">[math]</span>', '', $parsed['text'] );

		return $parsed;
	}

	public function remove_script_tags( $text ) {
		$text = preg_replace( '|<script type="text[^>]+>[^<]+</script>|', '', $text );
		return $text;
	}

	public function generate_placeholders( $text ) {
		$regex = '|<script type="math/tex[^>]+>(.*?)</script>|';

		$retval = array(
			'text' => '',
			'maths' => array(),
		);

		if ( preg_match_all( $regex, $text, $matches ) ) {
			$matches_wrapped   = $matches[0];
			$matches_unwrapped = $matches[1];

			$clean_text = $text;
			foreach ( $matches_wrapped as $key => $mw ) {
				$clean_text = str_replace( $mw, '{{{math_' . $key . '}}}', $clean_text );
			}

			$retval['text'] = $clean_text;

			foreach ( $matches_wrapped as $key => $mw ) {
				if ( false !== strpos( $mw, 'mode=display' ) ) {
					$display = 'block';
				} else {
					$display = 'inline';
				}

				$retval['maths'][ $key ] = array(
					'math' => $matches_unwrapped[ $key ],
					'display' => $display,
				);
			}
		} else {
			$retval['text'] = $text;
		}

		return $retval;
	}
}
