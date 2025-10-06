"use client";

import { BudgetData } from '@/types/budget';

interface BudgetChartProps {
  budgetData: BudgetData;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData }) => {
  const needsCategories = ['rent', 'groceries', 'transportation'];
  const wantsCategories = ['subscriptions', 'diningOut', 'shopping', 'entertainment', 'other'];

  const currentNeeds = needsCategories.reduce(
    (sum, cat) => sum + (budgetData.expenses[cat] || 0), 
    0
  );
  const currentWants = wantsCategories.reduce(
    (sum, cat) => sum + (budgetData.expenses[cat] || 0), 
    0
  );

  const needsPercentage = (currentNeeds / budgetData.monthlyIncome) * 100;
  const wantsPercentage = (currentWants / budgetData.monthlyIncome) * 100;
  const savingsPercentage = (budgetData.remainingForSavings / budgetData.monthlyIncome) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        50/30/20 Rule Breakdown
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-sm text-green-600 font-semibold mb-1">NEEDS (50%)</div>
          <div className="text-3xl font-bold text-green-700">
            ${budgetData.rule.needs.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Current: ${currentNeeds.toFixed(0)}
          </div>
          {currentNeeds > budgetData.rule.needs && (
            <div className="text-xs text-red-500 font-semibold mt-1">
              Over by ${(currentNeeds - budgetData.rule.needs).toFixed(0)} 😬
            </div>
          )}
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
          <div className="text-sm text-orange-600 font-semibold mb-1">WANTS (30%)</div>
          <div className="text-3xl font-bold text-orange-700">
            ${budgetData.rule.wants.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Current: ${currentWants.toFixed(0)}
          </div>
          {currentWants > budgetData.rule.wants && (
            <div className="text-xs text-red-500 font-semibold mt-1">
              Over by ${(currentWants - budgetData.rule.wants).toFixed(0)} 💀
            </div>
          )}
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-1">SAVINGS (20%)</div>
          <div className="text-3xl font-bold text-blue-700">
            ${budgetData.rule.savings.toFixed(0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Current: ${Math.max(0, budgetData.remainingForSavings).toFixed(0)}
          </div>
          {budgetData.remainingForSavings < budgetData.rule.savings && (
            <div className="text-xs text-red-500 font-semibold mt-1">
              Short by ${(budgetData.rule.savings - budgetData.remainingForSavings).toFixed(0)} 💸
            </div>
          )}
        </div>
      </div>

      {/* Visual Bar */}
      <div className="w-full h-12 flex rounded-lg overflow-hidden shadow-md">
        <div 
          className="bg-green-500 flex items-center justify-center text-white font-bold text-sm"
          style={{ width: `${needsPercentage}%` }}
        >
          {needsPercentage.toFixed(0)}%
        </div>
        <div 
          className="bg-orange-500 flex items-center justify-center text-white font-bold text-sm"
          style={{ width: `${wantsPercentage}%` }}
        >
          {wantsPercentage.toFixed(0)}%
        </div>
        <div 
          className="bg-blue-500 flex items-center justify-center text-white font-bold text-sm"
          style={{ width: `${savingsPercentage}%` }}
        >
          {savingsPercentage.toFixed(0)}%
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Needs</span>
        <span>Wants</span>
        <span>Savings</span>
      </div>
    </div>
  );
};