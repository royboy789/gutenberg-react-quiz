import React, { Component } from 'react';
import './QuizApp.css';
import axios from 'axios';

// Questions
import QuestionMultipleChoice from './question-components/multiple-choice';
import QuestionText from './question-components/text';


const api = axios.create({
  baseURL: 'http://wordpress.test/wp-json/'
});

const wp = window.wp;

class QuizApp extends Component {

  constructor( props ) {
    super(props);

    this.state = {
      quiz_complete: false,
      id: this.props['quizid'],
      questions: [],
      total_questions: null,
      answered_questions: [],
      current_question: 0
    };

    // Get Question Data from Editor blocks
    // REQUIRES GUTENBERG OBJECT PLUGIN - https://github.com/royboy789/gutenberg-object-plugin
    api.get('wp/v2/quiz/' + this.state.id).then((res) => {
      if ( ! res.data ) { return false; }
      this.setState({
        questions: res.data.editor_blocks,
        total_questions: res.data.editor_blocks.length
      })
    });

    this.nextQuestion = this.nextQuestion.bind(this);
    this.loadQuestion = this.loadQuestion.bind(this);

  }

  /**
   * Determine which question component to load
   *
   * @param question
   * @returns {*|boolean}
   */
  questionComponent( question ) {
    question = question.replace( 'react-quiz-blocks/', '' );

    let returnComp = false;

    switch( question ) {
      case 'question-multiple-choice':
        returnComp = QuestionMultipleChoice;
        break;
      case 'question-text':
        returnComp = QuestionText;
        break;
      default:
        console.log( 'cannot find question type: ' + question );
        break;
    }

    // Filter the right comp to load based on question
    returnComp = wp.hooks.applyFilters( 'reactQuiz_load_question_component', returnComp, question );

    return returnComp;
  }

  /**
   * Load Question Component
   *
   * @param question_key
   * @returns {*}
   */
  loadQuestion( question_key ) {
    let { questions } = this.state;
    let question = questions[ question_key ];

    if ( ! question ) { return; }

    let questionBlock = this.questionComponent( question.name );
    question.data.nextQuestion = this.nextQuestion;

    return(
      <div key={question.uid}>
        { React.createElement( questionBlock, question.data ) }
      </div>
    );
  }

  /**
   * Load the next question - gets passed into every question component
   *
   * @param correct
   */
  nextQuestion( correct ) {
    let { answered_questions, current_question, total_questions } = this.state;

    // add correct bool to array of all answered questions
    answered_questions[ current_question ] = correct;

    // set state
    this.setState({
      answered_questions: answered_questions,
      current_question: current_question+=1
    }, () => {
      if ( this.state.current_question === total_questions ) {
        this.completeQuiz();
      }
    });

  }

  /**
   * Complete Quiz
   */
  completeQuiz() {
    const { answered_questions, total_questions } = this.state;

    let final_state = {
      quiz_complete: true,
      quiz_result: ( this.countInArray( answered_questions, true ) / total_questions ) * 100
    };

    wp.hooks.applyFilters( 'reactQuiz_quiz_final_state', final_state );

    this.setState( final_state, () => {
      wp.hooks.doAction( 'reactQuiz_complete_react_quiz', this.state );
    });
  }

  /**
   * Count how many times "what" appaers in array
   *
   * @param array
   * @param what
   * @returns {number}
   */
  countInArray( array, what ) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === what) {
        count++;
      }
    }
    return count;
  }

  /**
   * Load Message Title when quiz completed
   *
   * @returns {*}
   */
  loadCompleteMessageTitle() {
    const { quiz_result } = this.state;

    let title;

    if ( 90 < quiz_result ) {
      title = 'Congratulations!';
    } else {
      title = 'Better luck next time!';
    }

    title = wp.hooks.applyFilters( 'reactQuiz_complete_message_title', title, quiz_result );

    return title;

  }

  /**
   * Message when quiz completed
   *
   * @returns {*}
   */
  loadCompleteMessage() {
    const { quiz_result } = this.state;

    let message;

    if ( 90 < quiz_result ) {
      message = 'You Got ' + this.state.quiz_result + '%!';
    } else {
      message = 'You only got ' + this.state.quiz_result + '%';
    }

    message = wp.hooks.applyFilters( 'reactQuiz_complete_message', message, quiz_result );

    return (
      <p>
        { message }
      </p>
    );
  }

  render() {

    if ( ! this.state.quiz_complete ) {
      return (
        <div id={'quiz-app-plugin'}>
          <h2>Quiz - {this.state.id}</h2>
          {this.loadQuestion(this.state.current_question)}
        </div>
      );
    } else {
      return (
        <div id={'quiz-app-plugin'}>
          <h2>{ this.loadCompleteMessageTitle() } </h2>
          { this.loadCompleteMessage() }
        </div>
      )
    }
  }
}

export default QuizApp;
