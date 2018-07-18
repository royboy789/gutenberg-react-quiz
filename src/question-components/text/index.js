import React, { Component } from 'react';

var wp = window.wp;
const { TextControl } = wp.components;

export default class QuestionText extends Component {

  constructor( props ) {
    super( props );
    this.state = { ...props, text_answer: ''};

    this.setAnswer = this.setAnswer.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  setAnswer(e) {
    this.setState({
      text_answer: e
    });
  }

  submitAnswer() {
    const { text_answer } = this.state;
    let correct = false;

    for( let answer of this.state.possible_answers ) {
      if ( text_answer === answer.value || text_answer === answer.label ) {
        correct = true;
        break;
      }
    }

    this.props.nextQuestion( correct );
  }

  render() {
    return (
      <div>
        <h4>{ this.state.question }</h4>
        <em>{ this.state.hint }</em>
        <TextControl
          value={ this.state.text_answer }
          onChange={ this.setAnswer }
        />
        <span className={"btn btn-primary"} onClick={ this.submitAnswer }>Submit</span>
      </div>
    )
  }

}