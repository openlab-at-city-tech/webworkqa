<?php

/**
 * @group problem
 */
class WeBWork_Tests_Problem extends WeBWorK_UnitTestCase {
	public function test_successful_save_for_existing_item() {
		$p = self::factory()->problem->create( array(
			'content' => 'bar',
			'remote_url' => 'http://example.com/my-webwork-problem',
		) );

		$problem = new \WeBWorK\Server\Problem( $p );

		$problem->set_content( 'foo' );
		$problem->set_author_id( 123 );
		$problem->set_remote_url( 'http://example.com/example-problem' );

		$saved = $problem->save();

		$this->assertTrue( $saved );

		$new_problem = new \WeBWorK\Server\Problem( $problem->get_id() );
		$this->assertSame( $p, $new_problem->get_id() );
		$this->assertSame( 'foo', $new_problem->get_content() );
		$this->assertSame( 123, $new_problem->get_author_id() );
		$this->assertSame( 'http://example.com/example-problem', $new_problem->get_remote_url() );
	}

	public function test_successful_save_for_new_item() {
		$problem = new \WeBWorK\Server\Problem();

		$problem->set_content( 'foo' );
		$problem->set_author_id( 123 );
		$problem->set_remote_url( 'http://example.com/example-problem' );

		$saved = $problem->save();

		$this->assertTrue( $saved );

		$new_problem = new \WeBWorK\Server\Problem( $problem->get_id() );
		$this->assertSame( 'foo', $new_problem->get_content() );
		$this->assertSame( 123, $new_problem->get_author_id() );
		$this->assertSame( 'http://example.com/example-problem', $new_problem->get_remote_url() );
	}

	public function test_exists_false() {
		$p = new \WeBWorK\Server\Problem( 999 );
		$this->assertFalse( $p->exists() );
	}

	public function test_exists_true() {
		$p = self::factory()->problem->create();

		$problem = new \WeBWorK\Server\Problem( $p );

		$this->assertTrue( $problem->exists() );
	}

	public function test_delete_should_fail_when_question_does_not_exist() {
		$problem = new \WeBWorK\Server\Problem( 999 );
		$this->assertFalse( $problem->exists() );

		$this->assertFalse( $problem->delete() );
	}

	public function test_delete_success() {
		$p = self::factory()->problem->create();

		$problem = new \WeBWorK\Server\Problem( $p );
		$this->assertTrue( $problem->exists() );

		$this->assertTrue( $problem->delete() );

		$problem_2 = new \WeBWorK\Server\Problem( $p );
		$this->assertFalse( $problem_2->exists() );
	}

	public function test_set_post_date() {
		$p = self::factory()->problem->create();

		$problem = new \WeBWorK\Server\Problem( $p );

		$new_date = '2015-05-05 05:05:05';
		$problem->set_post_date( $new_date );

		$this->assertTrue( $problem->save() );

		$problem2 = new \WeBWorK\Server\Problem( $p );
		$this->assertSame( $new_date, $problem2->get_post_date() );
	}

	public function test_get_library_id_when_unsaved() {
		$text = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{frac{4}{x-1}-frac{1}{x+1}}{frac{x}{x-1}+frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$p = new \WeBWorK\Server\Problem();
		$p->set_content( $text );

		$expected = 'Library/ma117DB/set1b/srw1_4_41.pg';

		$this->assertSame( $expected, $p->get_library_id() );
	}

	public function test_get_library_id_when_not_prefixed_with_Library() {
		$text = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Foo/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{frac{4}{x-1}-frac{1}{x+1}}{frac{x}{x-1}+frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$p = new \WeBWorK\Server\Problem();
		$p->set_content( $text );

		$expected = 'Foo/ma117DB/set1b/srw1_4_41.pg';

		$this->assertSame( $expected, $p->get_library_id() );
	}

	public function test_library_id_should_be_reset_when_content_is_changed() {
		$text = '<script type="text/x-mathjax-config">MathJax.Hub.Config({MathMenu: {showContext: true}});</script><script type="text/javascript">if(!window.MathJax)(function () {var script = document.createElement("script");script.type = "text/javascript";script.src  = "/webwork2_files/mathjax/MathJax.js?config=TeX-MML-AM_HTMLorMML-full";document.getElementsByTagName("head")[0].appendChild(script);})();</script> <P style="margin: 0">(1 point) <B>Library/ma117DB/set1b/srw1_4_41.pg</B><BR>Simplify the expression  <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{frac{4}{x-1}-frac{1}{x+1}}{frac{x}{x-1}+frac{1}{x+1}}</script>  and give your answer in the form of <span class="MathJax_Preview">[math]</span><script type="math/tex; mode=display">frac{f(x)}{g(x)}.</script>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">f(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0001" id="AnSwEr0001" aria-label="answer 1 " value=""/> <input type=hidden  name="previous_AnSwEr0001" value=""/>  <BR/> Your answer for the function <span class="MathJax_Preview">[math]</span><script type="math/tex">g(x)</script> is : <input type=text class="codeshard" size=20 name="AnSwEr0002" id="AnSwEr0002" aria-label="answer 2 " value=""/> <input type=hidden  name="previous_AnSwEr0002" value=""/>  <BR/>  <p><b>Note: </b><i>You can earn partial credit on this problem.</i></p>';

		$p = new \WeBWorK\Server\Problem();
		$p->set_content( $text );

		$expected = 'Library/ma117DB/set1b/srw1_4_41.pg';
		$this->assertSame( $expected, $p->get_library_id() );

		$p->set_content( 'foo' );
		$this->assertNull( $p->get_library_id() );
	}

	public function test_instance_exists_true() {
		$url = 'http://example.com/my-webwork-course';
		$p = self::factory()->problem->create( array(
			'content' => 'bar',
		) );

		$pi = self::factory()->problem_instance->create( array(
			'remote_course_url' => $url,
			'problem_id' => $p,
		) );

		$problem = new \WeBWorK\Server\Problem( $p );
		$this->assertTrue( $problem->instance_exists( $url ) );
	}

	public function test_instance_exists_false() {
		$url = 'http://example.com/my-webwork-course';
		$p = self::factory()->problem->create( array(
			'content' => 'bar',
		) );

		// Create a dummy instance associated with another problem, but same URL.
		$pi = self::factory()->problem_instance->create( array(
			'problem_id' => 12345,
			'remote_url' => $url,
		) );

		$problem = new \WeBWorK\Server\Problem( $p );
		$this->assertFalse( $problem->instance_exists( $url ) );
	}

	public function test_create_instance() {
		$url = 'http://example.com/my-webwork-course';
		$p = self::factory()->problem->create( array(
			'content' => 'bar',
			'remote_url' => $url,
		) );

		$problem = new \WeBWorK\Server\Problem( $p );

		$this->assertTrue( $problem->create_instance( $url, array(
			'course_problem_url' => 'http://example.com/foo/123/456',
			'problem' => 123,
			'set' => 456,
		) ) );

		$instance = $problem->get_instance( $url );

		$this->assertInstanceOf( 'WeBWorK\Server\ProblemInstance', $instance );
		$this->assertSame( $url, $instance->get_remote_course_url() );
		$this->assertSame( 'http://example.com/foo/123/456', $instance->get_remote_problem_url() );

		// Need not be integers.
		$this->assertEquals( 123, $instance->get_remote_problem() );
		$this->assertEquals( 456, $instance->get_remote_problem_set() );
	}
}
