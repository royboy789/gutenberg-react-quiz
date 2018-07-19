const { Fragment, Component } = wp.element;
const { TextControl, RadioControl } = wp.components;
const { __ } = wp.i18n;

import './style.scss';

export default class YouTubePausedQuestion extends Component {

  constructor( props ) {
    super( props );

    this.state = {
      answer: null
    };

    this.renderQuestion = this.renderQuestion.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this);
    this.submitTextAnswer = this.submitTextAnswer.bind(this);
  }

  renderQuestion() {
    const { question } = this.props;
    let question_type = question.question_type;

    if ( 'text' === question_type ) {
      return(
        <div>
          <TextControl
            label={ __( 'Answer' ) }
            value={ this.state.answer }
            onChange={ this.answerQuestion }
          />
          <span className={ 'button' } onClick={ this.submitTextAnswer }>Submit</span>
        </div>
      )
    }

  }

  answerQuestion( e ) {
    const { question } = this.props;
    let question_type = question.question_type;

    this.setState({
      answer: e
    });
  }

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

    console.log( correct );

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