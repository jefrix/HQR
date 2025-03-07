@@ -1,8 +1,7 @@
// Hidden Order Projection Sketch (with Interactivity)
// Hidden Order Projection Sketch
let hiddenOrderSketch = function(p) {
    let particles = [];
    let wave = 0;
    let isPaused = false;
    let wave;

    p.setup = function() {
        let canvas = p.createCanvas(300, 200);
@@ -18,547 +17,100 @@ let hiddenOrderSketch = function(p) {
                vy: 0
            });
        }
        wave = 0;
    };

    p.draw = function() {
        if (!isPaused) {
            p.background(15, 52, 96, 50); // Semi-transparent for trail effect
        p.background(15, 52, 96, 50); // Semi-transparent for trail effect

            // Simulate pilot wave from "higher dimension"
            wave += 0.05;
            let waveEffect = p.sin(wave);
        // Simulate pilot wave from "higher dimension"
        wave += 0.05;
        let waveEffect = p.sin(wave);

            // Update particles with subtle order, influenced by mouse position
            for (let particle of particles) {
                let dx = particle.x - p.width / 2;
                let dy = particle.y - p.height / 2;
                let distance = p.sqrt(dx * dx + dy * dy);
                let mouseInfluence = p.dist(particle.x, particle.y, p.mouseX, p.mouseY) / p.width;
                let force = (waveEffect * 0.1 + (1 - mouseInfluence) * 0.05) / (distance + 1); // Mouse affects force
        // Update particles with subtle order
        for (let particle of particles) {
            let dx = particle.x - p.width / 2;
            let dy = particle.y - p.height / 2;
            let distance = p.sqrt(dx * dx + dy * dy);
            let force = waveEffect * 0.1 / (distance + 1); // Avoid division by zero

                particle.vx += dx * force;
                particle.vy += dy * force;
                particle.vx *= 0.95; // Damping
                particle.vy *= 0.95;
            particle.vx += dx * force;
            particle.vy += dy * force;
            particle.vx *= 0.95; // Damping
            particle.vy *= 0.95;

                particle.x += particle.vx;
                particle.y += particle.vy;
            particle.x += particle.vx;
            particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
            // Bounce off edges
            if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;

                p.fill(224, 224, 224); // #e0e0e0
                p.noStroke();
                p.ellipse(particle.x, particle.y, 5, 5);
            }

            // Connect particles to show hidden order
            p.stroke(233, 69, 96, 100); // #e94560 with alpha
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (d < 50) {
                        p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    }
                }
            }
        }
    };

    // Pause/resume on click
    p.mouseClicked = function() {
        isPaused = !isPaused;
        if (isPaused) {
            p.background(15, 52, 96); // Clear canvas when paused
        }
    };

    // Influence particle movement with mouse position
    p.mouseMoved = function() {
        if (!isPaused) {
            // Particle movement slightly influenced by mouse position (already in p.draw)
        }
    };
};
// Tensor Networks Sketch
let tensorNetworkSketch = function(p) {
    let nodes = [];
    let connections = [];
    let isPaused = false;

    p.setup = function() {
        let canvas = p.createCanvas(300, 200);
        canvas.parent('tensor-network-canvas');
        p.background(15, 52, 96); // Match #0f3460

        // Initialize nodes (representing qubits or entanglement points)
        for (let i = 0; i < 20; i++) {
            nodes.push({
                x: p.random(p.width),
                y: p.random(p.height),
                vx: 0,
                vy: 0
            });
            p.fill(224, 224, 224); // #e0e0e0
            p.noStroke();
            p.ellipse(particle.x, particle.y, 5, 5);
        }

        // Initialize connections (randomly, based on entanglement)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (p.random() < 0.3) { // 30% chance of connection (adjustable)
                    connections.push({ from: i, to: j });
        // Connect particles to show hidden order
        p.stroke(233, 69, 96, 100); // #e94560 with alpha
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                if (d < 50) {
                    p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                }
            }
        }
    };

    p.draw = function() {
        if (!isPaused) {
            p.background(15, 52, 96, 50); // Semi-transparent for trail effect

            // Update nodes with subtle motion, influenced by mouse position
            for (let node of nodes) {
                let dx = node.x - p.width / 2;
                let dy = node.y - p.height / 2;
                let mouseInfluence = p.dist(node.x, node.y, p.mouseX, p.mouseY) / p.width;
                let force = (0.05 + (1 - mouseInfluence) * 0.02); // Mouse affects motion

                node.vx += dx * force;
                node.vy += dy * force;
                node.vx *= 0.95; // Damping
                node.vy *= 0.95;

                node.x += node.vx;
                node.y += node.vy;

                // Bounce off edges
                if (node.x < 0 || node.x > p.width) node.vx *= -1;
                if (node.y < 0 || node.y > p.height) node.vy *= -1;

                p.fill(224, 224, 224); // #e0e0e0
                p.noStroke();
                p.ellipse(node.x, node.y, 5, 5);
            }

            // Draw connections (tensor network structure)
            p.stroke(233, 69, 96, 100); // #e94560 with alpha (red for connections)
            for (let connection of connections) {
                let fromNode = nodes[connection.from];
                let toNode = nodes[connection.to];
                p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
            }
        }
    };

    // Pause/resume on click
    p.mouseClicked = function() {
        isPaused = !isPaused;
        if (isPaused) {
            p.background(15, 52, 96); // Clear canvas when paused
        }
    };

    // Influence node movement with mouse position
    p.mouseMoved = function() {
        if (!isPaused) {
            // Nodes subtly adjust based on mouse proximity (already in p.draw)
        }
    };
};

