# 💰 Expense Splitter Challenge

## Time Limit: 2 hours

Welcome to the Expense Splitter coding challenge! Your task is to build a fully functional React + TypeScript application that helps groups of people track and split expenses.

## 🚀 Getting Started

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Run tests:

   ```bash
   npm test
   ```

## 📖 Application Overview

The Expense Splitter helps groups of people (roommates, friends on trips, etc.) track shared expenses and calculate who owes whom. Users can:

1. Manage a group of people
2. Record expenses paid by members of the group
3. Specify how each expense should be split
4. See calculated balances and suggested settlements

The application currently displays initial sample data but needs full functionality implemented.

**📸 Visual Reference:** See the `screenshots/` folder for images of what the completed application should look like. These screenshots show all features working and can help you understand the requirements.

## 📋 Detailed Requirements

### 1. People Management

**What it does:** Manage the list of people in the expense-sharing group.

**Required Operations:**

- **Add Person:** Users should be able to add new people to the group by entering their name
- **Remove Person:** Users should be able to remove people from the group
- **Display List:** Show all current members with their names

**User Experience:**

- The form should clear after successfully adding a person
- Users should receive feedback when operations succeed or fail
- The current count of members should be visible

---

### 2. Expense Management

**What it does:** Record and track expenses paid by group members.

**Required Data for Each Expense:**

- **Description:** What the expense was for (e.g., "Dinner at restaurant")
- **Amount:** The monetary value in dollars
- **Paid By:** Which person paid for this expense
- **Date:** When the expense occurred
- **Split Between:** Which people should share this expense
- **Split Type:** How the expense should be divided
  - **Equal Split:** Divide amount equally among selected people
  - **Custom Split:** Specify exact amounts for each person

**Required Operations:**

- **Add Expense:** Create a new expense record with all required fields
- **Delete Expense:** Remove an expense from the list
- **View Details:** Display expense information including who paid and how it's split

**User Experience:**

- The form should provide all necessary input fields
- Display existing expenses in a clear, readable format
- Show the total count of expenses

---

### 3. Balance Calculation & Display

**What it does:** Calculate and display financial balances for the group.

**Required Calculations:**

- **Individual Balances:** For each person, calculate:
  - Total amount they paid for all expenses
  - Total amount they owe based on their share of expenses
  - Net balance (positive if owed money, negative if owing money)

- **Total Group Spending:** Sum of all expense amounts

- **Debt Simplification:** Calculate the minimum number of transactions needed to settle all debts
  - Example: If Alice owes Bob $20 and Bob owes Charlie $20, simplify to Alice pays Charlie $20

**Required Displays:**

- **Total Group Spending:** Show the overall sum
- **Individual Balances:** For each person show:
  - Their name
  - Whether they are owed money, owe money, or are settled up
  - The amount
- **Suggested Settlements:** Show simplified transactions (who should pay whom and how much)

---

### 4. State Management & Data Flow

**Challenge:** Components need to share data and communicate changes.

**Current State:**

- Components currently use `initialData.ts` for display only
- No data flows between components
- User actions don't update the application state

**What You Need to Implement:**

- **Shared State:** People and expenses data needs to be accessible across components
- **State Updates:** When users add/remove people or expenses, all relevant components should update
- **Component Communication:** Changes in one component should reflect in others
  - Adding a person in PeopleManager should update the dropdowns in ExpenseForm
  - Adding an expense should update the balances in BalanceView
  - The expense list in ExpenseList should reflect all expenses

**Data Structure Reference:**

- See `src/types.ts` for TypeScript interfaces
- See `src/initialData.ts` for example data structure

---

### 5. UI/UX Requirements

**Responsive Design:**

- Application should work on mobile devices (phone screens)
- Application should work on desktop/laptop screens
- Layout should adapt appropriately to different screen sizes

**User Feedback:**

- Users should know when their actions succeed
- Users should be informed when operations cannot be completed
- Loading states or transitions should feel smooth

**Intuitive Interface:**

- Forms should be easy to understand and fill out
- Navigation between different sections should be clear
- Information should be displayed in a logical, organized manner

---

### 6. Code Quality Requirements

**TypeScript:**

- Use proper types from `types.ts`
- Add additional types as needed
- Avoid `any` types where possible

**React Best Practices:**

- Use appropriate hooks for state management
- Follow React conventions for component structure
- Handle side effects properly

**Clean Code:**

- Components should have single, clear responsibilities
- Code should be readable and maintainable
- Remove unused code and console logs

## 🏗 Project Structure

```
src/
├── components/
│   ├── PeopleManager.tsx    # Add/remove people with validation
│   ├── ExpenseForm.tsx      # Add expenses with equal/custom splits
│   ├── BalanceView.tsx      # Show balances and settlements
│   └── ExpenseList.tsx      # List and manage expenses
├── test/
│   ├── calc.test.ts         # Unit tests for calculations
├── utils/
│   ├── calc.ts              # Calculation utilities
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Main app component
├── initialData.ts           # Sample data for reference
└── main.tsx                 # App entry point
```

## 🎯 What We're Looking For

