import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ChevronRight, ChevronDown, Maximize, Minimize } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Dashboard({ selectedModule }) {
  const [expandedSubmodules, setExpandedSubmodules] = useState({});
  const [activeResource, setActiveResource] = useState({
    lessonIndex: null,
    resourceUrl: null,
    type: null,
    slides: [],
    currentSlideIndex: 0,
    isFullScreen: false, 
  });

  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("Selected Module:", selectedModule);
  }, [selectedModule]);

  const toggleSubmodule = (index) => {
    setExpandedSubmodules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const processVideoUrl = (url) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\//);
      if (match) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  };

  const handleResourceClick = (lessonIndex, resourceUrl, type, slides = []) => {
    const processedUrl = type === "video" ? processVideoUrl(resourceUrl) : resourceUrl;

    setActiveResource((prev) =>
      prev.lessonIndex === lessonIndex && prev.resourceUrl === processedUrl && prev.type === type
        ? { lessonIndex: null, resourceUrl: null, type: null, slides: [], currentSlideIndex: 0, isFullScreen: false }
        : { lessonIndex, resourceUrl: processedUrl, type, slides, currentSlideIndex: 0, isFullScreen: false }
    );
  };

  const goToSlide = (direction) => {
    setActiveResource((prev) => {
      const newIndex = prev.currentSlideIndex + direction;
      return {
        ...prev,
        currentSlideIndex: newIndex,
        resourceUrl: prev.slides[newIndex],
      };
    });
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

  if (!selectedModule?.submodules?.length) {
    return <div className="text-center text-gray-500">No submodules available.</div>;
  }

  return (
    <div className="flex flex-col w-full p-6 space-y-4 font-sans ">
      <h2 className="text-sm ">{selectedModule.title}</h2>
      <p className="text-sm text-gray-600">{selectedModule.description}</p>

      <div className="space-y-4">
        {selectedModule.submodules.map((submodule, submoduleIndex) => (
          <div key={submodule._id} className="border p-4 rounded-lg  ">
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
              <div className="mt-4 space-y-3 ">
                {submodule.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="border p-3 rounded-lg bg-white ">
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
                      <div key={resourceIndex} className="mt-2 ">
                        {resource.slides?.length > 0 && (
                          <button
                            onClick={() =>
                              handleResourceClick(lessonIndex, resource.slides[0], "slides", resource.slides)
                            }
                            className="text-green-600 font-semibold block hover:underline"
                          >
                            View Slides
                          </button>
                        )}
                      </div>
                    ))}

                    {activeResource.lessonIndex === lessonIndex && activeResource.resourceUrl && (
                      <div
                        ref={containerRef}
                        className={`relative  mt-3 border rounded-lg overflow-hidden w-full flex flex-col items-center ${activeResource.isFullScreen ? "fixed inset-0 z-50 h-screen w-screen" : "sm:h-[600px] h-[250px]"
                          }`}
                      >
                        <button
                          onClick={toggleFullScreen}
                          className="absolute top-2 right-2 bg-white p-2 rounded-full "
                        >
                          {activeResource.isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>

                        {activeResource.type === "video" ? (
                          <div className="w-full max-w-6xl h-full flex justify-center items-center">
                            <ReactPlayer
                              ref={playerRef}
                              url={activeResource.resourceUrl}
                              controls
                              playing
                              width="100%"
                              height="100%"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="w-full h-full flex justify-center items-center bg-white">
                              <img
                                src={activeResource.resourceUrl}
                                alt="Slide"
                                className="w-auto h-full max-w-full max-h-full object-contain"
                              />
                            </div>

                            
                            <div className="flex justify-between items-center w-full px-4 py-3  bg-white rounded-b-md text-center sm:flex-row flex-row">
                              <button
                                onClick={() => goToSlide(-1)}
                                disabled={activeResource.currentSlideIndex === 0}
                                className={`flex items-center justify-center w-auto px-3 py-1 sm:px-5 sm:py-2 text-xs sm:text-base text-white font-semibold rounded-md ${activeResource.currentSlideIndex === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                  }`}
                              >
                                 Previous
                              </button>

                              <span className="flex items-center text-sm font-sm text-center">
                                Slide {activeResource.currentSlideIndex + 1} / {activeResource.slides.length}
                              </span>

                              <button
                                onClick={() => goToSlide(1)}
                                disabled={activeResource.currentSlideIndex === activeResource.slides.length - 1}
                                className={`flex items-center justify-center w-auto px-3 py-1 sm:px-5 sm:py-2 text-xs sm:text-base text-white font-semibold  rounded-md ${activeResource.currentSlideIndex === activeResource.slides.length - 1
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                  }`}
                              >
                                Next 
                              </button>
                            </div>

                          </>
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
    </div>
  );
}
