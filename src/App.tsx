import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';
// Types
import { QuestionState, Difficulty } from './API';
// Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [questNumber, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // users answer
      const answer = e.currentTarget.value;
      // check answer against correct answer
      const correct = questions[questNumber].correct_answer === answer;
      // increment score if correct
      if (correct) setScore((prev) => prev + 1);
      // save answer in array for user answers
      const answerObject = {
        question: questions[questNumber].question,
        answer,
        correct,
        correctAnswer: questions[questNumber].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // move to next question if not last question
    const nextQuestion = questNumber + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>QUIZZICAL</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className='start' onClick={startQuiz}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className='score'>Score: {score}</p> : null}
        {loading && <p>Loading Questions...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={questNumber + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[questNumber].question}
            answers={questions[questNumber].answers}
            userAnswer={userAnswers ? userAnswers[questNumber] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === questNumber + 1 &&
        questNumber !== TOTAL_QUESTIONS - 1 ? (
          <button className='next' onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
