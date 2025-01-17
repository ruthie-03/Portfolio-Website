import json
import datetime

# Dictionary to store income and expenses
finance_data = {
    "income": [],
    "expenses": [],
    "monthly_budget": 0.0,
    "savings_goal": 0.0,
    "current_savings": 0.0
}

# Reordered categories for expenses
expense_categories = [
    "Housing",            # 1. Housing
    "Utility Bills",      # 2. Utility Bills
    "Travel",             # 3. Travel
    "Food",               # 4. Food
    "Toiletries",         # 5. Toiletries
    "Entertainment",      # 6. Entertainment
    "Eating Out",         # 7. Eating Out
    "Miscellaneous"       # 8. Misc
]

# Available categories for income
income_categories = [
    "Salary",
    "Overtime",
    "Bonus",
    "Interest",
    "Miscellaneous"
]

# Menu options
menu_options = [
    "1. Add Income (£)",           # Now "Add Income" is option 1
    "2. Set Savings Goal (£)",
    "3. Set Monthly Budget (£)",   # "Set Monthly Budget" is now option 3
    "4. Add to Savings (£)",       # "Add to Savings" remains option 4
    "5. Add Expense (£)",
    "6. Show Summary",
    "7. Exit"
]

# Variables to hold start and finish dates
start_date = None
finish_date = None

# Function to set the date range
def set_date_range():
    global start_date, finish_date
    start_date_str = input("Enter start date (DD-MM-YYYY): ")
    finish_date_str = input("Enter finish date (DD-MM-YYYY): ")
    
    start_date = datetime.datetime.strptime(start_date_str, '%d-%m-%Y')
    finish_date = datetime.datetime.strptime(finish_date_str, '%d-%m-%Y')
    
    print(f"Date range set from {start_date_str} to {finish_date_str}")

# Function to add income with a date and category
def add_income():
    amount = float(input("Enter income amount (£): "))
    description = input("Enter income description: ")
    date_str = input("Enter date (DD-MM-YYYY): ")
    date = datetime.datetime.strptime(date_str, '%d-%m-%Y')  # Parse the date

    # Category selection for income
    print("Select income category:")
    for i, category in enumerate(income_categories, 1):
        print(f"{i}. {category}")
    category_choice = int(input("Enter the number corresponding to the category: "))
    category = income_categories[category_choice - 1]  # Select the category

    # Append income details to finance data
    finance_data["income"].append({
        "amount": amount,
        "description": description,
        "date": date.strftime('%d-%m-%Y'),  # Store date as string
        "category": category
    })
    
    print(f"Thank you for submitting your income: £{amount:.2f} - {description} on {date_str} in category '{category}'")

# Function to add expense with a date and category
def add_expense():
    amount = float(input("Enter expense amount (£): "))
    description = input("Enter expense description: ")
    date_str = input("Enter date (DD-MM-YYYY): ")
    date = datetime.datetime.strptime(date_str, '%d-%m-%Y')  # Parse the date

    # Category selection for expenses
    print("Select expense category:")
    for i, category in enumerate(expense_categories, 1):
        print(f"{i}. {category}")
    category_choice = int(input("Enter the number corresponding to the category: "))
    category = expense_categories[category_choice - 1]  # Select the category

    # Append expense details to finance data
    finance_data["expenses"].append({
        "amount": amount,
        "description": description,
        "date": date.strftime('%d-%m-%Y'),  # Store date as string
        "category": category
    })
    
    print(f"That's great! You've recorded an expense: £{amount:.2f} - {description} on {date_str} in category '{category}'")

    # Check budget status
    check_budget_status()

# Function to set a monthly budget
def set_monthly_budget():
    budget = float(input("Enter your monthly budget (£): "))  # Prompt user for budget
    finance_data["monthly_budget"] = budget  # Store the budget
    print(f"Monthly budget set to £{budget:.2f}")

# Function to set a savings goal
def set_savings_goal():
    goal = float(input("Enter your savings goal (£): "))  # Prompt user for savings goal
    finance_data["savings_goal"] = goal  # Store the savings goal
    print(f"Savings goal set to £{goal:.2f}")

# Function to add amount to savings
def add_to_savings():
    amount = float(input("Enter the amount to add to savings (£): "))
    
    if amount <= 0:
        print("Invalid amount. Please enter a positive value.")
        return

    finance_data["current_savings"] += amount
    print(f"£{amount:.2f} has been added to your savings. Total saved: £{finance_data['current_savings']:.2f}")

