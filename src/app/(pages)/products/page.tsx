"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Simple from "../components/simple";

// Define Product Type
interface Product {
  _id: string;
  title: string;  // Product Title
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: 50, // Default to 50 if no price is fetched
    stock: 50, // Default to 50 if no stock is fetched
  });

  // Fetch Products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "product"] | order(_createdAt desc) {
            _id,
            title,
            price,
            stock
          }
        `);
        setProducts(data); // Set products to state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle "Edit" button click
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.title, // Using product title as name
      price: product.price || 50, // Default price if not available
      stock: product.stock || 50, // Default stock if not available
    });
  };

  // Handle form data change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await client
        .patch(selectedProduct._id) // Target the specific product by _id
        .set({
          title: formData.name,
          price: parseFloat(formData.price.toString()), // Ensure price is a number
          stock: parseInt(formData.stock.toString(), 10), // Ensure stock is an integer
        })
        .commit();

      // After successful update, refresh product list
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProduct._id ? { ...product, ...formData } : product
        )
      );

      setSelectedProduct(null); // Close edit form
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="flex max-w-screen-2xl mx-auto">
    <div className="w-64">
    <Simple />
  </div>

    <div className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold">Products Management</h1>
      <p className="text-sm sm:text-base text-gray-600">View, add or edit products in your store.</p>

      {/* Product List */}
      <div className="mt-4 sm:mt-6 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Product List</h2>

        {/* Mobile-Friendly Card Layout */}
        <div className="lg:hidden space-y-4">
          {products.map((product) => (
            <div key={product._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">{product.title}</span>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="text-sm font-medium">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stock</span>
                  <span className="text-sm font-medium">{product.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Layout for Larger Screens */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Product Name</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Stock</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{product.title}</td>
                  <td className="p-2">${product.price}</td>
                  <td className="p-2">{product.stock}</td>
                  <td className="p-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Form */}
      {selectedProduct && (
        <div className="mt-4 sm:mt-6 bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Edit Product</h2>

          {/* Display product title as title below the input */}
          <div className="mb-4">
            <strong>Product Title: </strong>
            <span>{selectedProduct.title}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm sm:text-base text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""} // Prevent null value
                onChange={handleFormChange}
                className="border p-2 w-full text-sm sm:text-base"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm sm:text-base text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price || 50} // Default to 50 if price is not available
                onChange={handleFormChange}
                className="border p-2 w-full text-sm sm:text-base"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm sm:text-base text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock || 50} // Default to 50 if stock is not available
                onChange={handleFormChange}
                className="border p-2 w-full text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded text-sm sm:text-base"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
    </div>

  );
}