// Local Mock API Data Array (Simulates an external DB fetch)
const mockQuizData = [
    {
        id: 1,
        question: "Which of the following is NOT a primitive data type in JavaScript?",
        options: ["String", "Number", "Array", "Boolean"],
        correct: 2
    },
    {
        id: 2,
        question: "In Python, which keyword is used to initialize an object constructor method?",
        options: ["__init__", "constructor", "def", "this"],
        correct: 0
    },
    {
        id: 3,
        question: "Which SQL clause is used to filter data groups aggregate functions?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correct: 1
    },
    {
        id: 4,
        question: "What is the time complexity of looking up a key in a well-distributed Hash Table/Python Dictionary?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correct: 0
    },
    {
        id: 5,
        question: "Which HTML5 element is used to embed independent, self-contained content?",
        options: ["<section>", "<div>", "<article>", "<aside>"],
        correct: 2
    }
];

// Application State Tracking
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

// DOM Element Selectors
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionNumberTxt = document.getElementById('question-number');
const questionTxt = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');

const finalScoreTxt = document.getElementById('final-score');
const totalQuestionsTxt = document.getElementById('total-questions');
const feedbackTxt = document.getElementById('feedback-text');

// Event Listeners
startBtn.addEventListener('click', initQuiz);
nextBtn.addEventListener('click', handleNextQuestion);
restartBtn.addEventListener('click', resetQuiz);

// Step 1: Simulated API Fetch Operations using Promises
function fetchQuizQuestions() {
    return new Promise((resolve) => {
        // Simulating network latency
        setTimeout(() => {
            resolve(mockQuizData);
        }, 400);
    });
}

// Step 2: Initialize Quiz State
async function initQuiz() {
    startBtn.disabled = true;
    startBtn.textContent = "Loading...";
    
    try {
        currentQuestions = await fetchQuizQuestions();
        switchScreen(startScreen, questionScreen);
        loadQuestion();
    } catch (error) {
        console.error("Failed to load questions:", error);
        startBtn.textContent = "Error Loading. Try Again.";
        startBtn.disabled = false;
    }
}

// Step 3: Dynamic DOM Generation for Questions
function loadQuestion() {
    hasAnswered = false;
    nextBtn.disabled = true;
    optionsContainer.innerHTML = '';

    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    // UI Metadata Rendering
    questionNumberTxt.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    questionTxt.textContent = currentQuestion.question;
    
    // Progress bar math representation
    const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Dynamic Option Node Generation
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => handleOptionSelection(index, button));
        optionsContainer.appendChild(button);
    });
}

// Step 4: Input Validation & Score Evaluation Logic
function handleOptionSelection(selectedIndex, selectedButton) {
    if (hasAnswered) return; // Prevent multiple clicks
    hasAnswered = true;
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    
    // Disable all options post-click
    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentQuestion.correct) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('incorrect');
        // Highlight the correct answer for clarity
        optionButtons[currentQuestion.correct].classList.add('correct');
    }
    
    nextBtn.disabled = false;
}

// Step 5: Advanced State Transitions & Pipeline Routing
function handleNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Step 6: Render Results Dashboard & Analytics
function showResults() {
    progressBar.style.width = '100%';
    switchScreen(questionScreen, resultScreen);
    
    finalScoreTxt.textContent = score;
    totalQuestionsTxt.textContent = currentQuestions.length;
    
    // Dynamic Performance Content Strategy
    const percentage = (score / currentQuestions.length) * 100;
    if (percentage === 100) {
        feedbackTxt.textContent = "Outstanding! Perfect domain knowledge displayed.";
    } else if (percentage >= 70) {
        feedbackTxt.textContent = "Great job! Strong structural understanding.";
    } else {
        feedbackTxt.textContent = "Good try! Consider reviewing software architecture concepts.";
    }
}

// Helper Utilities
function switchScreen(hideScreen, showScreen) {
    hideScreen.classList.remove('active');
    showScreen.classList.add('active');
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    startBtn.textContent = "Start Quiz";
    startBtn.disabled = false;
    switchScreen(resultScreen, startScreen);
    progressBar.style.width = '0%';
}