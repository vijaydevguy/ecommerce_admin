import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const getAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } },
      );
      console.log("all orders", res.data);
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  console.log("orders", orders);

  return (
    <div>
      <h2>Orders</h2>
      <div className="flex flex-col">
        {orders.map((order, i) => (
          <div key={i}>
            <img
              src={assets.parcel_icon}
              alt="parcel"
              className="pointer-events-none"
            />
            <div>
              {order.items.map((item, i) => {
                if (i === order.items.length - 1) {
                  return (
                    <p key={i}>
                      {item.name} x {item.quantity}
                      <span>{item.size}</span>
                    </p>
                  );
                } else {
                  return (
                    <p key={i}>
                      {item.name} x {item.quantity}
                      <span>{item.size}</span>
                    </p>
                  );
                }
              })}
            </div>
            <p>{`${order.address.firstName} ${order.address.firstName}`}</p>
            <div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
