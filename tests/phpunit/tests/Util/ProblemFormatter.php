<?php

/**
 * @group util
 */
class WeBWork_Tests_Util_ProblemFormatter extends WeBWorK_UnitTestCase {
	protected $text = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">\frac{\frac{4}{x-1}-\frac{1}{x+1}}{\frac{x}{x-1}+\frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">\frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

	public function test_generate_placeholders() {
		$l = new \WeBWorK\Server\Util\ProblemFormatter();

		$found = $l->generate_placeholders( $this->text );

		$expected_text = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span>{{{math_0}}}  and give your answer in the form of <span class="MathJax_Preview">[math]</span>{{{math_1}}}  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span>{{{math_2}}} is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span>{{{math_3}}} is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$this->assertSame( $expected_text, $found['text'] );

		$expected_maths = array(
			0 => array(
				'math'    => '\frac{\frac{4}{x-1}-\frac{1}{x+1}}{\frac{x}{x-1}+\frac{1}{x+1}}',
				'display' => 'block',
			),

			1 => array(
				'math'    => '\frac{f(x)}{g(x)}.',
				'display' => 'block',
			),

			2 => array(
				'math'    => 'f(x)',
				'display' => 'inline',
			),

			3 => array(
				'math'    => 'g(x)',
				'display' => 'inline',
			),
		);
		$this->assertSame( $expected_maths, $found['maths'] );

		$expected_inputs = array(
			0 => array(
				'type'  => 'text',
				'value' => '',
			),
			2 => array(
				'type'  => 'text',
				'value' => '',
			),
		);
	}

	public function test_generate_placeholders_for_maths_with_slashed_input() {
		$l = new \WeBWorK\Server\Util\ProblemFormatter();

		$text = '<script type=\"text/x-mathjax-config\">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type=\"text/javascript\">if(!window.MathJax)(function () {var script = document.createElement(\"script\");script.type = \"text/javascript\";script.src  = \"/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full\";document.getElementsByTagName(\"head\")[0].appendChild(script);})();</script> <P style=\"margin: 0\">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class=\"MathJax_Preview\">[math]</span><script type=\"math/tex; mode=display\">\\frac{\\frac{4}{x-1}-\\frac{1}{x+1}}{\\frac{x}{x-1}+\\frac{1}{x+1}}</script>  and give your answer in the form of <span class=\"MathJax_Preview\">[math]</span><script type=\"math/tex; mode=display\">\\frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class=\"MathJax_Preview\">[math]</span><script type=\"math/tex\">f(x)</script> is : <input type=text class=\"codeshard\" size=20 name=\"AnSwEr0001\" id=\"AnSwEr0001\" aria-label=\"answer 1 \" value=\"\"/> <input type=hidden  name=\"previous_AnSwEr0001\" value=\"\"/>  <BR/> Your answer for the function <span class=\"MathJax_Preview\">[math]</span><script type=\"math/tex\">g(x)</script> is : <input type=text class=\"codeshard\" size=20 name=\"AnSwEr0002\" id=\"AnSwEr0002\" aria-label=\"answer 2 \" value=\"\"/> <input type=hidden  name=\"previous_AnSwEr0002\" value=\"\"/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$found = $l->generate_placeholders_for_maths( $text );

		$expected_maths = array(
			0 => array(
				'math'    => '\frac{\frac{4}{x-1}-\frac{1}{x+1}}{\frac{x}{x-1}+\frac{1}{x+1}}',
				'display' => 'block',
			),

			1 => array(
				'math'    => '\frac{f(x)}{g(x)}.',
				'display' => 'block',
			),

			2 => array(
				'math'    => 'f(x)',
				'display' => 'inline',
			),

			3 => array(
				'math'    => 'g(x)',
				'display' => 'inline',
			),
		);
		$this->assertSame( $expected_maths, $found['maths'] );
	}

