import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ChevronRight, ChevronDown } from "lucide-react";

// Dynamically import ReactPlayer to fix Next.js SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Dashboard({ selectedModule }) {
  console.log("selectedModule 01", selectedModule.submodules[0].lessons[0].videoUrl);

  useEffect(() => {
    if (selectedModule?.submodules?.[0]?.lessons?.[0]?.videoUrl) {
      console.log("selectedModule 01", selectedModule.submodules[0].lessons[0].videoUrl);
    }
  }, [selectedModule]);

  if (!selectedModule || !selectedModule.submodules || selectedModule.submodules.length === 0) {
    return <div className="text-center text-gray-500">No submodules available for this module.</div>;
  }

  const [expandedSubmodules, setExpandedSubmodules] = useState(
    selectedModule?.submodules?.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );

  const [activeResource, setActiveResource] = useState({
    lessonIndex: null,
    resourceUrl: null,
    type: null,
    slides: [],
    currentSlideIndex: 0,
  });

  const toggleSubmodule = (index) => {
    setExpandedSubmodules((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleResourceClick = (lessonIndex, resourceUrl, type, slides = []) => {
    setActiveResource((prev) =>
      prev.lessonIndex === lessonIndex && prev.resourceUrl === resourceUrl && prev.type === type
        ? { lessonIndex: null, resourceUrl: null, type: null, slides: [], currentSlideIndex: 0 }
        : { lessonIndex, resourceUrl, type, slides, currentSlideIndex: 0 }
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

  return (
    <div className="flex flex-col w-full p-6 space-y-4 font-sans">
      <h2 className="text-2xl font-semibold">{selectedModule.title}</h2>
      <p className="text-lg text-gray-600">{selectedModule.description}</p>

      <div className="space-y-4">
        {selectedModule.submodules.map((submodule, submoduleIndex) => (
          <div key={submoduleIndex} className="border p-4 rounded-lg bg-white shadow">
            <div
              className="flex items-center cursor-pointer space-x-2 hover:bg-gray-100 p-2 rounded"
              onClick={() => toggleSubmodule(submoduleIndex)}
            >
              {expandedSubmodules[submoduleIndex] ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
              <h3 className="text-xl font-medium">{submodule.title}</h3>
            </div>

            {expandedSubmodules[submoduleIndex] && submodule.lessons?.length > 0 && (
              <div className="mt-4 space-y-3">
                {submodule.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="border p-3 rounded-lg bg-white shadow-sm">
                    <h4 className="font-semibold text-lg">{lesson.title}</h4>
                    <p className="text-sm text-gray-600">{lesson.description}</p>

                    {lesson.videoUrl && (
                      <button
                        onClick={() => handleResourceClick(lessonIndex, lesson.videoUrl, "video")}
                        className="text-blue-600 font-semibold mt-2 block hover:underline"
                      >
                        Watch Video
                      </button>
                    )}

                    {lesson.resources?.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="mt-2">
                        {resource.slides?.length > 0 && (
                          <button
                            onClick={() => handleResourceClick(lessonIndex, resource.slides[0], "slides", resource.slides)}
                            className="text-green-600 font-semibold block hover:underline"
                          >
                            View Slides
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Display Video or Slides Below the Button */}
                    {activeResource.lessonIndex === lessonIndex && activeResource.resourceUrl && (
                      <div className="mt-3 border rounded-lg overflow-hidden w-full h-[500px] bg-gray-100 shadow-md flex flex-col items-center">
                        {activeResource.type === "video" ? (
                          <ReactPlayer
                            url={activeResource.resourceUrl}
                            controls
                            width="100%"
                            height="100%"
                          />
                        ) : (
                          <>
                            {/* Render slides */}
                            <iframe
                              src={activeResource.resourceUrl}
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                            ></iframe>

                            {/* Slide Navigation Buttons */}
                            <div className="flex justify-between w-full p-2">
                              <button
                                onClick={() => goToSlide(-1)}
                                disabled={activeResource.currentSlideIndex === 0}
                                className={`px-4 py-2 text-white rounded ${
                                  activeResource.currentSlideIndex === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                              >
                                Previous
                              </button>

                              <button
                                onClick={() => goToSlide(1)}
                                disabled={activeResource.currentSlideIndex === activeResource.slides.length - 1}
                                className={`px-4 py-2 text-white rounded ${
                                  activeResource.currentSlideIndex === activeResource.slides.length - 1
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
