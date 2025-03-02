/**
 * Graphs.js - Visualization of Holonomic Quantum Reality Equations
 * 
 * This file contains functions to render SVG visualizations for the seven
 * key equations in the Holonomic Quantum Reality (HQR) framework.
 * Each graph demonstrates a different aspect of the theory through 
 * carefully designed visual representations.
 */

// Main function to initialize all graphs when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create each graph
    renderRicciScalarGraph();
    renderEnergyDensityGraph();
    renderStressTensorGraph();
    renderEntropyEvolutionGraph();
    renderUnifiedFieldGraph();
    renderHolographicTensorGraph();
    renderProjected4DGraph();
});

/**
 * Utility function to create SVG element with proper attributes
 * @param {string} containerId - ID of the container to place the SVG
 * @returns {SVGElement} - The created SVG element
 */
function createSVG(containerId) {
    // Get the container
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create SVG element with proper namespace
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 800 400");
    container.appendChild(svg);
    
    return svg;
}

/**
 * Adds axes to SVG visualization
 * @param {SVGElement} svg - SVG element to add axes to
 * @param {string} xLabel - Label for x-axis
 * @param {string} yLabel - Label for y-axis
 * @param {boolean} centerY - Whether y-axis should be centered (for graphs with positive/negative values)
 */
function addAxes(svg, xLabel, yLabel, centerY = false) {
    // Axis lines
    const yAxisY = centerY ? 200 : 350;
    
    // X-axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "50");
    xAxis.setAttribute("y1", yAxisY.toString());
    xAxis.setAttribute("x2", "750");
    xAxis.setAttribute("y2", yAxisY.toString());
    xAxis.setAttribute("stroke", "black");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);
    
    // Y-axis
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", "50");
    yAxis.setAttribute("y1", "50");
    yAxis.setAttribute("x2", "50");
    yAxis.setAttribute("y2", "350");
    yAxis.setAttribute("stroke", "black");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);
    
    // X-axis label
    const xAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xAxisLabel.setAttribute("x", "400");
    xAxisLabel.setAttribute("y", "390");
    xAxisLabel.setAttribute("text-anchor", "middle");
    xAxisLabel.setAttribute("font-size", "16");
    xAxisLabel.textContent = xLabel;
    svg.appendChild(xAxisLabel);
    
    // Y-axis label
    const yAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yAxisLabel.setAttribute("x", "20");
    yAxisLabel.setAttribute("y", "200");
    yAxisLabel.setAttribute("text-anchor", "middle");
    yAxisLabel.setAttribute("font-size", "16");
    yAxisLabel.setAttribute("transform", "rotate(-90, 20, 200)");
    yAxisLabel.textContent = yLabel;
    svg.appendChild(yAxisLabel);
}

/**
 * Adds ticks and grid lines to the graph
 * @param {SVGElement} svg - SVG element to add ticks to
 * @param {Array} xTicks - Array of x-tick values
 * @param {Array} yTicks - Array of y-tick values
 * @param {boolean} centerY - Whether y-axis is centered
 */
