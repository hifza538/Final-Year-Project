// src/components/dashboard/DashboardCharts.jsx
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Compact chart cards for the dashboard. Each chart accepts a `data` prop.
const ChartEmptyState = () => (
  <div className="h-28 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg">
    <p className="text-xs text-gray-400 font-medium">No data yet</p>
    <p className="text-[11px] text-gray-300 mt-0.5">Populates once Orders feature is live</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-secondary mb-4">{title}</h3>
    {children}
  </div>
);

// Individual chart components for the dashboard. Each chart accepts a `data` prop.
export const OrdersLineChart = ({ data = [] }) => (
  <ChartCard title="Orders Overview">
    {data.length === 0 ? (
      <ChartEmptyState />
    ) : (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#E8590C" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </ChartCard>
);

export const RevenueBarChart = ({ data = [] }) => (
  <ChartCard title="Revenue Overview">
    {data.length === 0 ? (
      <ChartEmptyState />
    ) : (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="revenue" fill="#E8590C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </ChartCard>
);
// Compact area chart showing user growth over time. Shows "No data yet" until the Orders feature exists on the backend - avoids fabricating numbers.
export const UserGrowthAreaChart = ({ data = [] }) => (
  <ChartCard title="User Growth">
    {data.length === 0 ? (
      <ChartEmptyState />
    ) : (
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E8590C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#E8590C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE9" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="users" stroke="#E8590C" fill="url(#userGrowth)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </ChartCard>
);