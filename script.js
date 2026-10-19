

const STORAGE_KEY = "spendsmart_expenses";
const BUDGET_KEY = "spendsmart_budget";

const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const searchInput = document.getElementById("searchInput");
const budgetButton = document.getElementById("budgetButton");

let expenses = loadExpenses();
let budget = loadBudget();
let expenseChart = null;

const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
});

function loadExpenses() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function loadBudget() {
    const value = Number(localStorage.getItem(BUDGET_KEY));
    return Number.isFinite(value) && value >= 0 ? value : 5000;
}

function saveExpenses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function saveBudget() {
    localStorage.setItem(BUDGET_KEY, String(budget));
}

function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isCurrentMonth(dateString) {
    return dateString.slice(0, 7) === getToday().slice(0, 7);
}

function getMonthlyExpenses() {
    return expenses.filter(expense => isCurrentMonth(expense.date));
}

function formatMoney(amount) {
    return currency.format(amount);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function renderDashboard() {
    const monthlyExpenses = getMonthlyExpenses();

    const total = monthlyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const remaining = budget - total;

    document.getElementById("totalExpense").textContent =
        formatMoney(total);

    document.getElementById("budgetDisplay").textContent =
        formatMoney(budget);

    document.getElementById("remainingBudget").textContent =
        formatMoney(remaining);

    document.getElementById("transactionCount").textContent =
        monthlyExpenses.length;

    const message = document.getElementById("budgetMessage");

    if (remaining < 0) {
        message.textContent =
            `Over budget by ${formatMoney(Math.abs(remaining))}`;
    } else if (remaining === 0) {
        message.textContent = "Budget fully used";
    } else {
        message.textContent = "Keep saving!";
    }

    renderTransactions();
    renderChart();
}

function renderTransactions() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = expenses
        .filter(expense => {
            const text =
                `${expense.description} ${expense.category} ${expense.date}`
                    .toLowerCase();

            return text.includes(query);
        })
        .sort((a, b) => b.date.localeCompare(a.date));

    expenseList.replaceChildren();

    document.getElementById("emptyMessage").hidden =
        filtered.length !== 0;

    filtered.forEach(expense => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = expense.description;

        const categoryCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "category-badge";
        badge.textContent = expense.category;
        categoryCell.appendChild(badge);

        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;

        const amountCell = document.createElement("td");
        amountCell.className = "amount-cell";
        amountCell.textContent = formatMoney(expense.amount);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteExpense(expense.id);
        });

        actionCell.appendChild(deleteButton);

        row.append(
            nameCell,
            categoryCell,
            dateCell,
            amountCell,
            actionCell
        );

        expenseList.appendChild(row);
    });
}

function renderChart() {
    const monthlyExpenses = getMonthlyExpenses();
    const totals = {};

    monthlyExpenses.forEach(expense => {
        totals[expense.category] =
            (totals[expense.category] || 0) + expense.amount;
    });

    const labels = Object.keys(totals);
    const values = Object.values(totals);

    document.getElementById("chartMessage").hidden =
        labels.length !== 0;

    const canvas = document.getElementById("expenseChart");

    if (typeof Chart === "undefined") {
        document.getElementById("chartMessage").hidden = false;
        document.getElementById("chartMessage").textContent =
            "Charts need an internet connection to load.";
        return;
    }

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#6854d9",
                    "#36b98b",
                    "#f2a54a",
                    "#48a5e8",
                    "#e86e91",
                    "#8d9bf5",
                    "#a0a0ad"
                ],
                borderWidth: 3,
                borderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        padding: 16
                    }
                }
            }
        }
    });
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);

    saveExpenses();
    renderDashboard();
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const description =
        document.getElementById("description").value.trim();

    const amount =
        Number(document.getElementById("amount").value);

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;

    if (
        !description ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !date ||
        !isValidDate(date)
    ) {
        alert("Please enter valid expense details.");
        return;
    }

    const expense = {
        id: crypto.randomUUID(),
        description,
        amount,
        category,
        date
    };

    expenses.push(expense);

    saveExpenses();
    form.reset();

    document.getElementById("date").value = getToday();

    renderDashboard();
});


function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    return parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day;
}


searchInput.addEventListener("input", renderTransactions);

budgetButton.addEventListener("click", () => {
    const answer = prompt(
        "Enter your monthly budget in ₹:",
        String(budget)
    );

    if (answer === null || answer.trim() === "") {
        return;
    }

    const newBudget = Number(answer);

    if (!Number.isFinite(newBudget) || newBudget < 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    budget = newBudget;
    saveBudget();
    renderDashboard();
});

document.getElementById("today").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

document.getElementById("date").value = getToday();

renderDashboard();
