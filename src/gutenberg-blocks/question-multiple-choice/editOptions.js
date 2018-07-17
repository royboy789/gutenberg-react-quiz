const { Fragment, Component } = wp.element;

const { TextControl } = wp.components;

export default class EditOptions extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      options: this.props.options
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ( prevProps.options !== this.state.options ) {
      this.setState({
        options: prevProps.options
      })
    }
  }

  changeLabel( e, key ) {
    let options = this.state.options;
    options[key].label = e;
    options[key].value = e.replace( ' ', '_' );
    options[key].value = options[key].value.toLowerCase();
    this.setState({ options: options });
    this.props.onChange( this.state.options );
  }

  render() {
    if ( ! this.state.options || ! this.state.options.length ) {
      return false;
    }
    return (
      <div>
        <h3>Edit Options</h3>
        {this.state.options.map((option, key) => {
            return (
              <div>
                <div>
                  <TextControl
                    label={ 'Option ' + ( key + 1 ) }
                    value={ option.label }
                    onChange={ (e) => this.changeLabel( e, key ) }
                  />
                </div>
              </div>
            )
        })}
      </div>
    )
  }


}