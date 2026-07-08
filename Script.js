const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

function appendValue(ch){
  const last = display.value.slice(-1);
  const operators = ['+','-','*','/'];

  if (ch === '.'){
    // prevent multiple decimals in current number
    const parts = display.value.split(/[\+\-\*\/\(\)]/).filter(Boolean);
    const current = parts[parts.length - 1] || '';
    if (current.includes('.')) return;
  }

  if (operators.includes(ch)){
    if (!display.value && ch !== '-') return; // no leading operator except minus
    if (operators.includes(last)) {
      // replace last operator with the new one
      display.value = display.value.slice(0,-1) + ch;
      return;
    }
  }

  display.value += ch;
}

function clearDisplay(){
  display.value = '';
}

function backspace(){
  display.value = display.value.slice(0,-1);
}

function evaluateExpr(){
  if (!display.value) return;
  try {
    // sanitize: allow only numbers, operators, parentheses, decimal and spaces
    const sanitized = display.value.replace(/[^\d+\-*/().\s]/g,'');
    // use Function to evaluate in a safer restricted scope
    const result = Function('"use strict";return (' + sanitized + ')')();
    display.value = String(result);
  } catch (e){
    display.value = 'Error';
    setTimeout(()=> display.value = '', 800);
  }
}

buttons.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.dataset.value) appendValue(btn.dataset.value);
  if (btn.dataset.action === 'clear') clearDisplay();
  if (btn.dataset.action === 'back') backspace();
  if (btn.dataset.action === 'equals') evaluateExpr();
});

// keyboard support
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || ['+','-','*','/','(',')','.'].includes(e.key)) {
    e.preventDefault();
    appendValue(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    evaluateExpr();
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    backspace();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    clearDisplay();
  }
});
