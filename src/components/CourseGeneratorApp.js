// src/components/CourseGeneratorApp.js
import React, { useState } from 'react';
import { FaBook, FaDownload, FaHistory, FaMagic, FaUsers, FaClock, FaProjectDiagram } from 'react-icons/fa';
import { generatePDF, generateDOCX, generateSlides } from '../utils/documentGenerators';

export default function CourseGeneratorApp() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('professionals');
  const [sessionLength, setSessionLength] = useState('60');
  const [deliveryFormat, setDeliveryFormat] = useState('workshop');
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [previousCourses, setPreviousCourses] = useState([]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/generate-program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, audience, sessionLength, deliveryFormat }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate course');
      }

      const data = await response.json();
      const generatedCourse = {
        id: Date.now(),
        topic,
        audience,
        sessionLength,
        deliveryFormat,
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Mastery for ${audience}`,
        modules: parseModules(data.content),
        assessments: parseAssessments(data.content),
        timestamp: new Date().toISOString(),
      };
      
      setCourseData(generatedCourse);
      setPreviousCourses(prev => [generatedCourse, ...prev]);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      // Fallback to mock data in development
      const generatedCourse = {
        id: Date.now(),
        topic,
        audience,
        sessionLength,
        deliveryFormat,
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Mastery for ${audience}`,
        modules: [
          {
            title: 'Foundation & Introduction',
            content: `Understanding the core principles of ${topic}...`,
            activities: ['Interactive demonstration', 'Group discussion', 'Concept mapping'],
            learningObjectives: [`Define key concepts in ${topic}`, 'Identify main applications', 'Understand historical context'],
          },
          {
            title: 'Core Concepts Deep Dive',
            content: `Exploring the fundamental concepts and theories that underpin ${topic}...`,
            activities: ['Case study analysis', 'Hands-on practice', 'Problem-solving workshop'],
            learningObjectives: ['Apply core principles', 'Analyze real-world scenarios', 'Develop critical thinking skills'],
          },
          {
            title: 'Advanced Applications',
            content: `Building expertise through practical application of ${topic} concepts...`,
            activities: ['Project development', 'Peer review', 'Expert panel discussion'],
            learningObjectives: ['Create original solutions', 'Evaluate complex scenarios', 'Present findings effectively'],
          },
          {
            title: 'Integration & Innovation',
            content: `Connecting ${topic} with industry trends and future developments...`,
            activities: ['Strategic planning', 'Innovation workshop', 'Future trends analysis'],
            learningObjectives: ['Synthesize multiple concepts', 'Design innovative solutions', 'Plan strategic implementation'],
          },
        ],
        assessments: [
          'Knowledge check quiz',
          'Practical demonstration',
          'Case study analysis',
          'Final project presentation',
          'Peer assessment exercise',
        ],
      };
      setCourseData(generatedCourse);
      setPreviousCourses(prev => [generatedCourse, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-r from-primary-700 via-primary-800 to-accent-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute top-20 -right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-2 flex items-center gap-3">
                <FaMagic className="text-accent-500" />
                AI Course Generator
              </h1>
              <p className="text-xl text-primary-200">Transform any topic into professional training materials instantly</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
                <FaBook size={40} className="mx-auto mb-2 text-accent-500" />
                <p className="text-sm">Powered by AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
              <h2 className="text-2xl font-bold mb-6 text-primary-900 flex items-center gap-2">
                <FaProjectDiagram className="text-accent-500" />
                Create Your Course
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Course Topic
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={topic} 
                      onChange={(e) => setTopic(e.target.value)} 
                      placeholder="e.g., Machine Learning, Leadership, Python..."
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition duration-300"
                      required
                    />
                    <FaBook className="absolute right-3 top-3.5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Target Audience
                  </label>
                  <div className="relative">
                    <select 
                      value={audience} 
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition duration-300 appearance-none bg-white"
                    >
                      <option value="beginners">Beginners</option>
                      <option value="professionals">Professionals</option>
                      <option value="executives">Executives</option>
                      <option value="students">Students</option>
                      <option value="instructors">Instructors</option>
                    </select>
                    <FaUsers className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Session Duration
                  </label>
                  <div className="relative">
                    <select 
                      value={sessionLength} 
                      onChange={(e) => setSessionLength(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition duration-300 appearance-none bg-white"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                      <option value="480">Full day</option>
                    </select>
                    <FaClock className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Delivery Format
                  </label>
                  <select 
                    value={deliveryFormat} 
                    onChange={(e) => setDeliveryFormat(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition duration-300 appearance-none bg-white"
                  >
                    <option value="workshop">Interactive Workshop</option>
                    <option value="lecture">Traditional Lecture</option>
                    <option value="online">Online Course</option>
                    <option value="blended">Blended Learning</option>
                    <option value="masterclass">Masterclass</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-500 text-white py-4 px-6 rounded-lg hover:from-primary-700 hover:to-accent-600 transition duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                  ) : (
                    <FaMagic />
                  )}
                  {loading ? 'Generating Course...' : 'Generate Course'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Enhanced Course Display Section */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white rounded-2xl shadow-xl p-12 animate-fade-in">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mx-auto mb-4" />
                    <div className="animate-pulse h-4 bg-primary-200 rounded w-3/4 mx-auto mb-2" />
                    <div className="animate-pulse h-4 bg-primary-100 rounded w-1/2 mx-auto" />
                  </div>
                  <p className="text-xl text-primary-700 font-medium">
                    Creating your professional course materials...
                  </p>
                  <p className="text-primary-500 mt-2">
                    This may take a few moments
                  </p>
                </div>
              </div>
            )}
            
            {!loading && courseData && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-primary-900 mb-2">{courseData.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full flex items-center gap-1">
                        <FaUsers size={12} /> {courseData.audience}
                      </span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full flex items-center gap-1">
                        <FaClock size={12} /> {courseData.sessionLength} minutes
                      </span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                        {courseData.deliveryFormat}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => generatePDF(courseData)} 
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 shadow-md"
                    >
                      <FaDownload size={14} /> PDF
                    </button>
                    <button 
                      onClick={() => generateDOCX(courseData)} 
                      className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition flex items-center gap-2 shadow-md"
                    >
                      <FaDownload size={14} /> DOCX
                    </button>
                    <button 
                      onClick={() => generateSlides(courseData)} 
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2 shadow-md"
                    >
                      <FaDownload size={14} /> Slides
                    </button>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary-800">Course Modules</h3>
                    <div className="space-y-4">
                      {courseData.modules.map((module, index) => (
                        <div key={index} className="border-l-4 border-accent-500 bg-primary-50 rounded-r-lg p-6 hover:shadow-md transition duration-300">
                          <h4 className="font-bold text-lg text-primary-900 mb-2">
                            Module {index + 1}: {module.title}
                          </h4>
                          <p className="text-gray-700 mb-4">{module.content}</p>
                          
                          {module.learningObjectives && (
                            <div className="mb-4">
                              <h5 className="font-medium text-primary-800 mb-2">Learning Objectives:</h5>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {module.learningObjectives.map((objective, idx) => (
                                  <li key={idx}>{objective}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-4">
                            <h5 className="font-medium text-primary-800 mb-2">Activities:</h5>
                            <div className="flex flex-wrap gap-2">
                              {module.activities.map((activity, idx) => (
                                <span key={idx} className="bg-white border border-primary-200 text-primary-700 px-3 py-1 rounded-full text-sm">
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary-800">Assessment Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {courseData.assessments.map((assessment, index) => (
                        <div key={index} className="bg-primary-50 border border-primary-200 p-4 rounded-lg flex items-center gap-3">
                          <div className="w-2 h-2 bg-accent-500 rounded-full" />
                          <span className="text-gray-700">{assessment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!loading && !courseData && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBook size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">Ready to Create?</h3>
                  <p className="text-gray-600 mb-6">
                    Enter your course topic and preferences to generate professional training materials
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="bg-primary-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-primary-800 mb-3">What You'll Get:</h4>
                      <ul className="text-left space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                          Comprehensive course modules
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                          Engaging activities & assessments
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                          Professional presentation materials
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                          Downloadable formats (PDF, DOCX, PPT)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Enhanced Previous Courses Section */}
      {previousCourses.length > 0 && (
        <section className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary-900 flex items-center gap-2">
              <FaHistory className="text-accent-500" />
              Course History
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousCourses.map(course => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 border border-primary-100 cursor-pointer hover:border-accent-500"
                onClick={() => setCourseData(course)}
              >
                <h3 className="font-bold text-lg text-primary-900 mb-2">{course.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaUsers size={12} />
                    <span>Audience: {course.audience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock size={12} />
                    <span>Duration: {course.sessionLength} minutes</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Format: {course.deliveryFormat}
                  </div>
                </div>
                <button className="text-accent-600 hover:text-accent-700 font-medium text-sm flex items-center gap-1">
                  View Details <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="bg-primary-900 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary-300">Created with AI • Built for Educators</p>
        </div>
      </footer>
    </div>
  );
}

// In your CourseGenerator component, update the catch block:
.catch(error => {
  console.error('Error status:', error.response?.status);
  console.error('Error data:', error.response?.data);
  console.error('Error message:', error.response?.data?.error?.message);
  setIsGenerating(false);
  alert(`Error generating program: ${error.response?.data?.message || 'Unknown error'}`);
});