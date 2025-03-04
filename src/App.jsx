import { useEffect, useState } from "react";
import { quizCategories } from "./data/quizCategories";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

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
    const shuffledAll = shuffleArray([...allQuestions]);
    const finalQuestions = shuffledAll.slice(0, 40);

    setCategory(selectedCategory);
    setQuestions(finalQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback(null);
    setShowNext(false);
    setShuffledOptions(shuffleArray([...finalQuestions[0].options]));
    setAnswered(false);
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
                onClick={() => setAnswered(true)}
                className="block w-full bg-gray-100 hover:bg-gray-300 p-2 rounded cursor-pointer"
              >
                {option.text}
              </button>
            ))}
          </div>
          {showNext && (
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer">
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;