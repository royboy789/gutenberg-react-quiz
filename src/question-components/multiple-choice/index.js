import React, { Component } from 'react';

var wp = window.wp;
const { RadioControl } = wp.components;

export default class QuestionMultipleChoice extends Component {

  constructor( props ) {
    super( props );
    this.state = props;
    this.answer = this.answer.bind(this);
  }

  answer(e) {
    const { correct_answer } = this.state;
    this.setState({
      select_answer: e
    });

    let correct = correct_answer === e;
    this.props.nextQuestion( correct );
  }

  render() {
    return (
      <div>
        <h4>{ this.state.question }</h4>
        <em>{ this.state.hint }</em>
        <RadioControl
          options={ this.state.options }
          selected={ this.state.select_answer }
          onChange={ this.answer }
        />
      </div>
    )
  }

}