function addTicksAndGrid(svg, xTicks, yTicks, centerY = false) {
    const yAxisY = centerY ? 200 : 350;
    
    // X-axis ticks and grid lines
    xTicks.forEach(tick => {
        const x = 50 + (tick.value / 10) * 700; // Assuming x range 0-10
        
        // Tick mark
        const xTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xTick.setAttribute("x1", x.toString());
        xTick.setAttribute("y1", (yAxisY - 5).toString());
        xTick.setAttribute("x2", x.toString());
        xTick.setAttribute("y2", (yAxisY + 5).toString());
        xTick.setAttribute("stroke", "black");
        xTick.setAttribute("stroke-width", "2");
        svg.appendChild(xTick);
        
        // Tick label
        const xTickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        xTickLabel.setAttribute("x", x.toString());
        xTickLabel.setAttribute("y", (yAxisY + 25).toString());
        xTickLabel.setAttribute("text-anchor", "middle");
        xTickLabel.setAttribute("font-size", "14");
        xTickLabel.textContent = tick.label;
        svg.appendChild(xTickLabel);
        
        // Grid line (if not at origin)
        if (tick.value > 0) {
            const xGridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            xGridLine.setAttribute("x1", x.toString());
            xGridLine.setAttribute("y1", "50");
            xGridLine.setAttribute("x2", x.toString());
            xGridLine.setAttribute("y2", "350");
            xGridLine.setAttribute("stroke", "#ddd");
            xGridLine.setAttribute("stroke-width", "1");
            xGridLine.setAttribute("stroke-dasharray", "5,5");
            svg.appendChild(xGridLine);
        }
    });
    
    // Y-axis ticks and grid lines
    yTicks.forEach(tick => {
        let y;
        if (centerY) {
            // For centered y-axis, map values to pixel position
            // 0 maps to 200, positive values go up, negative values go down
            y = 200 - (tick.value / 0.3) * 150; // Assuming y range -0.3 to 0.3
        } else {
            // For bottom-anchored y-axis
            const yRange = yTicks[yTicks.length - 1].value - yTicks[0].value;
            y = 350 - ((tick.value - yTicks[0].value) / yRange) * 300;
        }
        
        // Tick mark
        const yTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        yTick.setAttribute("x1", "45");
        yTick.setAttribute("y1", y.toString());
        yTick.setAttribute("x2", "55");
        yTick.setAttribute("y2", y.toString());
        yTick.setAttribute("stroke", "black");
        yTick.setAttribute("stroke-width", "2");
        svg.appendChild(yTick);
        
        // Tick label
        const yTickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yTickLabel.setAttribute("x", "35");
        yTickLabel.setAttribute("y", (y + 5).toString());
        yTickLabel.setAttribute("text-anchor", "end");
        yTickLabel.setAttribute("font-size", "14");
        yTickLabel.textContent = tick.label;
        svg.appendChild(yTickLabel);
        
        // Grid line (if not at origin)
        if ((!centerY && tick.value > 0) || (centerY && tick.value !== 0)) {
            const yGridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            yGridLine.setAttribute("x1", "50");
            yGridLine.setAttribute("y1", y.toString());
            yGridLine.setAttribute("x2", "750");
            yGridLine.setAttribute("y2", y.toString());
            yGridLine.setAttribute("stroke", "#ddd");
            yGridLine.setAttribute("stroke-width", "1");
            yGridLine.setAttribute("stroke-dasharray", "5,5");
            svg.appendChild(yGridLine);
        }
    });
}

/**
 * Adds a path to the SVG with specified attributes
 * @param {SVGElement} svg - SVG element to add the path to
 * @param {string} d - Path data string (SVG path definition)
 * @param {string} stroke - Stroke color
 * @param {number} strokeWidth - Stroke width
 * @param {string} fill - Fill color (default: none)
 * @param {string} dashArray - Stroke dash array (for dashed lines)
 * @returns {SVGElement} - The created path element
 */
function addPath(svg, d, stroke, strokeWidth, fill = "none", dashArray = null) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", stroke);
    path.setAttribute("stroke-width", strokeWidth.toString());
    path.setAttribute("fill", fill);
    
    if (dashArray) {
        path.setAttribute("stroke-dasharray", dashArray);
    }
    
    svg.appendChild(path);
    return path;
}

/**
 * Adds a legend to the SVG
 * @param {SVGElement} svg - SVG element to add the legend to
 * @param {Array} items - Array of legend items, each with a color and label
 * @param {number} x - X position of the legend
 * @param {number} y - Y position of the legend
 */
function addLegend(svg, items, x = 560, y = 70) {
    // Legend box
    const legendHeight = 30 + (items.length * 30);
    const legendRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    legendRect.setAttribute("x", x.toString());
    legendRect.setAttribute("y", y.toString());
    legendRect.setAttribute("width", "180");
    legendRect.setAttribute("height", legendHeight.toString());
    legendRect.setAttribute("fill", "white");
    legendRect.setAttribute("stroke", "#ccc");
    legendRect.setAttribute("rx", "5");
    svg.appendChild(legendRect);
    
    // Legend items
    items.forEach((item, index) => {
        const itemY = y + 20 + (index * 30);
        
        // Line/symbol
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", (x + 10).toString());
        line.setAttribute("y1", itemY.toString());
        line.setAttribute("x2", (x + 40).toString());
        line.setAttribute("y2", itemY.toString());
        line.setAttribute("stroke", item.color);
        line.setAttribute("stroke-width", "3");
        
        if (item.dashed) {
            line.setAttribute("stroke-dasharray", "6,4");
        }
        
        svg.appendChild(line);
        
        // Label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", (x + 50).toString());
        label.setAttribute("y", (itemY + 5).toString());
        label.setAttribute("font-size", "14");
        label.textContent = item.label;
        svg.appendChild(label);
    });
}

