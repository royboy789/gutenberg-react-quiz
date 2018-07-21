# Gutenberg React Quiz Plugin
Gutenberg based Quiz Plugin. Use Gutenberg to build your quiz, use Gutenberg to display your quiz.
  
__React__ powers it all.

### Overview
There is currently 2 React Apps. 
* 1 is Gutenberg, so `gutes-dev` and `gutes-build` build and run those React components
* 2 is the QuizApp React App which runs on the front end.

## Installation
* Clone
* Run `composer install`
* Run `npm run build`
* Run `npm run gutes-build` 

__REQUIRES__
* Gutenberg
* [My Gutenberg Object Plugin](https://github.com/royboy789/gutenberg-object-plugin/)

## Instructions
* Creating a new Quiz (CPT)
* Use Gutenberg to add questions 
* Go to a post or page running Gutenberg, use the Quiz Block to add the quiz

## Question Types
* Multiple Choice text choices
* Single Text - you set all the possible _correct_ answers
* "YouTube Pause n' Ask" - embed a video, and pause at second and ask text or multiple choice
  * 

## JavaScript Hooks
There are a number of `wp.hooks` I've implemented, and will be adding more as I go

### Example
```
function my_title( title, quiz_result ) {
    if ( 100 === quiz_result ) {
        return 'PERFECT SCORE!';
    }
}
wp.hooks.addFilter( 'reactQuiz_complete_message_title', 'my_title', 10 );
```

### Filters
__Gutenberg__
* __reactQuiz_gutes_questions__ - array of block data
  * `allBlocks` - array of blocks (questions)

__Quiz App__
* __reactQuiz_load_question_component__ - select which component loads
  * `returnComp` - component to return 
  * `question` - question (block name) being loaded
* __reactQuiz_quiz_final_state__ - runs when quiz is completed
  * `final_state` - object to pass into `setState` on quiz completion
* __reactQuiz_complete_message_title__ - title for complete message
  * `title` - current title
  * `quiz_result` - number representing % of correct answers
* __reactQuiz_complete_message__ - message for complete message
  * `message` - current message
  * `quiz_result` - number representing % of correct answers
  
### Actions
__Quiz App__
* __reactQuiz_complete_react_quiz__ - fires when quiz completed
  * `state` - the whole state of the Quiz App

# TODO

### Question Types To Add
* Video Embed w/ multiple choice
* Multiple Choice - each choice an image
* Textarea
* Flip `Single Text` Question so you put in all _incorrect_ answers

### Extendability
* Add in hook to add more question types (filterable array?)
* Create more actions that run (after question answered, after all questions answered, etc.)
