import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('wheel-of-fortune')
export class WheelOfFortune extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    canvas {
      border-radius: 50%;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
  `;

  createRenderRoot() {
    return this; // disable shadow DOM to allow global styles
  }

  private canvas!: HTMLCanvasElement;

  private _names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
  private _currentRotation = 0;
  private _isSpinning = false;
  private _winnerText = 'Spin to Find the Winner!';
  private _namesInput = 'Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry';

  private colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB', '#AED6F1',
    '#A9DFBF', '#F4D03F', '#E8DAEF', '#A2D9CE', '#FCBDBD',
    '#D6EAF8', '#D5F4E6', '#FEF9E7', '#EBDEF0', '#EAEDED'
  ];

  get names() { return this._names; }
  set names(value: string[]) { 
    this._names = value; 
    this.requestUpdate();
    // Redraw wheel after update
    setTimeout(() => this.drawWheel(), 0);
  }

  get currentRotation() { return this._currentRotation; }
  set currentRotation(value: number) { 
    this._currentRotation = value; 
    this.requestUpdate();
    // Redraw wheel after update
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
  private centerX = 240;  // 200 * 1.2
  private centerY = 240;  // 200 * 1.2
  private radius = 216;   // 180 * 1.2

  firstUpdated() {
    this.initCanvas();
  }

  updated() {
    if (!this.ctx && this.canvas) {
      this.initCanvas();
    }
  }

  private initCanvas() {
    // Since shadow DOM is disabled, use querySelector on this element
    this.canvas = this.querySelector('#wheel') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d')!;
      this.drawWheel();
    } else {
      // Retry in the next frame if canvas isn't ready
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
      
      // Draw segment
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fill();
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      // Draw text near the outer edge
      this.ctx.save();
      this.ctx.translate(this.centerX, this.centerY);
      this.ctx.rotate(startAngle + anglePerSegment / 2);
      
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      const text = this.names[i];
      let fontSize = 14;
      const textRadius = this.radius * 0.75; // Position text at 75% of radius (near outer edge)
      const maxTextWidth = this.radius * 0.3; // Limit text width for better fit
      
      this.ctx.font = `bold ${fontSize}px Arial`;
      while (this.ctx.measureText(text).width > maxTextWidth && fontSize > 8) {
        fontSize--;
        this.ctx.font = `bold ${fontSize}px Arial`;
      }
      
      // Add text shadow for better readability
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      this.ctx.shadowBlur = 3;
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;
      
      this.ctx.fillText(text, textRadius, 0);
      this.ctx.restore();
    }
    
    // Draw center circle
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();
  }

  private spin() {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.winnerText = 'Spinning...';
    
    // Generate a random final rotation (between 5-8 full spins plus a random portion)
    const minSpins = 5;
    const maxSpins = 8;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    const finalRotation = this.currentRotation + (spins * 2 * Math.PI) + Math.random() * 2 * Math.PI;
    
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    const startRotation = this.currentRotation;
    const rotationDelta = finalRotation - startRotation;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for realistic physics (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      this.currentRotation = startRotation + rotationDelta * easeOut;
      this.drawWheel();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        
        // Determine the winner based on which segment is at 12 o'clock
        const anglePerSegment = (2 * Math.PI) / this.names.length;
        // Normalize the final rotation to be between 0 and 2π
        const normalizedRotation = this.currentRotation % (2 * Math.PI);
        // 3π/2 is 12 o'clock position (270 degrees)
        // We add 2π and use modulo to handle negative rotations
        const winningIndex = Math.floor(
          (((3 * Math.PI/2) - normalizedRotation + (2 * Math.PI)) % (2 * Math.PI)) / anglePerSegment
        ) % this.names.length;
        
        const winner = this.names[winningIndex];
        this.winnerText = `🎉 Winner: ${winner}! 🎉`;
      }
    };
    
    requestAnimationFrame(animate);
  }

  private updateNames() {
    const inputText = this.namesInput.trim();
    const newNames = inputText.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (newNames.length < 2) {
      alert('Please enter at least 2 names.');
      return;
    }
    
    if (newNames.length > 30) {
      alert('Maximum 30 names allowed. Extra names will be ignored.');
      this.names = newNames.slice(0, 30);
    } else {
      this.names = newNames;
    }
    
    this.currentRotation = 0;
    this.winnerText = 'Spin to Find the Winner!';
    this.drawWheel();
    
    // Update textarea to show actual names being used
    this.namesInput = this.names.join('\n');
    this.requestUpdate();
  }

  private handleNamesInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.namesInput = target.value;
  }

  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 p-5">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <!-- Wheel Section -->
          <div class="flex flex-col items-center bg-white p-8 rounded-2xl shadow-2xl">
            <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center min-h-[60px] flex items-center">
              ${this.winnerText}
            </h1>
            
            <div class="relative mb-8">
              <canvas 
                id="wheel" 
                width="480" 
                height="480"
                class="block"
              ></canvas>
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-4xl text-black z-10" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">▼</div>
            </div>
            
            <button 
              @click="${this.spin}"
              ?disabled="${this.isSpinning}"
              class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                     text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg 
                     transform transition-all duration-200 hover:scale-105 hover:-translate-y-1
                     disabled:transform-none disabled:shadow-none"
            >
              ${this.isSpinning ? 'Spinning...' : 'Spin'}
            </button>
          </div>
          
          <!-- Input Section -->
          <div class="bg-white p-8 rounded-2xl shadow-2xl">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Update Names</h2>
            
            <textarea
              .value="${this.namesInput}"
              @input="${this.handleNamesInput}"
              placeholder="Enter names separated by new lines (2-30 names)..."
              class="w-full h-80 p-4 border-2 border-gray-300 rounded-lg text-sm resize-none 
                     focus:border-indigo-500 focus:outline-none transition-colors duration-200"
            ></textarea>
            
            <button
              @click="${this.updateNames}"
              class="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 
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