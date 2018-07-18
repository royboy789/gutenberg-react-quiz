import * as quizBlock from './quiz-block';

import * as questionMultipleChoice from './question-multiple-choice';
import * as questionText from './question-text';

const { registerBlockType, setDefaultBlockName } = wp.blocks;

[
  quizBlock,
  questionMultipleChoice,
  questionText
].forEach(({name, settings}) => {

  registerBlockType( name, settings );
});