<?php wp_enqueue_script( 'webwork-form-js' ); ?>
<?php wp_enqueue_style( 'webwork-form-css' ); ?>

<div class="webwork-ask-a-question">

<h2><?php esc_html_e( 'WeBWoRK', 'webwork' ); ?></h2>

<h3><?php esc_html_e( 'Ask a question', 'webwork' ); ?></h3>

<?php $post_data = webwork_get_current_post_data(); ?>

<p>
<?php
$source_name = sprintf( 'Problem set %s #%s', esc_html( $post_data['set'] ), intval( $post_data['problem'] ) );
printf(
	esc_html__( 'You are asking a question about: %s', 'webwork' ),
	sprintf( '<a href="%s">%s</a>', esc_url( $post_data['remote_referer_url'] ), $source_name )
);
?>
</p>

<div class="webwork-show-problem">
	<a href="#" data-content-type="problem" class="problem-toggle section-toggle"><?php esc_html_e( 'Show problem', 'webwork' ); ?></a>
	<div class="webwork-show-problem-content section-content section-content-hide">
		<?php echo( webwork_prepare_pg_object( $post_data['pg_object'] ) ); ?>
	</div>
</div>

<?php $related_questions = webwork_get_related_questions(); ?>
<?php if ( $related_questions->has_questions() ) : ?>
<div class="webwork-related-questions">
	<a href="#" data-content-type="related" class="related-toggle section-toggle"><?php esc_html_e( 'Show related questions', 'webwork' ); ?></a>
	<div class="webwork-show-related-content section-content section-content-hide">
		<ul>
			<?php foreach ( $related_questions as $related_question ) : ?>
				<li>
					<?php printf( '<a href="%s">%s</a>', esc_url( $related_question['url'] ), esc_html( $related_question['title'] ) ); ?>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</div>
<?php endif; ?>

<form action="" method="post" class="webwork-question-form">
	<label for="webwork-question-subject"><?php esc_html_e( 'Subject', 'webwork' ); ?></label>
	<input type="text" id="webwork-question-subject" name="webwork-question-subject" />
	<p class="description"><?php esc_html_e( 'A one-sentence description of your problem.', 'webwork' ); ?></p>

	<label for="webwork-question-text"><?php esc_html_e( 'Your problem', 'webwork' ); ?></label>
	<textarea id="webwork-question-text" name="webwork-question-text"></textarea>
	<p class="description"><?php esc_html_e( 'A detailed description of the problem you\'re experiencing.', 'webwork' ); ?></p>

	<label for="webwork-question-tried"><?php esc_html_e( 'What you\'ve tried', 'webwork' ); ?></label>
	<textarea id="webwork-question-tried" name="webwork-question-tried"></textarea>
	<p class="description"><?php esc_html_e( 'A summary of the approaches you\'ve attempted so far.', 'webwork' ); ?></p>

	<input type="hidden" name="webwork-question-problem" value="<?php echo intval( $post_data['problem'] ); ?>" />
	<input type="hidden" name="webwork-question-problem-set" value="<?php echo esc_attr( $post_data['set'] ); ?>" />

	<?php $wwclass = webwork_get_current_wwclass(); ?>
	<input type="hidden" name="webwork-question-wp-object-id" value="<?php echo intval( $wwclass->get_wp_object_id() ) ; ?>" />
	<input type="hidden" name="webwork-question-wp-object-type" value="<?php echo esc_attr( $wwclass->get_wp_object_type() ) ; ?>" />

	<?php wp_nonce_field( 'webwork_question', 'webwork-question-nonce' ); ?>

	<input type="submit" value="<?php esc_html_e( 'Submit', 'webwork' ); ?>" />
</form>

<h3>FOR DEBUG ONLY</h3>
<p>Here's a dump of all the data WeBWorK sends over:</p>

<pre><?php print_r( array_map( 'esc_html', $post_data ) ); ?></pre>

</div><!-- .webwork-ask-a-question -->
