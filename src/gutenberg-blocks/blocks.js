import * as quizBlock from './quiz-block';

// Question Blocks
import * as questionMultipleChoice from './question-multiple-choice';
import * as questionText from './question-text';
import * as questionYoutube from './question-youtube';

const { registerBlockType } = wp.blocks;

let allBlocks = [ questionText, questionMultipleChoice, questionYoutube ];

allBlocks = wp.hooks.applyFilters( 'reactQuiz_gutes_questions', allBlocks );

allBlocks.push( quizBlock );

allBlocks.forEach(({name, settings}) => {
  registerBlockType( name, settings );
});