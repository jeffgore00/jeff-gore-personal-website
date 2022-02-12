"use strict";

// Test if strict mode is enabled.
// See http://www.larryullman.com/2012/03/28/testing-for-strict-mode-in-javascript-using-this/

function isStrict() {
  return (typeof this == 'undefined');
}



var strictModeOn = isStrict();

////////////////////////////////////
//
// Page header function - page updated
//
////////////////////////////////////

function refreshPageLastUpdated() {
  var lastModified = new Date(document.lastModified);

  if (lastModified.getHours() > 12) {
    var lastModHour = lastModified.getHours() - 12;
    var AMorPM = 'PM';
  } else if (lastModified.getHours() === 0) {
    var lastModHour = lastModified.getHours() + 12;
    var AMorPM = 'AM';
  } else {
    var lastModHour = lastModified.getHours();
    var AMorPM = 'AM';
  }

  var lastModMin = (lastModified.getMinutes() < 10) ? ('0' + lastModified.getMinutes()) : lastModified.getMinutes();

  var lastModDate = (lastModified.getMonth() + 1) + '/' + lastModified.getDate() + '/' + lastModified.getFullYear();

  $("#pageLastModifiedDateTime").html(lastModDate + ' ' + lastModHour + ":" + lastModMin + ' ' + AMorPM);
}

refreshPageLastUpdated();

////////////////////////////////////
//
// Page header - show or hide all answers.
//
////////////////////////////////////

function hideAllAnswers() {
  $("#QAcontainer .answer").hide();
}

function showAllAnswers() {
  $("#QAcontainer .answer").show();
}

function hideRandomAnswer() {
  $("#randomQuestion .answer").hide();
}

function showRandomAnswer() {
  $("#randomQuestion .answer").show();
}

const visitedQuestions = new Set();
visitedQuestions.add(-1)

function getNewRandomQuestion() {
  const questions = document.querySelectorAll("#QAcontainer > li");

  let randomQIdx = -1;
  while (visitedQuestions.has(randomQIdx)) {
    randomQIdx = Math.floor(Math.random() * questions.length)
  }
  const randomQuestion = questions[randomQIdx];
  const questionHTML = randomQuestion.querySelector('.question').innerHTML
  const answerHTML = randomQuestion.querySelector('.answer').innerHTML
  const destinationQ = document.querySelector('#randomQuestion .question')
  const destinationA = document.querySelector('#randomQuestion .answer')
  destinationQ.innerHTML = randomQuestion.querySelector('.question').classList.contains('toComplete') ? '<p class="warning">WARNING: The answer to this question is not yet complete.</p>' + questionHTML : questionHTML;
  destinationA.innerHTML = answerHTML;
  visitedQuestions.add(randomQIdx);
}

$(document).ready(hideAllAnswers);
$(document).ready(hideRandomAnswer);
$("#hideAllAnswers").on("click", hideAllAnswers);
$("#showAllAnswers").on("click", showAllAnswers);
$("#newRandomQuestion").on("click", hideRandomAnswer);
$("#newRandomQuestion").on("click", getNewRandomQuestion);

$(".question").on("click", function () {
  $(this).next().toggle();
});

$(".neutered").on("mousedown", function (e) {
  e.preventDefault();
});