/**
 * Renders the Ricci Scalar in 4D graph (Equation 1)
 */
function renderRicciScalarGraph() {
    const svg = createSVG('graph1');
    if (!svg) return;
    
    // Add axes and labels
    addAxes(svg, "Time (t)", "Ricci Scalar R(t)");
    
    // Add ticks and grid
    const xTicks = [
        {value: 0, label: "0"},
        {value: 2, label: "2"},
        {value: 4, label: "4"},
        {value: 6, label: "6"},
        {value: 8, label: "8"},
        {value: 10, label: "10"}
    ];
    
    const yTicks = [
        {value: 0, label: "0"},
        {value: 20, label: "20"},
        {value: 40, label: "40"},
        {value: 60, label: "60"},
        {value: 80, label: "80"},
        {value: 100, label: "100"}
    ];
    
    addTicksAndGrid(svg, xTicks, yTicks);
    
    // Add classical prediction line (dashed)
    addPath(
        svg,
        "M50,350 L750,50",
        "#FF6347",
        2,
        "none",
        "6,4"
    );
    
    // Add quantum fluctuations curve
    addPath(
        svg,
        "M50,350 " +
        "C70,345 90,335 110,330 " +
        "C130,325 150,315 170,305 " +
        "C190,295 210,285 230,270 " +
        "C250,255 270,245 290,230 " +
        "C310,215 330,200 350,185 " +
        "C370,170 390,160 410,145 " +
        "C430,130 450,120 470,105 " +
        "C490,90  510,80  530,70 " +
        "C550,60  570,55  590,50 " +
        "C610,45  630,45  650,50 " +
        "C670,55  690,65  710,60 " +
        "C730,55  750,50  770,50",
        "#4169E1",
        3
    );
    
    // Add legend
    addLegend(svg, [
        {color: "#4169E1", label: "Quantum HQR"},
        {color: "#FF6347", label: "Classical Prediction", dashed: true}
    ]);
}

/**
 * Renders the Energy Density in 11D graph (Equation 2)
 */
function renderEnergyDensityGraph() {
    const svg = createSVG('graph2');
    if (!svg) return;
    
    // Add axes and labels
    addAxes(svg, "Time (t)", "Energy Density ρ(t)");
    
    // Add ticks and grid
    const xTicks = [
        {value: 0, label: "0"},
        {value: 2, label: "2"},
        {value: 4, label: "4"},
        {value: 6, label: "6"},
        {value: 8, label: "8"},
        {value: 10, label: "10"}
    ];
    
    const yTicks = [
        {value: 0, label: "0"},
        {value: 1, label: "1"},
        {value: 2, label: "2"},
        {value: 3, label: "3"},
        {value: 4, label: "4"},
        {value: 5, label: "5"}
    ];
    
    addTicksAndGrid(svg, xTicks, yTicks);
    
    // Add linear approximation (dashed)
    addPath(
        svg,
        "M50,350 L750,50",
        "#FFA500",
        2,
        "none",
        "6,4"
    );
    
    // Add energy density with resonance patterns
    addPath(
        svg,
        "M50,350 " +
        "C60,345 70,340 80,335 " +
        "C90,330 100,320 110,310 " +
        "C120,300 130,290 140,285 " +
        "C150,280 160,275 170,265 " +
        "C180,255 190,245 200,240 " +
        "C210,235 220,230 230,225 " +
        "C240,220 250,215 260,205 " +
        "C270,195 280,190 290,185 " +
        "C300,180 310,175 320,170 " +
        "C330,165 340,160 350,155 " +
        "C360,150 370,145 380,140 " +
        "C390,135 400,130 410,125 " +
        "C420,120 430,115 440,110 " +
        "C450,105 460,100 470,95 " +
        "C480,90 490,83 500,80 " +
        "C510,77 520,74 530,69 " +
        "C540,64 550,61 560,65 " +
        "C570,69 580,73 590,70 " +
        "C600,67 610,64 620,59 " +
        "C630,54 640,51 650,54 " +
        "C660,57 670,60 680,55 " +
        "C690,50 700,45 710,50 " +
        "C720,55 730,60 740,55 " +
        "C750,50 760,45 770,50",
        "#4B0082",
        3
    );
    
    // Add legend
    addLegend(svg, [
        {color: "#4B0082", label: "11D with Resonance"},
        {color: "#FFA500", label: "Linear Approximation", dashed: true}
    ]);
}

