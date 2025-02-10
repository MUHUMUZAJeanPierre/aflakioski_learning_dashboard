import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function Dashboard({ selectedModule }) {
  console.log("selectedModule", selectedModule);

  // State to track expanded submodules (default: all expanded)
  const initialExpandedState = selectedModule?.submodules?.reduce((acc, submodule, index) => {
    acc[index] = true;
    return acc;
  }, {});
  const [expandedSubmodules, setExpandedSubmodules] = useState(initialExpandedState);

  // State to track active resource per lesson (video or slides)
  const [activeResource, setActiveResource] = useState({ lessonIndex: null, resourceUrl: null });

  // Toggle expand/collapse for submodules
  const toggleSubmodule = (index) => {
    setExpandedSubmodules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle click to display resource (video/slides) below clicked button
  const handleResourceClick = (lessonIndex, resourceUrl) => {
    setActiveResource((prev) =>
      prev.lessonIndex === lessonIndex && prev.resourceUrl === resourceUrl
        ? { lessonIndex: null, resourceUrl: null } // Collapse if clicked again
        : { lessonIndex, resourceUrl }
    );
  };

  if (!selectedModule || !selectedModule.submodules || selectedModule.submodules.length === 0) {
    return <div>No submodules available for this module.</div>;
  }

  return (
    <div className="flex flex-col w-full p-6 space-y-4">
      {/* Module Title */}
      <h2 className="text-2xl font-semibold">{selectedModule.title}</h2>
      <p className="text-lg">{selectedModule.description}</p>

      {/* Submodules List with Expand/Collapse */}
      <div className="space-y-4">
        {selectedModule.submodules.map((submodule, submoduleIndex) => (
          <div key={submoduleIndex} className="border p-4 rounded-lg bg-white">
            {/* Expand/Collapse Button */}
            <div
              className="flex items-center cursor-pointer space-x-2"
              onClick={() => toggleSubmodule(submoduleIndex)}
            >
              {expandedSubmodules[submoduleIndex] ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
              <h3 className="text-xl font-medium">{submodule.title}</h3>
            </div>

            {/* Lessons Section */}
            {expandedSubmodules[submoduleIndex] &&
              submodule.lessons &&
              submodule.lessons.length > 0 && (
                <div className="mt-4 space-y-3">
                  {submodule.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border p-3 rounded-lg bg-white shadow-sm">
                      <h4 className="font-semibold">{lesson.title}</h4>
                      <p>{lesson.description}</p>

                      {/* Resources (Videos & Slides) */}
                      {lesson.resources && lesson.resources.length > 0 && (
                        <div className="mt-3">
                          {lesson.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex}>
                              {/* Button for Slides (Open in New Tab) */}
                              {resource.slides && resource.slides.length > 0 && (
                                <button
                                  onClick={() => window.open(resource.slides[0], "_blank")}
                                  className="text-blue-600 underline mt-2 block"
                                >
                                  View Slides
                                </button>
                              )}

                              {/* Button for Videos */}
                              {resource.storedName && (
                                <button
                                  onClick={() => handleResourceClick(lessonIndex, resource.storedName)}
                                  className="text-blue-600 underline mt-2 block"
                                >
                                  Watch Video
                                </button>
                              )}

                              {/* Display selected resource below the button */}
                              {activeResource.lessonIndex === lessonIndex &&
                                activeResource.resourceUrl === resource.storedName && (
                                  <div className="mt-3 border rounded-lg overflow-hidden w-full h-[350px] bg-gray-100 shadow-md">
                                    {/* Embed Video */}
                                    {resource.storedName.endsWith(".mp4") ? (
                                      <video className="w-full h-full" controls>
                                        <source src={resource.storedName} type="video/mp4" />
                                        Your browser does not support the video tag.
                                      </video>
                                    ) : resource.storedName.includes("youtube.com") ||
                                      resource.storedName.includes("vimeo.com") ? (
                                      <iframe
                                        src={resource.storedName.replace("watch?v=", "embed/")}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                      ></iframe>
                                    ) : (
                                      <iframe
                                        src={resource.storedName}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                      ></iframe>
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
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
