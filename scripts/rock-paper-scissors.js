// Initialize the score by retrieving it from localStorage or using default values
let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

// Update the score display on the page
updateScoreElement();

// Initialize the auto-playing state and interval ID
let isAutoPlaying = false;
let intervalId;

// Function to handle auto-play
function autoPlay() {
  if (!isAutoPlaying) {
    // Start auto-play by repeatedly choosing a random move for the player
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    
    // Update the text of the auto-play button
    document.querySelector('.js-auto-play-button')
      .innerHTML = 'Stop Playing';

  } else {
    // Stop auto-play by clearing the interval
    clearInterval(intervalId);
    isAutoPlaying = false;

    // Update the text of the auto-play button
    document.querySelector('.js-auto-play-button')
      .innerHTML = 'Auto Play';
  }
}

// Event listener for the auto-play button
document.querySelector('.js-auto-play-button')
  .addEventListener('click', () => {
    autoPlay();
  });

// Event listeners for the buttons that correspond to player moves
document.querySelector('.js-rock-button')
  .addEventListener('click', () => {
    playGame('rock');
  });

document.querySelector('.js-paper-button')
  .addEventListener('click', () => {
    playGame('paper');
  });

document.querySelector('.js-scissors-button')
  .addEventListener('click', () => {
    playGame('scissors');
  });

// Event listener for keyboard input
document.body.addEventListener('keydown', (event) => {
  if (event.key === 'r') {
    playGame('rock');
  } else if (event.key === 'p') {
    playGame('paper');
  } else if (event.key === 's') {
    playGame('scissors');
  } else if (event.key === 'a') {
    autoPlay(); // Toggle auto-play when 'a' key is pressed
  } else if (event.key === 'Backspace') {
    // resetScore(); // Uncomment this line to reset the score immediately
    showResetConfirmation(); // Show reset confirmation when 'Backspace' key is pressed
  }
});

// Function to play a round of the game
function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = '';

  if (playerMove === 'scissors') {
    if (computerMove === 'rock') {
      result = 'You lose.';
    } else if (computerMove === 'paper') {
      result = 'You win.';
    } else if (computerMove === 'scissors') {
      result = 'Tie.';
    }

  } else if (playerMove === 'paper') {
    if (computerMove === 'rock') {
      result = 'You win.';
    } else if (computerMove === 'paper') {
      result = 'Tie.';
    } else if (computerMove === 'scissors') {
      result = 'You lose.';
    }
    
  } else if (playerMove === 'rock') {
    if (computerMove === 'rock') {
      result = 'Tie.';
    } else if (computerMove === 'paper') {
      result = 'You lose.';
    } else if (computerMove === 'scissors') {
      result = 'You win.';
    }
  }

  // Update the score based on the game result
  if (result === 'You win.') {
    score.wins += 1;
  } else if (result === 'You lose.') {
    score.losses += 1;
  } else if (result === 'Tie.') {
    score.ties += 1;
  }

  // Store the updated score in localStorage
  localStorage.setItem('score', JSON.stringify(score));

  // Update the score display on the page
  updateScoreElement();

  // Display the game result and moves
  document.querySelector('.js-result').innerHTML = result;

  document.querySelector('.js-moves').innerHTML = `You
<img src="images/${playerMove}-emoji.png" class="move-icon">
<img src="images/${computerMove}-emoji.png" class="move-icon">
Computer`;

  // Auto-play logic
  if (isAutoPlaying) {
    setTimeout(() => {
      playGame(pickComputerMove());
    }, 1000);
  }
}

// Function to update the score displayed on the page
function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

// Function to pick a random move for the computer
function pickComputerMove() {
  const randomNumber = Math.random();

  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  return computerMove;
}

// Function to reset the score to zero
function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score'); // Remove score from localStorage
  updateScoreElement();
}

// Event listener for the reset button
document.querySelector('.js-reset-score-button')
  .addEventListener('click', () => {
    // resetScore(); // Uncomment this line to reset the score immediately
    showResetConfirmation(); // Show reset confirmation when reset button is clicked
  });

// Function to display the reset confirmation message
function showResetConfirmation() {
  document.querySelector('.js-reset-confirmation')
    .innerHTML = `
      Are you sure you want to reset the score?
      <button class="js-reset-confirm-yes reset-confirm-button">
        Yes
      </button>
      <button class="js-reset-confirm-no reset-confirm-button">
        No
      </button>
    `;
  
  // Event listener for the "Yes" button in the reset confirmation
  document.querySelector('.js-reset-confirm-yes')
    .addEventListener('click', () => {
      resetScore(); // Reset the score when "Yes" is clicked
      hideResetConfirmation(); // Hide the reset confirmation message
    });
  
  // Event listener for the "No" button in the reset confirmation
  document.querySelector('.js-reset-confirm-no')
    .addEventListener('click', () => {
      hideResetConfirmation(); // Hide the reset confirmation message without resetting
    });
}

// Function to hide the reset confirmation message
function hideResetConfirmation() {
  document.querySelector('.js-reset-confirmation')
    .innerHTML = '';
}
