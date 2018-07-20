var wp = window.wp;

const { Fragment, Component } = wp.element;
const { TextControl, RadioControl } = wp.components;
const { InspectorControls, MediaUpload } = wp.editor;
const { __ } = wp.i18n;

import '../style.scss';

export default class YoutubeQuestionOptions extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      correct_answer: this.props.correctAnswer,
      options: this.props.options,
      question_type: this.props.questionType,
    };


    this.addOption = this.addOption.bind(this);
    this.saveOption = this.saveOption.bind(this);
    this.deleteOption = this.deleteOption.bind(this);

    this.saveCorrectAnswer = this.saveCorrectAnswer.bind(this);

    this.resetQuestion = this.resetQuestion.bind(this);

  }

  addOption( e ) {
    let { options, question_type } = this.state;
    let new_option = {};

    switch( question_type ) {
      case 'text':
        new_option = {
          value: ''
        };
        break;
      case 'multiple_text':
        new_option = {
          value: '',
          label: ''
        };
        break;
      default:
        break;
    }

    options.push( new_option );
    this.setState({
      options: options
    }, () => {
      this.props.onOptionsChange( options );
    });
  }

  saveOption( e, key ) {
    let { options, question_type } = this.state;

    options[key].label = e;
    options[key].value = e;
    options[key].value = options[key].value.replace( ' ', '_' );
    options[key].value = options[key].value.toLowerCase();

    this.setState({
      options: options
    }, () => {
      this.props.onOptionsChange( options );
    });
  }

  resetQuestion() {
    this.setState({
      options: this.props.options,
      question_type: this.props.questionType,
      correct_answer: this.props.correctAnswer
    });
  }

  deleteOption( key ) {
    let { options } = this.state;

    options.splice( key, 1 );

    this.setState({
      options: options
    });
  }

  saveCorrectAnswer( e ) {
    this.setState({
      correct_answer: e
    });
    this.props.onCorrectAnswerChange( e );
  }

  render() {
    const { options, question_type, correct_answer } = this.state;
    let correctAnswer = '';

    if ( options !== this.props.options || question_type !== this.props.questionType || correct_answer !== this.props.correctAnswer ) {
      this.resetQuestion();
    }

    if ( 'multiple_text' === question_type ) {
      correctAnswer = <RadioControl
        label={ __( 'Correct Answer' ) }
        options={ options }
        selected={ correct_answer }
        onChange={ this.saveCorrectAnswer }
      />;
    }

    return(
      <div>
        <h2>Options</h2>
        <span className={ 'button' } onClick={ this.addOption }>Add Option</span>
        {
          options.map((option, key) => {
            return(
              <div className={ 'single-option' }>
                <span className={ 'button' } onClick={ (e) => this.deleteOption( key ) }>X</span>
                <TextControl
                  value={ option.label }
                  onChange={ (e) => this.saveOption( e, key ) }
                />
              </div>
            )
          })
        }
        { correctAnswer }
      </div>
    )
  }

}