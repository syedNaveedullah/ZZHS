// Helper function to generate detailed result feedback for each question
function generateResultHTML(
  score,
  totalQuestions,
  userAnswers,
  correctAnswers
) {
  let resultHTML = `<h1>Result</h1> <h3 class="mb-3">You got ${score} out of ${totalQuestions} correct!</h3>`;

  // Display correct/incorrect for each question
  for (let i = 1; i <= totalQuestions; i++) {
    const userAnswer = userAnswers[`q${i}`] || "No Answer";
    const correctAnswer = correctAnswers[`q${i}`];
    const isCorrect = userAnswer === correctAnswer ? "Correct" : `Incorrect`;

    // Bootstrap alert for correct/incorrect answers
    resultHTML += `
      <div class="alert ${
        isCorrect === "Correct" ? "alert-success" : "alert-danger"
      }">
        Question ${i}: ${isCorrect}
      </div>`;
  }

  // Scroll down a bit to show the results
  setTimeout(() => {
    window.scrollBy({
      top: 500, // Adjust this value as needed (pixels)
      behavior: "smooth", // Smooth scrolling effect
    });
  }, 100); // Delay ensures content is loaded before scrolling

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
  const quizContainer = document.querySelector(".quiz-container");
  const congratsSound = document.getElementById("congrats-sound");

  // Add a blur effect to the quiz container (but not the overlay)
  quizContainer.classList.add("blur");

  // Display the congratulatory message in front
  let resultHTML = `
    <div class="congrats-overlay">
      <div>
        <img src="/pictures/success.gif" alt="success image" hight="500px" width="500px">
        <h2 class="text-success">🎉 Congratulations! 🎉</h2>
        <p>You answered all the questions correctly!</p>
        <p>Your score is <strong>${score} out of ${totalQuestions}</strong>.</p>
        <h2 class="text-success">Proceed to Next Chapter➡️</h2>
      </div>
    </div>
  `;

  // Append detailed feedback using the helper function
  resultHTML += generateResultHTML(
    score,
    totalQuestions,
    userAnswers,
    correctAnswers
  );

  resultsDiv.innerHTML = resultHTML;

  // Play the congratulatory sound
  congratsSound.play();
  // Automatically hide the congratulations overlay and blur effect after 5 seconds
  setTimeout(() => {
    quizContainer.classList.remove("blur");
    const overlay = document.querySelector(".congrats-overlay");
    if (overlay) {
      overlay.remove();
    }
  }, 5000); // 5 seconds
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
    // storing test id to DB
    addVidIDtoDB();
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

// adding test id to DB
let testID = testNum; //ID to store in DB
let subjectName = subject;
// console.log(subject);
// console.log(testNum);

// =====================ADDING video ID to Data Base===========================================
function addVidIDtoDB() {
  // Use the fetch API to call the server route for updating the subject array
  fetch(`/courses/10th/${subjectName}/${testID}/pushingSub`, {
    method: "POST", // Assuming this is a GET request, based on your route
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    })
    .catch((error) => {
      console.error("Error in adding video ID to DB:", error);
    });
}
