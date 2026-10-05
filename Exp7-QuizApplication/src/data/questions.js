/**
 * Quiz Questions Data
 * Each question has: question text, four options, and the correct answer.
 * Edit or expand this array to customize the quiz.
 */
const questions = [
  {
    id: 1,
    question: "Which hook is used to manage state in a React functional component?",
    options: ["useEffect", "useContext", "useState", "useRef"],
    answer: "useState",
  },
  {
    id: 2,
    question: "What does JSX stand for in React?",
    options: [
      "JavaScript XML",
      "JavaScript Extension",
      "Java Syntax Extension",
      "JavaScript Execution",
    ],
    answer: "JavaScript XML",
  },
  {
    id: 3,
    question: "Which HTML tag is used to link an external CSS stylesheet?",
    options: ["<style>", "<script>", "<link>", "<css>"],
    answer: "<link>",
  },
  {
    id: 4,
    question: "Which CSS property is used to change the text color of an element?",
    options: ["font-color", "text-color", "color", "foreground-color"],
    answer: "color",
  },
  {
    id: 5,
    question: "What is the correct way to write a JavaScript arrow function?",
    options: [
      "function myFunc() => {}",
      "const myFunc = () => {}",
      "const myFunc => () {}",
      "arrow myFunc() {}",
    ],
    answer: "const myFunc = () => {}",
  },
  {
    id: 6,
    question: "Which React hook is used to perform side effects in a functional component?",
    options: ["useState", "useCallback", "useMemo", "useEffect"],
    answer: "useEffect",
  },
  {
    id: 7,
    question: "What does the 'key' prop do in a React list?",
    options: [
      "Adds keyboard shortcuts",
      "Helps React identify which items changed",
      "Encrypts the list data",
      "Sets the CSS class name",
    ],
    answer: "Helps React identify which items changed",
  },
  {
    id: 8,
    question: "Which JavaScript method is used to add an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()",
  },
  {
    id: 9,
    question: "What does CSS Flexbox's 'justify-content: center' do?",
    options: [
      "Centers items vertically",
      "Centers items horizontally along the main axis",
      "Adds space between items",
      "Aligns items to the baseline",
    ],
    answer: "Centers items horizontally along the main axis",
  },
  {
    id: 10,
    question: "Which HTML5 element is used to define a section of navigation links?",
    options: ["<section>", "<aside>", "<nav>", "<header>"],
    answer: "<nav>",
  },
  {
    id: 11,
    question: "What is the purpose of React's virtual DOM?",
    options: [
      "To store data permanently",
      "To style components automatically",
      "To improve performance by minimizing direct DOM manipulation",
      "To handle HTTP requests",
    ],
    answer: "To improve performance by minimizing direct DOM manipulation",
  },
  {
    id: 12,
    question: "Which JavaScript keyword declares a block-scoped variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    answer: "const",
  },
];

export default questions;
