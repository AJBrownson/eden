"use client";
import React from 'react';
import { BudgetData } from '@/types/budget';
// import { Trash2, Edit2 } from 'lucide-react';

interface BudgetTableProps {
  budgetData: BudgetData;
  onDeleteExpense: (category: string) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ 
  budgetData, 
  onDeleteExpense 
}) => {
  const needsCategories = ['rent', 'groceries', 'transportation'];

  const getCategoryType = (category: string): 'needs' | 'wants' => {
    return needsCategories.includes(category) ? 'needs' : 'wants';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Expense Breakdown 📊
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Income</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(budgetData.expenses).map(([category, amount]) => {
              const type = getCategoryType(category);
              const percentage = ((amount / budgetData.monthlyIncome) * 100).toFixed(1);

              return (
                <tr 
                  key={category} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 capitalize font-medium text-gray-800">
                    {category}
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        type === 'needs' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-800">
                    ${amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {percentage}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteExpense(category)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      title="Delete expense"
                    >
                      {/* <Trash2 size={18} /> */}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 font-bold text-lg">
              <td className="py-4 px-4 text-gray-800" colSpan={2}>
                Total Expenses
              </td>
              <td className="py-4 px-4 text-right text-gray-800">
                ${budgetData.totalExpenses.toFixed(2)}
              </td>
              <td className="py-4 px-4 text-right text-gray-600">
                {((budgetData.totalExpenses / budgetData.monthlyIncome) * 100).toFixed(1)}%
              </td>
              <td></td>
            </tr>
            <tr className="font-bold text-lg">
              <td 
                className={`py-4 px-4 ${
                  budgetData.remainingForSavings >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`} 
                colSpan={2}
              >
                {budgetData.remainingForSavings >= 0 ? 'Left for Savings 💰' : 'Over Budget 😬'}
              </td>
              <td 
                className={`py-4 px-4 text-right ${
                  budgetData.remainingForSavings >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}
              >
                ${Math.abs(budgetData.remainingForSavings).toFixed(2)}
              </td>
              <td className="py-4 px-4 text-right text-gray-600">
                {((Math.abs(budgetData.remainingForSavings) / budgetData.monthlyIncome) * 100).toFixed(1)}%
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};