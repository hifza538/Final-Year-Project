// src/pages/OrderSuccessPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Receipt, ShoppingBag } from "lucide-react";

function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId || `ORD-${Date.now()}`;
  const customerName = location.state?.customerName || "Customer";

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 max-w-2xl w-full text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Thank you, <span className="font-semibold">{customerName}</span>!  
          Your order has been confirmed and is now being prepared.
        </p>

        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Order ID</span>
          </div>
          <p className="text-2xl font-bold text-orange-500">{orderId}</p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-xl transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;