/**
 * Renders the Quantum Stress Tensor graph (Equation 3)
 */
function renderStressTensorGraph() {
    const svg = createSVG('graph3');
    if (!svg) return;
    
    // Add axes and labels
    addAxes(svg, "Time (t)", "Stress Tensor Components");
    
    // Add ticks and grid
    const xTicks = [
        {value: 0, label: "0"},
        {value: 2, label: "2"},
        {value: 4, label: "4"},
        {value: 6, label: "6"},
        {value: 8, label: "8"},
        {value: 10, label: "10"}
    ];
    
    const yTicks = [
        {value: 0, label: "0"},
        {value: 1, label: "1"},
        {value: 2, label: "2"},
        {value: 3, label: "3"},
        {value: 4, label: "4"},
        {value: 5, label: "5"}
    ];
    
    addTicksAndGrid(svg, xTicks, yTicks);
    
    // Add trace component path
    addPath(
        svg,
        "M50,350 " +
        "C70,345 90,335 110,325 " +
        "C130,315 150,305 170,295 " +
        "C190,285 210,275 230,265 " +
        "C250,255 270,247 290,240 " +
        "C310,233 330,229 350,220 " +
        "C370,211 390,203 410,195 " +
        "C430,187 450,178 470,170 " +
        "C490,162 510,153 530,145 " +
        "C550,137 570,128 590,120 " +
        "C610,112 630,103 650,95 " +
        "C670,87 690,80 710,75 " +
        "C730,70 750,65 770,60",
        "#2E8B57", // Green
        3
    );
    
    // Add scalar component path
    addPath(
        svg,
        "M50,350 " +
        "C70,343 90,336 110,328 " +
        "C130,320 150,315 170,305 " +
        "C190,295 210,290 230,280 " +
        "C250,270 270,265 290,255 " +
        "C310,245 330,240 350,230 " +
        "C370,220 390,212 410,205 " +
        "C430,198 450,189 470,180 " +
        "C490,171 510,165 530,155 " +
        "C550,145 570,140 590,130 " +
        "C610,120 630,115 650,105 " +
        "C670,95 690,90 710,80 " +
        "C730,70 750,65 770,60",
        "#4682B4", // Steel Blue
        3
    );
    
    // Add vacuum energy component
    addPath(
        svg,
        "M50,330 " +
        "C70,328 90,326 110,324 " +
        "C130,322 150,321 170,319 " +
        "C190,317 210,316 230,314 " +
        "C250,312 270,311 290,309 " +
        "C310,307 330,306 350,304 " +
        "C370,302 390,300 410,298 " +
        "C430,296 450,294 470,292 " +
        "C490,290 510,288 530,286 " +
        "C550,284 570,283 590,282 " +
        "C610,281 630,280 650,280 " +
        "C670,280 690,280 710,280 " +
        "C730,280 750,280 770,280",
        "#9400D3", // Purple
        3
    );
    
    // Add legend
    addLegend(svg, [
        {color: "#2E8B57", label: "Trace Component"},
        {color: "#4682B4", label: "Scalar Component"},
        {color: "#9400D3", label: "Vacuum Energy"}
    ]);
}

/**
 * Renders the Entanglement Entropy Evolution graph (Equation 4)
 */
