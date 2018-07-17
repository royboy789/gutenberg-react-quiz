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

  }

  questionComponent( question ) {
    return QuestionMultipleChoice;
  }

  nextQuestion( correct_answer, given_answer ) {
    let { answered_questions, current_question, total_questions } = this.state;
    let correct = correct_answer === given_answer;
    answered_questions[ current_question ] = correct;


    
    this.setState({
      answered_questions: answered_questions,
      current_question: current_question+=1
    });

    console.log( this.state.current_question, total_questions );

  }

  render() {

    return (
      <div id={'quiz-app-plugin'}>
        <h2>Quiz - { this.state.id }</h2>
        { this.state.questions.map((question) => {
          let questionBlock = this.questionComponent( question.name );
          question.data.nextQuestion = this.nextQuestion;
          return(
            <div key={question.uid}>
              { React.createElement( questionBlock, question.data ) }
            </div>
          )
        })}
      </div>
    );
  }
}

export default QuizApp;
