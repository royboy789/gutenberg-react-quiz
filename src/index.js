import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import QuizApp from './QuizApp';
import registerServiceWorker from './registerServiceWorker';


const AppInit = ( props ) => {
  return(
    <QuizApp
      quizid={props.quiz}
    />
  )
};
const root = document.getElementById('react-quiz-wrapper');

ReactDOM.render(<AppInit {...(root.dataset)} />, root);
registerServiceWorker();
