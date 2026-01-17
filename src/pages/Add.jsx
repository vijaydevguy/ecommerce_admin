import React, { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const CATEGORY = ["Men", "Women", "Kids"];
const SUB_CATEGORY = ["Topwear", "Bottomwear", "Winterwear"];

const Add = ({ token }) => {
  // form data's
  const [img1, setImg1] = useState(false);
  const [img2, setImg2] = useState(false);
  const [img3, setImg3] = useState(false);
  const [img4, setImg4] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(
      "img1",
      img1,
      "img1",
      img1,
      "img1",
      img1,
      "img1",
      img1,
      "name",
      name,
      "desc",
      desc,
      "price",
      price,
      "category",
      category,
      "subcategory",
      subCategory,
      "sizes",
      sizes,
      "bestseller",
      bestseller
    );
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", desc);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // Add api_key using backendUrl as the api_key value
      if (backendUrl) {
        formData.append("api_key", backendUrl);
      }

      // images
      img1 && formData.append("image1", img1);
      img2 && formData.append("image2", img2);
      img3 && formData.append("image3", img3);
      img4 && formData.append("image4", img4);

      // Build URL - add api_key as query parameter using backendUrl
      let url = backendUrl + "/api/product/add";
      if (backendUrl) {
        url =
          backendUrl +
          `/api/product/add?api_key=${encodeURIComponent(backendUrl)}`;
      }

      console.log("url", url);
      console.log("backendUrl", backendUrl);
      console.log("token", token ? "exists" : "missing");
      console.log("formData entries:", Object.fromEntries(formData.entries()));

      const res = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000, // 10 second timeout
      });
      console.log("Response received:", res.data);

      if (res.data.success) {
        toast.success("Product added");
        // Reset form after successful submission
        setName("");
        setDesc("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setSizes([]);
        setBestSeller(false);
        setImg1(false);
        setImg2(false);
        setImg3(false);
        setImg4(false);
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);

      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.data ||
          `Error: ${error.response.status}`;
        console.error("Server error response:", error.response.data);
        toast.error(errorMessage);
      } else if (error.request) {
        // Request made but no response received
        toast.error(
          "No response from server. Please check your connection and backend URL."
        );
      } else {
        // Something else happened
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }

    // setTimeout(() => {
    //   setLoading(false);
    // }, 3000);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col w-full items-start gap-6"
    >
      <div className="flex flex-col gap-2">
        <p className={"label"}>Upload Image</p>

        <div className="flex gap-2">
          <label htmlFor="img1_input">
            <img
              src={img1 ? URL.createObjectURL(img1) : assets.upload_area}
              alt="upload"
              className={`w-20  pointer-events-none`}
            />
            <input
              onChange={(e) => setImg1(e.target.files[0])}
              type="file"
              name="img1"
              id="img1_input"
              className="hidden"
            />
          </label>
          <label htmlFor="img2_input">
            <img
              src={img2 ? URL.createObjectURL(img2) : assets.upload_area}
              alt="upload"
              className={`w-20  pointer-events-none`}
            />
            <input
              onChange={(e) => setImg2(e.target.files[0])}
              type="file"
              name="img2"
              id="img2_input"
              className="hidden"
            />
          </label>
          <label htmlFor="img3_input">
            <img
              src={img3 ? URL.createObjectURL(img3) : assets.upload_area}
              alt="upload"
              className={`w-20  pointer-events-none`}
            />
            <input
              onChange={(e) => setImg3(e.target.files[0])}
              type="file"
              name="img3"
              id="img3_input"
              className="hidden"
            />
          </label>
          <label htmlFor="img4_input">
            <img
              src={img4 ? URL.createObjectURL(img4) : assets.upload_area}
              alt="upload"
              className={`w-20  pointer-events-none`}
            />
            <input
              onChange={(e) => setImg4(e.target.files[0])}
              type="file"
              name="img4"
              id="img4_input"
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <p className={"label"}>Product name*</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Type here"
          required
          className="inputField"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <p className={"label"}>Product description*</p>
        <textarea
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          type="text"
          placeholder="Write content here"
          required
          className="inputField min-h-[42px] lg:max-h-[250px] max-h-[200px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full">
        {/* category */}
        <div className="flex flex-col gap-2">
          <p className="label">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="inputField"
          >
            {CATEGORY.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
            {/* <option value="Women">Women</option>
            <option value="Kids">Kids</option> */}
          </select>
        </div>
        {/* subcategory */}
        <div className="flex flex-col gap-2">
          <p className="label">Product subcategory</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="inputField "
          >
            {SUB_CATEGORY.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}

            {/* // <option value="Topwear">topTear</option>
            // <option value="Bottomwear">Bottomwear</option>
            // <option value="Winterwear">Winterwear</option> */}
          </select>
        </div>

        {/* price */}
        <div value={price} className="flex flex-col gap-2">
          <p className="label nospi">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="Number"
            placeholder="25"
            className="inputField select-none"
            min={0}
          />
        </div>
      </div>

      {/* sizes */}
      <div className="flex flex-col gap-2">
        <p>Product sizes</p>

        <div className="flex gap-3">
          {SIZES.map((s, i) => (
            <p
              role="button"
              key={i}
              className={`px-4 flex justify-center items-center py-1 cursor-pointer border border-gray-300 rounded-full ${
                sizes.includes(s)
                  ? "bg-[#1e1e1e] text-white transform-fill duration-300 ease-linear"
                  : ""
              }`}
              onClick={() => {
                setSizes((prev) =>
                  prev.includes(s)
                    ? prev.filter((item) => item != s)
                    : [...prev, s]
                );
              }}
            >
              {s}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center ">
        <input
          type="checkbox"
          id="bestseller"
          className="accent-[#1e1e1e] w-4 h-4 cursor-pointer"
        />
        <label
          checked={bestseller}
          onChange={() => setBestSeller((prev) => !prev)}
          htmlFor="bestseller"
          className="select-none cursor-pointer"
        >
          Add to bestseller
        </label>
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`bg-[#1e1e1e] text-white rounded-full px-4 py-2  md:w-fit w-full lg:w-48 ${
          loading ? "bg-gray-500" : "cursor-pointer"
        }`}
      >
        {loading ? "ADDING...." : "ADD"}
      </button>
    </form>
  );
};

export default Add;
