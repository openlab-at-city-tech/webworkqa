<?php

/**
 * @group util
 */
class WeBWork_Tests_Util_LaTeX extends WeBWorK_UnitTestCase {
	protected $text = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{frac{4}{x-1}-frac{1}{x+1}}{frac{x}{x-1}+frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

	public function test_generate_placeholders() {
		$l = new \WeBWorK\Server\Util\LaTeX();

		$found = $l->generate_placeholders( $this->text );

		$expected_text = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span>{{{math_0}}}  and give your answer in the form of <span class="MathJax_Preview">[math]</span>{{{math_1}}}  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span>{{{math_2}}} is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span>{{{math_3}}} is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$this->assertSame( $expected_text, $found['text'] );

		$expected_maths = array(
			0 => array(
				'math' => 'frac{frac{4}{x-1}-frac{1}{x+1}}{frac{x}{x-1}+frac{1}{x+1}}',
				'display' => 'block',
			),

			1 => array(
				'math' => 'frac{f(x)}{g(x)}.',
				'display' => 'block',
			),

			2 => array(
				'math' => 'f(x)',
				'display' => 'inline',
			),

			3 => array(
				'math' => 'g(x)',
				'display' => 'inline',
			),
		);
		$this->assertSame( $expected_maths, $found['maths'] );
	}

	public function test_remove_script_tags() {
		$l = new \WeBWorK\Server\Util\LaTeX();

		$found = $l->remove_script_tags( $this->text );

		$expected = ' <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{frac{4}{x-1}-frac{1}{x+1}}{frac{x}{x-1}+frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$this->assertSame( $expected, $found );
	}
}
