import axios from 'axios';
import YouTube from 'react-youtube';
import YoutubeQuestionOptions from './options';
import YouTubePausedQuestion from './paused-question';

import './style.scss';

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
      pause_times: [],
      paused_question: false,
    };


    this.readyPlayer = this.readyPlayer.bind(this);
    this.playInit = this.playInit.bind(this);
    this.renderBlock = this.renderBlock.bind(this);
    this.initEditMode = this.initEditMode.bind(this);
    this.playerTimeCheck = this.playerTimeCheck.bind(this);

    this.saveQuestions = this.saveQuestions.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);

  }

  // Ready Player callback
  readyPlayer( e ) {
    const { attributes } = this.props;
    const { questions } = attributes;
    const player = e.target;

    // reset & set
    let pause_times = [];
    questions.map((question, key) => {
      pause_times.push( parseInt( question.seconds ) );
    });

    this.setState({
      player: player,
      pause_times: pause_times
    });

  }

  // On Play Callback
  playInit( e ) {
    const player = e.target;

    this.playerInterval = setInterval((player) => {
      this.playerTimeCheck( player );
    }, 1000, player );
  }

  // Player Interval Time Check & Init Pause n' Ask
  playerTimeCheck( player ) {
    let currentTime = parseInt( player.getCurrentTime() );
    const { pause_times } = this.state;
    let pause = ( -1 !== pause_times.indexOf( currentTime ) );

    if ( pause ) {
      this.initPauseNAsk( pause_times.indexOf( currentTime ) );
      player.pauseVideo();
    }

  }

  initPauseNAsk( question_key ) {
    const { attributes } = this.props;
    const { questions } = attributes;

    const question = questions[ question_key ];

    this.setState({
      paused_question: question
    });

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
      options: [],
      correct_answer: ''
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


  // Render Block - state swap management
  renderBlock() {
    const { attributes } = this.props;
    let active_question;

    if ( ! attributes.youtube_id ) {
      // No Youtube ID set
      return(
        <div>
          <p>
            No Youtube Video ID set - add the ID on the right.
          </p>
        </div>
      )
    }

    if ( false !== this.state.paused_question ) {
      active_question = <YouTubePausedQuestion
        question={ this.state.paused_question }
      />;
    }


    if ( ! this.state.edit_mode ) {
      // Youtube Player
      return (
        <div id={'youtube-wrapper'}>
          { active_question }
          <YouTube
            videoId={ attributes.youtube_id }
            onReady={this.readyPlayer}
            onPlay={this.playInit}
            onPause={ (e) => { clearInterval( this.playerInterval )}}
          />
        </div>
      )
    } else {
      // Edit Question
      let question = this.state.edit_question;
      const key = this.state.edit_question_key;

      // Destroy Player and set player to null
      const { player } = this.state;
      if ( player ) {
        player.stopVideo();
        player.destroy();
        this.setState({
          player: null
        });
      }

      // Return Edit Question
      return(
        <div id={'question-edit-wrapper'}>
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
          <div>
            <YoutubeQuestionOptions
              options={ question.options }
              questionType={ question.question_type }
              correctAnswer={ question.correct_answer }
              onOptionsChange={ (e) => this.saveQuestion( e, key, 'options' ) }
              onCorrectAnswerChange={ (e) => this.saveQuestion( e, key, 'correct_answer' ) }
            />
          </div>
          <hr/>
          <span className={'button'} onClick={ (e) => { this.setState({ edit_mode: false, edit_question: false, edit_question_key: false, paused_question: false } ) } }>close</span>
        </div>
      )
    }
  }

  render() {
    const { attributes } = this.props;
    return(
      <div>
        <h2>Youtube Pause & Ask</h2>
        { this.renderBlock() }
        <div id={'inspector'}>
          <Fragment>
            <InspectorControls>
              <TextControl
                label={ __( 'Youtube Video ID' ) }
                value={ attributes.youtube_id }
                onChange={ (e) => { this.props.setAttributes({ youtube_id: e })}}
              />
              <div>
                <h4>Pause & Ask Questions:</h4>
              </div>
              {
                attributes.questions.map( (question,key) =>{
                  return(
                    <div key={ key } className={'single-question'}>
                      <div className={'single-question--meta'}>
                        <strong>Question:</strong> {question.question } <br/>
                        <strong>Seconds:</strong> { question.seconds } <br/>
                        <strong>Type:</strong> { question.question_type } <br/>
                      </div>

                      <span className={'button'} onClick={ (e) => this.initEditMode( key ) }>edit</span>
                      <span className={'button'} onClick={ (e) => this.deleteQuestion( key ) }>remove</span>
                    </div>
                  )
                })
              }
              <span className={'button addQuestionButton'} onClick={this.addQuestion}>+ Question</span>
            </InspectorControls>
          </Fragment>
        </div>
      </div>

    )
  }

}