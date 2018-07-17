<?php

namespace ReactQuiz;


class QuizCPT {

	function __construct() {
		add_action( 'init', [ $this, 'register_quiz_cpt' ] );
	}

	public function register_quiz_cpt() {

		$labels = array(
			'name'               => _x( 'Quizzes', 'post type general name', 'react-quiz-plugin' ),
			'singular_name'      => _x( 'Quiz', 'post type singular name', 'react-quiz-plugin' ),
			'menu_name'          => _x( 'Quizzes', 'admin menu', 'react-quiz-plugin' ),
			'name_admin_bar'     => _x( 'Quiz', 'add new on admin bar', 'react-quiz-plugin' ),
			'add_new'            => _x( 'Add New', 'Quiz', 'react-quiz-plugin' ),
			'add_new_item'       => __( 'Add New Quiz', 'react-quiz-plugin' ),
			'new_item'           => __( 'New Quiz', 'react-quiz-plugin' ),
			'edit_item'          => __( 'Edit Quiz', 'react-quiz-plugin' ),
			'view_item'          => __( 'View Quiz', 'react-quiz-plugin' ),
			'all_items'          => __( 'All Quizzes', 'react-quiz-plugin' ),
			'search_items'       => __( 'Search Quizzes', 'react-quiz-plugin' ),
			'parent_item_colon'  => __( 'Parent Quizzes:', 'react-quiz-plugin' ),
			'not_found'          => __( 'No Quizzes found.', 'react-quiz-plugin' ),
			'not_found_in_trash' => __( 'No Quizzes found in Trash.', 'react-quiz-plugin' )
		);

		$args = array(
			'labels'             => $labels,
			'description'        => __( 'Description.', 'react-quiz-plugin' ),
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'quiz' ),
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title', 'author', 'thumbnail', 'comments', 'editor', 'revisions' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'quiz', $args );

	}

}