	public function test_remove_script_tags() {
		$l = new \WeBWorK\Server\Util\ProblemFormatter();

		$found = $l->remove_script_tags( $this->text );

		$expected = ' <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">\frac{\frac{4}{x-1}-\frac{1}{x+1}}{\frac{x}{x-1}+\frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">\frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$this->assertSame( $expected, $found );
	}

	public function test_convert_delims() {
		$text     = '\foo \bar \begin{math} \foo \bar\end{math} \begin{displaymath}\foo \bar\end{displaymath} foo';
		$expected = '\foo \bar {{{LATEX_DELIM_INLINE_OPEN}}} \foo \bar{{{LATEX_DELIM_INLINE_CLOSE}}} {{{LATEX_DELIM_DISPLAY_OPEN}}}\foo \bar{{{LATEX_DELIM_DISPLAY_CLOSE}}} foo';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->convert_delims( $text ) );
	}

	/**
	 * @group bbg
	 */
	public function test_convert_shorthand_delims() {
		$text     = '\foo \bar $latex \foo \bar$ $latex\foo
\bar$ foo';
		$expected = '\foo \bar {{{LATEX_DELIM_INLINE_OPEN}}} \foo \bar{{{LATEX_DELIM_INLINE_CLOSE}}} {{{LATEX_DELIM_DISPLAY_OPEN}}}\foo
\bar{{{LATEX_DELIM_DISPLAY_CLOSE}}} foo';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->convert_delims( $text ) );
	}

	public function test_swap_latex_escape_characters() {
		$text = '\foo \bar <script type="text/javascript">\foo \bar</script> {{{LATEX_DELIM_INLINE_OPEN}}}\foo \bar{{{LATEX_DELIM_INLINE_CLOSE}}} {{{LATEX_DELIM_DISPLAY_OPEN}}}\foo \bar{{{LATEX_DELIM_DISPLAY_CLOSE}}}';

		$expected = '\foo \bar <script type="text/javascript">\foo \bar</script> {{{LATEX_DELIM_INLINE_OPEN}}}{{{LATEX_ESCAPE_CHARACTER}}}foo {{{LATEX_ESCAPE_CHARACTER}}}bar{{{LATEX_DELIM_INLINE_CLOSE}}} {{{LATEX_DELIM_DISPLAY_OPEN}}}{{{LATEX_ESCAPE_CHARACTER}}}foo {{{LATEX_ESCAPE_CHARACTER}}}bar{{{LATEX_DELIM_DISPLAY_CLOSE}}}';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->swap_latex_escape_characters( $text ) );
	}

	public function test_swap_latex_escape_characters_with_custom_delims() {
		$text = '\foo \bar <script type="text/javascript">\foo \bar</script> {{{LATEX_DELIM_INLINE_OPEN}}}\foo \bar{{{LATEX_DELIM_INLINE_CLOSE}}} {{{LATEX_DELIM_DISPLAY_OPEN}}}\foo \bar{{{LATEX_DELIM_DISPLAY_CLOSE}}}';

		$expected = '\foo \bar <script type="text/javascript">\foo \bar</script> {{{LATEX_DELIM_INLINE_OPEN}}}{{{LATEX_ESCAPE_CHARACTER}}}foo {{{LATEX_ESCAPE_CHARACTER}}}bar{{{LATEX_DELIM_INLINE_CLOSE}}} {{{LATEX_DELIM_DISPLAY_OPEN}}}{{{LATEX_ESCAPE_CHARACTER}}}foo {{{LATEX_ESCAPE_CHARACTER}}}bar{{{LATEX_DELIM_DISPLAY_CLOSE}}}';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->swap_latex_escape_characters( $text ) );
	}

	public function test_swap_latex_escape_characters_should_match_multiline_tex() {
		$text = '<span class="MathJax_Preview">[math]</span>{{{LATEX_DELIM_DISPLAY_OPEN}}}\begin{array}{l}
        x^2+y^2 = 11, \\\\
        x+y = 1. \\\\
\end{array}{{{LATEX_DELIM_DISPLAY_CLOSE}}}
<BR/>';

		$expected = '<span class="MathJax_Preview">[math]</span>{{{LATEX_DELIM_DISPLAY_OPEN}}}{{{LATEX_ESCAPE_CHARACTER}}}begin{array}{l}
        x^2+y^2 = 11, {{{LATEX_ESCAPE_CHARACTER}}}{{{LATEX_ESCAPE_CHARACTER}}}
        x+y = 1. {{{LATEX_ESCAPE_CHARACTER}}}{{{LATEX_ESCAPE_CHARACTER}}}
{{{LATEX_ESCAPE_CHARACTER}}}end{array}{{{LATEX_DELIM_DISPLAY_CLOSE}}}
<BR/>';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->swap_latex_escape_characters( $text ) );
	}

	public function test_replace_latex_escape_characters() {
		$text = '\foo \bar <script type="text/javascript">\foo \bar</script> <script type="math/tex">{{{LATEX_ESCAPE_CHARACTER}}}foo {{{LATEX_ESCAPE_CHARACTER}}}bar</script> <script type="math/tex; mode=display">{{{LATEX_ESCAPE_CHARACTER}}}foo {{{LATEX_ESCAPE_CHARACTER}}}bar</script>';

		$expected = '\foo \bar <script type="text/javascript">\foo \bar</script> <script type="math/tex">\foo \bar</script> <script type="math/tex; mode=display">\foo \bar</script>';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->replace_latex_escape_characters( $text ) );
	}

	public function test_strip_inputs() {
		$expected = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">\frac{\frac{4}{x-1}-\frac{1}{x+1}}{\frac{x}{x-1}+\frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">\frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : ___ <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : ___ <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_inputs( $this->text ) );
	}

	public function test_strip_inputs_should_remove_line_break_before_visible_input() {
		$text = 'foo
<input type="text" />  bar';

		$expected = 'foo ___ bar';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_inputs( $text ) );
	}

	public function test_strip_inputs_should_be_case_insensitive() {
		$text = 'foo <INPUT TYPE="text" />  bar';

		$expected = 'foo ___ bar';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_inputs( $text ) );
	}

	public function test_get_library_id_from_text() {
		$text     = 'foo bar <b>Test/foo/bar/baz.pg</b> baz';
		$expected = 'Test/foo/bar/baz.pg';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->get_library_id_from_text( $text ) );
	}

	public function test_strip_library_id_from_text() {
		$text     = 'foo bar <i><b>Test/foo/bar/baz.pg</b></i> baz';
		$expected = 'foo bar  baz';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_library_id_from_text( $text ) );
	}

	public function test_strip_p_tags_should_remove_simple_opening_tags() {
		$text     = 'foo <p> bar';
		$expected = 'foo  bar';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_p_tags( $text ) );
	}

	public function test_strip_p_tags_should_remove_complex_opening_tags() {
		$text     = 'foo <p attr="value"> bar';
		$expected = 'foo  bar';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_p_tags( $text ) );
	}

	public function test_strip_p_tags_should_remove_closing_tags() {
		$text     = 'foo </p> bar';
		$expected = 'foo  bar';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_p_tags( $text ) );
	}

	public function test_strip_knowls() {
		$text     = 'foo <a href="#" knowl = "" class = "internal" value = "PEJSLz48ST4gIChJbnN0cnVjdG9yIGhpbnQgcHJldmlldzogc2hvdyB0aGUgc3R1ZGVudCBoaW50 IGFmdGVyIDcgYXR0ZW1wdHMuIFRoZSBjdXJyZW50IG51bWJlciBvZiBhdHRlbXB0cyBpcyAwLiAp PEJSLz4gPC9JPiA8QlIvPgo8QlIvPgpGb3IgdGhpcyBxdWVzdGlvbiwgPHNwYW4gY2xhc3M9Ik1h dGhKYXhfUHJldmlldyI+W21hdGhdPC9zcGFuPjxzY3JpcHQgdHlwZT0ibWF0aC90ZXgiPmEgPSAt MTUsIGIgPSAtMTU8L3NjcmlwdD4gYW5kIDxzcGFuIGNsYXNzPSJNYXRoSmF4X1ByZXZpZXciPltt YXRoXTwvc3Bhbj48c2NyaXB0IHR5cGU9Im1hdGgvdGV4Ij5jID0gMzA8L3NjcmlwdD4uCgo8UD4= " base64 = "1" >Hint: </a> bar';
		$expected = 'foo  bar';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->strip_knowls( $text ) );
	}

	public function test_convert_anchors() {
		$text     = 'foo <a href="#">bar baz</a> quz <a href="#>chort</a> chop';
		$expected = 'foo bar baz quz chort chop';

		$pf = new \WeBWorK\Server\Util\ProblemFormatter();
		$this->assertSame( $expected, $pf->convert_anchors( $text ) );
	}

	public function test_convert_image_urls_should_convert_relative_href() {
		$text       = 'This is a <a href="/link">link</a>';
		$course_url = 'http://example.com/testcourse';

		$pf    = new \WeBWorK\Server\Util\ProblemFormatter();
		$found = $pf->convert_image_urls( $text, $course_url );
		$this->assertStringContainsString( 'href="http://example.com/link"', $found );
	}

	public function test_convert_image_urls_should_convert_relative_src() {
		$text       = 'This is a <img src="/image.jpg" />';
		$course_url = 'http://example.com/testcourse';

		$pf    = new \WeBWorK\Server\Util\ProblemFormatter();
		$found = $pf->convert_image_urls( $text, $course_url );
		$this->assertStringContainsString( 'src="http://example.com/image.jpg"', $found );
	}

	public function test_convert_image_urls_should_be_case_insensitive_for_tag_match() {
		$text       = 'This is a <IMG SRC="/image.jpg" />';
		$course_url = 'http://example.com/testcourse';

		$pf    = new \WeBWorK\Server\Util\ProblemFormatter();
		$found = $pf->convert_image_urls( $text, $course_url );
		$this->assertStringContainsString( 'src="http://example.com/image.jpg"', $found );
	}

	public function test_convert_image_urls_should_recognize_single_quotes() {
		$text       = 'This is a <img src=\'/image.jpg\' />';
		$course_url = 'http://example.com/testcourse';

		$pf    = new \WeBWorK\Server\Util\ProblemFormatter();
		$found = $pf->convert_image_urls( $text, $course_url );
		$this->assertStringContainsString( 'src=\'http://example.com/image.jpg\'', $found );
	}

	public function test_convert_image_urls_should_ignore_absolute_href() {
		$text       = 'This is a <a href="http://foo.bar/link">link</a>';
		$course_url = 'http://example.com/testcourse';

		$pf    = new \WeBWorK\Server\Util\ProblemFormatter();
		$found = $pf->convert_image_urls( $text, $course_url );
		$this->assertStringContainsString( 'href="http://foo.bar/link"', $found );
	}

	public function test_convert_image_urls_should_ignore_absolute_src() {
		$text       = 'This is a <img src="http://foo.bar/image.jpg" />';
		$course_url = 'http://example.com/testcourse';

		$pf    = new \WeBWorK\Server\Util\ProblemFormatter();
		$found = $pf->convert_image_urls( $text, $course_url );
		$this->assertStringContainsString( 'src="http://foo.bar/image.jpg"', $found );
	}

	public function test_convert_image_urls_should_ignore_spaces_after_attribute_names() {
		$text       = 'This is a <a href = "/link">link</a> and <img src = "/image.jpg" />';
		$course_url = 'http://example.com/testcourse';

		$pf    = new \WeBWorK\Server\Util\ProblemFormatter();
		$found = $pf->convert_image_urls( $text, $course_url );
		$this->assertStringContainsString( 'href="http://example.com/link"', $found );
		$this->assertStringContainsString( 'src="http://example.com/image.jpg"', $found );
	}
}
