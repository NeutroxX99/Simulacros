import { useEffect, useState } from "react";
import { quizCategories } from "./data/quizCategories";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Clonar y mezclar sin perder datos
const shuffleArray = (array) => {
  return [...array].map(item => ({ ...item })).sort(() => Math.random() - 0.5);
};

const Quiz = () => {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showNext, setShowNext] = useState(false);
  const [nota, setNota] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (questions.length > 0) {
      setNota((score / questions.length) * 10);
    } else {
      setNota(0);
    }
  }, [score, questions]);

  const startQuiz = () => {
    const selectedCategory = "cuestionarios";
    const allQuestions = quizCategories[selectedCategory];

    const shuffledAll = shuffleArray(allQuestions);
    const finalQuestions = shuffledAll.slice(0, 40);

    setCategory(selectedCategory);
    setQuestions(finalQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback(null);
    setShowNext(false);
    setAnswered(false);
    setSelectedOption(null);

    // Clonar opciones y mezclarlas para evitar perder isCorrect
    const shuffledOptions = shuffleArray([...finalQuestions[0].options]);
    setShuffledOptions(shuffledOptions);
  };

  const handleAnswerClick = (option) => {
    if (answered) return;

    setSelectedOption(option);
    setAnswered(true);
    setShowNext(true);

    if (option.isCorrect === true) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("¡Correcto! 🎉");
    } else {
      setFeedback("Incorrecto ❌");
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);

      // Mezclar opciones sin perder la propiedad isCorrect
      const shuffledOptions = shuffleArray([...questions[nextQuestion].options]);
      setShuffledOptions(shuffledOptions);

      setAnswered(false);
      setSelectedOption(null);
      setFeedback(null);
      setShowNext(false);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="p-6 xl:max-w-[80%] max-w-[95%] mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      <Analytics />
      <SpeedInsights />
      {!category ? (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          onClick={startQuiz}
        >
          Cuestionarios
        </button>
      ) : showScore ? (
        <div>
          <h2 className="text-xl font-bold text-green-600">Tu puntuación: {score} / {questions.length}</h2>
          <h2 className="text-xl font-bold text-green-600">Tu nota: {nota.toFixed(2)}</h2>
        </div>
      ) : (
        <div>
          <h2 className="md:text-lg text-md font-semibold text-gray-700">{questions[currentQuestion]?.question}</h2>
          <div className="mt-4 space-y-4">
            {shuffledOptions.map((option, index) => (
              <button
                key={index}
                disabled={answered}
                onClick={() => handleAnswerClick(option)}
                className={`block w-full p-2 rounded cursor-pointer 
                  ${selectedOption === option 
                    ? option.isCorrect 
                      ? "bg-green-400 text-white" 
                      : "bg-red-400 text-white" 
                    : "bg-gray-100 hover:bg-gray-300"}`}
              >
                {option.text}
              </button>
            ))}
          </div>
          {feedback && <p className="mt-2 font-semibold">{feedback}</p>}
          {showNext && (
            <button 
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
              onClick={handleNextQuestion}
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
