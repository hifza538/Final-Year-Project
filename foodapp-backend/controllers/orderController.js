import Order from "../models/Order.js";

/* -------------------------------------------------------------------------- */
/*                              CREATE NEW ORDER                              */
/* -------------------------------------------------------------------------- */
export const createOrder = async (req, res) => {
  try {
    const {
      restaurantName,
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      deliveryFee,
      taxPrice,
      totalPrice,
    } = req.body;

    // Validation
        if (!restaurantName) {
      return res.status(400).json({
        message: "Restaurant name is required",
      });
    }
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: "No order items provided",
      });
    }

    if (!deliveryAddress || !deliveryAddress.address || !deliveryAddress.phone) {
      return res.status(400).json({
        message: "Delivery address is required",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      restaurantName,
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      deliveryFee,
      taxPrice,
      totalPrice,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to create order",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              GET MY ORDERS                                 */
/* -------------------------------------------------------------------------- */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch user orders",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                           GET ORDER BY ID                                  */
/* -------------------------------------------------------------------------- */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Sirf apna order dekh sake
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch order",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                           UPDATE ORDER STATUS                              */
/* -------------------------------------------------------------------------- */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus || order.orderStatus;

    if (orderStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to update order status",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                            CANCEL ORDER                                    */
/* -------------------------------------------------------------------------- */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Ownership check
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to cancel this order",
      });
    }

    // Only pending orders can be cancelled
    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    order.orderStatus = "Cancelled";
    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to cancel order",
    });
  }
};