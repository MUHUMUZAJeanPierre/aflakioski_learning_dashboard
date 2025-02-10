export default function Dashboard({ selectedModule }) {
    console.log("selectedModule", selectedModule);
  
    // Check if selectedModule is undefined or if it doesn't have submodules
    if (!selectedModule || !selectedModule.submodules || selectedModule.submodules.length === 0) {
      return <div>No submodules available for this module.</div>;
    }
  
    return (
      <div className="flex flex-col w-full p-6 space-y-4 bg-red-300  ">
        {/* Module Title */}
        <h2 className="text-2xl font-semibold">{selectedModule.title}</h2>
        <p className="text-lg">{selectedModule.description}</p>
  
        {/* Submodules List */}
        <div className="space-y-4">
          {selectedModule.submodules.map((submodule, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-medium">{submodule.title}</h3>
              <p className="text-sm text-gray-500">Duration: {submodule.duration}</p>
              <a
                href={submodule.url}
                target="_blank"
                className="text-blue-600 underline mt-2 block"
              >
                Start Submodule
              </a>
  
              {/* Lessons List within each Submodule */}
              {submodule.lessons && submodule.lessons.length > 0 && (
                <div className="mt-4 space-y-3">
                  {submodule.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border p-3 rounded-lg bg-white shadow-sm">
                      <h4 className="font-semibold">{lesson.title}</h4>
                      <p>{lesson.description}</p>
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        className="text-blue-600 underline mt-2 block"
                      >
                        Watch Lesson
                      </a>
                      {/* Optionally, add more resources or slides */}
                      {lesson.resources && lesson.resources.length > 0 && (
                        <div className="mt-3">
                          {lesson.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex}>
                              <a
                                href={resource.storedName} // Assuming the stored name is the file path or URL
                                target="_blank"
                                className="text-blue-600 underline"
                              >
                                {resource.originalName}
                              </a>
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
  