<h2><?php esc_html_e( 'WeBWoRK', 'webwork' ); ?></h2>

<h3><?php esc_html_e( 'Ask a question', 'webwork' ); ?></h3>

<?php $post_data = webwork_get_current_post_data(); ?>

<?php /*
<?php esc_html_e( 'Problem:', 'webwork' ); ?>
<div class="webwork-problem">
	<?php echo( webwork_prepare_pg_object( $post_data['pg_object'] ) ); ?>
</div>
*/ ?>

<h3><?php esc_html_e( 'Related Questions', 'webwork' ); ?></h3>
<p><?php
printf(
	esc_html( 'Other questions related to problem %1$s from problem set %2$s:', 'webwork' ),
	intval( $post_data['problem'] ),
	esc_html( $post_data['set'] )
);
?></p>

<form action="" method="post">
	<p><?php echo esc_html( sprintf( __( 'Problem: %s', 'webwork' ), intval( $post_data['problem'] ) ) ); ?></p>
	<p><?php echo esc_html( sprintf( __( 'Problem set: %s', 'webwork' ), esc_html( $post_data['set'] ) ) ); ?></p>

	<textarea name="webwork-question-text"></textarea>

	<input type="hidden" name="webwork-question-problem" value="<?php echo intval( $post_data['problem'] ); ?>" />
	<input type="hidden" name="webwork-question-problem-set" value="<?php echo esc_attr( $post_data['set'] ); ?>" />

	<?php $wwclass = webwork_get_current_wwclass(); ?>
	<input type="hidden" name="webwork-question-wp-object-id" value="<?php echo intval( $wwclass->get_wp_object_id() ) ; ?>" />
	<input type="hidden" name="webwork-question-wp-object-type" value="<?php echo esc_attr( $wwclass->get_wp_object_type() ) ; ?>" />

	<?php wp_nonce_field( 'webwork_question', 'webwork-question-nonce' ); ?>

	<input type="submit" value="<?php esc_html_e( 'Submit', 'webwork' ); ?>" />
</form>
