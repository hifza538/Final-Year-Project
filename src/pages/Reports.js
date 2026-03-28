import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, Filter, FileText, ChevronDown } from 'lucide-react';
import { useTheme } from '../ThemeContext';

// --- Sab Data Points ---
const weeklyData = [
  { name: 'Mon', revenue: 4000 }, { name: 'Tue', revenue: 3000 }, { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 4500 }, { name: 'Fri', revenue: 6000 }, { name: 'Sat', revenue: 8000 }, { name: 'Sun', revenue: 7500 },
];

const monthlyData = [
  { name: 'Week 1', revenue: 25000 }, { name: 'Week 2', revenue: 18000 }, 
  { name: 'Week 3', revenue: 32000 }, { name: 'Week 4', revenue: 28000 },
];

const threeMonthsData = [
  { name: 'Jan', revenue: 85000 }, { name: 'Feb', revenue: 72000 }, { name: 'Mar', revenue: 95000 },
];

const sixMonthsData = [
  { name: 'Oct', revenue: 60000 }, { name: 'Nov', revenue: 75000 }, { name: 'Dec', revenue: 90000 },
  { name: 'Jan', revenue: 85000 }, { name: 'Feb', revenue: 72000 }, { name: 'Mar', revenue: 95000 },
];

const Reports = () => {
  const { darkMode, card, text, subText, border } = useTheme();
  const [reportRange, setReportRange] = useState('Last 7 Days');
  const [chartData, setChartData] = useState(weeklyData);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleRangeChange = (label, data) => {
    setReportRange(label);
    setChartData(data);
    setShowDropdown(false);
  };

  const categoryData = [
    { name: 'Fast Food', value: 45, color: '#ff6b00' },
    { name: 'Desi Food', value: 30, color: '#00b894' },
    { name: 'Beverages', value: 15, color: '#0984e3' },
    { name: 'Desserts', value: 10, color: '#6c5ce7' },
  ];

  return (
    <div style={{ padding: '5px', color: text }}>
      {/* 1. Header & Dropdown Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold' }}>Analytics Reports</h1>
          <p style={{ color: subText }}>Performance: <b>{reportRange}</b></p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', 
                borderRadius: '12px', border: `1px solid ${border}`, backgroundColor: card, 
                color: text, cursor: 'pointer', fontWeight: '500', minWidth: '180px', justifyContent: 'space-between'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#ff6b00" /> {reportRange}
              </div>
              <ChevronDown size={16} style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
            </button>

            {showDropdown && (
              <div style={{ 
                position: 'absolute', top: '55px', right: 0, width: '100%', backgroundColor: card, 
                borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 10, border: `1px solid ${border}`, overflow: 'hidden'
              }}>
                <div onClick={() => handleRangeChange('Last 7 Days', weeklyData)} style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: `1px solid ${border}` }}>Last 7 Days</div>
                <div onClick={() => handleRangeChange('Last Month', monthlyData)} style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: `1px solid ${border}` }}>Last Month</div>
                <div onClick={() => handleRangeChange('Last 3 Months', threeMonthsData)} style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: `1px solid ${border}` }}>Last 3 Months</div>
                <div onClick={() => handleRangeChange('Last 6 Months', sixMonthsData)} style={{ padding: '12px 20px', cursor: 'pointer' }}>Last 6 Months</div>
              </div>
            )}
          </div>
          <button style={{ backgroundColor: '#ff6b00', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* 2. Summary Cards (Avg Value, Conversion, Profit) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '35px' }}>
        <div style={{ backgroundColor: card, padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${border}` }}>
          <div style={{ padding: '12px', backgroundColor: '#ff6b0015', borderRadius: '12px' }}><FileText color="#ff6b00" /></div>
          <div><p style={{ margin: 0, color: subText, fontSize: '13px' }}>Avg. Value</p><h3 style={{ margin: 0 }}>$42.50</h3></div>
        </div>
        <div style={{ backgroundColor: card, padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${border}` }}>
          <div style={{ padding: '12px', backgroundColor: '#00b89415', borderRadius: '12px' }}><TrendingUp color="#00b894" /></div>
          <div><p style={{ margin: 0, color: subText, fontSize: '13px' }}>Conversion</p><h3 style={{ margin: 0 }}>3.2%</h3></div>
        </div>
        <div style={{ backgroundColor: card, padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${border}` }}>
          <div style={{ padding: '12px', backgroundColor: '#0984e315', borderRadius: '12px' }}><Filter color="#0984e3" /></div>
          <div><p style={{ margin: 0, color: subText, fontSize: '13px' }}>Net Profit</p><h3 style={{ margin: 0 }}>$18,200</h3></div>
        </div>
      </div>

      {/* 3. Main Analytics Section (Area Chart & Pie Chart) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Revenue Area Chart */}
        <div style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', border: `1px solid ${border}` }}>
          <h3 style={{ marginBottom: '25px' }}>Revenue Overview ({reportRange})</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#333' : '#eee'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: darkMode ? '#aaa' : '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: darkMode ? '#aaa' : '#888', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: card, border: `1px solid ${border}`, color: text, borderRadius: '10px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#ff6b00" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div style={{ backgroundColor: card, padding: '30px', borderRadius: '25px', border: `1px solid ${border}` }}>
          <h3 style={{ marginBottom: '25px' }}>Category Distribution</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '20px' }}>
            {categoryData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></div>
                  <span style={{ fontSize: '14px', color: subText }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 'bold' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
