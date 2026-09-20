const COLS = 4;
const ROWS = 3;
const winningState =[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
let currentState = [...winningState];

let isPlaying = false;
let timerInterval = null;
let secondsElapsed = 0;
let moveCount = 0;

const startBtn = document.getElementById('startBtn');
const boardEl = document.getElementById('board');
const timerEl = document.getElementById('timer');
const historyLogEl = document.getElementById('historyLog');

const tileColors = {
    1: "bg-[#ebfaf0] text-[#27ae60]",
    2: "bg-[#fdf0ee] text-[#e74c3c]",
    3: "bg-[#eaf2fb] text-[#2980b9]",
    4: "bg-[#f7eefb] text-[#8e44ad]",
    5: "bg-[#fef9e8] text-[#f1c40f]",
    6: "bg-[#fdeef5] text-[#e84393]",
    7: "bg-[#edf0fa] text-[#3f51b5]",
    8: "bg-[#f5f6f7] text-[#7f8c8d]",
    9: "bg-[#eafaf1] text-[#2ecc71]",
    10: "bg-[#fef5e7] text-[#e67e22]",
    11: "bg-[#effaf2] text-[#27ae60]"
};

function renderBoard() {
    boardEl.innerHTML = '';
    currentState.forEach((value) => {
        const tile = document.createElement('div');
        if (value === 0) {
            tile.className = "bg-black rounded-xl shadow-inner border border-black";
        } else {
            const colorClass = tileColors[value] || "bg-gray-200 text-gray-800";
            tile.className = `flex items-center justify-center text-2xl font-extrabold rounded-xl select-none shadow-sm border border-gray-100/50 transition-all duration-100 active:scale-95 cursor-pointer ${colorClass}`;
            tile.textContent = value;
            tile.addEventListener('click', () => handleTileClick(value));
        }
        boardEl.appendChild(tile);
    });
}

startBtn.addEventListener('click', () => {
    if (!isPlaying) {
        isPlaying = true;
        moveCount = 0;
        historyLogEl.innerHTML = '';     
        startBtn.textContent = 'Kết thúc';
        startBtn.className = "text-white font-bold bg-red-500 hover:bg-red-600 py-3 px-8 rounded-xl cursor-pointer transition text-sm";

        let iterations = 100;
        currentState = [...winningState];

        for (let i = 0; i < iterations; i++) {
            const blankIndex = currentState.indexOf(0);
            const validMoves = [];
            const r = Math.floor(blankIndex / COLS);
            const c = blankIndex % COLS;
            if (r > 0) validMoves.push(blankIndex - COLS); 
            if (r < ROWS - 1) validMoves.push(blankIndex + COLS); 
            if (c > 0) validMoves.push(blankIndex - 1); 
            if (c < COLS - 1) validMoves.push(blankIndex + 1); 

            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            [currentState[blankIndex], currentState[randomMove]] = [currentState[randomMove], currentState[blankIndex]];
        }

        renderBoard();
        startTimer(); 
    } else {
        isPlaying = false;
        clearInterval(timerInterval);
        secondsElapsed = 0;
        updateTimerUI();
        currentState = [...winningState];
        renderBoard();
        startBtn.textContent = 'Bắt đầu';
        startBtn.className = "text-white font-extrabold bg-[#00ca65] hover:bg-emerald-600 py-3 px-8 rounded-xl cursor-pointer transition text-sm";
    }
});

function startTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    updateTimerUI();
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerUI();
    }, 1000);
}

function updateTimerUI() {
    timerEl.textContent = formatTime(secondsElapsed);
}

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

