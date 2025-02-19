import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ChevronRight, ChevronDown, Maximize, Minimize } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Dashboard({ selectedModule }) {
  const [expandedSubmodules, setExpandedSubmodules] = useState({});
  const [expandedQuiz, setExpandedQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [quizStarted, setQuizStarted] = useState(false);



  const [activeResource, setActiveResource] = useState({
    lessonIndex: null,
    resourceUrl: null,
    type: null, // 'video' or 'pdf'
    isFullScreen: false,
  });

  // const pdfUrls = data.data[0].modules[0].submodules[1].lessons[0].resources[0].pdfUrls;
console.log(activeResource)

  const containerRef = useRef(null);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizSubmitted) {
      submitQuiz();
    }
  }, [timeLeft, quizStarted]);

  const toggleSubmodule = (index) => {
    setExpandedSubmodules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleQuiz = () => {
    setExpandedQuiz((prev) => !prev);
  };

  const handleResourceClick = (lessonIndex, resourceUrl, type) => {
    setActiveResource((prev) =>
      prev.lessonIndex === lessonIndex && prev.resourceUrl === resourceUrl && prev.type === type
        ? { lessonIndex: null, resourceUrl: null, type: null, isFullScreen: false }
        : { lessonIndex, resourceUrl, type, isFullScreen: false }
    );
  };

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setActiveResource((prev) => ({ ...prev, isFullScreen: false }));
    } else {
      if (containerRef.current) {
        containerRef.current.requestFullscreen();
        setActiveResource((prev) => ({ ...prev, isFullScreen: true }));
      }
    }
  };

  const handleAnswerChange = (qIndex, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: answer,
    }));
  };

  const submitQuiz = () => {
    if (!selectedModule.quiz) return;

    let correctAnswers = 0;
    selectedModule.quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setQuizSubmitted(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col w-full p-6 space-y-4 font-sans">
      <h2 className="text-sm">{selectedModule.title}</h2>
      <p className="text-sm text-gray-600">{selectedModule.description}</p>

      <div className="space-y-4">
        {selectedModule.submodules.map((submodule, submoduleIndex) => (
          <div key={submodule._id} className="border p-4 rounded-lg">
            <div
              className="flex items-center cursor-pointer space-x-2 p-2 rounded"
              onClick={() => toggleSubmodule(submoduleIndex)}
            >
              {expandedSubmodules[submoduleIndex] ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
              <h3 className="text-sm font-sm">{submodule.title}</h3>
            </div>

            {expandedSubmodules[submoduleIndex] && submodule.lessons?.length > 0 && (
              <div className="mt-4 space-y-3">
                {submodule.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="border p-3 rounded-lg bg-white">
                    <h4 className="font-normal text-sm">{lesson.title}</h4>
                    <p className="text-sm text-gray-600">{lesson.description}</p>

                    {lesson.videoUrl && (
                      <button
                        onClick={() => handleResourceClick(lessonIndex, lesson.videoUrl, "video")}
                        className="text-blue-600 font-normal mt-2 block hover:underline"
                      >
                        Watch Video
                      </button>
                    )}

                    {lesson.resources?.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="mt-2">
                        {resource.pdfUrl && (
                          <button
                            onClick={() =>
                              handleResourceClick(lessonIndex, `${resource.pdfUrl}#toolbar=0`, "pdf")
                            }
                            className="text-red-600 font-semibold block hover:underline"
                          >
                            View PDF
                          </button>
                        )}
                      </div>
                    ))}

                    {activeResource.lessonIndex === lessonIndex && activeResource.resourceUrl && (
                      <div
                        ref={containerRef}
                        className={`relative mt-3 border rounded-lg overflow-hidden w-full flex flex-col items-center ${activeResource.isFullScreen ? "fixed inset-0 z-50 h-screen w-screen" : "sm:h-[600px] h-[250px]"
                          }`}
                      >
                        <button
                          onClick={toggleFullScreen}
                          className="absolute top-2 right-2 bg-white p-2 rounded-full"
                        >
                          {activeResource.isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>

                        {activeResource.type === "video" ? (
                          <div className="w-full max-w-6xl h-full flex justify-center items-center">
                            <ReactPlayer url={activeResource.resourceUrl} controls playing width="100%" height="100%" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex justify-center items-center bg-white">
                            <iframe
                              src={activeResource.resourceUrl}
                              className="w-full h-full"
                              title="PDF Viewer"
                              frameBorder="0"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedModule.quiz&& (
        <div className="border p-4 rounded-sm bg-gray-100 mt-4">
          <div className="flex items-center cursor-pointer space-x-2 p-2 rounded-sm" onClick={toggleQuiz}>
            {expandedQuiz ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
            <h3 className="text-lg font-semibold">{selectedModule.quiz.title}</h3>
          </div>

          {expandedQuiz && (
            <div className="mt-4 space-y-3">

              {!quizSubmitted && (
                <div className="text-center font-semibold text-lg text-red-600">
                  ⏳ Time Left: {formatTime(timeLeft)}
                </div>
              )}

              {selectedModule.quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="border p-3 rounded-lg bg-white">
                  <p className="text-sm font-medium">{qIndex + 1}. {question.question}</p>
                  <ul className="mt-1">
                    {question.options.map((option, oIndex) => (
                      <li key={oIndex} className="text-sm">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`q-${qIndex}`}
                            value={option}
                            checked={userAnswers[qIndex] === option}
                            onChange={() => handleAnswerChange(qIndex, option)}
                            disabled={quizSubmitted}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="mt-4 text-center font-semibold text-lg">
                  Your Score: {score} / {selectedModule.quiz.questions.length}
                  <p className={`text-sm ${score > selectedModule.quiz.questions.length / 2 ? "text-green-600" : "text-red-600"}`}>
                    {score > selectedModule.quiz.questions.length / 2
                      ? "Great job! You passed!"
                      : "Keep practicing! You can improve."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



