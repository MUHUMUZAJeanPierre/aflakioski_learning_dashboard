import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function Dashboard({ selectedModule }) {
  // console.log("selectedModule", selectedModule.data[0].modules[0].submodules[0].lessons[0].resources[0].slides[0]);
  console.log("selectedModule", selectedModule.submodules[0].lessons[0].resources[0].slides[0]);

  // State to track expanded submodules
  const initialExpandedState = selectedModule?.submodules?.reduce((acc, submodule, index) => {
    acc[index] = true; // All submodules start expanded
    return acc;
  }, {});
  const [expandedSubmodules, setExpandedSubmodules] = useState(initialExpandedState);

  // State to track which lesson's resource is active
  const [activeResource, setActiveResource] = useState({ lessonIndex: null, resourceUrl: null });

  // Toggle expand/collapse for a submodule
  const toggleSubmodule = (index) => {
    setExpandedSubmodules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to handle resource selection and show below clicked lesson
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
        {selectedModule.submodules.map((submodule, index) => (
          <div key={index} className="border p-4 rounded-lg bg-white">
            {/* Clickable Header to Toggle Expand/Collapse */}
            <div
              className="flex items-center cursor-pointer space-x-2"
              onClick={() => toggleSubmodule(index)}
            >
              {expandedSubmodules[index] ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
              <h3 className="text-xl font-medium">{submodule.title}</h3>
            </div>
            {/* <p className="text-sm text-gray-500">Duration: {submodule.duration}</p> */}
            {/* <a href={submodule.url} target="_blank" className="text-blue-600 underline mt-2 block">
              Start Submodule
            </a> */}

            {/* Show lessons only if submodule is expanded */}
            {expandedSubmodules[index] && submodule.lessons && submodule.lessons.length > 0 && (
              <div className="mt-4 space-y-3">
                {submodule.lessons.map((lesson, lessonIndex) => (
                  <div key={lessonIndex} className="border p-3 rounded-lg bg-white shadow-sm">
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <p>{lesson.description}</p>

                    {/* Additional Resources (PDFs, slides, etc.) */}
                    {lesson.resources && lesson.resources.length > 0 && (
                      <div className="mt-3">
                        {lesson.resources.map((resource, resourceIndex) => (
                          <div key={resourceIndex}>
                            <button
                              onClick={() => handleResourceClick(lessonIndex, resource.storedName)}
                              className="text-blue-600 underline"
                            >
                              {resource.originalName}
                            </button>

                            {/* Show resource below the clicked button */}
                            {activeResource.lessonIndex === lessonIndex &&
                              activeResource.resourceUrl === resource.storedName && (
                                <div className="mt-3 border rounded-lg overflow-hidden w-full h-[350px] bg-gray-100 shadow-md">
                                  {resource.storedName.endsWith(".mp4") ? (
                                    <video className="w-full h-full" controls>
                                      <source src={resource.storedName} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
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
