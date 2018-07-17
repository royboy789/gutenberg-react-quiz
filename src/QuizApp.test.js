import React from 'react';
import ReactDOM from 'react-dom';
import QuizApp from './QuizApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<QuizApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
