import axios from 'axios';
import YouTube from 'react-youtube';

const { Fragment, Component } = wp.element;
const { TextControl, RadioControl } = wp.components;
const { InspectorControls, MediaUpload } = wp.editor;
const { __ } = wp.i18n;

const api = axios.create();

export default class QuestionYoutube extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      player: null,
      questions: this.props.questions,
      edit_mode: false,
      edit_question: false,
      edit_question_key: false,
    };


    this.readyPlayer = this.readyPlayer.bind(this);
    this.playInit = this.playInit.bind(this);
    this.renderBlock = this.renderBlock.bind(this);
    this.initEditMode = this.initEditMode.bind(this);

    this.saveQuestions = this.saveQuestions.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);

  }

  // Ready Player callback
  readyPlayer( e ) {
    const player = e.target;
    this.setState({
      player: player
    });

  }

  // On Play Callback
  playInit( e ) {
    const player = e.target;

    this.setState({
      player: player
    });
  }

  // Render Block - state swap management
  renderBlock() {
    if ( ! this.state.edit_mode ) {
      return (
        <div>
          <YouTube
            videoId={'3JgGJ7eG_JU'}
            onReady={this.readyPlayer}
            onPlay={this.playInit}
          />
        </div>
      )
    } else {
      let question = this.state.edit_question;
      const { player } = this.state;
      if ( player ) {
        player.stopVideo();
        player.destroy();
        this.setState({
          player: null
        });
      }

      const key = this.state.edit_question_key;
      return(
        <div>
          <div>
            <TextControl
              label={ __( 'Question:' ) }
              value={ question.question ? question.question : '' }
              onChange={ (e) => this.saveQuestion( e, key, 'question' ) }
            />
          </div>
          <div>
            <TextControl
              label={ __( 'Seconds' ) }
              value={ question.seconds ? question.seconds : '' }
              onChange={ (e) => this.saveQuestion( e, key, 'seconds' ) }
            />
          </div>
          <div>
            <RadioControl
              label={ __( 'Question Type' ) }
              selected={ question.question_type }
              options={[
                { label: 'Text', value: 'text' },
                { label: 'Multiple Text Choices', value: 'multiple_text' }
              ]}
              onChange={ (e) => this.saveQuestion( e, key, 'question_type' )}
            />
          </div>
          <span className={'button'} onClick={ (e) => { this.setState({ edit_mode: false, edit_question: false } ) } }>close</span>
        </div>
      )
    }
  }

  // Start Question Edit Mode
  initEditMode( key ) {
    const { attributes } = this.props;
    const { questions } = attributes;

    this.setState({
      edit_mode: true,
      edit_question: questions[key],
      edit_question_key: key
    });
  }

  // Dealing with Question
  saveQuestions( questions ) {
    const { setAttributes } = this.props;

    setAttributes({
      questions: questions
    });

    this.setState({
      questions: questions
    });
  }

  addQuestion( e ) {
    const { attributes, setAttributes } = this.props;
    let { questions } = attributes;

    if ( ! questions ) {
      questions = [];
    }

    questions.push({
      seconds: false,
      question: 'TESTING',
      question_type: 'text',
      options: []
    });

    this.saveQuestions( questions );

    this.initEditMode( questions.length - 1 );

  }

  deleteQuestion( key ) {
    const { attributes } = this.props;
    let { questions } = attributes;

    if ( 'undefined' === typeof key || ! questions ) {
      console.log( 'error deleting', key, questions );
      return false;
    }

    questions.splice( key, 1 );

    this.saveQuestions( questions );

  }

  saveQuestion( e, key, field ) {
    const { attributes } = this.props;
    let { questions } = attributes;

    questions[key][field] = e;

    this.saveQuestions( questions );

  }

  render() {
    const { attributes } = this.props;
    return(
      <div>
        { this.renderBlock() }
        <div id={'inspector'}>
          <Fragment>
            <InspectorControls>
              {
                attributes.questions.map( (question,key) =>{
                  return(
                    <div key={ key } className={'single-question'}>
                      <div>
                        <strong>Question:</strong> {question.question }
                        <strong>Seconds:</strong> { question.seconds } <br/>
                        <strong>Type:</strong> { question.question_type } <br/>
                      </div>

                      <span className={'button'} onClick={ (e) => this.initEditMode( key ) }>edit</span>
                      <span className={'button'} onClick={ (e) => this.deleteQuestion( key ) }>remove</span>
                    </div>
                  )
                })
              }
              <span className={'button'} onClick={this.addQuestion}>+ Question</span>
            </InspectorControls>
          </Fragment>
        </div>
      </div>

    )
  }

}