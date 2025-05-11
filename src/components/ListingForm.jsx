import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const ListingForm = ({ editData, onSuccess, onCancelEdit }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (editData) {
      setValue("title", editData.title);
      setValue("price", editData.price);
      setValue("category", editData.category);
      setValue("subcategory", editData.subcategory);
    } else {
      reset(); 
    }
  }, [editData, reset, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    console.log(data)

    if (!editData) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    try {
      let res;
      if (editData) {
        res = await axios.put(
          `https://productformhandling.onrender.com/api/listings/${editData._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post(
          "https://productformhandling.onrender.com/api/listings",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      setResponse(res.data.message);
      reset();
      onSuccess(); 
    } catch (err) {
      console.error(err);
      setResponse(
        err.response?.data?.errors?.[0]?.msg || "Something went wrong."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 shadow-lg rounded-xl bg-white mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {editData ? "Edit Listing" : "Create Listing"}
      </h2>

      {response && <p className="text-center text-green-600 mb-2">{response}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.price && <p className="text-red-500 text-sm">Price is required</p>}
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            {...register("category", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.category && <p className="text-red-500 text-sm">Category is required</p>}
        </div>

        <div>
          <label className="block font-medium">Subcategory</label>
          <input
            type="text"
            {...register("subcategory", { required: true })}
            className="w-full border p-2 rounded"
          />
          {errors.subcategory && <p className="text-red-500 text-sm">Subcategory is required</p>}
        </div>

        {!editData && (
          <div>
            <label className="block font-medium">Upload Images (Max 3)</label>
            <input
              type="file"
              multiple
              {...register("images", { required: !editData })}
              className="w-full"
            />
            {errors.images && (
              <p className="text-red-500 text-sm">At least 1 image is required</p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center gap-2">
          {/* <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            {editData ? "Update" : "Submit"}
          </button> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : editData ? "Update" : "Submit"}
          </button>

          {editData && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
