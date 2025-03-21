"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, clearCourseState } from "../../redux/slices/dataSlice";
import { Header } from "../../components/Header";
import Link from "next/link";
import { Search, Book, Filter, X, RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { courses = [], loading, error } = useSelector((state) => state.data);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" or "enrolled"
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) setUser(storedUser); // Ensure it's not null
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return; // Avoid making the request with undefined userId

    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://course-back-2-00rq.onrender.com/api/user/${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        
        const data = await res.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]); // Only run when `user` updates

  useEffect(() => {
    if (!userData) return;

    // Get enrolled course IDs
    const enrolledCourseIds = new Set(userData.courses.map(c => c.courseId));

    const updatedFilteredCourses = courses
      .filter((course) => {
        if (filter === "all") return true;
        return enrolledCourseIds.has(course._id); // Check if enrolled
      })
      .filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    setFilteredCourses(updatedFilteredCourses);
  }, [userData, courses, filter, searchQuery]);

  const refreshData = () => {
    dispatch(fetchCourses());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading courses...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error Loading Courses
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={refreshData}
          className="px-5 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors duration-200"
        >
          <RefreshCw size={16} className="mr-2" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Course Library
              </h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Browse and enroll in our available courses
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64 md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchQuery("")}
                  >
                    <X
                      size={16}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </button>
                )}
              </div>

              <div className="flex rounded-md shadow-sm w-full sm:w-auto">
                <button
                  className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-l-md flex-1 sm:flex-none ${
                    filter === "all"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All Courses
                </button>
                <button
                  className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-r-md flex-1 sm:flex-none ${
                    filter === "enrolled"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                  onClick={() => setFilter("enrolled")}
                >
                  My Courses
                </button>
              </div>
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                {filter === "all" ? (
                  <Book size={32} className="text-gray-400" />
                ) : (
                  <Filter size={32} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
                {searchQuery
                  ? `No courses match "${searchQuery}"`
                  : filter === "all"
                  ? "No courses available"
                  : "You haven't enrolled in any courses yet"}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mb-4">
                {searchQuery
                  ? "Try a different search term or check back later for more courses."
                  : filter === "all"
                  ? "Check back later for new course offerings."
                  : "Browse all courses to find something that interests you."}
              </p>
              {filter === "enrolled" && (
                <button
                  onClick={() => setFilter("all")}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors duration-200"
                >
                  Browse All Courses
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }) {
  const { _id, title, image, description, level } = course;
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
  }, []);
  
  useEffect(() => {
    if (!user?._id) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`https://course-back-2-00rq.onrender.com/api/user/${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        
        const data = await res.json();
        setUserData(data.data);
        
        // Check if the user is enrolled in this course
        const enrolledCourseIds = new Set(data.data.courses.map(c => c.courseId));
        setIsEnrolled(enrolledCourseIds.has(_id));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, _id]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-36 sm:h-48 w-full">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <Book size={36} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2 flex-grow">{description}</p>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs sm:text-sm text-gray-500">
            Level: {level || "Beginner"}
          </span>

          {isEnrolled ? (
            <Link
              href={`/dashboard?courseId=${_id}`}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
              onClick={() => dispatch(clearCourseState())}
            >
              Open Course
            </Link>
          ) : (
            <Link
              href={`/enroll?courseId=${_id}`}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors duration-200"
            >
              Enroll Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}