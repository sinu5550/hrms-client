import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'Public' | 'Optional' | 'Religious';
  description: string;
}

export default function HolidayCalendar() {
  const [selectedYear, setSelectedYear] = useState(2026);

  const holidays: Holiday[] = [
    {
      id: '1',
      name: 'New Year\'s Day',
      date: '2026-01-01',
      type: 'Public',
      description: 'First day of the year'
    },
    {
      id: '2',
      name: 'Independence Day',
      date: '2026-03-26',
      type: 'Public',
      description: 'National Independence Day celebration'
    },
    {
      id: '3',
      name: 'Bengali New Year',
      date: '2026-04-14',
      type: 'Public',
      description: 'Pohela Boishakh - Bengali New Year'
    },
    {
      id: '4',
      name: 'Labor Day',
      date: '2026-05-01',
      type: 'Public',
      description: 'International Workers\' Day'
    },
    {
      id: '5',
      name: 'Eid al-Fitr',
      date: '2026-05-24',
      type: 'Religious',
      description: 'End of Ramadan (Date may vary)'
    },
    {
      id: '6',
      name: 'Eid al-Adha',
      date: '2026-07-31',
      type: 'Religious',
      description: 'Festival of Sacrifice (Date may vary)'
    },
    {
      id: '7',
      name: 'National Mourning Day',
      date: '2026-08-15',
      type: 'Public',
      description: 'Remembrance day'
    },
    {
      id: '8',
      name: 'Victory Day',
      date: '2026-12-16',
      type: 'Public',
      description: 'National Victory Day celebration'
    },
    {
      id: '9',
      name: 'Christmas',
      date: '2026-12-25',
      type: 'Optional',
      description: 'Christmas celebration'
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Public':
        return 'bg-[#1a5f3f] text-white';
      case 'Religious':
        return 'bg-purple-500 text-white';
      case 'Optional':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getMonthName = (month: number) => {
    return new Date(2026, month, 1).toLocaleDateString('en-US', { month: 'long' });
  };

  // Group holidays by month
  const holidaysByMonth: { [key: number]: Holiday[] } = {};
  holidays.forEach(holiday => {
    const month = new Date(holiday.date).getMonth();
    if (!holidaysByMonth[month]) {
      holidaysByMonth[month] = [];
    }
    holidaysByMonth[month].push(holiday);
  });

  const stats = {
    total: holidays.length,
    public: holidays.filter(h => h.type === 'Public').length,
    religious: holidays.filter(h => h.type === 'Religious').length,
    optional: holidays.filter(h => h.type === 'Optional').length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/leave"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Leave Management
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Holiday Calendar</h1>
            <p className="text-gray-600 mt-1">View company holidays and plan your leave</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            Add Holiday
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Holidays</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Public Holidays</p>
              <p className="text-2xl font-semibold text-[#1a5f3f] mt-1">{stats.public}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1a5f3f] flex items-center justify-center text-white font-semibold">
              {stats.public}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Religious Holidays</p>
              <p className="text-2xl font-semibold text-purple-600 mt-1">{stats.religious}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
              {stats.religious}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Optional Holidays</p>
              <p className="text-2xl font-semibold text-blue-600 mt-1">{stats.optional}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {stats.optional}
            </div>
          </div>
        </div>
      </div>

      {/* Year Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Select Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f] focus:border-transparent"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2027}>2027</option>
          </select>

          {/* Legend */}
          <div className="flex gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#1a5f3f]"></div>
              <span className="text-sm text-gray-600">Public</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-sm text-gray-600">Religious</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-600">Optional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holiday List by Month */}
      <div className="space-y-6">
        {Object.keys(holidaysByMonth)
          .sort((a, b) => Number(a) - Number(b))
          .map((monthKey) => {
            const month = Number(monthKey);
            const monthHolidays = holidaysByMonth[month];
            
            return (
              <div key={month} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">{getMonthName(month)} {selectedYear}</h2>
                  <p className="text-sm text-gray-600 mt-1">{monthHolidays.length} {monthHolidays.length === 1 ? 'holiday' : 'holidays'}</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {monthHolidays.map((holiday) => (
                    <div key={holiday.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-lg bg-[#1a5f3f]/10 border-2 border-[#1a5f3f] flex flex-col items-center justify-center">
                              <span className="text-2xl font-semibold text-[#1a5f3f]">
                                {new Date(holiday.date).getDate()}
                              </span>
                              <span className="text-xs text-gray-600">
                                {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-800 text-lg">{holiday.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(holiday.type)}`}>
                                {holiday.type}
                              </span>
                            </div>
                            <p className="text-gray-600">{holiday.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(holiday.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Religious holiday dates may vary based on lunar calendar and will be confirmed closer to the date. 
          Optional holidays can be taken subject to approval and team availability.
        </p>
      </div>
    </div>
  );
}
