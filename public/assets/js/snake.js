// Snake Game - Complete Implementation
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game variables
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Snake
        this.snake = [
            { x: 10, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // Food
        this.food = this.generateFood();
        
        // Game state
        this.score = 0;
        this.bestScore = localStorage.getItem('snakeBestScore') || 0;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        // Speed
        this.baseSpeed = 100;
        this.gameSpeed = this.baseSpeed;
        this.lastMoveTime = 0;
        
        // UI elements
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('bestScore');
        this.levelDisplay = document.getElementById('level');
        this.gameStatusDisplay = document.getElementById('gameStatus');
        
        this.updateUI();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    handleKeyPress(event) {
        if (!this.gameRunning && !this.gamePaused) return;
        
        const key = event.key.toLowerCase();
        
        // Arrow keys
        if (event.key === 'ArrowUp' || key === 'z') {
            event.preventDefault();
            if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
        } else if (event.key === 'ArrowDown' || key === 's') {
            event.preventDefault();
            if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
        } else if (event.key === 'ArrowLeft' || key === 'q') {
            event.preventDefault();
            if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
        } else if (event.key === 'ArrowRight' || key === 'd') {
            event.preventDefault();
            if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
        }
        
        // Space to pause
        if (key === ' ') {
            event.preventDefault();
            this.togglePause();
        }
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gameOver = false;
            this.gamePaused = false;
            this.gameStatusDisplay.textContent = '';
            this.gameStatusDisplay.className = '';
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.resetBtn.disabled = true;
        }
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.pauseBtn.textContent = 'Resume';
            this.gameStatusDisplay.textContent = '⏸ PAUSED';
            this.gameStatusDisplay.className = 'game-paused';
        } else {
            this.pauseBtn.textContent = 'Pause';
            this.gameStatusDisplay.textContent = '';
            this.gameStatusDisplay.className = '';
        }
    }
    
    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.level = 1;
        this.gameSpeed = this.baseSpeed;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.lastMoveTime = 0;
        
        this.gameStatusDisplay.textContent = '';
        this.gameStatusDisplay.className = '';
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.resetBtn.disabled = false;
        
        this.updateUI();
    }
    
    generateFood() {
        let newFood;
        let collision;
        
        do {
            collision = false;
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            // Check if food spawns on snake
            for (let segment of this.snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    collision = true;
                    break;
                }
            }
        } while (collision);
        
        return newFood;
    }
    
    update(deltaTime) {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        this.lastMoveTime += deltaTime;
        
        if (this.lastMoveTime < this.gameSpeed) return;
        
        this.lastMoveTime = 0;
        
        // Update direction
        this.direction = this.nextDirection;
        
        // Calculate new head position
        const head = this.snake[0];
        const newHead = {
            x: (head.x + this.direction.x + this.tileCount) % this.tileCount,
            y: (head.y + this.direction.y + this.tileCount) % this.tileCount
        };
        
        // Check collision with self
        for (let segment of this.snake) {
            if (newHead.x === segment.x && newHead.y === segment.y) {
                this.endGame();
                return;
            }
        }
        
        // Add new head
        this.snake.unshift(newHead);
        
        // Check collision with food
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            
            // Increase level every 100 points
            const newLevel = Math.floor(this.score / 100) + 1;
            if (newLevel !== this.level) {
                this.level = newLevel;
                this.gameSpeed = Math.max(50, this.baseSpeed - (this.level - 1) * 10);
            }
            
            this.food = this.generateFood();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
        
        this.updateUI();
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        this.gameStatusDisplay.textContent = `💀 GAME OVER! Score: ${this.score}`;
        this.gameStatusDisplay.className = 'game-over';
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('snakeBestScore', this.bestScore);
        }
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'Play Again';
        this.pauseBtn.disabled = true;
        this.resetBtn.disabled = false;
        
        this.updateUI();
    }
    
    updateUI() {
        this.scoreDisplay.textContent = this.score;
        this.bestScoreDisplay.textContent = this.bestScore;
        this.levelDisplay.textContent = this.level;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (optional)
        this.drawGrid();
        
        // Draw food
        this.drawFood();
        
        // Draw snake
        this.drawSnake();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= this.tileCount; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            
            if (i === 0) {
                // Head - green with glow
                this.ctx.shadowColor = '#0f0';
                this.ctx.shadowBlur = 10;
                this.ctx.fillStyle = '#0f0';
            } else {
                // Body - darker green
                this.ctx.shadowColor = 'transparent';
                this.ctx.fillStyle = '#0a8a0a';
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        }
        
        this.ctx.shadowColor = 'transparent';
    }
    
    drawFood() {
        // Draw food with glow effect
        this.ctx.shadowColor = '#ff1744';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#ff1744';
        
        const x = this.food.x * this.gridSize + this.gridSize / 2;
        const y = this.food.y * this.gridSize + this.gridSize / 2;
        const radius = this.gridSize / 2 - 2;
        
        // Draw circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowColor = 'transparent';
    }
    
    gameLoop(currentTime = 0) {
        // Calculate delta time
        const deltaTime = currentTime - (this.lastFrameTime || 0);
        this.lastFrameTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
