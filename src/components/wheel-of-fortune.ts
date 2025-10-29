import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import confetti from 'canvas-confetti';

@customElement('wheel-of-fortune')
export class WheelOfFortune extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    canvas {
      border-radius: 50%;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      width: 100%;
      height: auto;
      max-width: 480px;
      margin: 0 auto;
    }
  `;

  createRenderRoot() {
    return this;
  }

  private canvas!: HTMLCanvasElement;

  private _names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Casey', 'Michael', 'Roger', 'Rafael', 'Jacky', 'Gabriel'];
  private _currentRotation = 0;
  private _isSpinning = false;
  private _winnerText = 'The Spintastic Wheel!';
  private _namesInput = this._names.join('\n');

  private generateRainbowColors(count: number): string[] {
    const colors: string[] = [];
    const hueStep = 360 / count; // Distribute hues evenly around the color wheel

    for (let i = 0; i < count; i++) {
      const hue = (i * hueStep) % 360;
      const saturation = 85; // High saturation for vibrant colors
      const lightness = 60; // Medium lightness for good visibility

      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }

  private get colors(): string[] {
    return this.generateRainbowColors(this.names.length);
  }

  get names() { return this._names; }
  set names(value: string[]) { 
    this._names = value; 
    this.requestUpdate();
    setTimeout(() => this.drawWheel(), 0);
  }

  get currentRotation() { return this._currentRotation; }
  set currentRotation(value: number) { 
    this._currentRotation = value; 
    this.requestUpdate();
    setTimeout(() => this.drawWheel(), 0);
  }

  get isSpinning() { return this._isSpinning; }
  set isSpinning(value: boolean) { 
    this._isSpinning = value; 
    this.requestUpdate(); 
  }

  get winnerText() { return this._winnerText; }
  set winnerText(value: string) { 
    this._winnerText = value; 
    this.requestUpdate(); 
  }

  get namesInput() { return this._namesInput; }
  set namesInput(value: string) { 
    this._namesInput = value; 
    this.requestUpdate(); 
  }

  private ctx!: CanvasRenderingContext2D;
  private centerX = 0;
  private centerY = 0;
  private radius = 0;
  private resizeObserver: ResizeObserver;

  constructor() {
    super();
    this.resizeObserver = new ResizeObserver(() => this.updateCanvasSize());
  }

  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this);
  }

  private updateCanvasSize() {
    if (!this.canvas) return;

    const containerWidth = this.getBoundingClientRect().width;
    const size = Math.min(containerWidth - 32, 480);
    this.canvas.width = size;
    this.canvas.height = size;
    
    this.centerX = size / 2;
    this.centerY = size / 2;
    this.radius = (size / 2) * 0.9;
    
    this.drawWheel();
  }

  firstUpdated() {
    this.initCanvas();
  }

  updated() {
    if (!this.ctx && this.canvas) {
      this.initCanvas();
    }
  }

  private initCanvas() {
    this.canvas = this.querySelector('#wheel') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d')!;
      this.drawWheel();
    } else {
      setTimeout(() => this.initCanvas(), 100);
    }
  }

  private drawWheel() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const anglePerSegment = (2 * Math.PI) / this.names.length;
    
    for (let i = 0; i < this.names.length; i++) {
      const startAngle = i * anglePerSegment + this.currentRotation;
      const endAngle = (i + 1) * anglePerSegment + this.currentRotation;
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fill();

      // Draw hairline border between segments
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(
        this.centerX + Math.cos(endAngle) * this.radius,
        this.centerY + Math.sin(endAngle) * this.radius
      );
      this.ctx.strokeStyle = 'ingigo';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(startAngle + anglePerSegment / 2);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 14px Arial, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      const text = this.names[i];
      let fontSize = 14;
      const textRadius = this.radius * 0.75;
      const maxTextWidth = this.radius * 0.3;

      // Security: Ensure font is safe and text is properly rendered
      this.ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      while (this.ctx.measureText(text).width > maxTextWidth && fontSize > 8) {
        fontSize--;
        this.ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      }
      
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      this.ctx.shadowBlur = 3;
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;
      
      this.ctx.fillText(text, textRadius, 0);
      this.ctx.restore();
    }
    
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();

    // Draw outer border around the wheel
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = 'indigo';
    this.ctx.lineWidth = 5;
    this.ctx.stroke();
  }

  private celebrateWinner() {
    const rect = this.canvas.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const particleCount = 100;
    const spread = 90;
    const startVelocity = 45;
    
    confetti({
      particleCount: particleCount,
      spread: spread,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      startVelocity: startVelocity,
      gravity: 1.2,
      drift: 0,
      ticks: 300,
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      shapes: ['circle', 'square'],
    });

    setTimeout(() => {
      confetti({
        particleCount: particleCount * 0.5,
        spread: spread * 1.2,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        startVelocity: startVelocity * 0.8,
        gravity: 1,
        drift: 0.2,
        ticks: 200,
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
        shapes: ['circle', 'square'],
      });
    }, 200);
  }

  private spin() {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.winnerText = 'Spinning...';
    
    const minSpins = 5;
    const maxSpins = 8;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    const finalRotation = this.currentRotation + (spins * 2 * Math.PI) + Math.random() * 2 * Math.PI;
    
    const duration = 3000;
    const startTime = Date.now();
    const startRotation = this.currentRotation;
    const rotationDelta = finalRotation - startRotation;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      this.currentRotation = startRotation + rotationDelta * easeOut;
      this.drawWheel();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        
        const anglePerSegment = (2 * Math.PI) / this.names.length;
        const normalizedRotation = this.currentRotation % (2 * Math.PI);
        const winningIndex = Math.floor(
          (((3 * Math.PI/2) - normalizedRotation + (2 * Math.PI)) % (2 * Math.PI)) / anglePerSegment
        ) % this.names.length;
        
        const winner = this.names[winningIndex];
        this.winnerText = `🎉 ${winner}! 🎉`;
        this.celebrateWinner();
      }
    };
    
    requestAnimationFrame(animate);
  }

  private updateNames() {
    const inputText = this.namesInput.trim();
    const newNames = inputText.split('\n')
      .map(name => this.sanitizeName(name.trim()))
      .filter(name => name.length > 0);

    if (newNames.length < 2) {
      this.showError('Please enter at least 2 names.');
      return;
    }

    if (newNames.length > 30) {
      this.showWarning('Maximum 30 names allowed. Extra names will be ignored.');
      this.names = newNames.slice(0, 30);
    } else {
      this.names = newNames;
    }

    this.currentRotation = 0;
    this.winnerText = 'Spin to Win!';
    this.drawWheel();

    this.namesInput = this.names.join('\n');
    this.requestUpdate();
  }

  private sanitizeName(name: string): string {
    // Remove potentially dangerous characters and limit length
    return name
      .replace(/[<>"'&]/g, '') // Remove HTML/XML special characters
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .substring(0, 50); // Limit name length
  }

  private showError(message: string) {
    // Use a custom notification system instead of alert()
    this.winnerText = `Error: ${message}`;
    this.requestUpdate();

    // Clear error message after 3 seconds
    setTimeout(() => {
      if (this.winnerText.startsWith('Error:')) {
        this.winnerText = 'Spin to Win!';
        this.requestUpdate();
      }
    }, 3000);
  }

  private showWarning(message: string) {
    // Use a custom notification system instead of alert()
    this.winnerText = `Note: ${message}`;
    this.requestUpdate();

    // Clear warning message after 3 seconds
    setTimeout(() => {
      if (this.winnerText.startsWith('Note:')) {
        this.winnerText = 'Spin to Win!';
        this.requestUpdate();
      }
    }, 3000);
  }

  private handleNamesInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.namesInput = target.value;
  }

  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 p-3">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[60%_40%] items-start">
          <div class="flex flex-col items-center mb-3">
            <h1 class="text-3xl font-bungee text-transparent bg-clip-text bg-gradient-to-br from-[#fff200] via-[#ffe600] to-[#d57e05] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] text-center tracking-wide p-3">
              ${this.winnerText}
            </h1>
            
            <div class="relative w-full flex justify-center">
              <canvas 
                id="wheel" 
                class="block"
              ></canvas>
              <div 
                class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[0%] text-3xl sm:text-4xl z-10"
                style="
                  background: linear-gradient(135deg, #fff200, #d57e05);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                "
              >▼</div>
            </div>
            
            <button 
              @click="${this.spin}"
              ?disabled="${this.isSpinning}"
              style="min-width: 200px"
              class="bg-gradient-to-t from-[#f59e0b] to-[#fcd34d] hover:from-[#dc8e06] hover:to-[#f1c124] 
                     disabled:from-[#dc8e06] disabled:to-[#f1c124] disabled:cursor-not-allowed
                     font-bold py-4 px-8 rounded-full text-xl shadow-lg 
                     transform transition-all duration-200 hover:scale-105 hover:-translate-y-1
                     disabled:transform-none disabled:shadow-none"
            >
              ${this.isSpinning ? 'Spinning...' : 'Spin'}
            </button>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-2xl">
            <h4 class="text-1xl font-bold text-gray-800 mb-2">Participants</h4>
            
            <textarea
              .value="${this.namesInput}"
              @input="${this.handleNamesInput}"
              placeholder="Enter names separated by new lines (2-30 names)..."
              class="w-full h-80 p-4 border-2 border-gray-300 rounded-lg text-sm resize-none 
                     focus:border-indigo-500 focus:outline-none transition-colors duration-200"
            ></textarea>
            
            <button
              @click="${this.updateNames}"
              class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 
                     hover:from-indigo-600 hover:to-purple-700 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Update
            </button>
            
            <p class="text-gray-600 text-sm text-center mt-3">
              Enter 2-30 names, one per line
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