- **Problem-Solving:** How you approach building features from scratch
- **Architecture Decisions:** How you structure data flow and state management
- **TypeScript Usage:** Proper typing and type safety
- **React Proficiency:** Effective use of React patterns and hooks
- **Code Organization:** Clean, maintainable code structure
- **Attention to Detail:** Complete features that work correctly
- **UI/UX Sense:** User-friendly interface design
- **Responsive Design:** Mobile and desktop compatibility

## 📝 Submission Guidelines

1. Ensure the application runs without errors
2. Test all features to verify they work correctly
3. Commit your changes with clear, descriptive messages
4. Include brief notes about your approach (state management choice, architecture decisions, etc.)
5. List any assumptions you made
6. Note any incomplete features or known issues

Good luck! 🍀


---

## ✅ Implementation Status

### Features Implemented

All required features have been fully implemented:

**✅ People Management:**
- Add person with name validation
- Remove person with confirmation dialog
- Real-time member count display
- Automatic cleanup: removing a person also removes them from existing expense splits
- Form clears after successful addition
- User feedback messages for success/error states

**✅ Expense Management:**
- Add expenses with description, amount, date, and payer selection
- Equal split: automatically divides amount equally among selected participants
- Custom split: allows specifying exact amounts per person with validation
- Custom split validation ensures totals match expense amount
- Delete expenses with confirmation dialog
- Expandable expense details showing split breakdown
- Total expense count display
- Form validation with clear error messages

**✅ Balance Calculations:**
- Individual balances: calculates paid, owed, and net balance for each person
- Total group spending: sum of all expenses
- Debt simplification: calculates minimum transactions to settle all debts using greedy algorithm
- Suggested settlements: shows who should pay whom and how much
- Color-coded visual feedback: green for owed money, red for owing money
- Plus/minus signs displayed before amounts for clarity

**✅ State Management & Data Flow:**
- Shared state using React useState hooks in App component
- Props passed down to child components (prop drilling)
- Real-time updates: all components update when state changes
- useMemo for optimized balance and settlement calculations

**✅ UI/UX:**
- Fully responsive design (mobile-first, adapts to desktop)
- Color-coded balances and settlements for visual clarity
- Smooth transitions and hover effects
- Empty states with helpful messages
- Form validation with user-friendly error messages
- Confirmation dialogs for destructive actions

**✅ Data Persistence:**
- localStorage usage
- Separate keys for people and expenses
- error handling

**✅ Testing:**
- Unit tests for calculation functions (equal split, custom split, debt simplification)
- Build passes successfully
- All features tested and verified working

### Architecture & Approach

**State Management:**
- Used React useState at App level instead of Context API or external state library
- Simple prop drilling is sufficient for component hierarchy, keeps code straightforward and maintainable
- State lifted to App component and passed down as props to child components

**Calculation Logic:**
- Separated calculation functions into `src/utils/calc.ts` for testing and reusability
- Pure functions enables unit testing without React dependencies
- Debt simplification uses greedy algorithm: sort debtors and creditors by amount, match largest debts to largest credits

**Component Structure:**
- Each component has single responsibility:
  - `PeopleManager`: handles people CRUD
  - `ExpenseForm`: manages expense creation with validation
  - `ExpenseList`: displays and manages expense list
  - `BalanceView`: shows balances and settlements
- Functional components with hooks throughout
- Props interfaces defined for type safety

**TypeScript:**
- Strong typing throughout with interfaces from `types.ts`
- Extended types with `PersonTotals` interface for balance calculations

**Data Persistence:**
- localStorage for client-side persistence
- Separate keys for people and expenses arrays
- Graceful error handling with try-catch blocks

### Assumptions Made

1. **Currency:** USD ($) - no currency conversion needed
2. **Amount Precision:** Rounded to 2 decimal places for all calculations
3. **Date Format:** ISO date strings (YYYY-MM-DD) stored, displayed in readable format (e.g., "Jan 28, 2024")
4. **Person Names:** Case-sensitive, trimmed whitespace, unique within group
5. **Minimum Group Size:** Requires at least 2 people to start tracking expenses (shown as warning message)
6. **LocalStorage:** Assumes localStorage is available
7. **Browser Support:** Modern browsers with ES6+ support

### Known Limitations / Incomplete Features

The following features are not implemented but could be added:

1. **No Expense Editing:** Can only add or delete expenses, not modify existing ones
2. **No Search Functionality:** Cannot search expenses by description or other fields
3. **No Expense Categories:** All expenses are flat, no categorization or tagging
4. **LocalStorage Only:** No backend persistence, data is browser-specific will not synced across devices
5. **No User Accounts:** Single shared group, no multi-user or multi-group support
6. **No Recurring Expenses:** Cannot set up recurring expenses
7. **No Payment Tracking:** Cannot mark settlements as paid/unpaid
8. **No History/Audit Trail:** Cannot see history of changes

### Build Status

✅ All features tested and working  
✅ Responsive design for mobile and desktop  
✅ localStorage working correctly  
✅ TypeScript compilation passes with no errors  
✅ Unit tests passing (`npm test`)