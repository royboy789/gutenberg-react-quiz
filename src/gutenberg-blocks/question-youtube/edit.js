import axios from 'axios';
import YouTube from 'react-youtube';
import YoutubeQuestionOptions from './options';
import YouTubePausedQuestion from '../../shared-components/question-youtube/paused-question';

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
      questions: this.props.attributes.questions,
      youtube_id: this.props.attributes.youtube_id,
      autoplay: this.props.attributes.autoplay,
      edit_mode: false,
      edit_question: false,
      edit_question_key: false,
      pause_times: [],
      paused_question: false,
      correct_answers: [],
      quiz_complete: false
    };

    this.saveBlockData = this.saveBlockData.bind(this);

    this.readyPlayer = this.readyPlayer.bind(this);
    this.playInit = this.playInit.bind(this);
    this.renderBlock = this.renderBlock.bind(this);
    this.initEditMode = this.initEditMode.bind(this);
    this.playerTimeCheck = this.playerTimeCheck.bind(this);

    this.saveQuestions = this.saveQuestions.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this);

  }

  /**
   * Video Player Ready Callback
   * 
   * @param e
   */
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

  /**
   * Video Play Callback
   * 
   * @param e
   */
  playInit( e ) {
    const player = e.target;

    this.playerInterval = setInterval((player) => {
      this.playerTimeCheck( player );
    }, 1000, player );
  }

  /**
   * Interval Player Time Check
   *
   * Interval = this.playerInterval
   *
   * @param player
   */
  playerTimeCheck( player ) {
    let currentTime = parseInt( player.getCurrentTime() );
    const { pause_times } = this.state;

    let isPauseTime = pause_times.indexOf( currentTime );
    let pause = ( -1 !== isPauseTime );

    if ( pause && 'undefined' === typeof this.state.correct_answers[ isPauseTime ] ) {
      this.initPauseNAsk( pause_times.indexOf( currentTime ) );
    } else if ( pause && this.state.correct_answers[ isPauseTime ] ) {
      console.log( 'Question ' + isPauseTime + ' answered' );
    }

  }

  /**
   * Pause and Ask Question Init
   * 
   * @param question_key
   */
  initPauseNAsk( question_key ) {
    const { attributes } = this.props;
    const { questions } = attributes;
    const question = questions[ question_key ];

    if ( this.state.edit_mode ) {
      this.setState({
        edit_mode: false,
        edit_question: false,
        edit_question_key: false
      });
    }

    if ( 'multiple_text' === question.question_type && ! question.options.length ) {
      console.log( 'QUESTION ERROR: no options' );
      return;
    }

    this.setState({
      paused_question: question,
      paused_question_key: question_key,
    }, () => {
      if ( this.state.player ) {
        this.state.player.seekTo( question.seconds, true );
        this.state.player.pauseVideo();
      }
    });

  }

  /**
   * Edit Mode Init
   * 
   * @param key
   */
  initEditMode( key ) {
    const { attributes } = this.props;
    const { questions } = attributes;

    this.setState({
      edit_mode: true,
      edit_question: questions[key],
      edit_question_key: key
    });
  }

  /**
   * Save all questions
   * 
   * @param questions
   */
  saveQuestions( questions ) {
    const { setAttributes } = this.props;

    setAttributes({
      questions: questions
    });

    this.setState({
      questions: questions
    });
  }

  /**
   * Add New Question
   * 
   * @param e
   */
  addQuestion( e ) {
    const { attributes, setAttributes } = this.props;
    let { questions } = attributes;

    if ( ! questions ) {
      questions = [];
    }

    questions.push({
      seconds: false,
      question: '',
      question_type: 'text',
      options: [],
      correct_answer: ''
    });

    this.saveQuestions( questions );

    this.initEditMode( questions.length - 1 );

  }

  /**
   * Delete Question
   * 
   * @param key
   * @returns {boolean}
   */
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

  /**
   * Update Question Field
   * 
   * @param e - value
   * @param key - index of question to edit
   * @param field - which field to update
   */
  updateQuestionField( e, key, field ) {
    const { attributes } = this.props;
    let { questions } = attributes;

    questions[key][field] = e;
    this.saveQuestions( questions );
  }

  /**
   * Callback from YouTubePausedQuestion
   *
   * @param correct
   */
  answerQuestion( correct ) {
    let { correct_answers, paused_question_key, paused_question } = this.state;
    const { attributes, setAttributes } = this.props;
    let { questions } = attributes;

    // Push correct boolean
    correct_answers[ paused_question_key ] = correct;

    this.setState({
      correct_answers: correct_answers,
      paused_question: false,
      paused_question_key: false
    }, () => {
      if ( this.state.correct_answers.length === questions.length ) {
        // Completed Quiz
        this.setState({
          quiz_complete: true
        });
      }

      // play video
      this.state.player.playVideo();
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
   * Save Block Level Data
   *
   * @param e
   * @param key
   */
  saveBlockData( e, key ) {
    let data = {};
    data[key] = e;
    this.props.setAttributes( data );
    this.setState( data );
  }


  /**
   * Render Main Gutes Block
   *
   * @returns {*}
   */
  renderBlock() {
    const { attributes } = this.props;
    let active_question;

    // No Youtube ID set
    if ( ! attributes.youtube_id ) {
      return(
        <div>
          <p>
            No Youtube Video ID set - add the ID on the right.
          </p>
        </div>
      )
    }

    // Paused Question
    if ( false !== this.state.paused_question ) {
      active_question = <YouTubePausedQuestion
        question={ this.state.paused_question }
        onAnswer={ this.answerQuestion }
      />;
    }

    // Quiz Completed
    if ( this.state.quiz_complete ) {
      let result = ( this.countInArray( this.state.correct_answers, true ) / attributes.questions.length ) * 100;
      active_question = 'Quiz Complete You Got ' + result + '%';
    }

    if ( ! this.state.edit_mode ) {
      // Youtube Player
      return (
        <div id={'youtube-wrapper'}>
          { active_question }
          <YouTube
            videoId={ this.state.youtube_id }
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
              onChange={ (e) => this.updateQuestionField( e, key, 'question' ) }
            />
          </div>
          <div>
            <TextControl
              label={ __( 'Seconds' ) }
              value={ question.seconds ? question.seconds : '' }
              onChange={ (e) => this.updateQuestionField( e, key, 'seconds' ) }
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
              onChange={ (e) => this.updateQuestionField( e, key, 'question_type' )}
            />
          </div>
          <div>
            <YoutubeQuestionOptions
              options={ question.options }
              questionType={ question.question_type }
              correctAnswer={ question.correct_answer }
              onOptionsChange={ (e) => this.updateQuestionField( e, key, 'options' ) }
              onCorrectAnswerChange={ (e) => this.updateQuestionField( e, key, 'correct_answer' ) }
            />
          </div>
          <hr/>
          <span className={'button'} onClick={ (e) => { this.setState({ edit_mode: false, edit_question: false, edit_question_key: false, paused_question: false } ) } }>close</span>
        </div>
      )
    }
  }

  render() {
    const { attributes, setAttributes } = this.props;

    if ( ! attributes.questions || ! attributes.questions instanceof Array ) {
      attributes.questions = [];
    }

    return(
      <div>
        <h2>Youtube Pause & Ask</h2>

        { this.renderBlock() }
        <div id={'inspector'}>
          <Fragment>
            <InspectorControls>
              <RadioControl
                label={ __( 'Autoplay?' ) }
                options={[
                  {
                    value: 'false',
                    label: __( 'No' )
                  },
                  {
                    value: 'true',
                    label: __( 'Yes' )
                  }
                ]}
                selected={ this.state.autoplay }
                onChange={ (e) => { this.saveBlockData( e, 'autoplay' ) } }
              />
              <TextControl
                label={ __( 'Youtube Video ID' ) }
                value={ this.state.youtube_id }
                onChange={ (e) => { this.saveBlockData( e, 'youtube_id' ) } }
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
                      <span className={'button'} onClick={ (e) => this.initPauseNAsk( key ) }>view</span>
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