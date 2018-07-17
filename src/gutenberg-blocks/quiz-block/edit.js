const { Fragment, Component } = wp.element;
const { SelectControl, BaseControl, ToggleControl, TextControl, RadioControl } = wp.components;
const { InspectorControls, MediaUpload } = wp.editor;
const { __ } = wp.i18n;

export default class QuizBlockEdit extends Component {

  constructor( props ){
    super( props );

    this.state = {
      quizzes: [
        {
          label: 'Select Quiz',
          value: '-1',
        }
      ]
    };

    this.setQuiz = this.setQuiz.bind(this);
    this.loadQuizzes = this.loadQuizzes.bind(this);
    this.loadQuizzes();
  }

  loadQuizzes() {
    const self = this;
    let quizzes = self.state.quizzes;
    wp.apiRequest( {
      path: '/wp/v2/quiz',
      method: 'GET',
    } ).then(function(res){
      res.forEach((post) => {
        quizzes.push({
          value: post.id,
          label: post.title.rendered
        });
      });

      self.setState({
        quizzes: quizzes
      });

    }, function(err) {
      console.log( err );
    });
  }

  setQuiz(e) {
    const { setAttributes, attributes } = this.props;
    console.log( 'changing quiz: ', e );
    setAttributes({
      quiz_id: e
    })
  }

  render() {
    const { attributes } = this.props;
    return(
      <div>
        <SelectControl
          label={ __( 'Select Quiz' ) }
          value={ attributes.quiz_id }
          options={ this.state.quizzes }
          onChange={ this.setQuiz }
        />
      </div>
    )
  }

}