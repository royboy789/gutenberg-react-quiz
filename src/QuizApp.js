import React, { Component } from 'react';
import './QuizApp.css';
import axios from 'axios';
import QuestionMultipleChoice from './question-components/multiple-choice';


const api = axios.create({
  baseURL: 'http://wordpress.test/wp-json/'
});

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

  questionComponent( question ) {
    return QuestionMultipleChoice;
  }

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

  nextQuestion( correct_answer, given_answer ) {
    let { answered_questions, current_question, total_questions } = this.state;
    let correct = correct_answer === given_answer;
    answered_questions[ current_question ] = correct;

    this.setState({
      answered_questions: answered_questions,
      current_question: current_question+=1
    }, () => {
      if ( this.state.current_question === total_questions ) {
        this.completeQuiz();
      }
    });

  }

  completeQuiz() {
    const { answered_questions, total_questions } = this.state;

    this.setState({
      quiz_complete: true,
      quiz_result: ( this.countInArray( answered_questions, true ) / total_questions ) * 100
    });
  }

  countInArray(array, what) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === what) {
        count++;
      }
    }
    return count;
  }

  loadCompleteMessageTitle() {
    const { quiz_result } = this.state;

    if ( 90 < quiz_result ) {
      return 'Congratulations!';
    } else {
      return 'Better luck next time!';
    }
  }

  loadCompleteMessage() {
    const { quiz_result } = this.state;

    if ( 90 < quiz_result ) {
      return (
        <p>
          You Got { this.state.quiz_result }%!
        </p>
      )
    } else {
      return (
        <p>
          You only got { this.state.quiz_result }%
        </p>
      )
    }
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
