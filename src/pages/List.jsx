import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import { products } from "../assets/frontend_assets/assets";
import { MdDeleteOutline, MdSearch, MdClear } from "react-icons/md";
import useDebounce from "../hooks/useDebounce";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // API pagination, search, filter, and sort states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  // Debounced search (400ms delay)
  const debouncedSearch = useDebounce(search, 400);

  // Reset to page 1 whenever debounced search, category, sort, or limit changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, sort, limit]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", limit);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);

      const res = await axios.get(
        `${backendUrl}/api/product/list?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res?.data?.success && res.data.products) {
        setList(res.data.products);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalProducts(
            res.data.pagination.totalProducts || res.data.products.length,
          );
        } else {
          setTotalPages(res.data.totalPages || 1);
          setTotalProducts(res.data.totalProducts || res.data.products.length);
        }
      } else {
        toast.error(`Fetching failed: ${res?.data?.message || "Local data loaded"}`);
        fallbackClientFilter();
      }
    } catch (error) {
      toast.error(error.message);
      fallbackClientFilter();
    } finally {
      setLoading(false);
    }
  };

  const fallbackClientFilter = () => {
    let copy = [...products];

    if (debouncedSearch.trim()) {
      copy = copy.filter((item) =>
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    if (category) {
      copy = copy.filter((item) => item.category === category);
    }

    if (sort === "low-high") {
      copy.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      copy.sort((a, b) => b.price - a.price);
    }

    setTotalProducts(copy.length);
    const pages = Math.ceil(copy.length / limit) || 1;
    setTotalPages(pages);

    const startIndex = (currentPage - 1) * limit;
    setList(copy.slice(startIndex, startIndex + limit));
  };

  useEffect(() => {
    fetchList();
  }, [currentPage, limit, debouncedSearch, category, sort]);

  const removeProduct = async (id) => {
    try {
      const res = await axios.delete(
        backendUrl + "/api/product/remove",
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(`Product deleted successfully`);
        await fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">All Products</h2>
          {totalProducts > 0 && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
              {totalProducts} {totalProducts === 1 ? "item" : "items"}
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
            placeholder="Search by product name..."
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
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 text-sm px-3 py-1.5 rounded outline-none cursor-pointer bg-white"
          >
            <option value="">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 text-sm px-3 py-1.5 rounded outline-none cursor-pointer bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="oldest">Oldest First</option>
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

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2.5 px-4 bg-gray-100 border-b border-gray-200 text-sm font-semibold text-gray-700">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Table Rows / Skeletons */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse py-3 px-4">
                <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center text-sm gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-sm" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 hidden md:block" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : list.length > 0 ? (
            list.map((item, i) => (
              <div
                key={item._id || i}
                className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center text-sm py-2.5 px-4 hover:bg-gray-50 transition"
              >
                <div>
                  {item.image && item.image.length > 0 ? (
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded pointer-events-none"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  )}
                </div>

                <p className="font-medium text-gray-800 pr-2 truncate">
                  {item.name}
                </p>

                <p className="text-gray-600 hidden md:block">{item.category}</p>

                <p className="font-medium text-gray-800">
                  {currency}
                  {item.price}
                </p>

                <div className="flex items-center justify-center">
                  <MdDeleteOutline
                    className="text-red-600 hover:text-red-800 cursor-pointer p-1 rounded hover:bg-red-50 transition"
                    size={28}
                    role="button"
                    title="Delete product"
                    onClick={() => removeProduct(item._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400">
              <p>No products found matching your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Table Footer with Full Persistent Pagination */}
      <div className="bg-white border border-gray-200 rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        {/* Left: Showing entries & Rows per page */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-gray-600">
          <span className="font-medium text-gray-700">
            {totalProducts === 0
              ? "Showing 0 to 0 of 0 products"
              : `Showing ${(currentPage - 1) * limit + 1} to ${Math.min(
                  currentPage * limit,
                  totalProducts,
                )} of ${totalProducts} products`}
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

          {/* Page Number Buttons with Smart Ellipsis Window */}
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

export default List;
