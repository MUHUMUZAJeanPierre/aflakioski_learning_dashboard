"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, enrollInCourse } from "../../../../redux/slices/dataSlice";
import { Header } from "../../../../components/Header";
import { ArrowLeft, CheckCircle, AlertCircle, BarChart, Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CourseEnrollmentPage() {
  const router = useRouter();
  const { courseId } = router.query;
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  
  const course = courses.find(c => c._id === courseId) || {};

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setEnrollmentError(null);
    
    try {
      await dispatch(enrollInCourse(courseId)).unwrap();
      setEnrollmentSuccess(true);
      
      // Redirect to course page after successful enrollment after a short delay
      setTimeout(() => {
        router.push(`/course/${courseId}`);
      }, 2000);
    } catch (error) {
      setEnrollmentError(error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Course</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/courses"
          className="px-5 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors duration-200"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course._id) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-yellow-100 rounded-full p-4 mb-4">
          <AlertCircle size={48} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/courses"
          className="px-5 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors duration-200"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Course Enrollment" />
      
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/courses" 
              className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Courses
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 md:h-80 w-full">
              {course.image ? (
                <Image 
                  src={course.image} 
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <BarChart size={64} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <span>{course.duration || '8 weeks'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2" />
                  <span>{course.enrolledStudents?.length || 0} students enrolled</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-8 leading-relaxed">{course.description}</p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
                <ul className="space-y-2">
                  {course.learningOutcomes?.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Master key concepts and methodologies</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Apply practical skills through hands-on exercises</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Develop a comprehensive understanding of the subject matter</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              {enrollmentSuccess ? (
                <div className="bg-green-50 p-6 rounded-lg border border-green-100 flex items-center">
                  <CheckCircle size={24} className="text-green-600 mr-3" />
                  <div>
                    <h3 className="text-green-800 font-semibold">Successfully Enrolled!</h3>
                    <p className="text-green-700">Redirecting you to the course...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`px-6 py-3 rounded-md text-white font-medium flex items-center justify-center ${
                      enrolling ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {enrolling ? "Enrolling..." : "Enroll in this Course"}
                  </button>
                  <Link
                    href="/courses"
                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center"
                  >
                    Cancel
                  </Link>
                </div>
              )}
              
              {enrollmentError && (
                <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-100 text-red-700">
                  <div className="flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    <p>Failed to enroll: {enrollmentError}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}