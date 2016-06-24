<?php

namespace WeBWorK\Server\Util;

/**
 * Shared query sorting functionality.
 *
 * @since 1.0.0
 */
class QuerySorter {
	public function sort_by_votes( $items ) {
		$sorted_items = array();

		$item_ids = array();
		foreach ( $items as $item ) {
			$item_ids[] = $item->get_id();
		}

		if ( $item_ids ) {
			$item_vote_query = new \WeBWorK\Server\Vote\Query( array( 'item_id__in' => $item_ids ) );
			$item_votes = $item_vote_query->get();

			$counts = array_fill_keys( $item_ids, 0 );
			foreach ( $item_votes as $vote ) {
				$item_id = $vote->get_item_id();
				$counts[ $item_id ]++;
			}

			// @todo Make sorting configurable.
			// Sort is: vote first, then post date.
			arsort( $counts );
			$items_by_count = array_fill_keys( $counts, array() );
			foreach ( $counts as $item_id => $count ) {
				$item = $items[ $item_id ];
				$item->set_vote_count( $counts[ $item_id ] );
				$items_by_count[ $count ][] = $item;
			}

			// @todo there must be a faster way
			$sorted_items = array();
			foreach ( $items_by_count as $count => $count_items ) {
				$sorted_items = array_merge( $sorted_items, $count_items );
			}

			$items = $sorted_items;
		}

		return $items;
	}
}
