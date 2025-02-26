// HQR Visualization Component
const { useState } = React;
const { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ScatterChart, Scatter, ZAxis
} = Recharts;

const HQRVisualization = () => {
  const [dimension, setDimension] = useState('4D');
  
  // Generate wave function data for Bohmian mechanics
  const generateWaveFunction = (dimension) => {
    const data = [];
    for (let x = -10; x <= 10; x += 0.2) {
      // Gaussian packet modulated by phase
      const amplitude = Math.exp(-x*x / 4);
      const phase = x*x / 2;
      // Different complexity for different dimensions
      const complexity = dimension === '4D' ? 1 : 2.5;
      
      // Wave function components R and S in Ψ = R e^(iS/ℏ)
      const r = amplitude;
      const s = phase * complexity;
      
      // Bohmian velocity from guiding equation dx/dt = ∇S/m
      // Approximating ∇S with finite difference
      const gradS = (x === -10) ? (s - 0) / 0.2 : (s - data[data.length-1].s) / 0.2;
      const velocity = gradS / 1; // m = 1 for simplicity
      
      // Hidden order correlation
      // Simulate correlation function with exponential decay modulated by oscillations
      const hiddenOrder = amplitude * Math.cos(complexity * x / 2) * Math.exp(-Math.abs(x) / 5);
      
      data.push({
        x,
        r,
        s,
        velocity,
        hiddenOrder,
        // Real and imaginary parts of the wave function
        realPart: r * Math.cos(s),
        imagPart: r * Math.sin(s),
        // Probability density
        probability: r * r
      });
    }
    return data;
  };

  // Generate 2D projection of higher-dimensional manifold (simplified Calabi-Yau)
  const generateManifoldData = (dimension) => {
    const data = [];
    const resolution = 20;
    const scale = dimension === '4D' ? 1 : 2;
    
    for (let i = 0; i <= resolution; i++) {
      const u = (i / resolution) * Math.PI * 2;
      for (let j = 0; j <= resolution; j++) {
        const v = (j / resolution) * Math.PI;
        
        // Parametric equations for a simplified projection of higher dimensional space
        let x, y, z;
        
        if (dimension === '4D') {
          // Simpler 4D projection
          x = Math.sin(u) * Math.sin(v);
          y = Math.sin(u) * Math.cos(v);
          z = Math.cos(u);
        } else {
          // More complex 11D projection with extra modulations
          x = Math.sin(u) * Math.sin(v) + 0.3 * Math.sin(3 * u);
          y = Math.sin(u) * Math.cos(v) + 0.3 * Math.cos(2 * v);
          z = Math.cos(u) + 0.2 * Math.sin(5 * v);
        }
        
        // Correlation function value as color intensity
        const correlation = Math.pow(Math.cos(scale * u) * Math.sin(scale * v), 2);
        
        data.push({ x: x * 10, y: y * 10, z: z * 5, value: correlation });
      }
    }
    return data;
  };

  // Generate data based on the selected dimension
  const waveData = generateWaveFunction(dimension);
  const manifoldData = generateManifoldData(dimension);
  
  // Customize the tooltip for wave function data
  const WaveFunctionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{backgroundColor: 'white', border: '1px solid #ccc', padding: '10px', borderRadius: '5px'}}>
          <p style={{margin: '0', fontSize: '12px'}}>{`Position (x): ${payload[0].payload.x.toFixed(2)}`}</p>
          <p style={{margin: '0', fontSize: '12px'}}>{`Amplitude (R): ${payload[0].payload.r.toFixed(4)}`}</p>
          <p style={{margin: '0', fontSize: '12px'}}>{`Phase (S): ${payload[0].payload.s.toFixed(4)}`}</p>
          <p style={{margin: '0', fontSize: '12px'}}>{`Velocity (∇S/m): ${payload[0].payload.velocity.toFixed(4)}`}</p>
          <p style={{margin: '0', fontSize: '12px'}}>{`Hidden Order: ${payload[0].payload.hiddenOrder.toFixed(4)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{fontFamily: 'Roboto, sans-serif', margin: '20px 0', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h3 style={{color: '#1e3a8a', fontSize: '24px', margin: '0'}}>Holonomic Quantum Reality (HQR) Mathematical Visualization</h3>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span style={{marginRight: '10px', fontSize: '14px', fontWeight: '500'}}>Dimension:</span>
          <select 
            value={dimension} 
            onChange={(e) => setDimension(e.target.value)}
            style={{padding: '5px', borderRadius: '4px', fontSize: '14px'}}
          >
            <option value="4D">4D Reality</option>
            <option value="11D">11D M-Theory</option>
          </select>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px'}}>
        {/* Bohmian Mechanics Visualization */}
        <div style={{backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h4 style={{color: '#1e40af', fontSize: '18px', marginTop: '0'}}>
            Bohmian Mechanics Wave Function (Ψ = Re<sup>iS/ℏ</sup>)
          </h4>
          <p style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>
            Visualizing components of the wave function and velocity field from guiding equation: dx/dt = ∇S/m
          </p>
          <div style={{height: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waveData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="x" 
                  label={{ value: 'Position (x)', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ value: 'Value', angle: -90, position: 'insideLeft' }} 
                  domain={[-1.2, 1.2]}
                />
                <Tooltip content={<WaveFunctionTooltip />} />
                <Legend verticalAlign="top" />
                <Line 
                  type="monotone" 
                  dataKey="realPart" 
                  stroke="#8884d8" 
                  name="Real Part (Re[Ψ])" 
                  dot={false} 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="imagPart" 
                  stroke="#82ca9d" 
                  name="Imaginary Part (Im[Ψ])" 
                  dot={false}
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#ff7300" 
                  name="Bohmian Velocity (∇S/m)" 
                  dot={false}
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="hiddenOrder" 
                  stroke="#ff0000" 
                  name="Hidden Order ⟨O(x)O(0)⟩" 
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="3 3" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Hidden Order Correlation and 11D Projection */}
        <div style={{backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h4 style={{color: '#1e40af', fontSize: '18px', marginTop: '0'}}>
            Hidden Order Correlation in {dimension} Space
          </h4>
          <p style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>
            Visualizing correlation function ⟨O(x)O(y)⟩ as a projection from {dimension === '4D' ? '4D' : '11D'} space
          </p>
          <div style={{height: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="x" 
                  label={{ value: 'Dimension 1', position: 'insideBottomRight', offset: -10 }} 
                  domain={[-12, 12]}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="y" 
                  label={{ value: 'Dimension 2', angle: -90, position: 'insideLeft' }} 
                  domain={[-12, 12]}
                />
                <ZAxis 
                  type="number" 
                  dataKey="z" 
                  range={[0, 500]} 
                  name="z" 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  formatter={(value) => value.toFixed(3)}
                />
                <Scatter 
                  name="Manifold Points" 
                  data={manifoldData} 
                  fill="#8884d8" 
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
            <div style={{display: 'flex', alignItems: 'center', marginRight: '20px'}}>
              <div style={{width: '12px', height: '12px', backgroundColor: '#1e3a8a', borderRadius: '50%', marginRight: '5px'}}></div>
              <span style={{fontSize: '12px'}}>Strong Correlation</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{width: '12px', height: '12px', backgroundColor: '#bfdbfe', borderRadius: '50%', marginRight: '5px'}}></div>
              <span style={{fontSize: '12px'}}>Weak Correlation</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AdS/CFT Correspondence Visualization */}
      <div style={{backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '20px'}}>
        <h4 style={{color: '#1e40af', fontSize: '18px', marginTop: '0'}}>
          Holographic Principle: AdS/CFT Correspondence
        </h4>
        <p style={{fontSize: '12px', color: '#666', marginBottom: '15px'}}>
          Visualizing the relationship between bulk AdS space and boundary CFT: Z<sub>CFT</sub> = ∫Dϕe<sup>-S<sub>bulk</sub>[ϕ]</sup>
        </p>
        <div style={{width: '100%', height: '250px', backgroundColor: '#eff6ff', borderRadius: '8px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{position: 'relative', width: '200px', height: '200px'}}>
            {/* Boundary circle (CFT) */}
            <div style={{
              position: 'absolute', 
              top: '0', 
              left: '0', 
              width: '100%', 
              height: '100%', 
              border: '4px solid #ef4444', 
              borderRadius: '50%'
            }}></div>
            
            {/* AdS bulk visualization with concentric circles */}
            {[0.8, 0.6, 0.4, 0.2].map((scale, idx) => (
              <div 
                key={idx}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: `${1 + (1-scale) * 3}px solid #3b82f6`,
                  transform: `scale(${scale})`,
                  opacity: 0.4 + ((1-scale) * 0.6)
                }}
              ></div>
            ))}
            
            {/* Central point representing deep bulk */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '16px',
              height: '16px',
              backgroundColor: '#1d4ed8',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
            
            {/* MERA Tensor Network representation for 11D */}
            {dimension === '11D' && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                opacity: 0.4
              }}>
                <svg width="200" height="200" viewBox="-100 -100 200 200">
                  <g>
                    {/* Simplified tensor network - just showing a few nodes/connections */}
                    <circle cx="0" cy="0" r="5" fill="#1d4ed8" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                      const radians = angle * Math.PI / 180;
                      const x = 40 * Math.cos(radians);
                      const y = 40 * Math.sin(radians);
                      const x2 = 80 * Math.cos(radians);
                      const y2 = 80 * Math.sin(radians);
                      return (
                        <g key={angle}>
                          <circle cx={x} cy={y} r="3" fill="#3b82f6" />
                          <line x1="0" y1="0" x2={x} y2={y} stroke="#93c5fd" strokeWidth="1" />
                          <circle cx={x2} cy={y2} r="3" fill="#ef4444" />
                          <line x1={x} y1={y} x2={x2} y2={y2} stroke="#93c5fd" strokeWidth="1" />
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            )}
          </div>
          
          <div style={{position: 'absolute', bottom: '10px', left: '10px', fontSize: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
              <div style={{width: '12px', height: '12px', border: '2px solid #ef4444', borderRadius: '50%', marginRight: '5px'}}></div>
              <span>CFT Boundary (Our 4D Reality)</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={{width: '12px', height: '12px', backgroundColor: '#1d4ed8', borderRadius: '50%', marginRight: '5px'}}></div>
              <span>AdS Bulk (Higher Dimensions)</span>
            </div>
            {dimension === '11D' && (
              <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                <div style={{width: '12px', height: '12px', border: '1px solid #93c5fd', borderRadius: '50%', marginRight: '5px'}}></div>
                <span>MERA Tensor Network</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Key Equations Section */}
      <div style={{backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '20px'}}>
        <h4 style={{color: '#1e40af', fontSize: '18px', marginTop: '0'}}>
          Key Equations of HQR
        </h4>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px', fontSize: '14px'}}>
          <div style={{padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px'}}>
            <p style={{fontWeight: '500', margin: '0 0 5px 0'}}>M-Theory Metric:</p>
            <p style={{fontFamily: 'monospace', margin: '0'}}>ds² = g<sub>μν</sub>dx<sup>μ</sup>dx<sup>ν</sup>, μ,ν = 0,1,...,10</p>
          </div>
          <div style={{padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px'}}>
            <p style={{fontWeight: '500', margin: '0 0 5px 0'}}>Bohmian Mechanics Guiding Equation:</p>
            <p style={{fontFamily: 'monospace', margin: '0'}}>dx/dt = ∇S/m</p>
            <p style={{fontFamily: 'monospace', margin: '5px 0 0 0'}}>Where Ψ = Re<sup>iS/ℏ</sup></p>
          </div>
          <div style={{padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px'}}>
            <p style={{fontWeight: '500', margin: '0 0 5px 0'}}>Hidden Order Correlation:</p>
            <p style={{fontFamily: 'monospace', margin: '0'}}>⟨O(x)O(y)⟩</p>
          </div>
          <div style={{padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px'}}>
            <p style={{fontWeight: '500', margin: '0 0 5px 0'}}>AdS/CFT Correspondence:</p>
            <p style={{fontFamily: 'monospace', margin: '0'}}>Z<sub>CFT</sub> = ∫Dϕe<sup>-S<sub>bulk</sub>[ϕ]</sup></p>
          </div>
        </div>
      </div>
      
      <div style={{fontSize: '12px', color: '#6b7280', marginTop: '10px'}}>
        <p>Note: This visualization is a simplified representation of the complex mathematical frameworks in HQR theory. The 11D visualization uses projections to represent higher-dimensional structures in a 3D space.</p>
      </div>
    </div>
  );
};

// Render the React component to the DOM
ReactDOM.render(
  <HQRVisualization />,
  document.getElementById('hqr-visualization-root')
);
