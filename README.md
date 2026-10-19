# SpendSmart – Student Expense Tracking and Budget Management System

## 📌 Project Overview

SpendSmart is a simple, user-friendly web application designed to help students track their daily expenses and manage their monthly budgets. It allows users to record expenses, organize them by category, monitor spending, and visualize their expenses.

## 🎯 Objectives

- Track daily expenses in one place.
- Set and monitor a monthly budget.
- Calculate total expenses and remaining budget.
- Organize transactions by category.
- Visualize spending using a category-wise chart.
- Store expense records in the browser for future access.

## ✨ Features

- **Add Expenses:** Enter an expense description, amount, category, and date.
- **Monthly Budget:** Set a budget and monitor spending against it.
- **Expense Summary:** View total expenses, remaining budget, and transaction count.
- **Category-wise Chart:** Visualize expenses using a doughnut chart.
- **Search Transactions:** Find expenses in the transaction list.
- **Delete Expenses:** Remove unwanted transactions.
- **Data Persistence:** Save expense and budget information using browser localStorage.

## 🛠️ Technologies Used

- **HTML5** – Structures the web application.
- **CSS3** – Provides styling and layout.
- **JavaScript** – Implements application functionality and calculations.
- **Browser localStorage** – Stores expense and budget data locally.
- **Chart.js** – Displays the category-wise expense chart.

## 📂 Project Structure

```text
SpendSmart/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run the Project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a web browser, or run it using the VS Code Live Server extension.
4. Add expenses and set a monthly budget to explore the features.

**Note:** An internet connection may be required to load Chart.js if it is included through a CDN.

## 💾 Data Storage

SpendSmart uses browser localStorage to save expense records and budget information. The data remains available in the same browser on the same device unless the browser data is cleared or the application storage is removed.

## ⚠️ Limitations

- This is a frontend-only application.
- It does not use a backend server or a database such as MongoDB.
- Expense data is stored locally in the browser and is not synchronized across devices.
- User authentication is not implemented.

## 🔮 Future Enhancements

- Add expense editing functionality.
- Integrate a backend and database.
- Introduce user registration and login.
- Export expense reports.
- Add monthly spending comparisons and savings insights.

## 🎓 Academic Project

**Subject:** Full Stack Technologies  
**Project:** SpendSmart – Student Expense Tracking and Budget Management System

This project demonstrates the use of HTML, CSS, and JavaScript to build an interactive web application with client-side data storage and expense visualization.