function renderEntropyEvolutionGraph() {
    const svg = createSVG('graph4');
    if (!svg) return;
    
    // Add axes and labels
    addAxes(svg, "Time (t)", "Entanglement Entropy Se(t)");
    
    // Add ticks and grid
    const xTicks = [
        {value: 0, label: "0"},
        {value: 2, label: "2"},
        {value: 4, label: "4"},
        {value: 6, label: "6"},
        {value: 8, label: "8"},
        {value: 10, label: "10"}
    ];
    
    const yTicks = [
        {value: 1, label: "1"},
        {value: 5, label: "5"},
        {value: 10, label: "10"},
        {value: 15, label: "15"},
        {value: 20, label: "20"},
        {value: 25, label: "25"}
    ];
    
    addTicksAndGrid(svg, xTicks, yTicks);
    
    // Add base parabolic curve (dashed)
    addPath(
        svg,
        "M50,350 " +
        "C70,349 90,348 110,345 " +
        "C130,342 150,338 170,334 " +
        "C190,330 210,325 230,320 " +
        "C250,315 270,309 290,302 " +
        "C310,295 330,287 350,278 " +
        "C370,269 390,259 410,248 " +
        "C430,237 450,225 470,212 " +
        "C490,199 510,185 530,170 " +
        "C550,155 570,139 590,122 " +
        "C610,105 630,87 650,68 " +
        "C670,49 690,29 710,15 " +
        "C730,8 750,1 770,0",
        "#1E90FF", // Dodger Blue
        2,
        "none",
        "6,4"
    );
    
    // Add entropy with phase transitions
    addPath(
        svg,
        "M50,350 " +
        "C70,349 90,348 110,345 " +
        "C130,342 150,338 170,334 " +
        "C190,330 210,325 230,320 " +
        "C250,315 270,309 290,302 " +
        "C310,295 330,287 350,278 " +
        "C370,269 390,259 410,240 " +
        "C430,230 450,220 470,210 " +
        "C490,200 510,185 530,170 " +
        "C550,155 570,139 590,120 " +
        "C610,100 630,80 650,60 " +
        "C670,40 690,20 710,10 " +
        "C730,5 750,0 770,0",
        "#DC143C", // Crimson
        3
    );
    
    // Add phase transition points
    const phaseTransition1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    phaseTransition1.setAttribute("cx", "400");
    phaseTransition1.setAttribute("cy", "240");
    phaseTransition1.setAttribute("r", "6");
    phaseTransition1.setAttribute("fill", "#DC143C");
    svg.appendChild(phaseTransition1);
    
    const phaseTransition2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    phaseTransition2.setAttribute("cx", "590");
    phaseTransition2.setAttribute("cy", "120");
    phaseTransition2.setAttribute("r", "6");
    phaseTransition2.setAttribute("fill", "#DC143C");
    svg.appendChild(phaseTransition2);
    
    // Add phase transition labels
    const label1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label1.setAttribute("x", "380");
    label1.setAttribute("y", "215");
    label1.setAttribute("text-anchor", "middle");
    label1.setAttribute("font-size", "12");
    label1.setAttribute("fill", "#DC143C");
    label1.textContent = "Phase";
    svg.appendChild(label1);
    
    const label1b = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label1b.setAttribute("x", "380");
    label1b.setAttribute("y", "230");
    label1b.setAttribute("text-anchor", "middle");
    label1b.setAttribute("font-size", "12");
    label1b.setAttribute("fill", "#DC143C");
    label1b.textContent = "Transition 1";
    svg.appendChild(label1b);
    
    const label2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label2.setAttribute("x", "570");
    label2.setAttribute("y", "95");
    label2.setAttribute("text-anchor", "middle");
    label2.setAttribute("font-size", "12");
    label2.setAttribute("fill", "#DC143C");
    label2.textContent = "Phase";
    svg.appendChild(label2);
    
    const label2b = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label2b.setAttribute("x", "570");
    label2b.setAttribute("y", "110");
    label2b.setAttribute("text-anchor", "middle");
    label2b.setAttribute("font-size", "12");
    label2b.setAttribute("fill", "#DC143C");
    label2b.textContent = "Transition 2";
    svg.appendChild(label2b);
    
    // Add legend
    addLegend(svg, [
        {color: "#DC143C", label: "With Phase Transitions"},
        {color: "#1E90FF", label: "Base Parabolic Growth", dashed: true}
    ], 560, 280);
}

/**
 * Renders the Time-Dependent Unified Field Equation graph (Equation 5)
 */
