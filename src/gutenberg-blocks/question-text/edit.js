import EditOptions from './../components/editOptions';

const { Fragment, Component } = wp.element;
const { TextControl } = wp.components;
const { InspectorControls, MediaUpload } = wp.editor;
const { __ } = wp.i18n;

export default class QuestionText extends Component {

  constructor( props ) {
    super( props );
    this.state = props;

    this.addAnswer = this.addAnswer.bind(this);
    this.changeVal = this.changeVal.bind(this);
  }

  addAnswer() {
    const { setAttributes, attributes } = this.props;
    let { possible_answers } = attributes;

    if ( ! possible_answers ) {
      possible_answers = [];
    }

    possible_answers.push({
      value: '',
    });

    setAttributes({
      possible_answers: possible_answers
    });

    this.setState({ possible_answers: possible_answers });
  }

  changeVal( event, attr ) {
    const { setAttributes, attributes } = this.props;

    let data = {};
    data[attr] = event;

    setAttributes( data );
    this.setState( data );
  };

  render() {
    const { attributes } = this.props;

    return(
      <div>
        <div>
          { attributes.question ? <h3>{ attributes.question }</h3> : 'Question options are set to the right' }
          { attributes.hint ? <em>{ attributes.hint }</em> : '' }
        </div>
        <div id={'inspector'}>
          <Fragment>
            <InspectorControls>
              <div>
                <TextControl
                  label={__( 'Question' ) }
                  onChange={ (e) => this.changeVal( e, 'question' ) }
                  value={ attributes.question }
                />
              </div>
              <div>
                <TextControl
                  label={__( 'Hint' ) }
                  onChange={ (e) => this.changeVal( e, 'hint' ) }
                  value={ attributes.hint }
                />
              </div>
              <div>
                <EditOptions
                  options={ attributes.possible_answers }
                  onChange={ (e) => this.changeVal( e, 'possible_answers' ) }
                />
                <span className="btn button" onClick={this.addAnswer}>+ Possible Answer</span>
              </div>
            </InspectorControls>
          </Fragment>
        </div>
      </div>
    )
  }

}