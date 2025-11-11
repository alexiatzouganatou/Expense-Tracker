const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const themeBtn = document.getElementById('themeToggle');
const langBtn = document.getElementById('langToggle');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert(currentLang === 'en' ? translations.en.alert : translations.gr.alert);
  } else {
    const transaction = {
      id: Math.floor(Math.random() * 100000000),
      text: text.value,
      amount: +amount.value
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
  }
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}${Math.abs(transaction.amount).toFixed(2)}€</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);

  balance.innerText = `${total}€`;
  money_plus.innerText = `+${income}€`;
  money_minus.innerText = `-${expense}€`;
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
form.addEventListener('submit', addTransaction);

// 🌙 DARK MODE TOGGLE
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '🌙' : '🌞';
});

// 🌍 LANGUAGE TOGGLE
let currentLang = 'en';
const translations = {
  en: {
    title: "💸 Expense Tracker",
    balance: "Your Balance",
    income: "Income",
    expense: "Expense",
    history: "History",
    add: "Add New Transaction",
    description: "Description",
    amount: "Amount (negative = expense, positive = income)",
    addBtn: "Add Transaction",
    alert: "Please add a description and amount"
  },
  gr: {
    title: "💸 Παρακολούθηση Εξόδων",
    balance: "Υπόλοιπο",
    income: "Έσοδα",
    expense: "Έξοδα",
    history: "Ιστορικό",
    add: "Νέα Συναλλαγή",
    description: "Περιγραφή",
    amount: "Ποσό (αρνητικό = έξοδο, θετικό = έσοδο)",
    addBtn: "Προσθήκη",
    alert: "Συμπληρώστε περιγραφή και ποσό"
  }
};

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'gr' : 'en';
  const lang = translations[currentLang];

  document.querySelector('h1').innerText = lang.title;
  document.querySelector('.balance h2').innerText = lang.balance;
  document.querySelector('.income h3').innerText = lang.income;
  document.querySelector('.expense h3').innerText = lang.expense;
  document.querySelector('h3:nth-of-type(1)').innerText = lang.history;
  document.querySelector('h3:nth-of-type(2)').innerText = lang.add;
  document.querySelector('label[for="text"]').innerText = lang.description;
  document.querySelector('label[for="amount"]').innerHTML = lang.amount.replace(/\n/g, "<br>");
  document.querySelector('.btn').innerText = lang.addBtn;
  langBtn.textContent = currentLang === 'en' ? '🇬🇧 EN' : '🇬🇷 GR';
});
