<?php

namespace WeBWorK;

/**
 * A list of related questions matching a set of params.
 *
 * @since 1.0.0
 */
class RelatedQuestions implements \ArrayAccess, \Iterator {
	protected $position;

	/**
	 * Questions.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected $questions;

	/**
	 * Set the questions.
	 *
	 * Integrations are responsible for setting this up.
	 *
	 * @since 1.0.0
	 *
	 * @param array $questions
	 */
	public function set_questions( $questions ) {
		$this->questions = $questions;
	}

        /**
         * Whether the current set has questions.
         *
         * @since 1.0.0
         *
         * @return bool
         */
        public function has_questions() {
                return ! empty( $this->questions );
        }

	public function offsetSet( $offset, $value ) {
		if ( is_null( $offset ) ) {
			$this->questions[] = $value;
		} else {
			$this->questions[ $offset ] = $value;
		}
	}

	public function offsetExists( $offset ) {
		return isset( $this->questions[ $offset ] );
	}

	public function offsetUnset( $offset ) {
		unset( $this->questions[ $offset ] );
	}

	public function offsetGet( $offset ) {
		return isset( $this->questions[ $offset ] ) ? $this->questions[ $offset ] : null;
	}

	public function rewind() {
		$this->position = 0;
	}

	public function current() {
		return $this->questions[ $this->position ];
	}

	public function key() {
		return $this->position;
	}

	public function next() {
		++$this->position;
	}

	public function valid() {
		return isset( $this->questions[ $this->position ] );
	}
}

