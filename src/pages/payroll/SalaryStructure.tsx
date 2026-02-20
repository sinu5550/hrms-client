import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Plus, Edit2, Trash2, DollarSign } from 'lucide-react';

interface SalaryComponent {
  id: string;
  name: string;
  type: 'Allowance' | 'Deduction';
  calculation: 'Fixed' | 'Percentage';
  value: number;
  taxable: boolean;
  mandatory: boolean;
}

export default function SalaryStructure() {
  const [activeTab, setActiveTab] = useState<'allowances' | 'deductions'>('allowances');

  const components: SalaryComponent[] = [
    { id: '1', name: 'Basic Salary', type: 'Allowance', calculation: 'Fixed', value: 5000, taxable: true, mandatory: true },
    { id: '2', name: 'House Rent Allowance', type: 'Allowance', calculation: 'Percentage', value: 40, taxable: true, mandatory: false },
    { id: '3', name: 'Transport Allowance', type: 'Allowance', calculation: 'Fixed', value: 500, taxable: false, mandatory: false },
    { id: '4', name: 'Medical Allowance', type: 'Allowance', calculation: 'Fixed', value: 300, taxable: false, mandatory: false },
    { id: '5', name: 'Special Allowance', type: 'Allowance', calculation: 'Percentage', value: 20, taxable: true, mandatory: false },
    { id: '6', name: 'Provident Fund', type: 'Deduction', calculation: 'Percentage', value: 12, taxable: false, mandatory: true },
    { id: '7', name: 'Income Tax', type: 'Deduction', calculation: 'Percentage', value: 15, taxable: false, mandatory: true },
    { id: '8', name: 'Professional Tax', type: 'Deduction', calculation: 'Fixed', value: 200, taxable: false, mandatory: true },
    { id: '9', name: 'Loan Deduction', type: 'Deduction', calculation: 'Fixed', value: 500, taxable: false, mandatory: false },
  ];

  const allowances = components.filter(c => c.type === 'Allowance');
  const deductions = components.filter(c => c.type === 'Deduction');

  // Calculate example salary
  const exampleBasic = 5000;
  const totalAllowances = allowances.reduce((sum, comp) => {
    if (comp.calculation === 'Fixed') {
      return sum + comp.value;
    } else {
      return sum + (exampleBasic * comp.value / 100);
    }
  }, 0);

  const grossSalary = totalAllowances;
  const totalDeductions = deductions.reduce((sum, comp) => {
    if (comp.calculation === 'Fixed') {
      return sum + comp.value;
    } else {
      return sum + (grossSalary * comp.value / 100);
    }
  }, 0);

  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/payroll"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Payroll
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Salary Structure Setup</h1>
            <p className="text-gray-600 mt-1">Configure salary components, allowances, and deductions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            Add Component
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Components List */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('allowances')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'allowances'
                    ? 'text-[#1a5f3f] border-b-2 border-[#1a5f3f]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Allowances ({allowances.length})
              </button>
              <button
                onClick={() => setActiveTab('deductions')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  activeTab === 'deductions'
                    ? 'text-[#1a5f3f] border-b-2 border-[#1a5f3f]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Deductions ({deductions.length})
              </button>
            </div>
          </div>

          {/* Allowances */}
          {activeTab === 'allowances' && (
            <div className="space-y-4">
              {allowances.map((component) => (
                <div key={component.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{component.name}</h3>
                        {component.mandatory && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            Mandatory
                          </span>
                        )}
                        {component.taxable && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">
                            Taxable
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="text-gray-500">Calculation Type</p>
                          <p className="font-medium text-gray-800">{component.calculation}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Value</p>
                          <p className="font-medium text-gray-800">
                            {component.calculation === 'Fixed' ? `$${component.value}` : `${component.value}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      {!component.mandatory && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Deductions */}
          {activeTab === 'deductions' && (
            <div className="space-y-4">
              {deductions.map((component) => (
                <div key={component.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{component.name}</h3>
                        {component.mandatory && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            Mandatory
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="text-gray-500">Calculation Type</p>
                          <p className="font-medium text-gray-800">{component.calculation}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Value</p>
                          <p className="font-medium text-gray-800">
                            {component.calculation === 'Fixed' ? `$${component.value}` : `${component.value}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      {!component.mandatory && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salary Calculator */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1a5f3f] to-[#2d8f5f] rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6" />
              <h3 className="font-semibold text-lg">Salary Calculator</h3>
            </div>
            <p className="text-white/80 text-sm mb-4">Example calculation based on current structure</p>
            
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/70 text-sm">Basic Salary</p>
                <p className="text-xl font-semibold">${exampleBasic.toFixed(2)}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/70 text-sm">+ Total Allowances</p>
                <p className="text-xl font-semibold">${(totalAllowances - exampleBasic).toFixed(2)}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/70 text-sm">= Gross Salary</p>
                <p className="text-2xl font-semibold">${grossSalary.toFixed(2)}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/70 text-sm">- Total Deductions</p>
                <p className="text-xl font-semibold">${totalDeductions.toFixed(2)}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 mt-4">
                <p className="text-gray-600 text-sm">Net Salary</p>
                <p className="text-3xl font-bold text-[#1a5f3f]">${netSalary.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Overtime Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Overtime Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Overtime Rate Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="1.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Holiday Rate Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="2.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5f3f]"
                />
              </div>
              <button className="w-full px-4 py-2 bg-[#1a5f3f] hover:bg-[#155233] text-white rounded-lg transition-colors">
                Save Configuration
              </button>
            </div>
          </div>

          {/* Tax Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Tax Management</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Tax Slabs</span>
                <button className="text-[#1a5f3f] text-sm font-medium">Configure</button>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Tax Exemptions</span>
                <button className="text-[#1a5f3f] text-sm font-medium">Manage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
