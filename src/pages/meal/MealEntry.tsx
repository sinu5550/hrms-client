import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

export default function MealEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mealCount: 1,
    guestCount: 0,
    costSplit: '50/50' as '50/50' | '100%',
    mealCost: 150,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const incrementMeals = () => {
    setFormData({ ...formData, mealCount: formData.mealCount + 1 });
  };

  const decrementMeals = () => {
    if (formData.mealCount > 0) {
      setFormData({ ...formData, mealCount: formData.mealCount - 1 });
    }
  };

  const incrementGuests = () => {
    setFormData({ ...formData, guestCount: formData.guestCount + 1 });
  };

  const decrementGuests = () => {
    if (formData.guestCount > 0) {
      setFormData({ ...formData, guestCount: formData.guestCount - 1 });
    }
  };

  const totalMeals = formData.mealCount + formData.guestCount;
  const totalCost = totalMeals * formData.mealCost;
  const employeeCost = formData.costSplit === '50/50' 
    ? (formData.mealCount * formData.mealCost) / 2 
    : 0;
  const companyCost = totalCost - employeeCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    navigate('/meal-expense');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/meal-expense"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Meal & Expense
        </Link>
        <h1 className="text-3xl font-semibold text-gray-800">Add Meal Entry</h1>
        <p className="text-gray-600 mt-1">Record your daily meal consumption</p>
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

              {/* Meal Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Personal Meals <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={decrementMeals}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="number"
                    name="mealCount"
                    value={formData.mealCount}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-20 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-lg font-semibold"
                  />
                  <button
                    type="button"
                    onClick={incrementMeals}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-gray-600">meals</span>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guest Meals
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={decrementGuests}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-20 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent text-lg font-semibold"
                  />
                  <button
                    type="button"
                    onClick={incrementGuests}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-gray-600">guests</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Guest meals are typically 100% company paid</p>
              </div>

              {/* Cost Split */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Split for Personal Meals <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, costSplit: '50/50' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.costSplit === '50/50'
                        ? 'border-[#1a5f3f] bg-[#1a5f3f]/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">50/50 Split</p>
                    <p className="text-sm text-gray-600 mt-1">Company and employee share equally</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, costSplit: '100%' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.costSplit === '100%'
                        ? 'border-[#1a5f3f] bg-[#1a5f3f]/5'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">100% Company</p>
                    <p className="text-sm text-gray-600 mt-1">Fully paid by company</p>
                  </button>
                </div>
              </div>

              {/* Cost Per Meal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Per Meal ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="mealCost"
                  value={formData.mealCost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Add any additional notes about this meal entry..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/meal-expense')}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors"
                >
                  Submit Entry
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Cost Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Cost Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Total Meals</span>
                <span className="font-semibold text-gray-800">{totalMeals}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600 text-sm">Personal: {formData.mealCount}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600 text-sm">Guest: {formData.guestCount}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between p-3 bg-blue-50 rounded">
                  <span className="text-gray-700 font-medium">Total Cost</span>
                  <span className="font-semibold text-blue-600">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 rounded mt-2">
                  <span className="text-gray-700 font-medium">Company Pays</span>
                  <span className="font-semibold text-green-600">${companyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded mt-2">
                  <span className="text-gray-700 font-medium">You Pay</span>
                  <span className="font-semibold text-orange-600">${employeeCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-medium text-blue-800 mb-2">💡 Important Notes</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Guest meals are 100% company paid</li>
              <li>• 50/50 split means you pay half</li>
              <li>• Entries can be edited within 24 hours</li>
              <li>• Monthly billing on the 1st of each month</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
