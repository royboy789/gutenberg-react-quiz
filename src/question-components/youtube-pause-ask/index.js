import React, { Component } from 'react';
import YouTube from 'react-youtube';

import YouTubePausedQuestion from './../../shared-components/question-youtube/paused-question';

// var wp = window.wp;
// const { TextControl, RadioControl } = wp.components;
// const { __ } = wp.i18n;

export default class QuestionYoutubePauseAsk extends Component {

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
      correct_answers: [],
      quiz_complete: false
    };


    this.readyPlayer = this.readyPlayer.bind(this);
    this.playInit = this.playInit.bind(this);
    this.renderBlock = this.renderBlock.bind(this);
    this.playerTimeCheck = this.playerTimeCheck.bind(this);
    this.answerQuestion = this.answerQuestion.bind(this);

  }

  /**
   * Video Player Ready Callback
   *
   * @param e
   */
  readyPlayer( e ) {
    const attributes = this.props;
    const { questions } = attributes;
    const player = e.target;

    // reset & set
    let pause_times = [];
    questions.map((question, key) => {
      return pause_times.push( parseInt( question.seconds, 0 ) );
    });

    this.setState({
      player: player,
      pause_times: pause_times
    }, () => {
      if ( 'true' === attributes.autoplay ) {
        this.state.player.playVideo();
      }
    });

  }

  /**
   * Video Play Callback
   *
   * @param e
   */
  playInit( e ) {
    const player = e.target;

    if ( ! this.state.quiz_complete ) {
      this.playerInterval = setInterval((player) => {
        this.playerTimeCheck( player );
      }, 1000, player );
    } else if ( this.state.quiz_complete && ! this.state.post_quiz_play ) {
      this.setState({
        post_quiz_play: true
      });
    }
  }

  /**
   * Interval Player Time Check
   *
   * Interval = this.playerInterval
   *
   * @param player
   */
  playerTimeCheck( player ) {
    let currentTime = parseInt( player.getCurrentTime(), 0 );
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
    const attributes = this.props;
    const { questions } = attributes;
    const question = questions[ question_key ];

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
   * Callback from YouTubePausedQuestion
   *
   * @param correct
   */
  answerQuestion( correct ) {
    let { correct_answers, paused_question_key } = this.state;
    const attributes = this.props;
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
      } else {
        // play video
        this.state.player.playVideo();
      }
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
   * Render Main Gutes Block
   *
   * @returns {*}
   */
  renderBlock() {
    const attributes = this.props;
    let active_question;

    // No Youtube ID set
    if ( ! attributes.youtube_id ) {
      return(
        <div>
          <p>
            <strong>Data Error :(</strong>
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
    if ( this.state.quiz_complete && ! this.state.post_quiz_play ) {
      active_question = (
        <div id={ 'youtube-pause-ask-complete' }>
          <p>
            There are no more questions for this video, do you want to:
          </p>
          <p>
            <span className={ 'btn btn-primary'} onClick={ (e) => { this.state.player.playVideo() } }>Continue Watching Video</span>
            <span className={ 'btn btn-primary'} onClick={ (e) => { this.props.nextQuestion( this.state.correct_answers ) } }>Continue Quiz</span>
          </p>
        </div>
      )
    } else if ( this.state.quiz_complete && this.state.post_quiz_play ) {
      active_question = (
        <div id={ 'post-quiz-play' }>
          <span className={ 'btn btn-primary'} onClick={ (e) => { this.props.nextQuestion( this.state.correct_answers ) } }>Skip Forward to Continue Quiz</span>
        </div>
      )
    }

    return (
      <div id={'youtube-wrapper'}>
        { active_question }
        <YouTube
          videoId={ attributes.youtube_id }
          onReady={this.readyPlayer}
          onPlay={this.playInit}
          onPause={ (e) => { clearInterval( this.playerInterval )}}
          onEnd={ (e) => { this.props.nextQuestion( this.state.correct_answers ) } }
        />
      </div>
    )
  }

  render() {
    return(
      <div>
        { this.renderBlock() }
      </div>

    )
  }

}