// Create p5 instance for tensor networks
new p5(tensorNetworkSketch);
// Holographic Reality Sketch (with Interactivity)
// Holographic Reality Sketch
let holographicSketch = function(p) {
    let angle = 0;
    let isPaused = false;
    let rotationSpeed = 0.02;

    p.setup = function() {
        let canvas = p.createCanvas(300, 200, p.WEBGL);
        canvas.parent('holographic-canvas');
    };

    p.draw = function() {
        if (!isPaused) {
            p.background(15, 52, 96); // #0f3460

            // Simulate 11D bulk as rotating sphere, influenced by mouse Y
            p.push();
            p.translate(0, -50, 0);
            p.rotateY(angle);
            p.noFill();
            p.stroke(162, 168, 211); // #a2a8d3
            p.sphere(30);
            p.pop();

            // 4D boundary as plane with "hidden order" ripples, influenced by mouse X
            p.push();
            p.translate(0, 50, 0);
            p.rotateX(p.PI / 4);
            p.fill(22, 33, 62, 150); // #16213e with alpha
            p.noStroke();
            for (let x = -100; x < 100; x += 20) {
                for (let z = -100; z < 100; z += 20) {
                    let y = p.sin(p.dist(x, z, 0, 0) * 0.05 + angle + p.map(p.mouseX, 0, p.width, -0.1, 0.1)) * 10;
                    p.push();
                    p.translate(x, y, z);
                    p.box(10);
                    p.pop();
                }
        p.background(15, 52, 96); // #0f3460

        // Simulate 11D bulk as rotating sphere
        p.push();
        p.translate(0, -50, 0);
        p.rotateY(angle);
        p.noFill();
        p.stroke(162, 168, 211); // #a2a8d3
        p.sphere(30);
        p.pop();

        // 4D boundary as plane with "hidden order" ripples
        p.push();
        p.translate(0, 50, 0);
        p.rotateX(p.PI / 4);
        p.fill(22, 33, 62, 150); // #16213e with alpha
        p.noStroke();
        for (let x = -100; x < 100; x += 20) {
            for (let z = -100; z < 100; z += 20) {
                let y = p.sin(p.dist(x, z, 0, 0) * 0.05 + angle) * 10;
                p.push();
                p.translate(x, y, z);
                p.box(10);
                p.pop();
            }
            p.pop();

            angle += rotationSpeed * p.map(p.mouseY, 0, p.height, 0.5, 1.5); // Mouse Y controls rotation speed
        }
    };
        p.pop();

    // Pause/resume on click
    p.mouseClicked = function() {
        isPaused = !isPaused;
        if (isPaused) {
            p.background(15, 52, 96); // Clear canvas when paused
        }
    };

    // Adjust rotation speed with mouse movement
    p.mouseMoved = function() {
        if (!isPaused) {
            rotationSpeed = p.map(p.mouseY, 0, p.height, 0.01, 0.05); // Slower or faster rotation
        }
        angle += 0.02;
    };
};

// sketch.js
let equationTextElement;

function setup() {
    // Create a canvas (optional, for future enhancements)
    let c = createCanvas(200, 50);
    c.parent('equation-display'); // Attach to the equation-display div
    equationTextElement = select('#equation-text'); // Get the text element
}

function draw() {
    // No drawing needed for now, just update text
    // This could be enhanced to graph the equation later
}
// sketch.js
let hiddenOrderSketch;
let hqrSketch;

function setup() {
    // Hidden Order Graph
    hiddenOrderSketch = (p) => {
        let params = { orderParam: 0.5, dim: '4d' };
        let equationText;

        p.setup = () => {
            let c = p.createCanvas(800, 400);
            c.parent('hidden-order-canvas');
            equationText = document.getElementById('equation-text-hidden');
            p.noLoop();
        };

        p.draw = () => {
            // Update parameters
            params.orderParam = hiddenOrderParams.orderParam;
            params.dim = hiddenOrderParams.dim;

            // Background
            p.background('#16213e');

            // Grid lines
            p.stroke('#30363d');
            p.strokeWeight(1);
            p.line(50, 350, 750, 350); // X-axis
            p.line(50, 50, 50, 350);   // Y-axis

            // Horizontal grid lines
            p.strokeWeight(0.5);
            p.setLineDash([5, 5]);
            p.line(50, 50, 750, 50);
            p.line(50, 150, 750, 150);
            p.line(50, 250, 750, 250);

            // Vertical grid lines
            p.line(190, 50, 190, 350);
            p.line(330, 50, 330, 350);
            p.line(470, 50, 470, 350);
            p.line(610, 50, 610, 350);
            p.line(750, 50, 750, 350);
            p.setLineDash([]);

            // Axes labels
            p.fill('#a2a8d3');
            p.noStroke();
            p.textSize(12);
            p.textAlign(p.CENTER);
            p.text('Position', 400, 380);
            p.push();
            p.translate(20, 200);
            p.rotate(-p.HALF_PI);
            p.text('Order Parameter', 0, 0);
            p.pop();

            // X-axis ticks
            p.textSize(10);
            p.text('0', 50, 370);
            p.text('1', 190, 370);
            p.text('2', 330, 370);
            p.text('3', 470, 370);
            p.text('4', 610, 370);
            p.text('5', 750, 370);

            // Y-axis ticks
            p.textAlign(p.RIGHT);
            p.text('-1.0', 40, 350);
            p.text('0.0', 40, 250);
            p.text('1.0', 40, 150);
            p.text('2.0', 40, 50);

            // Plot Bohmian Wave
            p.stroke('#8884d8');
            p.strokeWeight(2);
            p.noFill();
            p.beginShape();
            const amplitude = params.dim === '11d' ? 50 * params.orderParam : 30 * params.orderParam;
            for (let x = 50; x <= 750; x++) {
                let y = 250 - amplitude * Math.sin((x - 50) / 100);
                p.vertex(x, y);
            }
            p.endShape();

            // Plot Hidden Order
            p.stroke('#e94560');
            p.setLineDash([5, 3]);
            p.beginShape();
            for (let x = 50; x <= 750; x++) {
                let y = 250 + amplitude * Math.cos((x - 50) / 100);
                p.vertex(x, y);
            }
            p.endShape();
            p.setLineDash([]);

            // Legend
            p.fill('#0f3460');
            p.stroke('#0f3460');
            p.rect(580, 70, 150, 80, 5, 5);
            p.fill('#a2a8d3');
            p.noStroke();
            p.textSize(12);
            p.text('Legend:', 590, 90);
            p.stroke('#8884d8');
            p.strokeWeight(2);
            p.line(590, 110, 620, 110);
            p.noStroke();
            p.textSize(10);
            p.text('Bohmian Wave', 630, 113);
            p.stroke('#e94560');
            p.setLineDash([5, 3]);
            p.line(590, 130, 620, 130);
            p.setLineDash([]);
            p.noStroke();
            p.text('Hidden Order', 630, 133);

            // Update equation text
            equationText.textContent = `Equation: y = ${amplitude.toFixed(2)} * sin((x - 50) / 100)`;
        };

        p.setLineDash = (dash) => {
            p.drawingContext.setLineDash(dash);
        };
    };

    // HQR Graph
    hqrSketch = (p) => {
        let params = { complexity: 5, model: 'integrated' };
        let equationText;

        p.setup = () => {
            let c = p.createCanvas(800, 400);
            c.parent('hqr-canvas');
            equationText = document.getElementById('equation-text-hqr');
            p.noLoop();
        };

        p.draw = () => {
            // Update parameters
            params.complexity = hqrParams.complexity;
            params.model = hqrParams.model;

            // Background
            p.background('#16213e');

            // Grid for 4D projection (bottom half)
            p.stroke('#a2a8d3');
            p.strokeWeight(1);
            p.noFill();
            p.rect(200, 270, 400, 60);
            p.line(200, 300, 600, 300);
            p.strokeWeight(0.5);
            p.setLineDash([5, 5]);
            p.line(250, 270, 250, 330);
            p.line(300, 270, 300, 330);
            p.line(350, 270, 350, 330);
            p.line(400, 270, 400, 330);
            p.line(450, 270, 450, 330);
            p.line(500, 270, 500, 330);
            p.line(550, 270, 550, 330);
            p.setLineDash([]);

            // Labels for 4D projection
            p.fill('#a2a8d3');
            p.noStroke();
            p.textSize(12);
            p.textAlign(p.CENTER);
            p.text('Position', 400, 360);
            p.push();
            p.translate(170, 300);
            p.rotate(-p.HALF_PI);
            p.text('Amplitude', 0, 0);
            p.pop();

            // X-axis ticks
            p.textSize(10);
            p.text('-2', 200, 350);
            p.text('-1', 300, 350);
            p.text('0', 400, 350);
            p.text('1', 500, 350);
            p.text('2', 600, 350);

            // Y-axis ticks
            p.textAlign(p.RIGHT);
            p.text('-30', 190, 330);
            p.text('0', 190, 300);
            p.text('30', 190, 270);

            // Higher-dimensional representation (top half)
            p.stroke('#6a7cb2');
            p.strokeWeight(1);
            p.noFill();
            p.ellipse(400, 100, 400, 160);
            p.ellipse(400, 100, 400, 160, 0, 0, p.TWO_PI, false, 60);
            p.ellipse(400, 100, 400, 160, 0, 0, p.TWO_PI, false, 120);

            // Plot Pilot Wave
            p.stroke('#e94560');
            p.strokeWeight(3);
            p.beginShape();
            const amp = 20 + params.complexity * 5;
            const freq = params.model === 'integrated' ? 0.1 : 0.2;
            for (let x = -150; x <= 150; x++) {
                let y = amp * Math.sin(x * freq);
                p.vertex(400 + x, 100 + y);
            }
            p.endShape();

            // Plot Field Potential
            p.stroke('#4169e1');
            p.strokeWeight(2);
            p.beginShape();
            for (let x = -150; x <= 150; x++) {
                let y = -amp * Math.cos(x * freq);
                p.vertex(400 + x, 100 + y);
            }
            p.endShape();

            // Plot Projected Wave
            p.stroke('#e94560');
            p.strokeWeight(2);
            p.beginShape();
            for (let x = -200; x <= 200; x++) {
                let y = (amp * 0.5) * Math.sin(x * 0.15);
                p.vertex(400 + x, 300 + y);
            }
            p.endShape();

            // Legend
            p.fill('#0f3460');
            p.stroke('#0f3460');
            p.rect(580, 310, 170, 80, 5, 5);
            p.fill('#a2a8d3');
            p.noStroke();
            p.textSize(12);
            p.text('Legend:', 590, 330);
            p.stroke('#e94560');
            p.strokeWeight(2);
            p.line(590, 350, 620, 350);
            p.noStroke();
            p.textSize(10);
            p.text('Pilot Wave', 630, 353);
            p.stroke('#4169e1');
            p.strokeWeight(2);
            p.line(590, 370, 620, 370);
            p.noStroke();
            p.text('Quantum Potential', 630, 373);
            p.fill('#ffffff');
            p.stroke('#ffffff');
            p.ellipse(605, 390, 10, 10);
            p.noStroke();
            p.text('Particles', 630, 393);

            // Update equation text
            equationText.textContent = `Equation: y = ${amp.toFixed(2)} * sin(${freq.toFixed(2)}x)`;
        };

        p.setLineDash = (dash) => {
            p.drawingContext.setLineDash(dash);
        };
    };

    // Initialize sketches
    new p5(hiddenOrderSketch);
    new p5(hqrSketch);
}
// Create p5 instances
new p5(hiddenOrderSketch);
new p5(holographicSketch);
// sketch.js (Modular)
let hqrVisualizations = {
    hiddenOrderSketch: null,
    hqrSketch: null
};

function setupHQRVisualizations() {
    hqrVisualizations.hiddenOrderSketch = new p5((p) => {
        let equationText;
        p.setup = () => {
            let c = p.createCanvas(800, 400);
            c.parent('hidden-order-canvas');
            equationText = document.getElementById('equation-text-hidden');
            p.noLoop();
        };
        p.draw = () => {
            // [Same draw logic as Option 1 for Hidden Order]
        };
    });

    hqrVisualizations.hqrSketch = new p5((p) => {
        let equationText;
        p.setup = () => {
            let c = p.createCanvas(800, 400);
            c.parent('hqr-canvas');
            equationText = document.getElementById('equation-text-hqr');
            p.noLoop();
        };
        p.draw = () => {
            // [Same draw logic as Option 1 for HQR]
        };
    });

    p5.prototype.setLineDash = function(dash) {
        this.drawingContext.setLineDash(dash);
    };
}

window.addEventListener('load', () => {
    if (document.getElementById('hidden-order-canvas')) {
        setupHQRVisualizations();
    }
    // Add other page-specific setup logic here
});
// Smooth scrolling
// Smooth scrolling (from original script.js)
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
