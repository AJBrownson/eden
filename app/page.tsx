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
    deleteExpense
  } = useBudget();

  // Make the budget data readable to Copilot
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
      
      // // Provide sassy feedback based on amount
      // let response = `Got it! ${category} set to $${amount}/month. `;
      
      // if (category === 'diningOut' && amount > 150) {
      //   response += "That's a lot of DoorDash bestie 💀";
      // } else if (category === 'shopping' && amount > 200) {
      //   response += "Okay I see you shopping 👀";
      // } else if (category === 'subscriptions' && amount > 50) {
      //   response += "Do you even use all those subscriptions tho? 🤔";
      // } else {
      //   response += "Looking good! 💅";
      // }
      
      // return response;
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

      return `If you changed ${category} from $${currentAmount} to $${newAmount}:\n- You'd save $${difference.toFixed(2)}/month ($${(difference * 12).toFixed(2)}/year)\n- Your monthly savings would be $${newSavings.toFixed(2)}\n\nWant me to update it for real? Just say "update ${category} to $${newAmount}"`;
    }
  });

// Action: Roast user's spending habits
useCopilotAction({
  name: "roastUserSpendingHabits",
  description: "Generate a hilarious but helpful roast of the user's spending and saving habits based on their budget data. Analyze their worst spending categories and savings rate to create a personalized roast.",
  parameters: [
    {
      name: "roasts",
      type: "string",
      description: "Intensity of the roast: 'gentle' (playful teasing), 'medium' (direct but funny), or 'savage' (unhinged, no holding back)",
      required: false
    }
  ],
  handler: async ({ roasts = "medium" }) => {
    if (!budgetData) {
      return "Bestie, I can't roast you yet - you haven't told me your budget! That's like showing up to a roast battle unarmed";
    }

    // Calculate roast-worthy metrics
    const wantsCategories = ['subscriptions', 'diningOut', 'shopping', 'entertainment', 'other'];
    const currentWants = wantsCategories.reduce(
      (sum, cat) => sum + (budgetData.expenses[cat] || 0), 
      0
    );

    const savingsRate = (budgetData.remainingForSavings / budgetData.monthlyIncome) * 100;
    const wantsPercentage = (currentWants / budgetData.monthlyIncome) * 100;
    
    // Find the worst offender
    let worstCategory = { name: '', amount: 0, percentage: 0 };
    Object.entries(budgetData.expenses).forEach(([category, amount]) => {
      if (wantsCategories.includes(category) && amount > worstCategory.amount) {
        worstCategory = {
          name: category,
          amount: amount,
          percentage: (amount / budgetData.monthlyIncome) * 100
        };
      }
    });

    // Calculate yearly waste
    const yearlyWaste = worstCategory.amount * 12;

    // Return structured data for CopilotKit to use in generating the roast
    return `ROAST DATA ANALYSIS (${roasts}):

        FINANCIAL BREAKDOWN:
        - Monthly income: $${budgetData.monthlyIncome}
        - Total expenses: $${budgetData.totalExpenses}
        - Savings rate: ${savingsRate.toFixed(1)}% (Target: 20%)
        - Wants spending: ${wantsPercentage.toFixed(1)}% of income (Target: 30%)

        WORST OFFENDER:
        - Category: ${worstCategory.name}
        - Monthly: $${worstCategory.amount} (${worstCategory.percentage.toFixed(1)}% of income)
        - Yearly: $${yearlyWaste} 💀

        ALL EXPENSES:
        ${Object.entries(budgetData.expenses) .map(([cat, amt]) => `- ${cat}: $${amt}/month`).join('\n')}

        ${savingsRate < 0 ? "⚠️ CRISIS MODE: They're OVER BUDGET with NEGATIVE savings!" : ""}
        ${savingsRate < 10 ? "⚠️ Savings rate is dangerously low!" : ""}
        ${worstCategory.percentage > 10 ? `⚠️ Spending ${worstCategory.percentage.toFixed(1)}% on ${worstCategory.name} is WILD!` : ""}

        Now generate ${roasts} that:
        1. Opens with a devastating but hilarious observation about their spending
        2. Calls out the worst category (${worstCategory.name}) specifically with numbers
        3. Uses Gen-Z slang: "fam", "bestie", "no cap", "it's giving broke", "not you spending"
        4. Includes emojis: 💀, 👀, 💸, 🔥, 💅, 😭
        5. Makes specific math references (like yearly waste: $${yearlyWaste})
        6. Ends with ONE genuinely good, actionable piece of advice
        7. Is just 2 sentences in total
        8. Is funny and savage - roast the user with tough love`;
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
        - What-if scenarios: "what if I reduce groceries by 50%?"
        - Delete expenses: "remove shopping"

        4. USER ROASTS: If the user is done with the budget, ask if they will like to be roasted

        ACTIONS YOU CAN USE:
        - updateIncome: When user mentions income
        - updateExpense: When user mentions any expense amount
        - deleteExpense: When user wants to remove a category
        - provideSuggestion: When user asks for advice
        - whatIfScenario: When user asks "what if"
        - roastSpendingHabits: When user asks to be roasted

        ROASTING INSTRUCTIONS:
        When user wants a roast:
        1. Call roastUserSpendingHabits action

        2. The action returns detailed analysis. Use that data to generate a savage roast that:
        - Opens with a shocking observation about their worst spending
        - Calls out specific numbers and percentages
        - Uses Gen-Z slang throughout
        - References yearly waste to make it hurt more
        - Ends with genuine helpful advice

        3. Example roast structure:
        "Yo fam. The way you're spending [X]% on [category] 💀 That's $[amount]/month! 
        Over a YEAR that's $[yearly]... [comparison to what they could buy instead]. 
        [More roasting with specific numbers]. No cap, if you cut this to $[lower amount], 
        you'd save $[savings]/month. [Actionable advice]"

        PERSONALITY:
        - Use a sassy tone: Speak like a black american woman in her mid-twenties
        - Use Gen-Z slang: "fam", "bestie", "no cap", "it's giving", "slay"
        - React to high spending: "bestie that's a lot 💀", "okay I see you 👀"
        - Be encouraging: "you got this! 💪", "slay your budget! 🔥"
        - When roasting, be funny and savage - roast with tough love

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
            />
          </div>
        </main>
      </CopilotSidebar>
    </>
  );
}
