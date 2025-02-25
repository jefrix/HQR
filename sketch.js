// Hidden Order Projection Sketch (with Interactivity)
let hiddenOrderSketch = function(p) {
    let particles = [];
    let wave = 0;
    let isPaused = false;

    p.setup = function() {
        let canvas = p.createCanvas(300, 200);
        canvas.parent('hidden-order-canvas');
        p.background(15, 52, 96); // Match #0f3460

        // Initialize particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                vx: 0,
                vy: 0
            });
        }
    };

    p.draw = function() {
        if (!isPaused) {
            p.background(15, 52, 96, 50); // Semi-transparent for trail effect

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

                particle.vx += dx * force;
                particle.vy += dy * force;
                particle.vx *= 0.95; // Damping
                particle.vy *= 0.95;

                particle.x += particle.vx;
                particle.y += particle.vy;

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

// Holographic Reality Sketch (with Interactivity)
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
            }
            p.pop();

            angle += rotationSpeed * p.map(p.mouseY, 0, p.height, 0.5, 1.5); // Mouse Y controls rotation speed
        }
    };

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
    };
};

// Create p5 instances
new p5(hiddenOrderSketch);
new p5(holographicSketch);

// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        section.scrollIntoView({ behavior: 'smooth' });
    });
});
