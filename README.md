# Gutenberg React Quiz Plugin
Gutenberg based Quiz Plugin. Use Gutenberg to build your quiz, use Gutenberg to display your quiz.
  
__React__ powers it all.

### Overview
There is currently 2 React Apps. 
* 1 is Gutenberg, so `gutes-dev` and `gutes-build` build and run those React components
* 2 is the QuizApp React App which runs on the front end.

## Installation
* Clone
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

# TODO

### Extendable "completed" screen
* Filterable title & message args = % correct, array of results

### Question Types To Add
* Video Embed w/ multiple choice
* Multiple Choice - each choice an image
* Textarea
* Flip `Single Text` Question so you put in all _incorrect_ answers

### Possible Quiz Types (taxonomy powered)
* Youtube Embed with quiz, pause at points to ask question. End of video show results (or option to skip to results)

### Extendability
* Add in hook to add more question types (filterable array?)
* Create more actions that run (after question answered, after all questions answered, etc.)
