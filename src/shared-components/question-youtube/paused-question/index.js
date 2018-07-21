import React from 'react';
import './style.css';

var wp = window.wp;
const { Component } = wp.element;
const { TextControl, RadioControl } = wp.components;

export default class YouTubePausedQuestion extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      answer: ''
    };

    this.renderQuestion = this.renderQuestion.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this);

    this.submitTextAnswer = this.submitTextAnswer.bind(this);
    this.submitMultipleChoiceAnswer = this.submitMultipleChoiceAnswer.bind(this);
  }

  /**
   * Answer Question - DOES NOT SEND TO Block
   *
   * @param e
   */
  answerQuestion( e, question_type ) {
    this.setState({
      answer: e
    }, () => {
      if ( 'text' === question_type ) {
        this.submitTextAnswer();
      } else if( 'multiple_text' === question_type ) {
        this.submitMultipleChoiceAnswer();
      }
    });
  }

  /**
   * Submit Answer - send to Quiz Block
   *
   */
  submitTextAnswer() {
    const { question } = this.props;
    let text_answer = this.state.answer;
    let correct = false;

    for( let answer of question.options ) {
      if ( text_answer === answer.value || text_answer === answer.label ) {
        correct = true;
        break;
      }
    }

    this.props.onAnswer( correct );

  }

  submitMultipleChoiceAnswer() {
    const { question } = this.props;
    let answer = this.state.answer;

    let correct = answer.toString() === question.correct_answer.toString();

    this.props.onAnswer( correct );
  }


  /**
   *
   * Render Question
   *
   * @returns {boolean}
   */
  renderQuestion() {
    const { question } = this.props;
    let question_type = question.question_type;

    let wrapper_class = 'type-'.question_type;

    if ( 'text' === question_type ) {
      return(
        <div className={ wrapper_class }>
          <TextControl
            value={ this.state.answer }
            label={ 'Answer' }
            onChange={ (e) => { this.answerQuestion( e, 'text') } }
          />
        </div>
      )
    }

    if ( 'multiple_text' === question_type ) {

      if ( ! question.options || ! question.options.length ) {
        this.props.onAnswer( false );
        return false;
      }

      return(
        <div className={ wrapper_class }>
          <RadioControl
            options={ question.options }
            selected={ this.state.answer }
            onChange={ (e) => { this.answerQuestion( e, 'multiple_text') } }
          />
        </div>
      )
    }

  }

  render() {
    const { question } = this.props;

    return(
      <div id={'active-question-wrapper'}>
        <h4>{question.question}</h4>
        { this.renderQuestion() }
      </div>
    )
  }
}