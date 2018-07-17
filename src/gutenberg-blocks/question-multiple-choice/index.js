import edit from './edit';

export const name = 'react-quiz-blocks/question-multiple-choice';

export const settings = {
  title: 'Quiz Q - Multiple Choice',
  category: 'common',
  attributes: {
    question: {
      type: 'string'
    },
    hint: {
      type: 'string'
    },
    options: {},
    correct_answer: {
      type: 'string'
    },
  },
  edit,
  save(){ return; }
};