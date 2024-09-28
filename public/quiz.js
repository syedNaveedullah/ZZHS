// Helper function to generate detailed result feedback for each question
function generateResultHTML(
  score,
  totalQuestions,
  userAnswers,
  correctAnswers
) {
  let resultHTML = `<h3>You got ${score} out of ${totalQuestions} correct!</h3>`;

  // Display correct/incorrect for each question
  for (let i = 1; i <= totalQuestions; i++) {
    const userAnswer = userAnswers[`q${i}`] || "No Answer";
    const correctAnswer = correctAnswers[`q${i}`];
    const isCorrect = userAnswer === correctAnswer ? "Correct" : `Incorrect`;

    resultHTML += `<p>Question ${i}: ${isCorrect}</p>`;
  }

  return resultHTML;
}

// Function to show congratulations message and detailed feedback
function showCongratulations(
  score,
  totalQuestions,
  userAnswers,
  correctAnswers
) {
  const resultsDiv = document.getElementById("quiz-results");

  // Display the congratulatory message
  let resultHTML = `
        <h3>Congratulations! You answered all the questions correctly!</h3>
        <p>Your score is ${score} out of ${totalQuestions}.</p>
    `;

  // Append detailed feedback using the helper function
  resultHTML += generateResultHTML(
    score,
    totalQuestions,
    userAnswers,
    correctAnswers
  );

  resultsDiv.innerHTML = resultHTML;
}

function submitQuiz() {
  const form = document.getElementById("quiz-form");
  let score = 0;
  let totalQuestions = document.querySelectorAll(".question").length;

  let userAnswers = {};
  let allCorrect = true; // Initialize flag to true, assuming all answers are correct

  // Get all user answers dynamically
  for (let i = 1; i <= totalQuestions; i++) {
    const answer = form[`q${i}`].value;
    userAnswers[`q${i}`] = answer;

    // Check if the answer is correct
    if (answer === correctAnswers[`q${i}`]) {
      score++;
    } else {
      allCorrect = false; // If any answer is wrong, set allCorrect to false
    }
  }

  // If all answers are correct, show congratulations message + detailed feedback
  if (allCorrect) {
    showCongratulations(score, totalQuestions, userAnswers, correctAnswers);
  } else {
    // Show detailed results if not all answers are correct
    const resultsDiv = document.getElementById("quiz-results");
    resultsDiv.innerHTML = generateResultHTML(
      score,
      totalQuestions,
      userAnswers,
      correctAnswers
    );
  }
}
