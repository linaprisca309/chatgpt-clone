
let display = document.getElementById('display');
let current = '';

function append(val) {
    current += val;
    display.value = current;
}

function clearDisplay() {
    current = '';
    display.value = '';
}

function deleteChar() {
    current = current.slice(0, -1);
    display.value = current;
}

function calculate() {
    try {
        current = eval(current);
        display.value = current;
        current = '';
    } catch (e) {
        display.value = 'Error';
        current = '';
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key.match(/[0-9/*\-+.]/)) append(e.key);
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === 'Backspace') deleteChar();
});