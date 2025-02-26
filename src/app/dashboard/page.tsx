// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchModules } from "../../redux/slices/dataSlice";
// import { Sidebar } from "../../components/Sidebar";
// import Dashboard from "../../components/Dashboard";
// import { Header } from "../../components/Header";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default function Homepage() {
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const dispatch = useDispatch();
//   const searchParams = useSearchParams();
//   const courseId = searchParams.get("courseId");

//   // Ensure that state is safely accessed
//   const { modules = [], loading, error } = useSelector((state) => state.data || {});
//   const { courses = [] } = useSelector((state) => state.courses || {});

//   console.log("Redux State:", { modules, courses });

//   // Get current course information safely
//   const currentCourse = courses?.find((course) => course._id === courseId) || {};

//   useEffect(() => {
//     if (courseId) {
//       dispatch(fetchModules(courseId));
//     }
//   }, [dispatch, courseId]);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <Header 
//         setIsSidebarOpen={setIsSidebarOpen} 
//         isSidebarOpen={isSidebarOpen}
//         toggleSidebar={toggleSidebar}
//         title={currentCourse?.title || "Course Content"}
//       />
      
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           setSelectedModule={setSelectedModule}
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//           modules={modules}
//           loading={loading}
//           error={error}
//         />
        
//         <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : ''}`}>
//           <div className="mb-6">
//             <Link 
//               href="/courses" 
//               className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
//             >
//               <ArrowLeft size={16} className="mr-1" /> Back to Courses
//             </Link>
//           </div>

//           {selectedModule ? (
//             <Dashboard selectedModule={selectedModule} />
//           ) : (
//             <div className="text-center mt-10">
//               {loading ? (
//                 <div className="flex flex-col items-center">
//                   <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
//                   <p className="mt-4 text-gray-600">Loading module content...</p>
//                 </div>
//               ) : error ? (
//                 <div className="text-red-500">Error: {error}</div>
//               ) : (
//                 <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
//                   <h2 className="text-2xl font-bold text-gray-800 mb-4">
//                     {currentCourse?.title || "Welcome to the Course"}
//                   </h2>
//                   <p className="text-gray-600 mb-6">
//                     {currentCourse?.description || "Please select a module from the sidebar to begin learning."}
//                   </p>
//                   <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//                     <p className="text-green-700 font-medium">
//                       Select a module from the sidebar to start learning
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sidebar } from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import { Header } from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchModules } from "../../redux/slices/dataSlice";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Homepage() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { modules = [], loading, error } = useSelector((state) => state.data || {});
  const { courses = [] } = useSelector((state) => state.data || {});

  // Get current course information safely
  const currentCourse = courses?.find((course) => course._id === courseId) || {};

  useEffect(() => {
    if (courseId) {
      dispatch(fetchModules(courseId));
    }
  }, [dispatch, courseId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        setIsSidebarOpen={setIsSidebarOpen} 
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        title={currentCourse?.title || "Course Content"}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          setSelectedModule={setSelectedModule}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          modules={modules}
          loading={loading}
          error={error}
        />
        
        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : ''}`}>
          <div className="mb-6">
            <Link 
              href="/courses" 
              className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Courses
            </Link>
          </div>

          {selectedModule ? (
            <Dashboard selectedModule={selectedModule} />
          ) : (
            <div className="text-center mt-10">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading module content...</p>
                </div>
              ) : error ? (
                <div className="text-red-500">Error: {error}</div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {currentCourse?.title || "Welcome to the Course"}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {currentCourse?.description || "Please select a module from the sidebar to begin learning."}
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-green-700 font-medium">
                      Select a module from the sidebar to start learning
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
