import EditOptions from './../components/editOptions';

const { Fragment, Component } = wp.element;
const { SelectControl, BaseControl, ToggleControl, TextControl, RadioControl } = wp.components;
const { InspectorControls, MediaUpload } = wp.editor;
const { __ } = wp.i18n;

export default class QuestionMultipleChoiceEdit extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      options: props.options
    };

    this.addOption = this.addOption.bind(this);
    this.changeVal = this.changeVal.bind(this);
  }

  addOption() {
    const { setAttributes, attributes } = this.props;
    let { options } = attributes;

    if ( ! options ) {
      options = [];
    }

    options.push({
      label: '',
      value: '',
    });

    setAttributes({
      options: options
    });

    this.setState({ options: options });
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
                  options={attributes.options}
                  onChange={ (e) => this.changeVal( e, 'options') }
                />
                <span className={"btn button"} onClick={this.addOption}>+ Option</span>
              </div>
              <div>
                <RadioControl
                  label={ 'Correct Answer' }
                  selected={ attributes.correct_answer }
                  options={ attributes.options }
                  onChange={ (e) => this.changeVal( e, 'correct_answer' ) }
                />
              </div>
            </InspectorControls>
          </Fragment>
        </div>
      </div>
    );
  }
}