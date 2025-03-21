import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight, ChevronDown, Maximize, Minimize, Check } from "lucide-react";

// Dynamic import of ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Dashboard({ selectedModule }) {
  const [expandedSubmodules, setExpandedSubmodules] = useState({});
  const [activeVideo, setActiveVideo] = useState({});
  const [activeSlides, setActiveSlides] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState({});
  const [fullScreen, setFullScreen] = useState({});
  const [completedSubmodules, setCompletedSubmodules] = useState({});

  const containerRefs = useRef({});

  useEffect(() => {
    // Initialize completed submodules state from the module data
    const initialCompletedState = selectedModule.submodules.reduce((acc, submodule, index) => {
      acc[index] = submodule.isCompleted || false;
      return acc;
    }, {});
    setCompletedSubmodules(initialCompletedState);
  }, [selectedModule]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullScreen({});
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleSubmodule = (index) => {
    setExpandedSubmodules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmoduleComplete = async (submoduleId, index) => {
    try {
      const response = await fetch(`https://course-back-2-00rq.onrender.com/api/v1/submodules/${submoduleId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isCompleted: !completedSubmodules[index] 
        }),
      });

      if (response.ok) {
        setCompletedSubmodules((prev) => ({
          ...prev,
          [index]: !prev[index],
        }));
      } else {
        console.error('Failed to update submodule completion status');
      }
    } catch (error) {
      console.error('Error updating submodule completion:', error);
    }
  };

  const handleVideoClick = (lessonIndex, videoUrl) => {
    setActiveVideo((prev) => ({
      ...prev,
      [lessonIndex]: prev[lessonIndex] === videoUrl ? null : videoUrl,
    }));
    setActiveSlides((prev) => ({ ...prev, [lessonIndex]: null }));
  };

  const handleSlidesClick = (lessonIndex, pdfUrls) => {
    if (pdfUrls.length > 0) {
      setActiveSlides((prev) => ({
        ...prev,
        [lessonIndex]: prev[lessonIndex] ? null : pdfUrls,
      }));
      setCurrentSlideIndex((prev) => ({
        ...prev,
        [lessonIndex]: 0,
      }));
      setActiveVideo((prev) => ({ ...prev, [lessonIndex]: null }));
    }
  };

  const handleNextSlide = (lessonIndex) => {
    setCurrentSlideIndex((prev) => ({
      ...prev,
      [lessonIndex]: prev[lessonIndex] < activeSlides[lessonIndex].length - 1 ? prev[lessonIndex] + 1 : prev[lessonIndex],
    }));
  };

  const handlePrevSlide = (lessonIndex) => {
    setCurrentSlideIndex((prev) => ({
      ...prev,
      [lessonIndex]: prev[lessonIndex] > 0 ? prev[lessonIndex] - 1 : prev[lessonIndex],
    }));
  };

  const toggleFullScreen = (lessonIndex) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullScreen((prev) => ({ ...prev, [lessonIndex]: false }));
    } else {
      if (containerRefs.current[lessonIndex]) {
        containerRefs.current[lessonIndex].requestFullscreen();
        setFullScreen((prev) => ({ ...prev, [lessonIndex]: true }));
      }
    }
  };

  // Check if all submodules are completed
  const areAllSubmodulesCompleted = Object.values(completedSubmodules).every(Boolean);

  return (
    <div className="flex flex-col w-full p-3 md:p-6 space-y-4 font-sans">
      <h2 className="text-sm md:text-base lg:text-lg font-medium">{selectedModule.title}</h2>
      <p className="text-xs md:text-sm text-gray-600">{selectedModule.description}</p>

      {selectedModule.quiz && areAllSubmodulesCompleted && (
        <div className="mt-2 mb-4">
          <Link 
            href={`/quiz/${selectedModule._id}`}
            className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-green-500 text-white text-xs md:text-sm rounded hover:bg-green-600 font-medium transition-colors"
          >
            Take Module Quiz
          </Link>
        </div>
      )}

      <div className="space-y-3 md:space-y-4">
        {selectedModule.submodules.map((submodule, submoduleIndex) => (
          <div key={submodule._id} className="border p-3 md:p-4 rounded-lg">
            <div
              className="flex items-center cursor-pointer space-x-2 p-1.5 md:p-2 rounded"
              onClick={() => toggleSubmodule(submoduleIndex)}
            >
              {expandedSubmodules[submoduleIndex] ? (
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              )}
              <h3 className="text-xs md:text-sm font-medium flex-grow">{submodule.title}</h3>
            </div>

            {expandedSubmodules[submoduleIndex] && submodule.lessons?.length > 0 && (
              <div className="mt-3 md:mt-4 space-y-2 md:space-y-3">
                {submodule.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="border p-2 md:p-3 rounded-lg bg-white">
                    <h4 className="font-normal text-xs md:text-sm">{lesson.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">{lesson.description}</p>

                    <div className="mt-2 flex flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-2">
                      {lesson.videoUrl && (
                        <button
                          onClick={() => handleVideoClick(lessonIndex, lesson.videoUrl)}
                          className="text-blue-600 text-xs md:text-sm font-normal hover:underline text-left"
                        >
                          Watch Video
                        </button>
                      )}

                      {lesson.resources?.map((resource, resourceIndex) => (
                        <div key={resourceIndex}>
                          {resource.pdfUrls?.length > 0 && (
                            <button
                              onClick={() => handleSlidesClick(lessonIndex, resource.pdfUrls)}
                              className="text-red-600 text-xs md:text-sm font-semibold hover:underline text-left"
                            >
                              View Slides
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Video Player - Appears below "Watch Video" with responsive height */}
                    {activeVideo[lessonIndex] && (
                      <div
                        ref={(el) => (containerRefs.current[lessonIndex] = el)}
                        className={`relative mt-3 md:mt-4 border rounded-lg overflow-hidden w-full flex flex-col items-center ${
                          fullScreen[lessonIndex] ? "fixed inset-0 z-50 h-screen w-screen bg-black" : ""
                        }`}
                        style={
                          !fullScreen[lessonIndex] ? {
                            height: "200px",
                            maxHeight: "70vh",
                            "@media (min-width: 640px)": {
                              height: "350px"
                            },
                            "@media (min-width: 768px)": {
                              height: "450px"
                            },
                            "@media (min-width: 1024px)": {
                              height: "550px"
                            }
                          } : {}
                        }
                      >
                        <button
                          onClick={() => toggleFullScreen(lessonIndex)}
                          className="absolute top-2 right-2 bg-white p-1 md:p-2 rounded-full z-50 shadow-md"
                        >
                          {fullScreen[lessonIndex] ? <Minimize size={16} className="md:w-5 md:h-5" /> : <Maximize size={16} className="md:w-5 md:h-5" />}
                        </button>
                        <ReactPlayer 
                          url={activeVideo[lessonIndex]} 
                          controls 
                          playing 
                          width="100%" 
                          height="100%" 
                          config={{
                            youtube: {
                              playerVars: { 
                                modestbranding: 1,
                                rel: 0
                              }
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* PDF Viewer with Navigation - Appears below "View Slides" with responsive sizing */}
                    {activeSlides[lessonIndex] && (
                      <div
                        ref={(el) => (containerRefs.current[lessonIndex] = el)}
                        className={`relative mt-3 md:mt-4 border rounded-lg overflow-hidden w-full flex flex-col items-center bg-white ${
                          fullScreen[lessonIndex] ? "fixed inset-0 z-50 h-screen w-screen bg-black" : "h-64 sm:h-96 md:h-112 lg:h-128"
                        }`}
                      >
                        <button
                          onClick={() => toggleFullScreen(lessonIndex)}
                          className="absolute top-2 right-2 bg-white p-1 md:p-2 rounded-full z-50 shadow-md"
                        >
                          {fullScreen[lessonIndex] ? <Minimize size={16} className="md:w-5 md:h-5" /> : <Maximize size={16} className="md:w-5 md:h-5" />}
                        </button>
                        <iframe
                          src={`${activeSlides[lessonIndex][currentSlideIndex[lessonIndex]]}#toolbar=0&zoom=100`}
                          className="w-full h-full"
                          style={{
                            width: fullScreen[lessonIndex] ? "100vw" : "100%",
                            height: fullScreen[lessonIndex] ? "100vh" : "100%",
                          }}
                          title="Slides Viewer"
                          frameBorder="0"
                        />
                        <div className="absolute bottom-2 flex justify-between w-full px-2 md:px-4">
                          <button
                            onClick={() => handlePrevSlide(lessonIndex)}
                            disabled={currentSlideIndex[lessonIndex] === 0}
                            className={`px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-lg text-white ${
                              currentSlideIndex[lessonIndex] === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            Previous
                          </button>
                          <span className="bg-white px-2 py-1 rounded text-xs md:text-sm self-center">
                            {currentSlideIndex[lessonIndex] + 1} / {activeSlides[lessonIndex].length}
                          </span>
                          <button
                            onClick={() => handleNextSlide(lessonIndex)}
                            disabled={currentSlideIndex[lessonIndex] === activeSlides[lessonIndex].length - 1}
                            className={`px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-lg text-white ${
                              currentSlideIndex[lessonIndex] === activeSlides[lessonIndex].length - 1
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Submodule Completion Checkbox */}
                <div className="mt-3 md:mt-4 flex items-center space-x-2">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleSubmoduleComplete(submodule._id, submoduleIndex);
                    }}
                    className={`w-5 h-5 md:w-6 md:h-6 border rounded flex items-center justify-center cursor-pointer transition-colors ${
                      completedSubmodules[submoduleIndex] 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 bg-white hover:bg-gray-100'
                    }`}
                  >
                    {completedSubmodules[submoduleIndex] && <Check className="text-white w-3 h-3 md:w-4 md:h-4" />}
                  </div>
                  <label 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleSubmoduleComplete(submodule._id, submoduleIndex);
                    }}
                    className="cursor-pointer text-xs md:text-sm"
                  >
                    Mark Submodule as Completed
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}