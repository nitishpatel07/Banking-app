'use strict';

/////////////////////////////////////////////////
// BANKIST APP
// interest only applicable if the deposit is above 100

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// DOM MANIPULATION

//create movements, all operations within the array//
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  console.log(movs);
  movs.forEach(function (mov, i) {
    //console.log(i + 1 + ' ' + mov);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const formatMov = formatCurrent(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1.movements);

/* MAP method

///Convet euro to usd///
const euroToUsd = 2;
const movUSD = account1.movements.map(mov => mov * euroToUsd);
console.log(account1.movements);
console.log(movUSD);

///array of detailed transactions///
const movDetail = account1.movements.map(function (mov, i) {
  if (mov > 0) {
    return `Movement ${i + 1}:You deposited ${mov}`;
  } else {
    return `Movement ${i + 1}:You withdrew ${mov}`;
  }
});
console.log(movDetail);

///array of detailed transactions using ternary operator///
const movDetail2 = account1.movements.map((mov, i) =>
  mov > 0
    ? `Movement ${i + 1}:You deposited ${mov}`
    : `Movement ${i + 1}:You withdrew ${Math.abs(mov)}`
);
console.log(movDetail2);

 */

//creat username//
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);
console.log(accounts);

//update balance//
const showBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  console.log(acc.balance);

  const formatMov = formatCurrent(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formatMov}`;
};
//showBalance(account1.movements);

//display summary//
const displaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  console.log(income);
  labelSumIn.textContent = formatCurrent(income, acc.locale, acc.currency);

  const expenditure = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log(Math.abs(expenditure));
  labelSumOut.textContent = formatCurrent(
    Math.abs(expenditure),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 100)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, deposit) => acc + deposit);
  console.log(interest);
  labelSumInterest.textContent = formatCurrent(
    interest,
    acc.locale,
    acc.currency
  );
};
//displaySummary(account1.movements);

/* Find function
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/
const updateUI = function (acc) {
  displayMovements(acc);
  showBalance(acc);
  displaySummary(acc);
};
// Create login function
// event handler
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    /*currentAccount?.pin is similar to currentAccount && currentAccount.pin*/

    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;

    //if there is a timer first we need to clear it first
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;
  } else {
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `User not found!`;
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

//Transfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amtTransfer = Number(inputTransferAmount.value); //number () is very important as the initial is a string variable
  const transferTo = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amtTransfer);
  console.log(transferTo);
  if (
    amtTransfer > 0 &&
    transferTo &&
    currentAccount.balance >= amtTransfer &&
    transferTo.userName !== currentAccount.userName
  ) {
    //add transfer amount to movements
    currentAccount.movements.push(-amtTransfer);
    transferTo.movements.push(amtTransfer);

    //add transfer date to movements
    currentAccount.movementsDates.push(new Date());
    transferTo.movementsDates.push(new Date());

    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

//Approve loan, some function is used with a condition

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amt = Number(inputLoanAmount.value);
  if (amt > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amt)) {
    //add loan amount to movements
    currentAccount.movements.push(amt);

    //add loan date to movements
    currentAccount.movementsDates.push(new Date());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

// Close account, findIndex function is used

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
    labelWelcome.textContent = `${currentAccount.owner}'s account is closed`;
    setTimeout(function () {
      labelWelcome.textContent = `Log in to get started`;
    }, 2000);
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

//to calculate the net avlaible balance in the bank

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

//to sort the movements
let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, sorted);
  sorted = !sorted;
});

//Internationalizing of numbers(by currency and locale)

const formatCurrent = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Set the timer

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
  };

  let time = 300;
  tick();
  timer = setInterval(tick, 1000);
  return timer; //so as to check at every login that wether there is any previous timer running or not, if yes we need to remove it first and also timer should be placed in the parent scope
};
