"use client";

import { useState } from 'react';
import { BudgetData } from '@/types/budget';


export const useBudget = () => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

  const updateIncome = (income: number) => {
    setBudgetData(prev => {
      const needs = income * 0.5;
      const wants = income * 0.3;
      const savings = income * 0.2;

      return {
        ...prev,
        monthlyIncome: income,
        rule: { needs, wants, savings },
        expenses: prev?.expenses || {},
        totalExpenses: prev?.totalExpenses || 0,
        remainingForSavings: income - (prev?.totalExpenses || 0)
      };
    });
  };

  const updateExpense = (category: string, amount: number) => {
    setBudgetData(prev => {
      if (!prev) return null;

      const updatedExpenses = {
        ...prev.expenses,
        [category]: amount
      };

      const totalExpenses = Object.values(updatedExpenses).reduce(
        (sum, val) => sum + val, 
        0
      );

      return {
        ...prev,
        expenses: updatedExpenses,
        totalExpenses,
        remainingForSavings: prev.monthlyIncome - totalExpenses
      };
    });
  };

  const deleteExpense = (category: string) => {
    setBudgetData(prev => {
      if (!prev) return null;

      const updatedExpenses = { ...prev.expenses };
      delete updatedExpenses[category];

      const totalExpenses = Object.values(updatedExpenses).reduce(
        (sum, val) => sum + val, 
        0
      );

      return {
        ...prev,
        expenses: updatedExpenses,
        totalExpenses,
        remainingForSavings: prev.monthlyIncome - totalExpenses
      };
    });
  };

  const resetBudget = () => {
    setBudgetData(null);
  };

  return {
    budgetData,
    updateIncome,
    updateExpense,
    deleteExpense,
    resetBudget
  };
};