# Function to check and notify the user about budget status
def check_budget_status():
    total_expenses = sum(item['amount'] for item in finance_data["expenses"])
    budget = finance_data["monthly_budget"]

    if budget > 0:
        percentage_spent = (total_expenses / budget) * 100
        if percentage_spent > 100:
            print("Alert: You have exceeded your budget!")
        elif percentage_spent >= 90:
            print("Warning: You have used 90% of your budget.")
        elif percentage_spent >= 70:
            print("Notice: You have used 70% of your budget.")
        elif percentage_spent >= 50:
            print("Note: You have used 50% of your budget.")

# Function to show summary for the specified period
def show_summary():
    print(f"\n--- Financial Summary from {start_date.strftime('%d-%m-%Y')} to {finish_date.strftime('%d-%m-%Y')} ---")

    # Filter income and expenses within the date range
    filtered_income = [i for i in finance_data["income"] if start_date <= datetime.datetime.strptime(i["date"], '%d-%m-%Y') <= finish_date]
    filtered_expenses = [e for e in finance_data["expenses"] if start_date <= datetime.datetime.strptime(e["date"], '%d-%m-%Y') <= finish_date]
    
    # Calculate total income, expenses, and remaining balance
    total_income = sum(item['amount'] for item in filtered_income)
    total_expenses = sum(item['amount'] for item in filtered_expenses)
    balance = total_income - total_expenses
    budget = finance_data["monthly_budget"]
    remaining_budget = budget - total_expenses if budget > 0 else 0

    # Calculate percentage of budget spent
    percentage_spent = (total_expenses / budget) * 100 if budget > 0 else 0

    # Display income, expenses, and remaining balance
    print(f"Total Income: £{total_income:.2f}")
    print(f"Total Expenses: £{total_expenses:.2f}")
    print(f"Remaining Income after Expenses: £{balance:.2f}")
    print(f"Total Saved: £{finance_data['current_savings']:.2f}\n")  # Display total savings
    print(f"Percentage of Budget Spent: {percentage_spent:.2f}%")
    print(f"Amount Remaining until End of Budget: £{remaining_budget:.2f}")

    # Savings goal tracking
    savings_goal = finance_data["savings_goal"]
    print(f"Savings Goal: £{savings_goal:.2f}")
    if finance_data["current_savings"] >= savings_goal:
        print("Congratulations! You've reached your savings goal!")
    else:
        print(f"You are £{savings_goal - finance_data['current_savings']:.2f} away from your savings goal.")

    # Group expenses by category and calculate the total per category
    expense_category_totals = {category: 0 for category in expense_categories}
    for expense in filtered_expenses:
        expense_category_totals[expense["category"]] += expense["amount"]

    # Display the category-wise expense summary
    print("Expenses by Category:")
    for category, total in expense_category_totals.items():
        if total > 0:  # Only show categories with expenses
            print(f"- {category}: £{total:.2f}")

    # Group income by category and calculate the total per category
    income_category_totals = {category: 0 for category in income_categories}  # New income categories dictionary
    for income in filtered_income:  # Summing the income by category
        income_category_totals[income["category"]] += income['amount']

    # Display the category-wise income summary
    print("Income by Category:")
    for category, total in income_category_totals.items():
        if total > 0:  # Only show categories with income
            print(f"- {category}: £{total:.2f}")

    # Display detailed income records
    print("\nDetailed Income Records:")
    for income in filtered_income:
        print(f"- £{income['amount']:.2f} on {income['date']} - {income['description']} (Category: {income['category']})")

    # Display detailed expense records
    print("\nDetailed Expense Records:")
    for expense in filtered_expenses:
        print(f"- £{expense['amount']:.2f} on {expense['date']} - {expense['description']} (Category: {expense['category']})")

# Main menu function to run the program
def main_menu():
    set_date_range()  # Prompt user for start and finish dates
    print("\nPersonal Finance Tracker (GBP)")
    print("\n".join(menu_options))  # Display menu options

    while True:
        choice = input("Select a main menu option (1-7): ")

        # Adjusted cases based on new menu order
        if choice == '1':
            add_income()           # "Add Income" now option 1
        elif choice == '2':
            set_savings_goal()
        elif choice == '3':
            set_monthly_budget()   # "Set Monthly Budget" is now option 3
        elif choice == '4':
            add_to_savings()       # "Add to Savings" remains option 4
        elif choice == '5':
            add_expense()
        elif choice == '6':
            show_summary()         # Now includes "Total Saved"
        elif choice == '7':
            print("Exiting the program. Goodbye!")
            break
        else:
            print("Invalid option. Please select a valid number.")

# Entry point of the program
if __name__ == "__main__":
    main_menu()
