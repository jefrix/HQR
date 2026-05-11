(function () {
    'use strict';

    const COLORS = {
        bg: '#07182d',
        bg2: '#123b68',
        panel: '#16213e',
        grid: 'rgba(162, 168, 211, 0.16)',
        line: '#56cfe1',
        accent: '#e94560',
        warm: '#f4d35e',
        text: '#e8eefc',
        muted: '#a2a8d3'
    };

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function p5Available() {
        if (typeof window.p5 === 'undefined') {
            console.warn('p5.js is required for HQR visualizations.');
            return false;
        }
        return true;
    }

    function measure(container, fallbackHeight) {
        const rect = container.getBoundingClientRect();
        const computed = window.getComputedStyle(container);
        const cssHeight = parseFloat(computed.height);

        return {
            width: Math.max(260, Math.floor(rect.width || container.clientWidth || 320)),
            height: Math.max(170, Math.floor(cssHeight || rect.height || fallbackHeight || 220))
        };
    }

    function clear(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    function buildCanvas(p, container, renderer, fallbackHeight) {
        clear(container);
        const size = measure(container, fallbackHeight);
        p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        const canvas = renderer
            ? p.createCanvas(size.width, size.height, renderer)
            : p.createCanvas(size.width, size.height);
        canvas.parent(container);
        canvas.elt.style.display = 'block';
        canvas.elt.style.width = '100%';
        canvas.elt.style.height = '100%';
        return canvas;
    }

    function resizeCanvas(p, container, fallbackHeight, onResize) {
        const size = measure(container, fallbackHeight);
        p.resizeCanvas(size.width, size.height);
        if (typeof onResize === 'function') {
            onResize();
        }
    }

    function pointerInside(p) {
        return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
    }

    function paintBackdrop(p) {
        const ctx = p.drawingContext;
        const gradient = ctx.createLinearGradient(0, 0, p.width, p.height);
        gradient.addColorStop(0, COLORS.bg);
        gradient.addColorStop(0.58, COLORS.bg2);
        gradient.addColorStop(1, '#102444');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, p.width, p.height);

        p.stroke(COLORS.grid);
        p.strokeWeight(1);
        const step = Math.max(26, Math.min(p.width, p.height) / 7);
        for (let x = step; x < p.width; x += step) {
            p.line(x, 0, x, p.height);
        }
        for (let y = step; y < p.height; y += step) {
            p.line(0, y, p.width, y);
        }
    }

    function drawGlowPoint(p, x, y, radius, color) {
        p.noStroke();
        p.fill(color);
        p.circle(x, y, radius);
        p.fill(p.color(color).setAlpha ? color : COLORS.text);
    }

    function createHiddenOrderSketch(container) {
        new p5(function (p) {
            let particles = [];
            let phase = 0;
            let paused = false;

            function seedParticles() {
                const count = Math.max(34, Math.min(64, Math.floor(p.width / 9)));
                particles = Array.from({ length: count }, function (_, index) {
                    return {
                        angle: (index / count) * p.TWO_PI,
                        radius: p.random(0.16, 0.46),
                        drift: p.random(0.5, 1.8),
                        offset: p.random(p.TWO_PI),
                        x: 0,
                        y: 0
                    };
                });
            }

            function particlePosition(particle) {
                const cx = p.width / 2;
                const cy = p.height / 2;
                const minDim = Math.min(p.width, p.height);
                const mousePull = pointerInside(p)
                    ? p.map(p.dist(p.mouseX, p.mouseY, cx, cy), 0, minDim, 0.22, -0.08, true)
                    : 0;
                const pulse = p.sin(phase * particle.drift + particle.offset);
                const radius = minDim * (particle.radius + pulse * 0.035 + mousePull * 0.08);
                const angle = particle.angle + p.sin(phase * 0.7 + particle.offset) * 0.42;

                particle.x = cx + p.cos(angle) * radius + p.sin(phase + particle.offset) * 10;
                particle.y = cy + p.sin(angle) * radius * 0.72 + p.cos(phase * 1.2 + particle.offset) * 8;
            }

            p.setup = function () {
                const canvas = buildCanvas(p, container, null, 220);
                canvas.elt.addEventListener('click', function () {
                    paused = !paused;
                });
                seedParticles();
            };

            p.draw = function () {
                if (!paused) {
                    phase += 0.018;
                }

                paintBackdrop(p);

                const cx = p.width / 2;
                const cy = p.height / 2;
                const ringRadius = Math.min(p.width, p.height) * 0.36;

                p.noFill();
                p.stroke('rgba(244, 211, 94, 0.28)');
                p.strokeWeight(1.5);
                p.ellipse(cx, cy, ringRadius * 2.15, ringRadius * 1.35);
                p.stroke('rgba(86, 207, 225, 0.22)');
                p.ellipse(cx, cy, ringRadius * 1.45, ringRadius * 0.9);

                particles.forEach(particlePosition);

                for (let i = 0; i < particles.length; i += 1) {
                    for (let j = i + 1; j < particles.length; j += 1) {
                        const d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        const limit = Math.min(p.width, p.height) * 0.24;
                        if (d < limit) {
                            const alpha = p.map(d, 0, limit, 150, 18);
                            p.stroke(233, 69, 96, alpha);
                            p.strokeWeight(1);
                            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }

                particles.forEach(function (particle, index) {
                    const isAnchor = index % 7 === 0;
                    p.noStroke();
                    p.fill(isAnchor ? 'rgba(244, 211, 94, 0.24)' : 'rgba(86, 207, 225, 0.18)');
                    p.circle(particle.x, particle.y, isAnchor ? 14 : 10);
                    p.fill(isAnchor ? COLORS.warm : COLORS.text);
                    p.circle(particle.x, particle.y, isAnchor ? 5.5 : 4.2);
                });

                p.noStroke();
                p.fill('rgba(232, 238, 252, 0.72)');
                p.textSize(11);
                p.textAlign(p.LEFT, p.BOTTOM);
                p.text(paused ? 'paused' : 'hidden correlations', 14, p.height - 12);
            };

            p.windowResized = function () {
                resizeCanvas(p, container, 220, seedParticles);
            };
        });
    }

    function createTensorNetworkSketch(container) {
        new p5(function (p) {
            let phase = 0;
            let paused = false;

            function nodeLayout() {
                const levels = [1, 2, 4, 8, 16];
                const nodes = [];
                const top = p.height * 0.15;
                const bottom = p.height * 0.84;
                const maxSpread = p.width * 0.82;

                levels.forEach(function (count, level) {
                    const y = p.map(level, 0, levels.length - 1, top, bottom);
                    const spread = p.map(level, 0, levels.length - 1, 0, maxSpread);
                    for (let i = 0; i < count; i += 1) {
                        const centered = count === 1 ? 0 : (i / (count - 1) - 0.5);
                        const wave = p.sin(phase + level * 0.8 + i * 0.35) * (level + 1) * 0.9;
                        nodes.push({
                            level: level,
                            index: i,
                            x: p.width / 2 + centered * spread + wave,
                            y: y + p.cos(phase * 1.4 + i) * 2.5
                        });
                    }
                });
                return { levels: levels, nodes: nodes };
            }

            function getNode(layout, level, index) {
                let offset = 0;
                for (let i = 0; i < level; i += 1) {
                    offset += layout.levels[i];
                }
                return layout.nodes[offset + index];
            }

            p.setup = function () {
                const canvas = buildCanvas(p, container, null, 260);
                canvas.elt.addEventListener('click', function () {
                    paused = !paused;
                });
            };

            p.draw = function () {
                if (!paused) {
                    phase += 0.014;
                }
                paintBackdrop(p);

                const layout = nodeLayout();

                p.noFill();
                p.stroke('rgba(86, 207, 225, 0.16)');
                p.strokeWeight(1);
                for (let r = 0.22; r <= 0.78; r += 0.14) {
                    p.arc(p.width / 2, p.height * 0.92, p.width * r, p.height * r * 0.72, p.PI, p.TWO_PI);
                }

                for (let level = 0; level < layout.levels.length - 1; level += 1) {
                    for (let i = 0; i < layout.levels[level]; i += 1) {
                        const from = getNode(layout, level, i);
                        const left = getNode(layout, level + 1, i * 2);
                        const right = getNode(layout, level + 1, i * 2 + 1);
                        [left, right].forEach(function (to) {
                            p.stroke('rgba(233, 69, 96, 0.52)');
                            p.strokeWeight(1.25);
                            p.line(from.x, from.y, to.x, to.y);
                        });
                    }
                }

                layout.nodes.forEach(function (node) {
                    const radius = p.map(node.level, 0, 4, 9, 4.5);
                    p.noStroke();
                    p.fill('rgba(86, 207, 225, 0.20)');
                    p.circle(node.x, node.y, radius * 2.5);
                    p.fill(node.level === 0 ? COLORS.warm : COLORS.text);
                    p.circle(node.x, node.y, radius);
                });

                p.noStroke();
                p.fill('rgba(232, 238, 252, 0.72)');
                p.textSize(11);
                p.textAlign(p.LEFT, p.BOTTOM);
                p.text(paused ? 'paused' : 'MERA tensor layers', 14, p.height - 12);
            };

            p.windowResized = function () {
                resizeCanvas(p, container, 260);
            };
        });
    }

    function createHolographicSketch(container) {
        new p5(function (p) {
            let phase = 0;
            let paused = false;

            p.setup = function () {
                const canvas = buildCanvas(p, container, null, 220);
                canvas.elt.addEventListener('click', function () {
                    paused = !paused;
                });
            };

            p.draw = function () {
                if (!paused) {
                    phase += 0.018;
                }
                paintBackdrop(p);

                const cx = p.width / 2;
                const sphereY = p.height * 0.38;
                const boundaryY = p.height * 0.72;
                const radius = Math.min(p.width, p.height) * 0.24;

                p.stroke('rgba(244, 211, 94, 0.28)');
                p.strokeWeight(1.1);
                for (let i = -4; i <= 4; i += 1) {
                    const x = cx + i * radius * 0.46;
                    const bend = p.sin(phase + i) * 10;
                    p.line(x, sphereY + radius * 0.62, x + bend, boundaryY - 16);
                }

                p.noFill();
                p.stroke(COLORS.line);
                p.strokeWeight(2);
                p.circle(cx, sphereY, radius * 2);

                p.stroke('rgba(86, 207, 225, 0.42)');
                for (let i = -2; i <= 2; i += 1) {
                    const squish = Math.abs(i) / 2;
                    p.ellipse(cx, sphereY, radius * 2, radius * (1 - squish * 0.38));
                }
                for (let i = 0; i < 8; i += 1) {
                    const angle = phase + (i / 8) * p.TWO_PI;
                    const x = cx + p.cos(angle) * radius;
                    p.line(cx, sphereY - radius, x, sphereY + radius);
                }

                p.noStroke();
                p.fill('rgba(244, 211, 94, 0.95)');
                p.circle(cx + p.cos(phase * 1.6) * radius * 0.64, sphereY + p.sin(phase) * radius * 0.28, 6);

                p.stroke('rgba(233, 69, 96, 0.85)');
                p.strokeWeight(2);
                p.noFill();
                p.beginShape();
                for (let x = p.width * 0.12; x <= p.width * 0.88; x += 8) {
                    const wave = p.sin((x * 0.045) + phase * 2.2) * 8;
                    p.vertex(x, boundaryY + wave);
                }
                p.endShape();

                p.stroke('rgba(162, 168, 211, 0.36)');
                p.strokeWeight(1);
                for (let i = 0; i < 5; i += 1) {
                    const y = boundaryY + i * 13;
                    p.line(p.width * 0.12, y, p.width * 0.88, y);
                }
                for (let i = 0; i < 9; i += 1) {
                    const x = p.map(i, 0, 8, p.width * 0.12, p.width * 0.88);
                    p.line(x, boundaryY - 16, x, boundaryY + 52);
                }

                p.noStroke();
                p.fill('rgba(232, 238, 252, 0.72)');
                p.textSize(11);
                p.textAlign(p.LEFT, p.BOTTOM);
                p.text(paused ? 'paused' : 'bulk to boundary projection', 14, p.height - 12);
            };

            p.windowResized = function () {
                resizeCanvas(p, container, 220);
            };
        });
    }

    function getHiddenParams() {
        if (typeof hiddenOrderParams !== 'undefined') {
            return hiddenOrderParams;
        }
        return { orderParam: 0.5, dim: '4d' };
    }

    function getHqrParams() {
        if (typeof hqrParams !== 'undefined') {
            return hqrParams;
        }
        return { complexity: 5, model: 'integrated' };
    }

    function drawAxes(p, left, top, width, height, xLabel, yLabel) {
        p.stroke('rgba(162, 168, 211, 0.45)');
        p.strokeWeight(1);
        p.line(left, top + height, left + width, top + height);
        p.line(left, top, left, top + height);

        p.stroke('rgba(162, 168, 211, 0.14)');
        for (let i = 1; i <= 4; i += 1) {
            const x = left + (width / 4) * i;
            const y = top + (height / 4) * i;
            p.line(x, top, x, top + height);
            p.line(left, y, left + width, y);
        }

        p.noStroke();
        p.fill(COLORS.muted);
        p.textSize(11);
        p.textAlign(p.CENTER, p.TOP);
        p.text(xLabel, left + width / 2, top + height + 16);
        p.push();
        p.translate(left - 28, top + height / 2);
        p.rotate(-p.HALF_PI);
        p.text(yLabel, 0, 0);
        p.pop();
    }

    function createAdvancedHiddenOrder(container) {
        new p5(function (p) {
            p.setup = function () {
                buildCanvas(p, container, null, 360);
            };

            p.draw = function () {
                const params = getHiddenParams();
                paintBackdrop(p);

                const left = 58;
                const top = 42;
                const width = p.width - 92;
                const height = p.height - 104;
                const amp = (params.dim === '11d' ? 0.43 : 0.31) * Number(params.orderParam || 0.5);

                drawAxes(p, left, top, width, height, 'Position', 'Order parameter');

                p.noFill();
                p.stroke(COLORS.line);
                p.strokeWeight(2.5);
                p.beginShape();
                for (let i = 0; i <= 240; i += 1) {
                    const x = left + (i / 240) * width;
                    const t = (i / 240) * p.TWO_PI * 2.2;
                    const y = top + height * (0.52 - Math.sin(t) * amp);
                    p.vertex(x, y);
                }
                p.endShape();

                p.stroke(COLORS.accent);
                p.strokeWeight(2);
                p.drawingContext.setLineDash([7, 5]);
                p.beginShape();
                for (let i = 0; i <= 240; i += 1) {
                    const x = left + (i / 240) * width;
                    const t = (i / 240) * p.TWO_PI * 2.2;
                    const y = top + height * (0.52 + Math.cos(t * 0.8) * amp * 0.82);
                    p.vertex(x, y);
                }
                p.endShape();
                p.drawingContext.setLineDash([]);

                p.noStroke();
                p.fill('rgba(7, 24, 45, 0.76)');
                p.rect(p.width - 214, 28, 178, 72, 8);
                p.fill(COLORS.text);
                p.textSize(12);
                p.textAlign(p.LEFT, p.TOP);
                p.text('Bohmian wave', p.width - 178, 43);
                p.text('Hidden order', p.width - 178, 68);
                p.stroke(COLORS.line);
                p.line(p.width - 198, 50, p.width - 184, 50);
                p.stroke(COLORS.accent);
                p.drawingContext.setLineDash([5, 4]);
                p.line(p.width - 198, 75, p.width - 184, 75);
                p.drawingContext.setLineDash([]);

                const equation = document.getElementById('equation-text-hidden');
                if (equation) {
                    equation.textContent = 'Equation: y = ' + (amp * 100).toFixed(1) + ' * sin(kx), projection = ' + params.dim.toUpperCase();
                }
            };

            p.windowResized = function () {
                resizeCanvas(p, container, 360);
            };
        });
    }

    function createAdvancedHqr(container) {
        new p5(function (p) {
            let phase = 0;

            p.setup = function () {
                buildCanvas(p, container, null, 360);
            };

            p.draw = function () {
                const params = getHqrParams();
                phase += 0.01;
                paintBackdrop(p);

                const complexity = Number(params.complexity || 5);
                const modelFactor = params.model === 'string' ? 1.35 : params.model === 'bohmian' ? 0.85 : 1;
                const amp = (16 + complexity * 3.5) * modelFactor;

                p.noFill();
                p.stroke('rgba(86, 207, 225, 0.32)');
                p.strokeWeight(1.2);
                p.ellipse(p.width / 2, p.height * 0.3, p.width * 0.58, p.height * 0.28);
                p.ellipse(p.width / 2, p.height * 0.3, p.width * 0.42, p.height * 0.2);

                p.stroke(COLORS.accent);
                p.strokeWeight(3);
                p.beginShape();
                for (let x = -p.width * 0.24; x <= p.width * 0.24; x += 4) {
                    p.vertex(p.width / 2 + x, p.height * 0.3 + Math.sin(x * 0.04 + phase * 2) * amp);
                }
                p.endShape();

                p.stroke(COLORS.line);
                p.strokeWeight(2);
                p.beginShape();
                for (let x = -p.width * 0.24; x <= p.width * 0.24; x += 4) {
                    p.vertex(p.width / 2 + x, p.height * 0.3 + Math.cos(x * 0.035 - phase) * amp * 0.65);
                }
                p.endShape();

                const gridTop = p.height * 0.64;
                const gridLeft = p.width * 0.16;
                const gridWidth = p.width * 0.68;
                const gridHeight = p.height * 0.16;
                p.stroke('rgba(162, 168, 211, 0.42)');
                p.noFill();
                p.rect(gridLeft, gridTop, gridWidth, gridHeight, 6);
                for (let i = 1; i < 8; i += 1) {
                    const x = gridLeft + (gridWidth / 8) * i;
                    p.line(x, gridTop, x, gridTop + gridHeight);
                }
                p.line(gridLeft, gridTop + gridHeight / 2, gridLeft + gridWidth, gridTop + gridHeight / 2);

                p.noFill();
                p.stroke(COLORS.warm);
                p.strokeWeight(2);
                p.beginShape();
                for (let i = 0; i <= 180; i += 1) {
                    const x = gridLeft + (i / 180) * gridWidth;
                    const y = gridTop + gridHeight / 2 + Math.sin(i * 0.11 + phase * 2.4) * (gridHeight * 0.32);
                    p.vertex(x, y);
                }
                p.endShape();

                p.noStroke();
                p.fill(COLORS.text);
                for (let i = 0; i < 8; i += 1) {
                    const x = gridLeft + (i / 7) * gridWidth;
                    const y = gridTop + gridHeight / 2 + Math.sin(i + phase * 2) * gridHeight * 0.22;
                    p.circle(x, y, 6);
                }

                p.fill('rgba(232, 238, 252, 0.78)');
                p.textSize(12);
                p.textAlign(p.LEFT, p.TOP);
                p.text('Model: ' + String(params.model || 'integrated'), 18, 18);

                const equation = document.getElementById('equation-text-hqr');
                if (equation) {
                    equation.textContent = 'Equation: y = ' + amp.toFixed(1) + ' * sin(kx), complexity = ' + complexity.toFixed(0);
                }
            };

            p.windowResized = function () {
                resizeCanvas(p, container, 360);
            };
        });
    }

    function initVisualizations() {
        if (!p5Available()) {
            return;
        }

        const hidden = document.getElementById('hidden-order-canvas');
        if (hidden) {
            if (hidden.classList.contains('interactive-canvas')) {
                createAdvancedHiddenOrder(hidden);
            } else {
                createHiddenOrderSketch(hidden);
            }
        }

        const tensor = document.getElementById('tensor-network-canvas');
        if (tensor) {
            createTensorNetworkSketch(tensor);
        }

        const holographic = document.getElementById('holographic-canvas');
        if (holographic && holographic.tagName.toLowerCase() !== 'canvas') {
            createHolographicSketch(holographic);
        }

        const hqr = document.getElementById('hqr-canvas');
        if (hqr) {
            createAdvancedHqr(hqr);
        }
    }

    ready(initVisualizations);
})();