window.addEventListener('keydown', (e) => {
    if (!isPlaying) return;   
    const blankIndex = currentState.indexOf(0);
    let targetIndex = -1;
    let keyId = '';
    const r = Math.floor(blankIndex / COLS);
    const c = blankIndex % COLS;            
    
    if (e.key === 'w' || e.key === 'W') {
        if (r < ROWS - 1) targetIndex = blankIndex + COLS;
        keyId = 'key-w';
    } else if (e.key === 'ArrowUp') {
        if (r < ROWS - 1) targetIndex = blankIndex + COLS;
        keyId = 'key-up';
    } else if (e.key === 's' || e.key === 'S') {
        if (r > 0) targetIndex = blankIndex - COLS;
        keyId = 'key-s';
    } else if (e.key === 'ArrowDown') {
        if (r > 0) targetIndex = blankIndex - COLS;
        keyId = 'key-down';
    } else if (e.key === 'a' || e.key === 'A') {
        if (c < COLS - 1) targetIndex = blankIndex + 1;
        keyId = 'key-a';
    } else if (e.key === 'ArrowLeft') {
        if (c < COLS - 1) targetIndex = blankIndex + 1;
        keyId = 'key-left';
    } else if (e.key === 'd' || e.key === 'D') {
        if (c > 0) targetIndex = blankIndex - 1;
        keyId = 'key-d';
    } else if (e.key === 'ArrowRight') {
        if (c > 0) targetIndex = blankIndex - 1;
        keyId = 'key-right';
    }
    
    if (targetIndex !== -1) {
        const movedValue = currentState[targetIndex];
        executeMove(targetIndex, blankIndex, `Phím đẩy ô số ${movedValue}`);
        
        const keyEl = document.getElementById(keyId);
        if (keyEl) {
            keyEl.classList.remove('bg-gray-200');
            keyEl.classList.add('bg-emerald-400', 'text-white', 'border-emerald-400', 'scale-95');
            setTimeout(() => {
                keyEl.classList.remove('bg-emerald-400', 'text-white', 'border-emerald-400', 'scale-95');
                keyEl.classList.add('bg-gray-200');
            }, 120);
        }
    }
});

function handleTileClick(value) {
    if (!isPlaying) return;
    const tileIndex = currentState.indexOf(value);
    const blankIndex = currentState.indexOf(0);

    if (Math.floor(tileIndex / COLS) === Math.floor(blankIndex / COLS) && Math.abs(tileIndex - blankIndex) === 1 ||
        tileIndex % COLS === blankIndex % COLS && Math.abs(tileIndex - blankIndex) === COLS) {
        executeMove(tileIndex, blankIndex, `Click chuột di chuyển ô số ${value}`);
    }
}

function executeMove(tileIndex, blankIndex, description) {
    [currentState[tileIndex], currentState[blankIndex]] = [currentState[blankIndex], currentState[tileIndex]];
    moveCount++;
    
    const row = document.createElement('div');
    row.className = "flex w-full hover:bg-gray-50 transition duration-150 text-gray-700 text-sm items-center py-2.5 bg-white";
    row.innerHTML = `
        <div class="w-[10%] text-center font-bold text-gray-400">${moveCount}</div>
        <div class="w-[60%] font-medium text-gray-900 text-left px-3 break-words">${description}</div>
        <div class="w-[30%] font-mono text-gray-500 text-left px-3">${formatTime(secondsElapsed)}</div>
    `;
    
    if (historyLogEl.firstChild) {
        historyLogEl.insertBefore(row, historyLogEl.firstChild);
    } else {
        historyLogEl.appendChild(row);
    }

    renderBoard();
    checkWin();
}

function checkWin() {
    const isWin = currentState.every((val, i) => val === winningState[i]);
    if (isWin) {
        isPlaying = false;
        clearInterval(timerInterval);
        startBtn.textContent = 'Bắt đầu';
        startBtn.className = "text-white font-extrabold bg-[#00ca65] hover:bg-emerald-600 py-3 px-8 rounded-xl cursor-pointer transition text-sm";

        setTimeout(() => {
            alert(`🎉 Chúc mừng chiến thắng! Bạn đã hoàn thành sau ${moveCount} bước trong ${formatTime(secondsElapsed)}.`);
        }, 150);
    }
}

renderBoard();
