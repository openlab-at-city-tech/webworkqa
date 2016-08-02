<?php

/**
 * @group server
 */
class WeBWorK_Tests_Server extends WeBWorK_UnitTestCase {
	public function test_sanitize_class_url_should_identify_section() {
		$url = 'http://mathww.citytech.cuny.edu/webwork2/MAT1234-S16-Plum/problemSetName/problemNumber/?foo=bar';

		// Cool
		$old_post = $_POST;
		$_POST = array(
			'set' => 'problemSetName',
			'problem' => 'problemNumber',
		);

		$expected = 'MAT1234-S16-Plum';

		$server = new \WeBWorK\Server();
		$found = $server->sanitize_class_url( $url );

		$_POST = $old_post;

		$this->assertSame( $expected, $found['section'] );
	}

	public function test_sanitize_class_url_should_identify_course() {
		$url = 'http://mathww.citytech.cuny.edu/webwork2/MAT1234-S16-Plum/problemSetName/problemNumber/?foo=bar';

		// Cool
		$old_post = $_POST;
		$_POST = array(
			'set' => 'problemSetName',
			'problem' => 'problemNumber',
		);

		$expected = 'MAT1234';

		$server = new \WeBWorK\Server();
		$found = $server->sanitize_class_url( $url );

		$_POST = $old_post;

		$this->assertSame( $expected, $found['course'] );
	}
}
