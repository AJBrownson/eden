"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { BudgetDisplay } from "@/components/BudgetDisplay";
import { useBudget } from "@/hooks/useBudget";


export default function Home() {
  const { 
    budgetData, 
    updateIncome, 
    updateExpense, 
    deleteExpense,
    resetBudget 
  } = useBudget();

  // Make budget data readable to Copilot
  useCopilotReadable({
    description: "User's current budget data including income, expenses, and remaining savings",
    value: budgetData || { message: "No budget created yet" }
  });

  // Action: Update monthly income
  useCopilotAction({
    name: "updateIncome",
    description: "Update the user's monthly income",
    parameters: [
      {
        name: "amount",
        type: "number",
        description: "Monthly income in dollars",
        required: true
      }
    ],
    handler: async ({ amount }) => {
      updateIncome(amount);
      return `Income updated to $${amount}/month! Let's start tracking your expenses.`;
    }
  });

  // Action: Add or update expense
  useCopilotAction({
    name: "updateExpense",
    description: "Add or update an expense category",
    parameters: [
      {
        name: "category",
        type: "string",
        description: "Expense category (rent, groceries, transportation, subscriptions, diningOut, shopping, entertainment, other)",
        required: true
      },
      {
        name: "amount",
        type: "number",
        description: "Monthly amount spent in this category",
        required: true
      }
    ],
    handler: async ({ category, amount }) => {
      updateExpense(category, amount);
      
      // Provide sassy feedback based on amount
      let response = `Got it! ${category} set to $${amount}/month. `;
      
      if (category === 'diningOut' && amount > 150) {
        response += "That's a lot of DoorDash bestie 💀";
      } else if (category === 'shopping' && amount > 200) {
        response += "Okay I see you shopping 👀";
      } else if (category === 'subscriptions' && amount > 50) {
        response += "Do you even use all those subscriptions tho? 🤔";
      } else {
        response += "Looking good! 💅";
      }
      
      return response;
    }
  });

  // Action: Delete expense
  useCopilotAction({
    name: "deleteExpense",
    description: "Remove an expense category from the budget",
    parameters: [
      {
        name: "category",
        type: "string",
        description: "Category to remove",
        required: true
      }
    ],
    handler: async ({ category }) => {
      deleteExpense(category);
      return `${category} removed from your budget!`;
    }
  });

  // Action: Provide budget suggestions
  useCopilotAction({
    name: "provideSuggestion",
    description: "Analyze the budget and provide a specific suggestion for improvement",
    parameters: [
      {
        name: "category",
        type: "string",
        description: "Category to provide suggestion for (optional)",
        required: false
      }
    ],
    handler: async ({ category }) => {
      if (!budgetData) {
        return "Create a budget first by telling me your income and expenses!";
      }

      const needsCategories = ['rent', 'groceries', 'transportation'];
      const currentNeeds = needsCategories.reduce(
        (sum, cat) => sum + (budgetData.expenses[cat] || 0), 
        0
      );
      const wantsCategories = ['subscriptions', 'diningOut', 'shopping', 'entertainment', 'other'];
      const currentWants = wantsCategories.reduce(
        (sum, cat) => sum + (budgetData.expenses[cat] || 0), 
        0
      );

      let suggestion = "";

      if (category) {
        const amount = budgetData.expenses[category] || 0;
        if (category === 'diningOut' && amount > 100) {
          suggestion = `Try meal prepping on Sundays! You could cut your dining out from $${amount} to $80 and save $${(amount - 80).toFixed(0)}/month. That's $${((amount - 80) * 12).toFixed(0)}/year bestie! 💰`;
        } else if (category === 'subscriptions' && amount > 30) {
          suggestion = `Review all your subscriptions. Cancel the ones you haven't used in a month. You could probably cut this to $20 and save $${(amount - 20).toFixed(0)}/month! 📺`;
        } else {
          suggestion = `Your ${category} spending looks reasonable at $${amount}/month. Keep it up! 💪`;
        }
      } else {
        // General suggestions
        if (currentWants > budgetData.rule.wants) {
          const overage = currentWants - budgetData.rule.wants;
          suggestion = `You're spending $${overage.toFixed(0)} too much on wants! Try cutting back on dining out and shopping to hit your 30% target. Small changes = big savings bestie! 💸`;
        } else if (budgetData.remainingForSavings < budgetData.rule.savings) {
          suggestion = `You're short on your savings goal! Try the 52-week challenge: save $1 week 1, $2 week 2, etc. You'll save $1,378 by the end! 🎯`;
        } else {
          suggestion = `You're doing great! Your budget is balanced. Keep tracking and you'll hit your goals no cap! 🔥`;
        }
      }

      return suggestion;
    }
  });

  // Action: What-if scenario
  useCopilotAction({
    name: "whatIfScenario",
    description: "Show what would happen if user changes a specific expense",
    parameters: [
      {
        name: "category",
        type: "string",
        description: "Category to adjust",
        required: true
      },
      {
        name: "newAmount",
        type: "number",
        description: "New amount to test",
        required: true
      }
    ],
    handler: async ({ category, newAmount }) => {
      if (!budgetData) {
        return "Create a budget first!";
      }

      const currentAmount = budgetData.expenses[category] || 0;
      const difference = currentAmount - newAmount;
      const newSavings = budgetData.remainingForSavings + difference;

      return `If you changed ${category} from $${currentAmount} to $${newAmount}:\n- You'd save $${difference.toFixed(2)}/month ($${(difference * 12).toFixed(2)}/year)\n- Your monthly savings would be $${newSavings.toFixed(2)}\n\nWant me to update it for real? Just say "update ${category} to $${newAmount}"! 💪`;
    }
  });

  return (
    <>
      <CopilotSidebar
        defaultOpen={true}
        instructions={`You are Ginny, a Gen-Z financial advisor helping users create and manage their budget.

        Your conversation flow:
        1. GREETING: Ask about their monthly income first
        2. EXPENSES: Ask about spending categories one at a time:
        - rent, groceries, transportation, subscriptions, diningOut, shopping, entertainment, other
        3. BUDGET UPDATES: User can ask you to:
        - Adjust any expense: "change rent to $1200"
        - Get suggestions: "how can I save money?"
        - What-if scenarios: "what if I cut dining out by $50?"
        - Delete expenses: "remove shopping"

        ACTIONS YOU CAN USE:
        - updateIncome: When user mentions income
        - updateExpense: When user mentions any expense amount
        - deleteExpense: When user wants to remove a category
        - provideSuggestion: When user asks for advice
        - whatIfScenario: When user asks "what if"

        PERSONALITY:
        - Use a sassy tone: Speak like a black american woman in her mid-twenties
        - Use Gen-Z slang: "fam", "bestie", "no cap", "it's giving", "slay"
        - React to high spending: "bestie that's a lot 💀", "okay I see you 👀"
        - Be encouraging: "you got this! 💪", "slay your budget! 🔥"

        Be conversational, helpful, and make budgeting fun!`}
        labels={{
          title: "Ginny",
          initial: "Yo fam! I'm Ginny 👋 and I'm here to help you get your finances together. Let's start with the basics - what's your monthly income? (be honest, no judgment here)"
        }}
      >
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <BudgetDisplay 
              budgetData={budgetData}
              onDeleteExpense={deleteExpense}
              onReset={resetBudget}
            />
          </div>
        </main>
      </CopilotSidebar>
    </>
  );
}
