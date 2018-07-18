import edit from './edit';

export const name = 'react-quiz-blocks/question-youtube-pause-ask';

export const settings = {
  title: 'Quiz Q - YouTube Pause & Ask',
  category: 'common',
  attributes: {
    question: {
      type: 'string'
    },
    hint: {
      type: 'string'
    },
    youtube_id : {
      type: 'string',
      required: true
    },
    questions: {},
  },
  edit,
  save(){ return; }
};