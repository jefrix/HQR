/**
 * HQR Math Visualizations
 * This script handles the canvas-based visualizations for the HQR theory.
 */

// Global state and variables
let currentDimension = '4D';
let animationRequestId = null;

// Constants
const COLORS = {
  // Background and grid
  background: '#0d1117',
  grid: '#30363d',
  axes: '#8b949e',
  
  // Wave function
  realPart: '#8884d8',
  imagPart: '#82ca9d',
  hiddenOrder: '#ff0000',
  
  // Correlation
  weakCorrelation: 'rgb(50, 50, 150)',
  strongCorrelation: 'rgb(50, 50, 255)',
  
  // Holographic
  boundary: '#ef4444',
  bulkSpace: '#3b82f6',
  network: '#93c5fd',
  
  // Text
  text: '#e0e0e0',
  
  // Gradients will be defined in context
};

// Update dimension display and redraw visualizations
function updateDimension(dimension) {
  currentDimension = dimension;
  const displayElement = document.getElementById('dimension-display');
  if (displayElement) {
    displayElement.textContent = 'Currently viewing: ' + dimension;
  }
  
  // Redraw all visualizations with the new dimension
  drawWaveFunction();
  drawCorrelation();
  drawHolographic();
  
  // Also update global dimension in dropdown if exists
  const dimensionSelect = document.getElementById('dimension-select');
  if (dimensionSelect && dimensionSelect.value !== dimension) {
    dimensionSelect.value = dimension;
  }
}

/**
 * Wave Function Visualization
 * Draws the Bohmian mechanics wave function and related components
 */
function drawWaveFunction() {
  const canvas = document.getElementById('wave-function-canvas');
  if (!canvas) {
    console.error('Canvas element wave-function-canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context for wave-function-canvas');
    return;
  }
  
  // Set canvas dimensions to match container
  canvas.width = canvas.parentElement.clientWidth || 500;
  canvas.height = canvas.parentElement.clientHeight || 300;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  drawGrid(ctx, canvas.width, canvas.height);
  
  // Center coordinates
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Draw axes
  drawAxes(ctx, canvas.width, canvas.height, centerX, centerY);
  
  // Set complexity based on dimension
  const complexity = currentDimension === '4D' ? 1 : 2;
  
  // Draw wave function components
  drawWaveFunctionComponents(ctx, canvas.width, canvas.height, centerX, centerY, complexity);
  
  // Draw legend
  drawWaveFunctionLegend(ctx);
}

/**
 * Draw the grid for visualizations
 */
