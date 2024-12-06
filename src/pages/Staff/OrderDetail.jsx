// src/components/OrderDetail.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import HeaderStaff from "../../layouts/HeaderStaff";
import SidebarStaff from "../../layouts/SidebarStaff";
import {
  Button,
  Option,
  Select,
  Step,
  Stepper,
} from "@material-tailwind/react";
import { approveOrder, rejectOrder } from "../../services/Staff/OrderService";

const ORDER_STEPS = [
  { id: 1, label: "Chờ xử lý" },
  { id: 2, label: "Đã xác nhận" },
  { id: 3, label: "Đã thanh toán" },
  { id: 4, label: "Đang xử lý" },
  { id: 5, label: "Đã giao hàng" },
  { id: 6, label: "Hoàn thành" },
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const [reload, setReload] = useState(false);
  // console.log(orderId);

  const [newStatus, setNewStatus] = useState(null); // State for selected status
  const [updating, setUpdating] = useState(false);
  const isStaffOrAdmin =
    user && (user.role === "Order Coordinator" || user.role === "Admin");
  const statusOptions = [
    { label: "Đã hủy", value: 0 },
    { label: "Chờ xử lý", value: 1 },
    { label: "Đã xác nhận", value: 2 },
    { label: "Đã thanh toán", value: 3 },
    { label: "Đang xử lý", value: 4 },
    { label: "Đã giao hàng", value: 5 },
    { label: "Bị trì hoãn", value: 6 },
    { label: "Hoàn thành", value: 7 },
  ];

  const getCurrentStepIndex = (orderStatus) => {
    const step = ORDER_STEPS.find((step) => step.label === orderStatus);
    return step ? step.id - 1 : 0; // Return 0 if not found (safe default)
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/get-sale-order-detail?orderId=${orderId}`
        );
        if (response.data.isSuccess) {
          setOrder(response.data.data);
        } else {
          setError("Failed to retrieve order details");
        }
      } catch (error) {
        setError("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId, reload]);

  const handleStatusChange = async () => {
    if (newStatus === null || updating) return;

    setUpdating(true);
    try {
      const response = await axios.put(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/update-order-status?orderId=${orderId}&status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        setOrder({ ...order, orderStatus: newStatus }); // Update order status locally
        alert("Order status updated successfully");
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      alert("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleApprove = async () => {
    const response = await approveOrder(orderId);
    setReload((prev) => !prev);
    console.log(response);
  };

  const handleReject = async () => {
    const response = await rejectOrder(orderId);
    setReload((prev) => !prev);
    navigate(-1);
    // console.log(response);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <HeaderStaff />
      <div className="flex h-full">
        {isStaffOrAdmin && <SidebarStaff />}
        <div className="flex-grow border-l-2 p-4">
          <div className="mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Order Item</span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <span className="text-red-500">Unfulfilled</span>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Use this personalized guide to get your store up and running.
              </p>

              <div className="flex items-start space-x-4 mb-8">
                <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                  <img
                    src="/placeholder.svg"
                    alt="MacBook Air"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Laptop</h3>
                  <p className="text-sm text-gray-600 mb-2">MacBook Air</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Medium</span>
                    <div className="h-4 w-4 rounded-full bg-black" />
                    <span className="text-sm">Black</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">3 x $500.00</div>
                  <div className="font-medium">$1500.00</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Effortlessly manage your orders with our intuitive Order List
                page.
              </p>

              <div className="flex items-center justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg
                    className="inline-block w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  Fulfill item
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Create shipping label
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Customer Info & Summary */}
        <div className="w-1/4 p-4">
          <div className="container mx-auto bg-white shadow-lg rounded-lg p-4">
            {/* Customer Information */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">
                Customer Information
              </h3>
              <p>
                <strong>Name:</strong> {order.fullName}
              </p>
              <p>
                <strong>Email:</strong> {order.email}
              </p>
              <p>
                <strong>Phone:</strong> {order.contactPhone}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
            </div>

            {/* Order Summary */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
              {/* <p><strong>Subtotal:</strong> {order.subTotal.toLocaleString()} VND</p> */}
              <p>
                <strong>Discount:</strong> 0.00 VND
              </p>
              <p>
                <strong>Shipping Fee:</strong> Free
              </p>
              {/* <p><strong>Total:</strong> {order.totalAmount.toLocaleString()} VND</p> */}
              <p>
                <strong>Delivery Method:</strong> {order.deliveryMethod}
              </p>
              <p>
                <strong>branch:</strong> {order.branchId}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
            </div>

            {/* Additional Details */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Additional Information
              </h3>
              <p>
                <strong>Order Note:</strong> {order.note}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Payment Date:</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