function renderUnifiedFieldGraph() {
    const svg = createSVG('graph5');
    if (!svg) return;
    
    // Add axes with centered y-axis
    addAxes(svg, "Time (t)", "Field Dynamics T(t)", true);
    
    // Add ticks and grid for centered y-axis
    const xTicks = [
        {value: 0, label: "0"},
        {value: 2, label: "2"},
        {value: 4, label: "4"},
        {value: 6, label: "6"},
        {value: 8, label: "8"},
        {value: 10, label: "10"}
    ];
    
    const yTicks = [
        {value: -0.3, label: "-0.3"},
        {value: -0.15, label: "-0.15"},
        {value: 0, label: "0"},
        {value: 0.15, label: "0.15"},
        {value: 0.3, label: "0.3"}
    ];
    
    addTicksAndGrid(svg, xTicks, yTicks, true);
    
    // Add holographic term (dashed line)
    addPath(
        svg,
        "M50,200 L750,50",
        "#008000", // Green
        2,
        "none",
        "6,4"
    );
    
    // Add entanglement counter-term (dashed line)
    addPath(
        svg,
        "M50,200 L750,350",
        "#FF4500", // OrangeRed
        2,
        "none",
        "6,4"
    );
    
    // Add net field dynamics
    addPath(
        svg,
        "M50,200 " +
        "C70,190 90,180 110,185 " +
        "C130,190 150,200 170,195 " +
        "C190,190 210,180 230,175 " +
        "C250,170 270,165 290,170 " +
        "C310,175 330,185 350,190 " +
        "C370,195 390,200 410,195 " +
        "C430,190 450,180 470,175 " +
        "C490,170 510,165 530,170 " +
        "C550,175 570,185 590,190 " +
        "C610,195 630,200 650,195 " +
        "C670,190 690,180 710,175 " +
        "C730,170 750,165 770,170",
        "#800080", // Purple
        3
    );
    
    // Add legend
    addLegend(svg, [
        {color: "#800080", label: "Net Field Dynamics"},
        {color: "#008000", label: "Holographic Term", dashed: true},
        {color: "#FF4500", label: "Entanglement Term", dashed: true}
    ]);
}

/**
 * Renders the Holographic Stress-Energy Tensor graph (Equation 6)
 */
function renderHolographicTensorGraph() {
    const svg = createSVG('graph6');
    if (!svg) return;
    
    // Add axes and labels
    addAxes(svg, "Time (t)", "Holographic Tensor T(t)");
    
    // Add ticks and grid
    const xTicks = [
        {value: 0, label: "0"},
        {value: 2, label: "2"},
        {value: 4, label: "4"},
        {value: 6, label: "6"},
        {value: 8, label: "8"},
        {value: 10, label: "10"}
    ];
    
    const yTicks = [
        {value: 0, label: "0"},
        {value: 1, label: "1"},
        {value: 2, label: "2"},
        {value: 3, label: "3"},
        {value: 4, label: "4"},
        {value: 5, label: "5"}
    ];
    
    addTicksAndGrid(svg, xTicks, yTicks);
    
    // Add linear trend (dashed)
    addPath(
        svg,
        "M50,350 L750,50",
        "#FFA500", // Orange
        2,
        "none",
        "6,4"
    );
    
    // Add multi-scale oscillations
    addPath(
        svg,
        "M50,350 " +
        "C60,345 70,340 80,330 " +
        "C90,320 100,315 110,310 " +
        "C120,305 130,310 140,318 " +
        "C150,326 160,330 170,326 " +
        "C180,322 190,315 200,300 " +
        "C210,285 220,275 230,270 " +
        "C240,265 250,270 260,278 " +
        "C270,286 280,290 290,286 " +
        "C300,282 310,270 320,255 " +
        "C330,240 340,230 350,225 " +
        "C360,220 370,225 380,235 " +
        "C390,245 400,250 410,242 " +
        "C420,234 430,220 440,205 " +
        "C450,190 460,180 470,178 " +
        "C480,176 490,182 500,190 " +
        "C510,198 520,202 530,198 " +
        "C540,194 550,180 560,162 " +
        "C570,144 580,130 590,126 " +
        "C600,122 610,128 620,138 " +
        "C630,148 640,154 650,146 " +
        "C660,138 670,120 680,105 " +
        "C690,90 700,80 710,76 " +
        "C720,72 730,78 740,86 " +
        "C750,94 760,98 770,90",
        "#008B8B", // Dark Cyan
        3
    );
    
    // Add legend
    addLegend(svg, [
        {color: "#008B8B", label: "Multi-Scale Effects"},
        {color: "#FFA500", label: "Linear Trend", dashed: true}
    ]);
}