function drawGrid(ctx, width, height) {
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 0.5;
  
  // Vertical grid lines
  for (let x = 0; x <= width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  for (let y = 0; y <= height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

/**
 * Draw x and y axes
 */
function drawAxes(ctx, width, height, centerX, centerY) {
  ctx.strokeStyle = COLORS.axes;
  ctx.lineWidth = 1;
  
  // X-axis
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
  
  // Y-axis
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();
}

/**
 * Draw the wave function components including real part, imaginary part, and hidden order
 */
function drawWaveFunctionComponents(ctx, width, height, centerX, centerY, complexity) {
  // Real part curve
  ctx.strokeStyle = COLORS.realPart;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let x = 0; x < width; x++) {
    // Map canvas x to wave function domain [-10, 10]
    const xValue = (x / width) * 20 - 10;
    
    // Calculate y from real part of wave function
    const amplitude = Math.exp(-xValue*xValue / 4);
    const phase = xValue*xValue / 2 * complexity;
    const realPart = amplitude * Math.cos(phase);
    
    // Map to canvas coordinates
    const y = centerY - realPart * (height * 0.4);
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Imaginary part curve
  ctx.strokeStyle = COLORS.imagPart;
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let x = 0; x < width; x++) {
    const xValue = (x / width) * 20 - 10;
    const amplitude = Math.exp(-xValue*xValue / 4);
    const phase = xValue*xValue / 2 * complexity;
    const imagPart = amplitude * Math.sin(phase);
    const y = centerY - imagPart * (height * 0.4);
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Hidden order correlation (dashed line)
  ctx.strokeStyle = COLORS.hiddenOrder;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  
  for (let x = 0; x < width; x++) {
    const xValue = (x / width) * 20 - 10;
    const amplitude = Math.exp(-xValue*xValue / 4);
    const hiddenOrder = amplitude * Math.cos(complexity * xValue / 2) * Math.exp(-Math.abs(xValue) / 5);
    const y = centerY - hiddenOrder * (height * 0.4);
    
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // Reset line dash
  ctx.setLineDash([]);
}

/**
 * Draw the legend for wave function visualization
 */
function drawWaveFunctionLegend(ctx) {
  const legendItems = [
    { color: COLORS.realPart, label: 'Real Part (Re[Ψ])' },
    { color: COLORS.imagPart, label: 'Imaginary Part (Im[Ψ])' },
    { color: COLORS.hiddenOrder, label: 'Hidden Order ⟨O(x)O(0)⟩' }
  ];
  
  ctx.font = '12px Arial';
  let legendY = 20;
  
  legendItems.forEach(item => {
    // Color box
    ctx.fillStyle = item.color;
    ctx.fillRect(10, legendY, 15, 15);
    
    // Label
    ctx.fillStyle = COLORS.text;
    ctx.fillText(item.label, 35, legendY + 12);
    
    legendY += 25;
  });
}

/**
 * Hidden Order Correlation Visualization
 * Shows how correlation functions behave in higher dimensions
 */
function drawCorrelation() {
  const canvas = document.getElementById('correlation-canvas');
  if (!canvas) {
    console.error('Canvas element correlation-canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context for correlation-canvas');
    return;
  }
  
  // Set canvas dimensions to match container
  canvas.width = canvas.parentElement.clientWidth || 500;
  canvas.height = canvas.parentElement.clientHeight || 300;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  drawGrid(ctx, canvas.width, canvas.height);
  
  // Center coordinates
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Draw axes
  drawAxes(ctx, canvas.width, canvas.height, centerX, centerY);
  
  // Set complexity based on dimension
  const complexity = currentDimension === '4D' ? 1 : 2;
  
  // Draw correlation points
  drawCorrelationPoints(ctx, canvas.width, canvas.height, centerX, centerY, complexity);
  
  // Draw correlation legend
  drawCorrelationLegend(ctx);
}

/**
 * Draw correlation points in a projection of higher dimensional space
 */
function drawCorrelationPoints(ctx, width, height, centerX, centerY, complexity) {
  const resolution = 20;
  
  for (let i = 0; i <= resolution; i++) {
    const u = (i / resolution) * Math.PI * 2;
    for (let j = 0; j <= resolution; j++) {
      const v = (j / resolution) * Math.PI;
      
      // Parametric equations for projection
      let x, y;
      
      if (currentDimension === '4D') {
        x = Math.sin(u) * Math.sin(v);
        y = Math.sin(u) * Math.cos(v);
      } else {
        x = Math.sin(u) * Math.sin(v) + 0.3 * Math.sin(3 * u);
        y = Math.sin(u) * Math.cos(v) + 0.3 * Math.cos(2 * v);
      }
      
      // Scale to canvas
      x = centerX + x * (width * 0.4);
      y = centerY - y * (height * 0.4);
      
      // Correlation intensity determines color
      const correlation = Math.pow(Math.cos(complexity * u) * Math.sin(complexity * v), 2);
      
      // Blue color with varying intensity
      const blue = Math.floor(150 + correlation * 105);
      ctx.fillStyle = `rgb(50, 50, ${blue})`;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Draw the legend for correlation visualization
 */
function drawCorrelationLegend(ctx) {
  // Color gradient legend
  const gradientWidth = 150;
  const gradientHeight = 15;
  const gradientX = 10;
  const gradientY = 20;
  
  ctx.font = '12px Arial';
  
  for (let i = 0; i < gradientWidth; i++) {
    const ratio = i / gradientWidth;
    const blue = Math.floor(150 + ratio * 105);
    ctx.fillStyle = `rgb(50, 50, ${blue})`;
    ctx.fillRect(gradientX + i, gradientY, 1, gradientHeight);
  }
  
  // Legend labels
  ctx.fillStyle = COLORS.text;
  ctx.fillText('Weak', gradientX, gradientY + gradientHeight + 15);
  ctx.fillText('Strong', gradientX + gradientWidth - 50, gradientY + gradientHeight + 15);
}

/**
 * Holographic Principle Visualization
 * Illustrates the AdS/CFT correspondence with bulk and boundary representations
 */
function drawHolographic() {
  const canvas = document.getElementById('holographic-canvas');
  if (!canvas) {
    console.error('Canvas element holographic-canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context for holographic-canvas');
    return;
  }
  
  // Set canvas dimensions to match container
  canvas.width = canvas.parentElement.clientWidth || 500;
  canvas.height = canvas.parentElement.clientHeight || 300;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Center and radius
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) * 0.4;
  
  // Draw holographic components
  drawHolographicComponents(ctx, centerX, centerY, radius);
  
  // Draw tensor network for 11D
  if (currentDimension === '11D') {
    drawTensorNetwork(ctx, centerX, centerY, radius);
  }
  
  // Draw holographic legend
  drawHolographicLegend(ctx);
}

/**
 * Draw the main components of the holographic visualization
 */
function drawHolographicComponents(ctx, centerX, centerY, radius) {
  // Draw boundary circle (CFT)
  ctx.strokeStyle = COLORS.boundary;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw concentric circles (AdS bulk)
  const circles = [0.8, 0.6, 0.4, 0.2];
  
  circles.forEach((scale, idx) => {
    ctx.strokeStyle = COLORS.bulkSpace;
    ctx.lineWidth = 1 + (1-scale) * 2;
    ctx.globalAlpha = 0.4 + ((1-scale) * 0.6);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
    ctx.stroke();
  });
  
  // Reset opacity
  ctx.globalAlpha = 1;
  
  // Draw radial lines
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  
  angles.forEach(angle => {
    const radian = angle * Math.PI / 180;
    const x = centerX + Math.cos(radian) * radius;
    const y = centerY + Math.sin(radian) * radius;
    
    ctx.strokeStyle = COLORS.network;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  
  // Reset opacity
  ctx.globalAlpha = 1;
  
  // Draw central point (deep bulk)
  ctx.fillStyle = COLORS.bulkSpace;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw the tensor network representation for 11D visualization
 */
function drawTensorNetwork(ctx, centerX, centerY, radius) {
  ctx.globalAlpha = 0.4;
  
  // Define levels of the network
  const levels = [0, 1, 2, 3];
  
  // Draw nodes at each level
  levels.forEach(level => {
    const levelRadius = (level === 0) ? 10 : radius * (0.2 + level * 0.2);
    const nodesAtLevel = 4 + level * 2;
    
    for (let i = 0; i < nodesAtLevel; i++) {
      const angle = (i / nodesAtLevel) * Math.PI * 2;
      const x = centerX + levelRadius * Math.cos(angle);
      const y = centerY + levelRadius * Math.sin(angle);
      
      // Node color based on level
      if (level === 0) {
        ctx.fillStyle = COLORS.bulkSpace;
      } else if (level === 3) {
        ctx.fillStyle = COLORS.boundary;
      } else {
        ctx.fillStyle = COLORS.bulkSpace;
      }
      
      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Draw connections between adjacent levels
  for (let level = 0; level < 3; level++) {
    const innerRadius = (level === 0) ? 10 : radius * (0.2 + level * 0.2);
    const outerRadius = radius * (0.2 + (level + 1) * 0.2);
    const innerNodes = 4 + level * 2;
    const outerNodes = 4 + (level + 1) * 2;
    
    for (let i = 0; i < innerNodes; i++) {
      const innerAngle = (i / innerNodes) * Math.PI * 2;
      const x1 = centerX + innerRadius * Math.cos(innerAngle);
      const y1 = centerY + innerRadius * Math.sin(innerAngle);
      
      // Connect each inner node to two outer nodes
      for (let j of [i*2, i*2+1]) {
        j = j % outerNodes; // Ensure we don't go out of bounds
        const outerAngle = (j / outerNodes) * Math.PI * 2;
        const x2 = centerX + outerRadius * Math.cos(outerAngle);
        const y2 = centerY + outerRadius * Math.sin(outerAngle);
        
        // Connection color
        ctx.strokeStyle = (level === 2) ? '#fca5a5' : COLORS.network;
        ctx.lineWidth = 1;
        
        // Draw connection
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }
  
  // Reset opacity
  ctx.globalAlpha = 1;
}

/**
 * Draw the legend for holographic visualization
 */
function drawHolographicLegend(ctx) {
  const legendItems = [
    { color: COLORS.boundary, label: 'CFT Boundary (Our 4D Reality)', type: 'line' },
    { color: COLORS.bulkSpace, label: 'AdS Bulk (Higher Dimensions)', type: 'circle' }
  ];
  
  if (currentDimension === '11D') {
    legendItems.push({ color: COLORS.network, label: 'MERA Tensor Network', type: 'line' });
  }
  
  ctx.font = '12px Arial';
  let legendY = 20;
  
  legendItems.forEach(item => {
    if (item.type === 'line') {
      // Line
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, legendY + 7);
      ctx.lineTo(25, legendY + 7);
      ctx.stroke();
    } else {
      // Circle
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(17, legendY + 7, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Label
    ctx.fillStyle = COLORS.text;
    ctx.fillText(item.label, 35, legendY + 12);
    
    legendY += 25;
  });
}

/**
 * Section animation
 */
function animateSections() {
  const sections = document.querySelectorAll('.visualization-section');
  
  sections.forEach(section => {
    const delay = parseInt(section.getAttribute('data-animation-delay')) || 0;
    
    setTimeout(() => {
      section.classList.add('loaded');
    }, delay);
  });
}

/**
 * Initialize visualizations
 */
function initVisualizations() {
  try {
    console.log("Initializing canvas visualizations...");
    
    // Check if canvas elements exist
    const waveFunctionCanvas = document.getElementById('wave-function-canvas');
    const correlationCanvas = document.getElementById('correlation-canvas');
    const holographicCanvas = document.getElementById('holographic-canvas');
    
    if (!waveFunctionCanvas) console.error("wave-function-canvas not found");
    if (!correlationCanvas) console.error("correlation-canvas not found");
    if (!holographicCanvas) console.error("holographic-canvas not found");
    
    // Force a minimum size for the chart containers
    document.querySelectorAll('.chart-container').forEach(container => {
      if (container.clientHeight < 300) {
        container.style.height = "300px";
      }
    });
    
    // Now draw the visualizations
    drawWaveFunction();
    drawCorrelation();
    drawHolographic();
    
    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        console.log("Window resized, redrawing visualizations...");
        drawWaveFunction();
        drawCorrelation();
        drawHolographic();
      }, 250);
    });
    
    // Animate in sections
    animateSections();
    
    // Hide error message if successful
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
  } catch (error) {
    console.error('Visualization error:', error);
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Error initializing visualizations: ' + error.message;
    }
  }
}

// Setup initialization based on document readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVisualizations);
} else {
  // DOM already loaded, initialize immediately
  initVisualizations();
}

// Fallback timer in case the DOMContentLoaded event didn't fire
setTimeout(function() {
  console.log("Fallback timer triggered for initialization");
  initVisualizations();
}, 500);
