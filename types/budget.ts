export interface Expense {
  category: string;
  amount: number;
  type: 'needs' | 'wants';
  percentage?: number;
}

export interface BudgetData {
  monthlyIncome: number;
  expenses: {
    [key: string]: number;
  };
  rule: {
    needs: number;
    wants: number;
    savings: number;
  };
  totalExpenses: number;
  remainingForSavings: number;
}

export interface BudgetRecommendation {
  category: string;
  currentSpending: number;
  recommendedSpending: number;
  tip: string;
  savings: number;
}
