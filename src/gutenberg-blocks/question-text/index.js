import edit from './edit';

export const name = 'react-quiz-blocks/question-text';

export const settings = {
  title: 'Quiz Q - Text',
  category: 'common',
  attributes: {
    question: {
      type: 'string'
    },
    hint: {
      type: 'string'
    },
    possible_answers: {},
  },
  edit,
  save(){ return; }
};