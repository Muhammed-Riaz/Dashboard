"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Simple from "../components/simple";

// Define Product Type for Inventory
interface Product {
  _id: string;
  title: string;
  stock: number;
  reorderLevel: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    stock: 0,
    reorderLevel: 0,
  });

  // Fetch Product Data from Sanity
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "product"] | order(_createdAt desc) {
            _id,
            title,
            stock,
            reorderLevel
          }
        `);
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      stock: product.stock,
      reorderLevel: product.reorderLevel,
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await client
        .patch(selectedProduct._id)
        .set({
          stock: parseInt(formData.stock.toString(), 10),
          reorderLevel: parseInt(formData.reorderLevel.toString(), 10),
        })
        .commit();

      setInventory((prevInventory) =>
        prevInventory.map((product) =>
          product._id === selectedProduct._id
            ? { ...product, ...formData }
            : product
        )
      );

      setSelectedProduct(null);
      alert("Inventory updated successfully!");
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  return (
    <div className="flex max-w-screen-2xl mx-auto">
    <div className="w-64">
    <Simple />
  </div>
    <div className="p-6 flex-1 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Inventory Management</h1>
      <p className="text-gray-600">Monitor your product stock and inventory levels.</p>

      {/* Responsive Layout */}
      <div className="mt-6 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Inventory Levels</h2>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          {inventory.map((product) => (
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
                  <span className="text-sm text-gray-600">Stock</span>
                  <span className="text-sm font-medium">{product.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reorder Level</span>
                  <span className="text-sm font-medium">{product.reorderLevel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table View for Large Screens */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Product Name</th>
                <th className="text-left p-2">Stock</th>
                <th className="text-left p-2">Reorder Level</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{product.title}</td>
                  <td className="p-2">{product.stock}</td>
                  <td className="p-2">{product.reorderLevel}</td>
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

      {/* Edit Inventory Form */}
      {selectedProduct && (
        <div className="mt-6 bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Edit Inventory</h2>
          <div className="mb-4">
            <strong>Product Title: </strong>
            <span>{selectedProduct.title}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock || 0}
                onChange={handleFormChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Reorder Level</label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel || 0}
                onChange={handleFormChange}
                className="border p-2 w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
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
