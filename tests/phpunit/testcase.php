<?php

class WeBWorK_UnitTestCase extends WP_UnitTestCase {
	protected static function factory() {
		static $factory = null;

		if ( ! $factory ) {
			$factory = new WP_UnitTest_Factory();
			$factory->vote = new WeBWorK_Tests_Factory_For_Vote();
			$factory->question = new WeBWorK_Tests_Factory_For_Question();
			$factory->response = new WeBWorK_Tests_Factory_For_Response();
		}

		return $factory;
	}
}
