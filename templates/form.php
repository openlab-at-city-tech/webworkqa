<h2><?php esc_html_e( 'WeBWoRK', 'webwork' ); ?></h2>

<h3><?php esc_html_e( 'Ask a question', 'webwork' ); ?></h3>

<?php $post_data = webwork_get_current_post_data(); ?>

<?php esc_html_e( 'Problem:', 'webwork' ); ?>
<div class="webwork-problem">
	<?php echo( webwork_prepare_pg_object( $post_data['pg_object'] ) ); ?>
</div>
