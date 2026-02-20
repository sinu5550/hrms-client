import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

export default function TimesheetEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    hours: 8,
    minutes: 0,
    description: '',
    billable: true,
  });

  const projects = [
    'HRMS Portal',
    'Client Dashboard',
    'E-Commerce Platform',
    'Mobile App Development',
    'Internal Tools',
  ];

  const taskCategories = [
    'Development',
    'Design',
    'Testing',
    'Code Review',
    'Meeting',
    'Documentation',
    'Bug Fixing',
    'Research',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const incrementHours = () => {
    if (formData.hours < 24) {
      setFormData({ ...formData, hours: formData.hours + 1 });
    }
  };

  const decrementHours = () => {
    if (formData.hours > 0) {
      setFormData({ ...formData, hours: formData.hours - 1 });
    }
  };

  const incrementMinutes = () => {
    if (formData.minutes < 45) {
      setFormData({ ...formData, minutes: formData.minutes + 15 });
    } else {
      setFormData({ ...formData, minutes: 0, hours: formData.hours + 1 });
    }
  };

  const decrementMinutes = () => {
    if (formData.minutes > 0) {
      setFormData({ ...formData, minutes: formData.minutes - 15 });
    } else if (formData.hours > 0) {
      setFormData({ ...formData, minutes: 45, hours: formData.hours - 1 });
    }
  };

  const totalHours = formData.hours + formData.minutes / 60;
  const estimatedCompletionTime = formData.task ? 2.5 : 0; // AI prediction

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    navigate('/timesheet');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/timesheet"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Timesheet
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">Log Time Entry</h1>
        <p className="text-gray-600 mt-1">Record your work hours and activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                />
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              {/* Task */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="task"
                  value={formData.task}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                >
                  <option value="">Select Task</option>
                  {taskCategories.map((task) => (
                    <option key={task} value={task}>{task}</option>
                  ))}
                </select>
              </div>

              {/* Time Entry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Spent <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Hours</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={decrementHours}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-5 h-5 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        name="hours"
                        value={formData.hours}
                        onChange={handleInputChange}
                        min="0"
                        max="24"
                        required
                        className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-lg font-semibold"
                      />
                      <button
                        type="button"
                        onClick={incrementHours}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minutes</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={decrementMinutes}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-5 h-5 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        name="minutes"
                        value={formData.minutes}
                        onChange={handleInputChange}
                        min="0"
                        max="45"
                        step="15"
                        required
                        className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-lg font-semibold"
                      />
                      <button
                        type="button"
                        onClick={incrementMinutes}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Describe what you worked on..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                />
              </div>

              {/* Billable */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billable"
                  name="billable"
                  checked={formData.billable}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#1a5f3f] border-gray-300 rounded focus:ring-[#1a5f3f]"
                />
                <label htmlFor="billable" className="text-sm font-medium text-gray-700">
                  This time is billable to client
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/timesheet')}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors"
                >
                  Log Time
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Time Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Time Summary</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#1a5f3f]/5 rounded-lg">
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-semibold text-[#1a5f3f]">
                  {Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m
                </p>
              </div>
              
              {formData.billable && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Billable</p>
                  <p className="text-lg font-semibold text-green-600">Yes</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Prediction */}
          {formData.task && (
            <div className="bg-gradient-to-br from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-white/20 p-2 rounded">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 7H7v6h6V7z" />
                    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold">AI Task Prediction</h3>
              </div>
              <p className="text-white/90 text-sm mb-3">
                Based on historical data for {formData.task} tasks:
              </p>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/70 text-xs">Estimated Time</p>
                <p className="text-xl font-semibold">{estimatedCompletionTime} hours</p>
              </div>
              <p className="text-white/80 text-xs mt-3">
                Your logged time is {totalHours > estimatedCompletionTime ? 'higher' : 'lower'} than average
              </p>
            </div>
          )}

          {/* Today's Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Today's Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Logged so far</span>
                <span className="font-medium text-gray-800">6.5 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current entry</span>
                <span className="font-medium text-[#1a5f3f]">{Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium">Total today</span>
                <span className="font-semibold text-gray-800">{(6.5 + totalHours).toFixed(1)} hours</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-medium text-blue-800 mb-2">💡 Quick Tips</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Log time daily for accuracy</li>
              <li>• Be specific in descriptions</li>
              <li>• Mark billable time correctly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
