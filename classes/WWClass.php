<?php

namespace WeBWorK;

/**
 * WeBWorK Class object.
 *
 * Called WWClass because 'Class' is a reserved term. Cool ontology bro.
 *
 * @since 1.0.0
 */
class WWClass {
	/**
	 * Class ID.
	 *
	 * @since 1.0.0
	 * @var int
	 */
	protected $class_id;

	/**
	 * WP object ID.
	 *
	 * @since 1.0.0
	 * @var int
	 */
	protected $wp_object_id;

	/**
	 * WP object ID.
	 *
	 * @since 1.0.0
	 * @var int
	 */
	protected $wp_object_type;

	/**
	 * WP post object (webwork_course).
	 *
	 * @since 1.0.0
	 * @var \WP_Post
	 */
	protected $post;

	/**
	 * Whether the class object is fully set up.
	 *
	 * @since 1.0.0
	 * @var bool
	 */
	protected $set_up = false;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param int $class_id ID of the webwork_class object.
	 */
	public function __construct( $class_id ) {
		$this->class_id = (int) $class_id;

		// Set up WP_Post data.
		$post = get_post( $this->class_id );
		if ( $post instanceof \WP_Post && 'webwork_class' === $post->post_type ) {
			$this->post = $post;
		}

		if ( ! $this->exists() ) {
			return;
		}

		// Get object integration information.
		$this->wp_object_type = get_post_meta( $this->class_id, 'webwork_object_type', true );
		if ( ! $this->wp_object_type ) {
			return;
		}

		// @todo Support multiple integrations per class? Blah.
		$this->integration = $this->get_integration_for_object_type( $this->wp_object_type );
		$this->wp_object_id = (int) get_post_meta( $this->class_id, 'webwork_object_id', true );

		if ( ! $this->integration || ! $this->wp_object_id ) {
			return;
		}

		$this->set_up = true;
	}

	/**
	 * Does the current webwork_class exists?
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function exists() {
		return ! is_null( $this->post );
	}

	/**
	 * Has the current class object been completely set up?
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function is_set_up() {
		return $this->set_up;
	}

	/**
	 * Can the current user post a question to this class?
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function current_user_can_post() {
		return $this->integration->current_user_can_post( $this->wp_object_id );
	}

	/**
	 * Get the integration URL for this class.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_integration_url() {
		return $this->integration->get_integration_url( $this->wp_object_id );
	}

	/**
	 * Get the WP object ID for this class.
	 *
	 * @since 1.0.0
	 *
	 * @return int
	 */
	public function get_wp_object_id() {
		return intval( $this->wp_object_id );
	}

	/**
	 * Get the WP object type for this class.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_wp_object_type() {
		return $this->wp_object_type;
	}

	/**
	 * Post a question to a course.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function post_question( $post_data ) {
		return $this->integration->post_question( $this->wp_object_id, $post_data );
	}

	/**
	 * Get related questions for a set of params.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args {
	 *     @type string $set
	 *     @type int    $problem
	 * }
	 * @return \WeBWorK\RelatedQuestions
	 */
	public function get_related_questions( $args ) {
		return $this->integration->get_related_questions( $this->wp_object_id, $args );
	}

	/**
	 * Get the integration class corresponding to an object type.
	 *
	 * @since 1.0.0
	 *
	 * @return bool|Integration
	 */
	protected function get_integration_for_object_type( $wp_object_type ) {
		$integrations = webwork()->get_integrations();

		$integration = false;
		if ( isset( $integrations[ $wp_object_type ] ) ) {
			$integration = new $integrations[ $wp_object_type ];
		}

		return $integration;
	}
}
