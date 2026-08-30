// customer-frontend/src/pages/OrderConfirmation.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";
import { getMyOrderById } from "../services/orderService";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import ErrorState from "../components/common/ErrorState";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyOrderById(id);
        setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return <div className="max-w-lg mx-auto px-4 py-16 text-center text-gray-500">Loading order...</div>;
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={32} className="text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
      <p className="text-gray-500 mt-2">
        Your order has been successfully placed. You can track its status below.
      </p>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mt-6 text-left">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Clock size={16} />
          <OrderStatusBadge status={order.orderStatus} />
        </div>
        <div className="space-y-1.5">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} × {item.qty}</span>
              <span>Rs. {item.price * item.qty}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>Rs. {order.totalPrice}</span>
        </div>
      </div>

      <Link
        to="/"
        className="inline-block mt-6 px-6 py-2.5 bg-primary text-white font-semibold rounded-full
                   hover:bg-primary-dark transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmation;