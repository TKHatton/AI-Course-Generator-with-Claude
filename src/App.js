import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Download } from 'lucide-react';

const CourseGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    programTitle: '',
    audience: '',
    emotionalTone: '',
    startingPoint: '',
    desiredTransformation: '',
    courses: []
  });
  const [courseCount, setCourseCount] = useState('');
  const [generatedMaterials, setGeneratedMaterials] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    "Program Setup",
    "Course Design",
    "Assessment",
    "Enhancement Materials",
    "Review & Generate"
  ];

  const emotionalTones = [
    "Professional & Informative",
    "Inspirational & Motivating",
    "Practical & Result-Oriented",
    "Supportive & Encouraging"
  ];

  const courseOptions = ["3 core courses", "5 comprehensive courses", "7 in-depth courses"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setFormData({ ...formData, courses: updatedCourses });
  };

  const generateProgram = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/generate-program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate program');
      }

      const data = await response.json();
      setGeneratedMaterials(data);
    } catch (error) {
      console.error('Error generating program:', error);
      alert('Error generating program. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Program Title</label>
              <input
                type="text"
                name="programTitle"
                value={formData.programTitle}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter program title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <input
                type="text"
                name="audience"
                value={formData.audience}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Describe your target audience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Emotional Tone</label>
              <select
                name="emotionalTone"
                value={formData.emotionalTone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select emotional tone</option>
                {emotionalTones.map((tone, index) => (
                  <option key={index} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Starting Point</label>
              <textarea
                name="startingPoint"
                value={formData.startingPoint}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="What's their current state/situation?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Desired Transformation</label>
              <textarea
                name="desiredTransformation"
                value={formData.desiredTransformation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
                placeholder="What transformation do you want them to achieve?"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4">Number of Courses</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courseOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      const count = parseInt(option.split(' ')[0]);
                      setCourseCount(option);
                      const newCourses = Array(count).fill(null).map(() => ({
                        title: '',
                        description: '',
                        modules: ''
                      }));
                      setFormData({ ...formData, courses: newCourses });
                    }}
                    className={`p-6 border-2 rounded-lg cursor-pointer ${
                      courseCount === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <h3 className="font-medium text-lg">{option}</h3>
                  </div>
                ))}
              </div>
            </div>

            {formData.courses.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Course Details</h3>
                {formData.courses.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium">Course {index + 1}</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Course Title</label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => handleCourseChange(index, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter course title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Course Description</label>
                      <textarea
                        value={course.description}
                        onChange={(e) => handleCourseChange(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                        placeholder="Brief description of the course"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Key Modules</label>
                      <textarea
                        value={course.modules}
                        onChange={(e) => handleCourseChange(index, 'modules', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                        placeholder="List key modules (one per line)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Assessment Structure</h3>
            <p className="text-gray-600">The program will include comprehensive assessments:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Multiple Choice Questions (MCQs) for each module</li>
              <li>Reflection Questions for deeper learning</li>
              <li>Practical Tasks for real-world application</li>
              <li>Final assessment to measure progress</li>
            </ul>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm">All assessments will be automatically generated based on your course content and learning objectives.</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Enhancement Materials</h3>
            <p className="text-gray-600">Your program will include premium materials:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Pre-Program Survey for student assessment</li>
              <li>Welcome Packet with program overview</li>
              <li>Implementation Plan and timeline</li>
              <li>Certificate of Completion templates</li>
              <li>Bonus Resources (books, articles, online tools)</li>
            </ul>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm">These materials will be professionally designed to enhance the learning experience.</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Review Your Program</h3>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium">Program Title</h4>
                <p className="text-gray-600">{formData.programTitle}</p>
              </div>
              <div>
                <h4 className="font-medium">Target Audience</h4>
                <p className="text-gray-600">{formData.audience}</p>
              </div>
              <div>
                <h4 className="font-medium">Courses</h4>
                <p className="text-gray-600">{formData.courses.length} courses</p>
              </div>
            </div>
            <button
              onClick={generateProgram}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Program Materials'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (generatedMaterials) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Your Program Materials Are Ready!</h2>
        <div className="space-y-4">
          {Object.entries(generatedMaterials).map(([key, content]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{key.replace(/_/g, ' ').toUpperCase()}</h3>
                <button
                  onClick={() => downloadFile(content, `${key}.md`)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {content.length} characters
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setGeneratedMaterials(null);
            setCurrentStep(0);
            setFormData({
              programTitle: '',
              audience: '',
              emotionalTone: '',
              startingPoint: '',
              desiredTransformation: '',
              courses: []
            });
          }}
          className="mt-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
        >
          Create Another Program
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Generator</h1>
        <p className="text-gray-600">Create a comprehensive educational program</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index === currentStep ? 'bg-blue-600 text-white' : 
              index < currentStep ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
              {index < currentStep ? <CheckCircle2 size={16} /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 w-16 ${index < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{steps[currentStep]}</h2>
        {renderStepContent()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(prev => prev - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentStep === 0 ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(prev => prev + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            currentStep === steps.length - 1 ? 'invisible' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CourseGenerator;