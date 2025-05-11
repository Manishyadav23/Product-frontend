import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, X, Trash2, Edit } from "lucide-react";
import ListingForm from "./ListingForm";

const ProductDashboard = () => {
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editListing, setEditListing] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/listings");
      setListings(res.data);
      console.log(listings,"listings is ");
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`);
      fetchListings();
      // console.log(listings,"listings after delete");  
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  console.log(listings, "listings after effect");

  const categories = [...new Set(listings.map((l) => l.category))];

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? listing.category === selectedCategory : true;
    const matchesSubcategory = selectedSubcategory ? listing.subcategory === selectedSubcategory : true;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Handling</h1>
        <p className="text-gray-500 mt-1">Manage your product listings</p>
      </div>
      
      {/* Search & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by title..."
            className="border border-gray-300 pl-10 p-2.5 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm transition duration-200 ${
            showForm 
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          onClick={() => {
            setEditListing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? (
            <>
              <X className="h-5 w-5" /> Close Form
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" /> Add Product
            </>
          )}
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-3">Filters</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block font-medium text-gray-700 mb-1.5 text-sm">Category</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value || null);
                setSelectedSubcategory(null);
              }}
              className="border border-gray-300 p-2.5 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- All Categories --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          
          <div className={selectedCategory ? "block" : "hidden"}>
            <label className="block font-medium text-gray-700 mb-1.5 text-sm">Subcategory</label>
            <select
              value={selectedSubcategory || ""}
              onChange={(e) => setSelectedSubcategory(e.target.value || null)}
              className="border border-gray-300 p-2.5 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- All Subcategories --</option>
              {[...new Set(listings.filter((l) => l.category === selectedCategory).map((l) => l.subcategory))].map(
                (sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

        {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                    setEditListing(null);
                    setShowForm(false);
                    }}
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-semibold mb-5 text-gray-800">
                    {editListing ? "Edit Product" : "Add New Product"}
                </h2>

                <ListingForm
                    editData={editListing}
                    onSuccess={() => {
                    fetchListings();
                    setEditListing(null);
                    setShowForm(false);
                    }}
                    onCancelEdit={() => {
                    setEditListing(null);
                    setShowForm(false);
                    }}
                />
                </div>
            </div>
        )}


      {filteredListings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div 
              key={listing._id} 
              className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition duration-300 flex flex-col"
            >
              {listing.images?.length > 0 ? (
 
                // <div className="relative h-56 overflow-hidden">
                //   <img
                //     src={listing.images[0]}
                //     alt={listing.title}
                //     className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                //   />
                //   <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 m-2 px-2 py-1 rounded-md text-xs font-medium">
                //     {listing.category}
                //   </div>
                // </div>
                    <div className="relative h-56 overflow-hidden">
                    <div className="flex h-full overflow-x-auto space-x-2">
                      {listing.images.map((imgUrl, index) => (
                        <img
                          key={index}
                          src={imgUrl}
                          alt={`${listing.title}-${index}`}
                          className="h-full w-auto object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                    <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 m-2 px-2 py-1 rounded-md text-xs font-medium">
                      {listing.category}
                    </div>
                  </div>

              ) : (
                <div className="bg-gray-100 h-56 flex items-center justify-center">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
              
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{listing.title}</h3>
                <div className="flex items-baseline mt-1.5 mb-1">
                  <span className="text-indigo-600 font-bold text-xl">₹{listing.price}</span>
                  <span className="ml-1 text-gray-500 text-sm line-through">{listing.price * 1.2}</span>
                </div>
                <div className="mt-2 space-y-1">
                  {/* <p className="text-gray-500 text-sm">Category: <span className="text-gray-700">{listing.category}</span></p>
                  <p className="text-gray-500 text-sm">Subcategory: <span className="text-gray-700">{listing.subcategory}</span></p> */}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
                <button
                  className="inline-flex items-center px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition duration-200"
                  onClick={() => deleteListing(listing._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md hover:bg-indigo-100 transition duration-200"
                  onClick={() => {
                    setEditListing(listing);
                    setShowForm(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;
