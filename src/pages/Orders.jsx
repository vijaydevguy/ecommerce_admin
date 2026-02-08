import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const getAllOrders = async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } },
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
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
  }, [token]);

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-4">Orders</h2>

      <div className="flex flex-col gap-4">
        {orders.map((order, i) => (
          <div
            key={i}
            className="grid grid-cols-1 
              sm:grid-cols-[0.4fr_2fr_1fr] 
              lg:grid-cols-[0.4fr_2fr_1fr_1fr_1fr]
              gap-4 items-start 
              border border-gray-300 
              p-5 text-sm text-gray-700"
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
              {order.items.map((item, idx) => (
                <p key={idx} className="font-medium">
                  {item.name} x {item.quantity}
                  <span className="ml-1 text-gray-500">{item.size}</span>
                </p>
              ))}

              {/* Address */}
              <p className="font-semibold">
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
              <p>{order.address.phone}</p>
            </div>

            {/* 📊 Order Info */}
            <div className="space-y-1">
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>
                Payment:{" "}
                <span className="font-medium">
                  {order.payment ? "Done" : "Pending"}
                </span>
              </p>
              <p>
                Date:{" "}
                {new Date(order.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <p className="font-semibold">
              {currency}
              {order.amount}
            </p>

            {/* 🔽 Order Status */}
            <div>
              <select
                className="border border-gray-300 px-3 py-1 rounded outline-none"
                defaultValue={order.status}
                onChange={(e)=>statusHandler(e,order._id)}
              >
                <option>Order Placed</option>
                <option>Packing</option>
                <option>Shipped</option>
                <option>Out for delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { backendUrl, currency } from "../App";
// import { toast } from "react-toastify";
// import { assets } from "../assets/assets";

// const Orders = ({ token }) => {
//   const [orders, setOrders] = useState([]);

//   const getAllOrders = async () => {
//     if (!token) {
//       return null;
//     }
//     console.log("token", token);
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/order/list`,
//         {},
//         { headers: { token } },
//       );
//       console.log("all orders", res.data);
//       if (res.data.success) {
//         setOrders(res.data.orders);
//       } else {
//         toast.error(res.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     getAllOrders();
//   }, [token]);

//   console.log("orders", orders);

//   return (
//     <div>
//       <h2>Orders</h2>
//       <div className="flex flex-col">
//         {console.log(orders.length)}
//         {orders.map((order, i) => (
//           <div key={i} className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-300 p-5 md:py-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700">
//             <div>
//               <img
//                 src={assets.parcel_icon}
//                 alt="parcel"
//                 className="pointer-events-none"
//               />
//               <div>
//                 {order.items.map((item, i) => {
//                   if (i === order.items.length - 1) {
//                     return (
//                       <p key={i}>
//                         {item.name} x {item.quantity}
//                         <span>{item.size}</span>
//                       </p>
//                     );
//                   } else {
//                     return (
//                       <p key={i}>
//                         {item.name} x {item.quantity}
//                         <span>{item.size}</span>
//                       </p>
//                     );
//                   }
//                 })}

//                 <p>{`${order.address.firstName} ${order.address.lastName}`}</p>
//                 <div>
//                   <p>{order.address.street},</p>
//                   <p>{order.address.city},</p>
//                   <p>{order.address.state},</p>
//                   <p>{order.address.country},</p>
//                   <p>{order.address.zipcode},</p>
//                 </div>
//                 <p>{order.address.phone}</p>
//               </div>
//             </div>

//             <div>
//               <p>Items: {order.items.length}</p>
//               <p>Method: {order.paymentMethod}</p>
//               <p>Payment: {order.payment ? "Done" : "Pending"}</p>
//               <p>
//                 Date:{" "}
//                 {new Date(order.date).toLocaleDateString("en-IN", {
//                   day: "2-digit",
//                   month: "short",
//                   year: "numeric",
//                 })}
//               </p>

//               <p>
//                 {currency}
//                 {order.amount}
//               </p>
//               <select name="payment" id="payment">
//                 <option value="Shipped">Shipped</option>
//                 <option value="Packing">Packing</option>
//                 <option value="Out for delivery">Out for delivery</option>
//                 <option value="Delivered">Delivered</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Orders;
