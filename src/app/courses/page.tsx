"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../redux/slices/dataSlice";
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

  // Filter courses based on enrollment status and search query
  const filteredCourses = courses
    .filter((course) => {
      if (filter === "all") return true;
      return course.isEnrolled;
    })
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Course Library
              </h1>
              <p className="mt-1 text-gray-500">
                Browse and enroll in our available courses
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
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

              <div className="flex rounded-md shadow-sm">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    filter === "all"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All Courses
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                {filter === "all" ? (
                  <Book size={32} className="text-gray-400" />
                ) : (
                  <Filter size={32} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                {searchQuery
                  ? `No courses match "${searchQuery}"`
                  : filter === "all"
                  ? "No courses available"
                  : "You haven't enrolled in any courses yet"}
              </h3>
              <p className="text-gray-500 max-w-md mb-4">
                {searchQuery
                  ? "Try a different search term or check back later for more courses."
                  : filter === "all"
                  ? "Check back later for new course offerings."
                  : "Browse all courses to find something that interests you."}
              </p>
              {filter === "enrolled" && (
                <button
                  onClick={() => setFilter("all")}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors duration-200"
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
  const { _id, title, image, description, instructor, level, isEnrolled } =
    course;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <Book size={48} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Level: {level || "Beginner"}
          </span>

          {isEnrolled ? (
            <Link
              href={`/course/${_id}`}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
            >
              Open Course
            </Link>
          ) : (
            <Link
              href={`/course/${_id}/enroll`}
              className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors duration-200"
            >
              Enroll Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
