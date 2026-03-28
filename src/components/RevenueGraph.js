import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../ThemeContext'; // 1. Theme connect kiya

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const RevenueGraph = () => {
  const { darkMode, card, text, border } = useTheme(); // 2. Theme variables nikaalein

  return (
    <div style={{ 
      backgroundColor: card, 
      padding: '25px', 
      borderRadius: '20px', 
      marginTop: '30px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      border: `1px solid ${border}`,
      transition: '0.3s'
    }}>
      <h3 style={{ marginBottom: '25px', color: text }}>Revenue Growth</h3>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff6b00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Grid Lines ka rang badalna */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#3d3d3d' : '#eee'} />
            
            {/* X aur Y Axis ke text ka rang badalna */}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: darkMode ? '#aaa' : '#888', fontSize: 12}} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: darkMode ? '#aaa' : '#888', fontSize: 12}} 
            />
            
            {/* Tooltip (Dabba jo mouse rakhne par ata hai) ka rang badalna */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: card, 
                border: `1px solid ${border}`, 
                borderRadius: '10px',
                color: text 
              }} 
              itemStyle={{ color: text }}
            />
            
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#ff6b00" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorRev)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueGraph;
