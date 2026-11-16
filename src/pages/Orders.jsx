import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { MdSearch, MdClear } from "react-icons/md";
import useDebounce from "../hooks/useDebounce";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination, search, and status filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Debounced search (400ms delay)
  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 whenever debounced search, status filter, or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, limit]);

  const getAllOrders = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", limit);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      if (statusFilter && statusFilter !== "All") {
        params.append("status", statusFilter);
      }

      const res = await axios.post(
        `${backendUrl}/api/order/list?${params.toString()}`,
        {},
        { headers: { token } },
      );

      if (res.data.success) {
        setOrders(res.data.orders);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalOrders(
            res.data.pagination.totalOrders || res.data.orders.length,
          );
        } else {
          setTotalPages(res.data.totalPages || 1);
          setTotalOrders(res.data.totalOrders || res.data.orders.length);
        }
      } else {
        toast.error(res.data.message || "Failed to load orders");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: e.target.value },
        {
          headers: { token },
        },
      );

      if (res.data.success) {
        toast.success("Order status updated");
        await getAllOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [token, currentPage, limit, debouncedSearch, statusFilter]);

  return (
    <div className="px-2 flex flex-col gap-4">
      {/* Top Header & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Orders Management</h2>
          {totalOrders > 0 && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
              {totalOrders} {totalOrders === 1 ? "order" : "orders"}
            </span>
          )}
        </div>
      </div>

      {/* Filter, Search & Pagination Toolbar */}
      <div className="bg-white p-3 border border-gray-200 rounded-md flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <MdSearch
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by customer, phone, city, or product..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-black transition"
          />
          {search && (
            <MdClear
              size={18}
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
            />
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 text-sm px-3 py-1.5 rounded outline-none cursor-pointer bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Limit Dropdown */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 text-sm px-2.5 py-1.5 rounded outline-none cursor-pointer bg-white"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 
                sm:grid-cols-[0.4fr_2fr_1fr] 
                lg:grid-cols-[0.4fr_2fr_1fr_1fr_1fr]
                gap-4 items-start 
                border border-gray-200 
                bg-white
                p-5 text-sm animate-pulse rounded-md"
            >
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gray-200 rounded" />
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>

              <div className="space-y-2">
                <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                <div className="h-3.5 bg-gray-200 rounded w-2/3" />
              </div>

              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-8 bg-gray-200 rounded w-28" />
            </div>
          ))
        ) : orders.length > 0 ? (
          orders.map((order, i) => (
            <div
              key={order._id || i}
              className="grid grid-cols-1 
                sm:grid-cols-[0.4fr_2fr_1fr] 
                lg:grid-cols-[0.4fr_2fr_1fr_1fr_1fr]
                gap-4 items-start 
                border border-gray-200 
                bg-white rounded-md
                p-5 text-sm text-gray-700 hover:border-gray-400 transition"
            >
              {/* 📦 Parcel Icon */}
              <div className="flex justify-center">
                <img
                  src={assets.parcel_icon}
                  alt="parcel"
                  className="w-12 h-12 pointer-events-none"
                />
              </div>

              {/* 🧾 Product + Address */}
              <div className="space-y-2">
                {/* Products */}
                {order.items &&
                  order.items.map((item, idx) => (
                    <p key={idx} className="font-medium text-gray-800">
                      {item.name} x {item.quantity}
                      <span className="ml-1 text-gray-500">({item.size})</span>
                    </p>
                  ))}

                {/* Address */}
                {order.address && (
                  <>
                    <p className="font-semibold text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <div className="text-gray-600 leading-tight">
                      <p>{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state}
                      </p>
                      <p>
                        {order.address.country} - {order.address.zipcode}
                      </p>
                    </div>
                    <p className="text-gray-600">📞 {order.address.phone}</p>
                  </>
                )}
              </div>

              {/* 📊 Order Info */}
              <div className="space-y-1">
                <p>Items: {order.items ? order.items.length : 0}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>
                  Payment:{" "}
                  <span
                    className={`font-medium ${
                      order.payment ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>
                <p>
                  Date:{" "}
                  {order.date
                    ? new Date(order.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>

              <p className="font-semibold text-base text-gray-800">
                {currency}
                {order.amount}
              </p>

              {/* 🔽 Order Status */}
              <div>
                <select
                  className="border border-gray-300 px-3 py-1.5 rounded outline-none font-medium text-gray-700 bg-white cursor-pointer"
                  defaultValue={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-md py-12 text-center text-gray-400">
            <p>No orders found matching your search or filters.</p>
          </div>
        )}
      </div>

      {/* Table Footer with Full Persistent Pagination */}
      <div className="bg-white border border-gray-200 rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        {/* Left: Showing entries & Rows per page */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-gray-600">
          <span className="font-medium text-gray-700">
            {totalOrders === 0
              ? "Showing 0 to 0 of 0 orders"
              : `Showing ${(currentPage - 1) * limit + 1} to ${Math.min(
                  currentPage * limit,
                  totalOrders,
                )} of ${totalOrders} orders`}
          </span>

          <div className="flex items-center gap-1.5 sm:border-l sm:pl-3 border-gray-300">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-0.5 text-xs outline-none bg-white font-medium cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Right: Pagination Navigation Controls */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || loading}
            title="First Page"
            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            &laquo;
          </button>

          {/* Prev Page */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-2.5 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            Prev
          </button>

          {/* Page Number Buttons with Smart Window */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              return (
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 2 && p <= currentPage + 2)
              );
            })
            .map((num, idx, arr) => {
              const prev = arr[idx - 1];
              return (
                <React.Fragment key={num}>
                  {prev && num - prev > 1 && (
                    <span className="px-1 text-xs text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(num)}
                    disabled={loading}
                    className={`min-w-7 h-7 px-1.5 text-xs border rounded transition font-medium ${
                      currentPage === num
                        ? "bg-black text-white border-black font-semibold"
                        : "border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {num}
                  </button>
                </React.Fragment>
              );
            })}

          {/* Next Page */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-2.5 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            Next
          </button>

          {/* Last Page */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || loading}
            title="Last Page"
            className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
