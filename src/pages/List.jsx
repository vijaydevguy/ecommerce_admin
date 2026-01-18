import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";
import { products } from "../assets/frontend_assets/assets";
import { MdDeleteOutline } from "react-icons/md";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      // const res = await axios.get(backendUrl + "/api/product/list", {
      //   Headers: { Authorization: `Bearer ${token}` },
      // });

      const res = await axios.get(backendUrl + "/api/product/list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res);

      // if API returns data
      if (res?.data?.products?.length > 0 && res.data.success) {
        setList(res.data.products);
      } else {
        toast.error(`Fetching failed local data loaded ${res.data.message}`);
        setList(products); // fallback
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    // setTimeout(() => {
    fetchList();
    // }, 3000);
  }, []);

  console.log(list);

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
        toast.success(`id:${id} Deleted successfully`);
        await fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // console.log(error.message);
      toast.error(error.message);
    }
  };

  return loading ? (
    <p className="text-black flex items-center justify-center h-screen text-2xl text-gray-500">
      Loading...
    </p>
  ) : (
    <div className="flex flex-col gap-2">
      <p>All products</p>
      <div className="flex flex-col gap-2">
        {/* list table */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 border border-gray-100 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* product list */}
        <div className="flex flex-col gap-4">
          {list.map((item, i) => (
            <div key={i}>
              <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] justify-center items-center text-sm">
                {item.image && item.image.length > 0 ? (
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="pointer-events-none w-12"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200"></div>
                )}

                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>
                  {currency}
                  {item.price}
                </p>
                <div className="flex items-center justify-center">
                  <MdDeleteOutline
                    className="text-red-700 cursor-pointer"
                    size={24}
                    role="button"
                    onClick={() => removeProduct(item._id)}
                  />
                </div>
              </div>
              <hr className="text-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
