import edit from './edit';
import ReactDOM from "react-dom";

export const name = 'react-quiz-blocks/quiz-block';

export const settings = {
  title: 'Quiz',
  category: 'common',
  attributes: {
    quiz_id: {
      type: 'integer',
      default: 0
    },
  },
  edit,
  save( props ){
    const { attributes } = props;
    return(
      <div id={'react-quiz-wrapper'} data-quiz={attributes.quiz_id}>{attributes.quiz_id}</div>
    )
  }
};