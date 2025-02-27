// HQR Visualization Component
(function() {
  // Check if required libraries are available
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || typeof Recharts === 'undefined') {
    console.error('Required libraries not found: React, ReactDOM, or Recharts is missing');
    
    // Add error message to the container if it exists
    const container = document.getElementById('hqr-visualization-root');
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; background-color: #2d0b0b; color: #f85149; border: 1px solid #f85149; border-radius: 8px;">
          <p><strong>Error:</strong> Required visualization libraries not found.</p>
          <p>Please ensure React, ReactDOM, and Recharts are properly loaded.</p>
        </div>
      `;
    }
    return;
  }

  const { useState, useEffect, useMemo, useCallback } = React;
  const { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, ScatterChart, Scatter, ZAxis
  } = Recharts;

  // Theme detection and constants
  const isDarkMode = document.body.classList.contains('dark-theme') || 
                   window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ||
                   document.documentElement.getAttribute('data-theme') === 'dark';

  // Theme-specific constants
  const THEME = {
    background: isDarkMode ? '#0d1117' : '#f8f9fa',
    cardBackground: isDarkMode ? '#161b22' : 'white',
    textPrimary: isDarkMode ? '#e0e0e0' : '#333',
    textSecondary: isDarkMode ? '#8b949e' : '#666',
    border: isDarkMode ? '#30363d' : '#e5e7eb',
    headingColor: isDarkMode ? '#58a6ff' : '#1e40af',
    tooltip: {
      background: isDarkMode ? '#0d1117' : 'white',
      border: isDarkMode ? '#30363d' : '#ccc',
      text: isDarkMode ? '#e0e0e0' : '#333'
    },
    chart: {
      realPart: '#8884d8',
      imagPart: '#82ca9d',
      velocity: '#ff7300',
      hiddenOrder: '#ff0000',
      strongCorrelation: isDarkMode ? '#58a6ff' : '#1e3a8a',
      weakCorrelation: isDarkMode ? '#3b82f6' : '#bfdbfe',
      bulkSpace: isDarkMode ? '#1d4ed8' : '#1d4ed8',
      boundary: '#ef4444',
      network: '#93c5fd'
    }
  };

  const HQRVisualization = () => {
    const [dimension, setDimension] = useState('4D');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Generate wave function data for Bohmian mechanics with memoization for performance
    const waveData = useMemo(() => {
      try {
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
      } catch (err) {
        console.error('Error generating wave function data:', err);
        setError('Failed to generate wave function visualization data.');
        return [];
      }
    }, [dimension]);

    // Generate 2D projection of higher-dimensional manifold (simplified Calabi-Yau)
    const manifoldData = useMemo(() => {
      try {
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
      } catch (err) {
        console.error('Error generating manifold data:', err);
        setError('Failed to generate correlation visualization data.');
        return [];
      }
    }, [dimension]);

    // Handle dimension change
    const handleDimensionChange = useCallback((e) => {
      setIsLoading(true);
      setDimension(e.target.value);
      // Short delay to allow loading state to render
      setTimeout(() => setIsLoading(false), 100);
    }, []);

    // Effect to set loading state
    useEffect(() => {
      // Simulate data loading for better UX
      setTimeout(() => setIsLoading(false), 500);
      
      // Clean up function
      return () => {
        // Any cleanup if needed when component unmounts
      };
    }, []);
    
    // Customize the tooltip for wave function data
    const WaveFunctionTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div style={{
            backgroundColor: THEME.tooltip.background, 
            border: `1px solid ${THEME.tooltip.border}`, 
            padding: '10px', 
            borderRadius: '5px',
            color: THEME.tooltip.text
          }}>
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

    // Loading state
    if (isLoading) {
      return (
        <div style={{
          fontFamily: 'Roboto, sans-serif', 
          margin: '20px 0', 
          padding: '20px', 
          backgroundColor: THEME.background, 
          borderRadius: '8px',
          color: THEME.textPrimary,
          minHeight: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <div style={{fontSize: '18px', marginBottom: '10px'}}>Loading visualizations...</div>
          <div style={{width: '50px', height: '50px', border: `3px solid ${THEME.border}`, borderRadius: '50%', borderTopColor: THEME.headingColor, animation: 'spin 1s linear infinite'}}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div style={{
          fontFamily: 'Roboto, sans-serif', 
          margin: '20px 0', 
          padding: '20px', 
          backgroundColor: isDarkMode ? '#2d0b0b' : '#fff5f5', 
          borderRadius: '8px',
          color: isDarkMode ? '#f85149' : '#dc2626',
          border: `1px solid ${isDarkMode ? '#f85149' : '#dc2626'}`
        }}>
          <h3 style={{margin: '0 0 10px 0'}}>Visualization Error</h3>
          <p>{error}</p>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>
      );
    }

    return (
      <div className="hqr-visualization" style={{
        fontFamily: 'Roboto, sans-serif', 
        margin: '20px 0', 
        padding: '20px', 
        backgroundColor: THEME.background, 
        borderRadius: '8px',
        color: THEME.textPrimary
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
          <h3 style={{color: THEME.headingColor, fontSize: '24px', margin: '0 0 10px 0'}}>
            Holonomic Quantum Reality (HQR) Mathematical Visualization
          </h3>
          <div className="visualization-controls" style={{display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: '10px', fontSize: '14px', fontWeight: '500'}}>Dimension:</span>
            <select 
              value={dimension} 
              onChange={handleDimensionChange}
              style={{
                padding: '5px', 
                borderRadius: '4px', 
                fontSize: '14px',
                backgroundColor: THEME.background,
                color: THEME.textPrimary,
                border: `1px solid ${THEME.border}`
              }}
              aria-label="Select dimension for visualization"
            >
              <option value="4D">4D Reality</option>
              <option value="11D">11D M-Theory</option>
            </select>
          </div>
        </div>
        
        <div className="visualization-grid" style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', 
          gap: '20px'
        }}>
          {/* Bohmian Mechanics Visualization */}
          <div className="visualization-card" style={{
            backgroundColor: THEME.cardBackground, 
            padding: '15px', 
            borderRadius: '8px', 
            boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
            border: isDarkMode ? `1px solid ${THEME.border}` : 'none'
          }}>
            <h4 style={{color: THEME.headingColor, fontSize: '18px', marginTop: '0'}}>
              Bohmian Mechanics Wave Function (Ψ = Re<sup>iS/ℏ</sup>)
            </h4>
            <p style={{fontSize: '12px', color: THEME.textSecondary, marginBottom: '15px'}}>
              Visualizing components of the wave function and velocity field from guiding equation: dx/dt = ∇S/m
            </p>
            <div className="chart-container" style={{height: '300px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke={THEME.border} />
                  <XAxis 
                    dataKey="x" 
                    stroke={THEME.textSecondary}
                    label={{ 
                      value: 'Position (x)', 
                      position: 'insideBottomRight', 
                      offset: -10,
                      fill: THEME.textSecondary
                    }} 
                  />
                  <YAxis 
                    stroke={THEME.textSecondary}
                    label={{ 
                      value: 'Value', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: THEME.textSecondary
                    }} 
                    domain={[-1.2, 1.2]}
                  />
                  <Tooltip content={<WaveFunctionTooltip />} />
                  <Legend verticalAlign="top" wrapperStyle={{color: THEME.textPrimary}} />
                  <Line 
                    type="monotone" 
                    dataKey="realPart" 
                    stroke={THEME.chart.realPart} 
                    name="Real Part (Re[Ψ])" 
                    dot={false} 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="imagPart" 
                    stroke={THEME.chart.imagPart} 
                    name="Imaginary Part (Im[Ψ])" 
                    dot={false}
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="velocity" 
                    stroke={THEME.chart.velocity} 
                    name="Bohmian Velocity (∇S/m)" 
                    dot={false}
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hiddenOrder" 
                    stroke={THEME.chart.hiddenOrder} 
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
          <div className="visualization-card" style={{
            backgroundColor: THEME.cardBackground, 
            padding: '15px', 
            borderRadius: '8px', 
            boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
            border: isDarkMode ? `1px solid ${THEME.border}` : 'none'
          }}>
            <h4 style={{color: THEME.headingColor, fontSize: '18px', marginTop: '0'}}>
              Hidden Order Correlation in {dimension} Space
            </h4>
            <p style={{fontSize: '12px', color: THEME.textSecondary, marginBottom: '15px'}}>
              Visualizing correlation function ⟨O(x)O(y)⟩ as a projection from {dimension === '4D' ? '4D' : '11D'} space
            </p>
            <div className="chart-container" style={{height: '300px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke={THEME.border} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="x"
                    stroke={THEME.textSecondary} 
                    label={{ 
                      value: 'Dimension 1', 
                      position: 'insideBottomRight', 
                      offset: -10,
                      fill: THEME.textSecondary 
                    }} 
                    domain={[-12, 12]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="y"
                    stroke={THEME.textSecondary} 
                    label={{ 
                      value: 'Dimension 2', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: THEME.textSecondary 
                    }} 
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
                    contentStyle={{
                      backgroundColor: THEME.tooltip.background,
                      border: `1px solid ${THEME.tooltip.border}`,
                      color: THEME.tooltip.text
                    }}
                  />
                  <Scatter 
                    name="Manifold Points" 
                    data={manifoldData} 
                    fill={THEME.chart.realPart} 
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="correlation-legend" style={{
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginTop: '10px',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: THEME.chart.strongCorrelation, 
                  borderRadius: '50%', 
                  marginRight: '5px'
                }}></div>
                <span style={{fontSize: '12px', color: THEME.textSecondary}}>Strong</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: THEME.chart.weakCorrelation, 
                  borderRadius: '50%', 
                  marginRight: '5px'
                }}></div>
                <span style={{fontSize: '12px', color: THEME.textSecondary}}>Weak</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* AdS/CFT Correspondence Visualization */}
        <div className="visualization-card" style={{
          backgroundColor: THEME.cardBackground, 
          padding: '15px', 
          borderRadius: '8px', 
          boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
          border: isDarkMode ? `1px solid ${THEME.border}` : 'none',
          marginTop: '20px'
        }}>
          <h4 style={{color: THEME.headingColor, fontSize: '18px', marginTop: '0'}}>
            Holographic Principle: AdS/CFT Correspondence
          </h4>
          <p style={{fontSize: '12px', color: THEME.textSecondary, marginBottom: '15px'}}>
            Visualizing the relationship between bulk AdS space and boundary CFT: Z<sub>CFT</sub> = ∫Dϕe<sup>-S<sub>bulk</sub>[ϕ]</sup>
          </p>
          <div className="holographic-visualization" style={{
            width: '100%', 
            height: '250px', 
            backgroundColor: isDarkMode ? '#161b22' : '#eff6ff', 
            borderRadius: '8px', 
            position: 'relative', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <div style={{position: 'relative', width: '200px', height: '200px'}}>
              {/* Boundary circle (CFT) */}
              <div style={{
                position: 'absolute', 
                top: '0', 
                left: '0', 
                width: '100%', 
                height: '100%', 
                border: `4px solid ${THEME.chart.boundary}`, 
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
                    border: `${1 + (1-scale) * 3}px solid ${THEME.chart.bulkSpace}`,
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
                backgroundColor: THEME.chart.bulkSpace,
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
                      <circle cx="0" cy="0" r="5" fill={THEME.chart.bulkSpace} />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                        const radians = angle * Math.PI / 180;
                        const x = 40 * Math.cos(radians);
                        const y = 40 * Math.sin(radians);
                        const x2 = 80 * Math.cos(radians);
                        const y2 = 80 * Math.sin(radians);
                        return (
                          <g key={angle}>
                            <circle cx={x} cy={y} r="3" fill={THEME.chart.bulkSpace} />
                            <line x1="0" y1="0" x2={x} y2={y} stroke={THEME.chart.network} strokeWidth="1" />
                            <circle cx={x2} cy={y2} r="3" fill={THEME.chart.boundary} />
                            <line x1={x} y1={y} x2={x2} y2={y2} stroke={THEME.chart.network} strokeWidth="1" />
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="holographic-legend" style={{
              position: 'absolute', 
              bottom: '10px', 
              left: '10px', 
              fontSize: '12px',
              color: THEME.textSecondary
            }}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                <div style={{
                  width: '12px', 
                  height: '12px', 
                  border: `2px solid ${THEME.chart.boundary}`, 
                  borderRadius: '50%', 
                  marginRight: '5px'
                }}></div>
                <span>CFT Boundary (Our 4D Reality)</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: THEME.chart.bulkSpace, 
                  borderRadius: '50%', 
                  marginRight: '5px'
                }}></div>
                <span>AdS Bulk (Higher Dimensions)</span>
              </div>
              {dimension === '11D' && (
                <div style={{display: 'flex', alignItems: 'center', marginTop: '5px'}}>
                  <div style={{
                    width: '12px', 
                    height: '12px', 
                    border: `1px solid ${THEME.chart.network}`, 
                    borderRadius: '50%', 
                    marginRight: '5px'
                  }}></div>
                  <span>MERA Tensor Network</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Key Equations Section */}
        <div className="visualization-card" style={{
          backgroundColor: THEME.cardBackground, 
          padding: '15px', 
          borderRadius: '8px', 
          boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
          border: isDarkMode ? `1px solid ${THEME.border}` : 'none',
          marginTop: '20px'
        }}>
          <h4 style={{color: THEME.headingColor, fontSize: '18px', marginTop: '0'}}>
            Key Equations of HQR
          </h4>
          <div className="equation-grid" style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '10px', 
            fontSize: '14px'
          }}>
            <div className="equation-card" style={{
              padding: '10px', 
              border: `1px solid ${THEME.border}`, 
              borderRadius: '4px'
            }}>
              <p style={{fontWeight: '500', margin: '0 0 5px 0', color: THEME.textPrimary}}>M-Theory Metric:</p>
              <p style={{fontFamily: 'monospace', margin: '0', color: THEME.textPrimary}}>ds² = g<sub>μν</sub>dx<sup>μ</sup>dx<sup>ν</sup>, μ,ν = 0,1,...,10</p>
            </div>
            <div className="equation-card" style={{
              padding: '10px', 
              border: `1px solid ${THEME.border}`, 
              borderRadius: '4px'
            }}>
              <p style={{fontWeight: '500', margin: '0 0 5px 0', color: THEME.textPrimary}}>Bohmian Mechanics Guiding Equation:</p>
              <p style={{fontFamily: 'monospace', margin: '0', color: THEME.textPrimary}}>dx/dt = ∇S/m</p>
              <p style={{fontFamily: 'monospace', margin: '5px 0 0 0', color: THEME.textPrimary}}>Where Ψ = Re<sup>iS/ℏ</sup></p>
            </div>
            <div className="equation-card" style={{
              padding: '10px', 
              border: `1px solid ${THEME.border}`, 
              borderRadius: '4px'
            }}>
              <p style={{fontWeight: '500', margin: '0 0 5px 0', color: THEME.textPrimary}}>Hidden Order Correlation:</p>
              <p style={{fontFamily: 'monospace', margin: '0', color: THEME.textPrimary}}>⟨O(x)O(y)⟩</p>
            </div>
            <div className="equation-card" style={{
              padding: '10px', 
              border: `1px solid ${THEME.border}`, 
              borderRadius: '4px'
            }}>
              <p style={{fontWeight: '500', margin: '0 0 5px 0', color: THEME.textPrimary}}>AdS/CFT Correspondence:</p>
              <p style={{fontFamily: 'monospace', margin: '0', color: THEME.textPrimary}}>Z<sub>CFT</sub> = ∫Dϕe<sup>-S<sub>bulk</sub>[ϕ]</sup></p>
            </div>
          </div>
        </div>
        
        <div className="visualization-footer" style={{fontSize: '12px', color: THEME.textSecondary, marginTop: '10px'}}>
          <p>Note: This visualization is a simplified representation of the complex mathematical frameworks in HQR theory. The 11D visualization uses projections to represent higher-dimensional structures in a 3D space.</p>
        </div>
      </div>
    );
  };

  // Render the component once the DOM is ready
  function initVisualization() {
    const container = document.getElementById('hqr-visualization-root');
    if (container) {
      try {
        ReactDOM.render(<HQRVisualization />, container);
        console.log('HQR Visualization component mounted successfully');
      } catch (error) {
        console.error('Failed to render HQR Visualization:', error);
        container.innerHTML = `
          <div style="padding: 20px; background-color: ${isDarkMode ? '#2d0b0b' : '#fff5f5'}; color: ${isDarkMode ? '#f85149' : '#dc2626'}; border: 1px solid ${isDarkMode ? '#f85149' : '#dc2626'}; border-radius: 8px;">
            <p><strong>Error:</strong> Failed to render the visualization.</p>
            <p>Technical details: ${error.message}</p>
          </div>
        `;
      }
    } else {
      console.error('HQR Visualization container not found: #hqr-visualization-root');
    }
  }

  // Initialize the component when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisualization);
  } else {
    // DOM already loaded
    initVisualization();
  }

  // Add resize handler to responsively update the visualization
  window.addEventListener('resize', function() {
    const container = document.getElementById('hqr-visualization-root');
    if (container) {
      // Force re-render on significant size changes
      container.style.height = `${container.offsetHeight + 1}px`;
      setTimeout(() => {
        container.style.height = null;
      }, 0);
    }
  });
})();
