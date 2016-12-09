<?php

namespace WeBWorK\Server\Util;

/**
 * Email.
 *
 * Wraps wp_mail().
 *
 * @since 1.0.0
 */
class Email {
	protected $recipient;
	protected $subject;

	public function set_recipient( $recipient ) {
		$this->recipient = $recipient;
	}

	public function set_subject( $subject ) {
		$this->subject = $subject;
	}

	public function set_message( $message ) {
		$this->message = $message;
	}

	public function send() {
		$subject = sprintf( '[%s] %s', get_option( 'blogname' ), $this->subject );
		$sent = wp_mail( $this->recipient, $subject, $this->message );
		return $sent;
	}
}
