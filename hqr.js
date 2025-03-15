function computeRQI(I0, dIdx, range, step) {
    let data = {x: [], y: []};

    for (let x = 0; x <= range; x += step) {
        let Ix = I0 + dIdx * x; // Linear approximation of I(x)
        if (Ix === 0) Ix = 0.0001; // Avoid division by zero
        let dI_dx = dIdx; // Constant in linear approximation
        let RQI = Math.pow(dI_dx, 2) / Math.pow(Ix, 2);
        
        data.x.push(x);
        data.y.push(RQI);
    }
    return data;
}

function plotHQR() {
    let I0 = parseFloat(document.getElementById('initialI').value);
    let dIdx = parseFloat(document.getElementById('rateChange').value);
    
    let computedData = computeRQI(I0, dIdx, 10, 0.05);
    
    const ctx = document.getElementById('hqrChart').getContext('2d');
    
    if(window.hqrChartInstance) window.hqrChartInstance.destroy();
    
    window.hqrChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: computedData.x,
            datasets: [{
                label: 'Rᴱᴵ(x)',
                data: computedData.y,
                borderColor: '#ffcc00',
                backgroundColor: 'rgba(255,204,0,0.2)',
                tension: 0.1,
            }]
        },
        options: {
            scales: {
                y: { title: {display: true, text: 'Informational Curvature (RQI)'} },
                x: { title: {display: true, text: 'x (Position or Parameter)'} }
            }
        }
    });
}

// Initial plot
plotHQR();
