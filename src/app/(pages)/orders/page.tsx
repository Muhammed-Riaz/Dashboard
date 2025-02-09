"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Simple from "../components/simple";

// Define Order Type
interface Order {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  cartItems: { id: string; name: string; price: number; quantity: number; image: string }[];
  totalAmount: number;
  status: string;  // "Completed", "Pending", "Cancelled"
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  // To hold the selected order

  // Fetch Orders from Sanity
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "order"] | order(_createdAt desc) {
            _id,
            name,
            email,
            address,
            phone,
            cartItems, 
            totalAmount,
            status
          }
        `);

        setOrders(data);  // Set orders to state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewClick = (order: Order) => {
    if (selectedOrder?._id === order._id) {
      setSelectedOrder(null);  // If the same order is clicked again, hide the details
    } else {
      setSelectedOrder(order);  // Otherwise, show the selected order's details
    }
  };

  // Update order status in the UI (without updating Sanity)
  const handleStatusChange = (status: string) => {
    if (selectedOrder) {
      // Update the selected order's status in the orders list
      const updatedOrders = orders.map((order) =>
        order._id === selectedOrder._id ? { ...order, status } : order
      );
      setOrders(updatedOrders);  // Update the orders list with the new status

      // Update the selected order's status
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <div className="sm:flex block max-w-screen-2xl mx-auto">
    <div className="w-64">
    <Simple/>
  </div>

    <div className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold">Orders Management</h1>
      <p className="text-sm sm:text-base text-gray-600">View and manage your customer orders here.</p>

      <div className="mt-4 sm:mt-6 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Order List</h2>

        {/* Mobile-Friendly Card Layout */}
        <div className="lg:hidden space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">#{order._id.slice(-6)}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer</span>
                  <span className="text-sm font-medium">{order.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-medium">${order.totalAmount.toFixed(2)}</span>
                </div>
             
              </div>
              <button
                className="w-full mt-2 py-1 text-sm text-blue-500 hover:underline"
                onClick={() => handleViewClick(order)}  // Toggle order details
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Table Layout for Larger Screens */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">#{order._id.slice(-6)}</td>
                  <td className="p-2">{order.name}</td>
                  <td className="p-2">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-2">
                    <span
                      className={`font-semibold ${
                        order.status === "Completed"
                          ? "text-green-600"
                          : order.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status} {/* Use the status of the individual order */}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleViewClick(order)}  // Toggle order details
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal or Section */}
      {selectedOrder && (
        <div className="mt-4 sm:mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2">
            <p><strong>Order ID:</strong> #{selectedOrder._id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.name}</p>
            <p><strong>Email:</strong> {selectedOrder.email}</p>
            <p><strong>Phone:</strong> {selectedOrder.phone}</p>
            <p><strong>Address: </strong>{selectedOrder.address}</p>

            {/* Display Cart Items */}
            <div>
              <h3 className="font-medium">Cart Items:</h3>
              <ul>
                {selectedOrder.cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>
                      ${item.price} x {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
            
            {/* Order Status Update Section */}
            <div>
              <h3 className="font-medium">Order Status</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="Pending"
                    checked={selectedOrder.status === "Pending"}
                    onChange={() => handleStatusChange("Pending")}
                  />
                  <span className="ml-2">Pending</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="Completed"
                    checked={selectedOrder.status === "Completed"}
                    onChange={() => handleStatusChange("Completed")}
                  />
                  <span className="ml-2">Completed</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="Cancelled"
                    checked={selectedOrder.status === "Cancelled"}
                    onChange={() => handleStatusChange("Cancelled")}
                  />
                  <span className="ml-2">Cancelled</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
