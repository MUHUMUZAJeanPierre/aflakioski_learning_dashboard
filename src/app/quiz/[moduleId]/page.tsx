"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import { api } from "../../../middleware/api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedModule } from "../../../redux/slices/dataSlice";

export default function QuizPage({ params: initialParams }) {
  const params = React.use(initialParams);
  const { moduleId } = params;
  const router = useRouter();
  const dispatch = useDispatch();


  const [quiz, setQuiz] = useState(null);
  const [numScore, setNumScore] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [moduleTitle, setModuleTitle] = useState("");
  const [user, setUser] = useState(null);

  const {selectedModule } = useSelector((state) => state.data || {});


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `https://course-back-2-00rq.onrender.com/api/modules/${moduleId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }

        const data = await response.json();
        setQuiz(data.data.quiz);
        setCourseId(data.data.courseId);
        setModuleTitle(data.moduleTitle || "Module Quiz");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again.");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [moduleId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser);
    }
  }, []);

  const handleOptionSelect = (questionId, option) => {
    if (quizSubmitted) return;

    // Check if the question allows multiple answers (based on correctAnswer length)
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isMultipleChoice = currentQuestion.correctAnswer.length > 1;

    if (isMultipleChoice) {
      // For multiple choice, toggle selection
      setSelectedAnswers((prev) => {
        const prevAnswers = prev[questionId] || [];
        if (prevAnswers.includes(option)) {
          return {
            ...prev,
            [questionId]: prevAnswers.filter((ans) => ans !== option),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...prevAnswers, option],
          };
        }
      });
    } else {
      // For single choice, replace selection
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: [option],
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      alert("Quiz data is not available.");
      return;
    }

    let correctCount = 0;
    quiz.questions.forEach((question) => {
      const userAnswers = selectedAnswers[question._id] || [];
      const correctAnswers = question.correctAnswer;

      if (
        userAnswers.length === correctAnswers.length &&
        correctAnswers.every((answer) => userAnswers.includes(answer))
      ) {
        correctCount++;
      }
    });

    setNumScore(correctCount);
    const percentageScore = Math.round(
      (correctCount / quiz.questions.length) * 100
    );
    setScore(percentageScore);
    setQuizSubmitted(true);

    const quizData = {
      userId: user?._id,
      courseId: courseId,
      moduleId,
      score: percentageScore,
    };

    // Post quiz score
    api
      .post("/progress/update-quiz-score", quizData)
      .then((response) => {
        console.log("Quiz score updated:", response.data);

        if (percentageScore >= 80) {
          const completionData = {
            userId: user?._id,
            courseId: courseId,
            moduleId,
          };

          // Post to complete-module endpoint
          api
            .post("/progress/complete-module", completionData)
            .then((res) => console.log("Module completed:", res.data))
            .catch((err) => alert(`Error completing module: ${err.message}`));
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert(`Error updating quiz score: ${error.message}`);
        }
      });
  };

  const isOptionSelected = (questionId, option) => {
    const answers = selectedAnswers[questionId] || [];
    return answers.includes(option);
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === quiz?.questions.length - 1;
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(selectedAnswers).length;
  };

  const getCorrectAnswerStatus = (questionId, option) => {
    if (!quizSubmitted) return null;

    const question = quiz.questions.find((q) => q._id === questionId);
    const userSelectedThis = (selectedAnswers[questionId] || []).includes(
      option
    );
    const isCorrectAnswer = question.correctAnswer.includes(option);

    if (userSelectedThis && isCorrectAnswer) return "correct";
    if (userSelectedThis && !isCorrectAnswer) return "incorrect";
    if (!userSelectedThis && isCorrectAnswer) return "missed";
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <Link
          href="/courses"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No quiz found for this module</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">
            {moduleTitle} - {quiz.title}
          </h1>
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>

        {quizSubmitted ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Quiz Completed!
              </h2>
              <p className="text-green-700">
                Your score: {numScore} out of {quiz.questions.length} ({score}%)
              </p>
            </div>

            <h3 className="font-semibold text-lg mt-6 mb-4">
              Review Your Answers:
            </h3>

            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <div key={question._id} className="border rounded-lg p-4">
                  <p className="font-medium mb-3">
                    {index + 1}. {question.question}
                  </p>

                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const status = getCorrectAnswerStatus(
                        question._id,
                        option
                      );
                      let bgColor = "bg-white";
                      let borderColor = "border-gray-300";
                      let textColor = "text-gray-800";

                      if (status === "correct") {
                        bgColor = "bg-green-50";
                        borderColor = "border-green-500";
                        textColor = "text-green-800";
                      } else if (status === "incorrect") {
                        bgColor = "bg-red-50";
                        borderColor = "border-red-500";
                        textColor = "text-red-800";
                      } else if (status === "missed") {
                        bgColor = "bg-yellow-50";
                        borderColor = "border-yellow-500";
                        textColor = "text-yellow-800";
                      }

                      return (
                        <div
                          key={option}
                          className={`${bgColor} ${textColor} border ${borderColor} rounded-md p-3 flex items-start`}
                        >
                          <span className="flex-grow">{option}</span>
                          {status === "correct" && (
                            <span className="text-green-600">✓</span>
                          )}
                          {status === "incorrect" && (
                            <span className="text-red-600">✗</span>
                          )}
                          {status === "missed" && (
                            <span className="text-yellow-600">●</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Link
                href={`/dashboard?courseId=${courseId}`}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={(e) => {
                  try {
                    const storedModules = JSON.parse(localStorage.getItem("coursemodules")) || [];
                    const currentModuleId = selectedModule?._id;
              
                    if (!storedModules.length) {
                      throw new Error("No modules found in local storage.");
                    }
              
                    const currentIndex = storedModules.findIndex(module => module._id === currentModuleId);
              
                    if (currentIndex === -1) {
                      throw new Error("Current module not found in local storage.");
                    }
              
                    if (currentIndex < storedModules.length - 1) {
                      const nextModule = storedModules[currentIndex + 1];
                      dispatch(setSelectedModule(nextModule));
                    } else {
                      throw new Error("No more modules available.");
                    }
              
                  } catch (err) {
                    e.preventDefault();
                    setError(err.message);
                    console.error("Error setting next module:", err);
                  }
                }
                }
              >
                Next Module
              </Link>

              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setScore(0);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">
                {quiz.questions[currentQuestionIndex].question}
              </h2>

              <div className="space-y-3">
                {quiz.questions[currentQuestionIndex].options.map((option) => {
                  const isSelected = isOptionSelected(
                    quiz.questions[currentQuestionIndex]._id,
                    option
                  );

                  return (
                    <button
                      key={option}
                      onClick={() =>
                        handleOptionSelect(
                          quiz.questions[currentQuestionIndex]._id,
                          option
                        )
                      }
                      className={`w-full text-left p-3 border rounded-md transition ${
                        isSelected
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 mr-3 flex-shrink-0 rounded-full border ${
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <span className="flex items-center justify-center h-full text-white">
                              ✓
                            </span>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded ${
                  currentQuestionIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                Previous
              </button>

              {isLastQuestion() ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

