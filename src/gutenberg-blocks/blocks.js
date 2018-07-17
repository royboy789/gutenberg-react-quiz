import * as quizBlock from './quiz-block';

import * as questionMultipleChoice from './question-multiple-choice';

const { registerBlockType, setDefaultBlockName } = wp.blocks;

[
  questionMultipleChoice,
  quizBlock
].forEach(({name, settings}) => {

  registerBlockType( name, settings );
});