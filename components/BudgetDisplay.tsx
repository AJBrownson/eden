"use client";

import { BudgetData } from '@/types/budget';
import { BudgetChart } from './BudgetChart';
import { BudgetTable } from './BudgetTable';
// import { Download, RefreshCw } from 'lucide-react';

interface BudgetDisplayProps {
  budgetData: BudgetData | null;
  onDeleteExpense: (category: string) => void;
  onReset: () => void;
}

export const BudgetDisplay: React.FC<BudgetDisplayProps> = ({ 
  budgetData, 
  onDeleteExpense,
  onReset 
}) => {
  const exportToCSV = () => {
    if (!budgetData) return;

    let csv = "Category,Amount,Type,Percentage\n";
    
    Object.entries(budgetData.expenses).forEach(([category, amount]) => {
      const needsCategories = ['rent', 'groceries', 'transportation'];
      const type = needsCategories.includes(category) ? 'needs' : 'wants';
      const percentage = ((amount / budgetData.monthlyIncome) * 100).toFixed(1);
      csv += `${category},${amount},${type},${percentage}%\n`;
    });

    csv += `\nTotal Expenses,${budgetData.totalExpenses},,\n`;
    csv += `Remaining for Savings,${budgetData.remainingForSavings},,\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ginny-budget.csv';
    a.click();
  };

  if (!budgetData) {
    return (
      <div className="min-h-screen flex items-center justify-center h-full">
        <div className="text-center p-8 rounded-2xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold mb-2">
            Chat with Ginny to Get Started!
          </h2>
          <p>
            Tell Ginny about your income and expenses and watch your budget appear here in real-time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-slate-500 p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Budget</h2>
            <p className="text-purple-100">
              Monthly Income: <span className="font-bold text-2xl">${budgetData.monthlyIncome.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-black px-4 py-2 rounded-lg font-semibold"
            >
              Export CSV
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Budget Chart */}
      <BudgetChart budgetData={budgetData} />

      {/* Budget Table */}
      <BudgetTable 
        budgetData={budgetData} 
        onDeleteExpense={onDeleteExpense} 
      />

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          💡 Pro Tips from Ginny
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Ask Ginny to suggest ways to save money in specific categories</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Tell Ginny to adjust any expense and watch the budget update in real-time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            <span>Ask &quot;What if I reduced dining out by $50?&quot; to see instant projections</span>
          </li>
        </ul>
      </div>
    </div>
  );
};