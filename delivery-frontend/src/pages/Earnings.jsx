// delivery-frontend/src/pages/Earnings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, Store } from "lucide-react";
import { getEarningsSummary, getRecentEarnings } from "../services/earningsService";

const SummaryCard = ({ label, earnings, deliveries }) => (
  <div className="bg-white rounded-xl border-2 border-primary/90 shadow-sm p-5">
    <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
    <p className="text-2xl font-bold text-green-700">Rs. {earnings?.toFixed(0) ?? 0}</p>
    <p className="text-xs text-gray-500 mt-1">{deliveries ?? 0} delivery{deliveries !== 1 ? "ies" : "y"}</p>
  </div>
);

const Earnings = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, recentData] = await Promise.all([
          getEarningsSummary(),
          getRecentEarnings(),
        ]);
        setSummary(summaryData);
        setRecent(recentData.orders);
      } catch (err) {
        console.error("Failed to load earnings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark
            bg-white border border-primary/20 rounded-full px-4 py-2 mb-6 shadow-sm
            hover:shadow transition-all duration-200"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wallet size={22} className="text-primary" />
          My Earnings
        </h1>

        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <SummaryCard label="Today" earnings={summary?.today.earnings} deliveries={summary?.today.deliveries} />
              <SummaryCard label="This Week" earnings={summary?.week.earnings} deliveries={summary?.week.deliveries} />
              <SummaryCard label="This Month" earnings={summary?.month.earnings} deliveries={summary?.month.deliveries} />
              <SummaryCard label="Lifetime" earnings={summary?.lifetime.earnings} deliveries={summary?.lifetime.deliveries} />
            </div>

            <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Deliveries</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400">No completed deliveries yet.</p>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                {recent.map((order) => (
                  <div key={order._id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Store size={15} className="text-primary" />
                      <span className="text-sm text-gray-700">{order.vendor?.shopName || "Restaurant"}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-700">Rs. {order.deliveryFee}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Earnings;