/**
 * Renders the Projected Time-Dependent Unified Equation in 4D graph (Equation 7)
 */
function renderProjected4DGraph() {
    const svg = createSVG('graph7');
    if (!svg) return;
    
    // Add axes with centered y-axis
    addAxes(svg, "Time (t)", "Projected Dynamics R(t)", true);
    
    // Add ticks and grid for centered y-axis
    const xTicks = [
        {value: 0, label: "0"},
        {value: 2, label: "2"},
        {value: 4, label: "4"},
        {value: 6, label: "6"},
        {value: 8, label: "8"},
        {value: 10, label: "10"}
    ];
    
    const yTicks = [
        {value: -0.3, label: "-0.3"},
        {value: -0.15, label: "-0.15"},
        {value: 0, label: "0"},
        {value: 0.15, label: "0.15"},
        {value: 0.3, label: "0.3"}
    ];
    
    addTicksAndGrid(svg, xTicks, yTicks, true);
    
    // Add zero baseline (dashed)
    const zeroLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    zeroLine.setAttribute("x1", "50");
    zeroLine.setAttribute("y1", "200");
    zeroLine.setAttribute("x2", "750");
    zeroLine.setAttribute("y2", "200");
    zeroLine.setAttribute("stroke", "#666");
    zeroLine.setAttribute("stroke-width", "1");
    zeroLine.setAttribute("stroke-dasharray", "2,2");
    svg.appendChild(zeroLine);
    
    // Add interference pattern
    addPath(
        svg,
        "M50,200 " +
        "C70,210 90,215 110,210 " +
        "C130,205 150,195 170,185 " +
        "C190,175 210,170 230,175 " +
        "C250,180 270,190 290,200 " +
        "C310,210 330,215 350,210 " +
        "C370,205 390,195 410,185 " +
        "C430,175 450,170 470,175 " +
        "C490,180 510,190 530,195 " +
        "C550,200 570,198 590,190 " +
        "C610,182 630,175 650,170 " +
        "C670,165 690,160 710,160 " +
        "C730,160 750,165 770,170",
        "#B22222", // Firebrick Red
        3
    );
    
    // Add legend
    addLegend(svg, [
        {color: "#B22222", label: "Interference Pattern"},
        {color: "#666", label: "Zero Baseline", dashed: true}
    ]);
}

/**
 * Utility function to convert a function to a path string
 * @param {Function} func - Function mapping x to y
 * @param {number} xMin - Minimum x value
 * @param {number} xMax - Maximum x value
 * @param {number} xRange - X-axis range in pixels (default: 700)
 * @param {number} yRange - Y-axis range in pixels (default: 300)
 * @param {number} xOffset - X-axis offset in pixels (default: 50)
 * @param {number} yOffset - Y-axis offset in pixels (default: 350)
 * @param {number} yTopValue - Value at the top of the y-axis
 * @param {number} yBottomValue - Value at the bottom of the y-axis (default: 0)
 * @param {number} points - Number of points to sample (default: 100)
 * @returns {string} SVG path string
 */
function functionToPath(func, xMin, xMax, xRange = 700, yRange = 300, xOffset = 50, yOffset = 350, yTopValue, yBottomValue = 0, points = 100) {
    // Calculate step size
    const step = (xMax - xMin) / (points - 1);
    
    // Initialize path
    let path = `M${xOffset},${yOffset}`;
    
    // Generate points
    for (let i = 0; i < points; i++) {
        const x = xMin + i * step;
        const y = func(x);
        
        // Map x and y to SVG coordinates
        const xPos = xOffset + (x - xMin) / (xMax - xMin) * xRange;
        const yPos = yOffset - (y - yBottomValue) / (yTopValue - yBottomValue) * yRange;
        
        // Add point to path
        path += ` L${xPos},${yPos}`;
    }
    
    return path;
}
