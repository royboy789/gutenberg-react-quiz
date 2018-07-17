# Gutenberg React Quiz Plugin
Gutenberg based Quiz Plugin. Use Gutenberg to build your quiz, use Gutenberg ot display your quiz.
  
__React__ powers it all.

### Overview
There is currently 2 React Apps. 
- 1 is Gutenberg, so `gutes-dev` and `gutes-build` build and run those React components
- 2 is the QuizApp React App which runs on the front end.

## Installation
* Clone
* Run `npm run build`
* Run `npm run gutes-build` 

__REQUIRES__
- Gutenberg
- [My Gutenberg Object Plugin](https://github.com/royboy789/gutenberg-object-plugin/)

## Instructions
* Creating a new Quiz (CPT)
* Use Gutenberg to add questions 
* Go to a post or page running Gutenberg, use the Quiz Block to add the quiz

## Question Types
- Multiple Choice - text choices

# TODO
I have not finished the quiz front end. Once a user completes every question, it shoudl take them to a "completed" screen with the % correct

### Question Types To Add
- Video Embed w/ multiple choice
- Multiple Choice - each choice an image
- Text - with supporting "correct answers" array
- Textarea