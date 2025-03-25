export const jsQuizz = {
    questions: [
      {
        question:
          "______ provide a way to pass data from one component to the other.",
        isOpen: true,
        correctAnswer: "props",
      },
      {
        question:
          "Which of the following is used in React.js to increase performance?",
        choices: [
          "Virtual DOM",
          "Original DOM",
          "Both A and B",
          "None of the above",
        ],
        isOpen: false,
        correctAnswer: "Virtual DOM",
      },
      {
        question: "What is ReactJS?",
        choices: [
          "Server-side framework",
          "User Interface framework",
          "both a and b",
          "None of the above",
        ],
        isOpen: false,
        correctAnswer: "User Interface framework",
      },
      {
        question:
          "Identify the one which is used to pass data to components from outside",
        choices: ["Render with arguments", "setState", "PropTypes", "props"],
        isOpen: false,
        correctAnswer: "props",
      },
      {
        question: "In which language is React.js written?",
        choices: ["Python", "Java", "C#", "JavaScript"],
        isOpen: false,
        correctAnswer: "JavaScript",
      },
      {
        question: "What is Babel?",
        choices: [
          "JavaScript interpreter",
          "JavaScript transpiler",
          "JavaScript compiler",
          "None of the above",
        ],
        isOpen: false,
        correctAnswer: "JavaScript compiler",
      },
    ],
  };

export const resultInitialState = {
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0
}