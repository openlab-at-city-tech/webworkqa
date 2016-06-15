<?php

namespace WeBWorK\Server\Vote;

/**
 * Vote query.
 *
 * @since 1.0.0
 */
class Query {
	protected $r;

	public function __construct( $args ) {
		$this->r = array_merge( array(
			'item_id' => null,
			'user_id' => null,
		), $args );
	}

	/**
	 * Get votes.
	 *
	 * @since 1.0.0
	 *
	 * @return array|int
	 */
	public function get( $type = 'object' ) {
		global $wpdb;

		$fields = 'count' === $type ? 'COUNT(*)' : '*';

		// todo
		$root_blog = 1;
		$table_name = $wpdb->get_blog_prefix( $root_blog ) . 'webwork_votes';

		$sql = "SELECT $fields FROM $table_name";

		$where = array();

		if ( null !== $this->r['user_id'] ) {
			$where[] = $wpdb->prepare( "user_id = %d", $this->r['user_id'] );
		}

		if ( null !== $this->r['item_id'] ) {
			$where[] = $wpdb->prepare( "item_id = %d", $this->r['item_id'] );
		}

		if ( $where ) {
			$sql .= ' WHERE ' . implode( ' AND ', $where );
		}

		if ( 'count' === $type ) {
			$found = $wpdb->get_var( $sql );
			return (int) $found;
		} else {
			$found = $wpdb->get_results( $sql );

			$votes = array();
			foreach ( $found as $f ) {
				$v = new \WeBWorK\Server\Vote( $f->user_id, $f->item_id );
				$v->set_id( $f->id );
				$v->set_value( $f->value );

				$votes[] = $v;
			}

			return $votes;
		}
	}
}
