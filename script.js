// DOM Elements
const currentInputElement = document.getElementById('current-input');
const historyElement = document.getElementById('history');
const buttons = document.querySelectorAll('button');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

// Calculator state
let currentInput = '0';
let previousInput = '';
let operation = undefined;
let resetScreen = false;

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Update calculator display
function updateDisplay() {
    currentInputElement.innerText = currentInput;
    if (operation != null) {
        historyElement.innerText = `${previousInput} ${operation}`;
    } else {
        historyElement.innerText = '';
    }
}

// Append number or decimal
function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        currentInput += number;
    }
}

// Choose operation
function chooseOperation(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        compute();
    }
    operation = op;
    previousInput = currentInput;
    currentInput = '';
}

// Compute result
function compute() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        case '^':
            computation = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    currentInput = computation.toString();
    operation = undefined;
    previousInput = '';
    resetScreen = true;
}

// Scientific functions
function scientificFunction(func) {
    const num = parseFloat(currentInput);
    if (isNaN(num)) return;
    
    switch (func) {
        case 'sin':
            currentInput = Math.sin(num * Math.PI / 180).toString();
            break;
        case 'cos':
            currentInput = Math.cos(num * Math.PI / 180).toString();
            break;
        case 'tan':
            currentInput = Math.tan(num * Math.PI / 180).toString();
            break;
        case 'log':
            currentInput = Math.log10(num).toString();
            break;
        case 'ln':
            currentInput = Math.log(num).toString();
            break;
        case 'sqrt':
            currentInput = Math.sqrt(num).toString();
            break;
        case 'fact':
            let result = 1;
            for (let i = 2; i <= num; i++) {
                result *= i;
            }
            currentInput = result.toString();
            break;
        case 'pi':
            currentInput = Math.PI.toString();
            break;
        case 'e':
            currentInput = Math.E.toString();
            break;
    }
    
    resetScreen = true;
}

// Clear calculator
function clear() {
    currentInput = '0';
    previousInput = '';
    operation = undefined;
}

// Delete last character
function deleteChar() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
}

// Toggle sign
function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
}

// Button click handler
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        
        if (!action) return;
        
        if (!isNaN(action) || action === '.') {
            appendNumber(action);
        } else if (['+', '-', '*', '/', '%', '^'].includes(action)) {
            chooseOperation(action);
        } else if (action === '=') {
            compute();
        } else if (action === 'clear') {
            clear();
        } else if (action === 'backspace') {
            deleteChar();
        } else if (action === '+/-') {
            toggleSign();
        } else {
            scientificFunction(action);
        }
        
        updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
        chooseOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        compute();
    } else if (e.key === 'Escape') {
        clear();
    } else if (e.key === 'Backspace') {
        deleteChar();
    } else if (e.key === 'p' && e.ctrlKey) {
        scientificFunction('pi');
    } else if (e.key === 'e' && e.ctrlKey) {
        scientificFunction('e');
    }
    
    updateDisplay();
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();