<?php
/**
 * Plugin Name: React Quiz Plugin
 * Description: Quizzes, with React
 * Version: 0.0.1
 * Author URI: http://arcctrl.com/
 * Textdomain: react-quiz-plugin
 */

namespace ReactQuiz;

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once 'vendor/autoload.php';
}

use ReactQuiz\QuizCPT;

class ReactQuizPlugin {

	private $quizObjects;

	public function __construct( $quizObjects ) {
		$this->quizObjects = $quizObjects;

		add_action( 'wp_enqueue_scripts', [ $this, 'react_quiz_enqueue'] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'react_quiz_enqueue_block_editor_assets' ] );
		add_filter( 'allowed_block_types', [ $this, 'quiz_block_types' ], 99, 2 );
		add_action( 'init', [ $this, 'add_quizzes_gutes_db' ], 10 );
	}

	public function react_quiz_enqueue() {

		$file = file_get_contents( plugin_dir_path( __FILE__ ) . '/build/asset-manifest.json' );
		$file = json_decode( $file );
		$dir = __DIR__;
		$blocks_js = '/build/' . $file->{ 'main.js' };
		$block_css = '/build/' . $file->{ 'main.css' };

		if ( ! defined( 'WP_ENV' ) || ( defined( 'WP_ENV' ) && 'dev' !== WP_ENV ) ) {
			$jsFile = plugins_url( $blocks_js, __FILE__ );
		} else {
			// if running dev, don't forget to 'npm run start'.
			$jsFile = '//localhost:3000/static/js/bundle.js';
		}

		if ( ! defined( 'WP_ENV' ) || ( defined( 'WP_ENV' ) && 'dev' !== WP_ENV ) ) {
			$cssFile = plugins_url( $block_css, __FILE__ );
			wp_enqueue_style( 'react-quiz-main-style', $cssFile, array(), null, 'all' );
		} else {
			$cssFile = false;
		}

		wp_enqueue_script( 'wp-components' );
		wp_enqueue_script( 'wp-hooks' );
		wp_enqueue_script( 'react-quiz-main', $jsFile, array( 'wp-hooks' ), null, true );

		wp_localize_script( 'react-quiz-main', 'ReactQuizObject', [
			'rest_url' => esc_url( get_rest_url() ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
		]);
	}

	public function react_quiz_enqueue_block_editor_assets() {
		$dir = __DIR__;
		$blocks_js = '/build/gutenberg/blocks.build.js';

		wp_enqueue_script( 'quiz-blocks', plugins_url( $blocks_js, __FILE__ ), array(
			'wp-blocks',
			'wp-i18n',
			'wp-editor',
			'wp-element',
		), '1.0.0' );

	}

	public function quiz_block_types( $allowed_blocks, $post ) {

		if ( 'quiz' === $post->post_type ) {

			$allowed_blocks = [
				'core/paragraph',
				'react-quiz-blocks/question-multiple-choice',
				'react-quiz-blocks/question-text',
				'react-quiz-blocks/question-youtube-pause-ask',
			];

		} else {
			$allowed_blocks = [
				'react-quiz-blocks/quiz-block',
				'core/shortcode',
				'core/image',
				'core/gallery',
				'core/heading',
				'core/quote',
				'core/embed',
				'core/list',
				'core/separator',
				'core/more',
				'core/button',
				'core/pullquote',
				'core/table',
				'core/preformatted',
				'core/code',
				'core/html',
				'core/freeform',
				'core/latest-posts',
				'core/categories',
				'core/cover-image',
				'core/text-columns',
				'core/verse',
				'core/video',
				'core/audio',
				'core/block',
				'core/paragraph',
				'core-embed/twitter',
				'core-embed/youtube',
				'core-embed/facebook',
				'core-embed/instagram',
				'core-embed/wordpress',
				'core-embed/soundcloud',
				'core-embed/spotify',
				'core-embed/flickr',
				'core-embed/vimeo',
				'core-embed/animoto',
				'core-embed/cloudup',
				'core-embed/collegehumor',
				'core-embed/dailymotion',
				'core-embed/funnyordie',
				'core-embed/hulu',
				'core-embed/imgur',
				'core-embed/issuu',
				'core-embed/kickstarter',
				'core-embed/meetup-com',
				'core-embed/mixcloud',
				'core-embed/photobucket',
				'core-embed/polldaddy',
				'core-embed/reddit',
				'core-embed/reverbnation',
				'core-embed/screencast',
				'core-embed/scribd',
				'core-embed/slideshare',
				'core-embed/smugmug',
				'core-embed/speaker',
				'core-embed/ted',
				'core-embed/tumblr',
				'core-embed/videopress',
				'core-embed/wordpress-tv',
			];
		}
		return $allowed_blocks;
	}

	public function add_quizzes_gutes_db() {
		if ( ! defined( 'GUTENBERG_OBJECT_PLUGIN_CPTS' ) ) {
			define( 'GUTENBERG_OBJECT_PLUGIN_CPTS', 'quiz' );
		}
	}


}


$quizObjects = new QuizCPT();


$ReactQuizPlugin = new ReactQuizPlugin( $quizObjects );