const initialExpenses = [
  { name: "Groceries", amount: 1500, category: "Food", type: "expense", date: "2026-10-20" },
  { name: "Bus Fare", amount: 500, category: "Transport", type: "expense", date: "2026-10-21" },
  { name: "House Rent", amount: 8000, category: "Rent", type: "expense", date: "2026-10-22" },
  { name: "Movie", amount: 1500, category: "Entertainment", type: "expense", date: "2026-10-23" },
  { name: "Internet", amount: 2500, category: "Other", type: "expense", date: "2026-10-24" }
];

const initialIncome = [
  { name: "Salary", amount: 60000, category: "Salary", type: "income", date: "2026-10-01" }
];

const transactions = [...initialIncome, ...initialExpenses];

const formatCurrency = (amount) => `KSh ${Number(amount).toLocaleString()}`;

const getTotals = () => {
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, totalBalance };
};

const renderSummary = () => {
  const { totalIncome, totalExpenses, totalBalance } = getTotals();
  const savings = totalIncome - totalExpenses;

  document.getElementById("income-total").textContent = formatCurrency(totalIncome);
  document.getElementById("expense-total").textContent = formatCurrency(totalExpenses);
  document.getElementById("balance-total").textContent = formatCurrency(totalBalance);

  document.getElementById("savings-value").textContent = formatCurrency(savings);
  document.getElementById("savings-rate").textContent =
    `${Math.round((savings / totalIncome) * 100) || 0}% of income`;

  const progress = Math.min((totalExpenses / totalIncome) * 100, 100);
  const budgetStatus = progress < 60 ? "On track" : progress < 80 ? "Watch closely" : "Over budget";

  document.getElementById("budget-progress").style.width = `${progress}%`;
  document.getElementById("budget-status").textContent = budgetStatus;

  const categoryTotals = {
    Food: 0,
    Transport: 0,
    Rent: 0,
    Entertainment: 0,
    Utilities: 0
  };

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      if (categoryTotals[item.category] !== undefined) {
        categoryTotals[item.category] += item.amount;
      }
    });

  document.getElementById("food-total").textContent = formatCurrency(categoryTotals.Food);
  document.getElementById("transport-total").textContent = formatCurrency(categoryTotals.Transport);
  document.getElementById("rent-total").textContent = formatCurrency(categoryTotals.Rent);
  document.getElementById("entertainment-total").textContent = formatCurrency(categoryTotals.Entertainment);
  document.getElementById("utilities-total").textContent = formatCurrency(categoryTotals.Utilities);
};

const renderTable = () => {
  const tbody = document.getElementById("transaction-table-body");
  tbody.innerHTML = "";

  transactions.forEach((item, index) => {
    const row = document.createElement("tr");

    const actionsCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete";
    removeButton.className = "delete-btn";
    removeButton.addEventListener("click", () => {
      transactions.splice(index, 1);
      renderSummary();
      renderTable();
    });

    actionsCell.appendChild(removeButton);

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${formatCurrency(item.amount)}</td>
      <td>${item.category}</td>
      <td>${item.date}</td>
      <td></td>
    `;

    row.lastElementChild.appendChild(removeButton);
    tbody.appendChild(row);
  });
};

document.getElementById("transaction-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("entry-name").value.trim();
  const amount = Number(document.getElementById("entry-amount").value);
  const category = document.getElementById("entry-category").value;
  const date = document.getElementById("entry-date").value;
  const type = document.getElementById("entry-type").value;

  if (!name || !amount || amount <= 0 || !date) {
    return;
  }

  transactions.push({
    name,
    amount,
    category,
    type,
    date
  });

  event.target.reset();
  renderSummary();
  renderTable();
});

renderSummary();
renderTable();
