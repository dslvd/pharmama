"use client";

import { useState } from "react";

interface Medicine {
  name: string;
  brand: string;
  stock: number;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem?: (item: {
    id: number;
    name: string;
    brand: string;
    quantity: number;
    priceIncluded: boolean;
    noOfItems: number;
  }) => void;
  autoId?: number;
}

const MEDICINES: Medicine[] = [
  { name: "Amoxicillin", brand: "Amoxil", stock: 100 },
  { name: "Ibuprofen", brand: "Advil", stock: 50 },
  { name: "Paracetamol", brand: "Biogesic", stock: 200 },
];

export default function TransactionModal({
  isOpen,
  onClose,
  onAddItem,
  autoId = 1,
}: TransactionModalProps) {
  const [category, setCategory] = useState("Antibiotics");
  const [status, setStatus] = useState("In Stock");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceIncluded, setPriceIncluded] = useState(true);
  const [noOfItems, setNoOfItems] = useState(0);

  if (!isOpen) return null;

  const selectMedicine = (med: Medicine) => {
    setName(med.name);
    setBrand(med.brand);
    setNoOfItems(med.stock);
    setSearch(med.name);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddItem?.({ id: autoId, name, brand, quantity, priceIncluded, noOfItems });
    onClose();
  };

  const filteredMeds = MEDICINES.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FFFDF5] border-2 border-black rounded-xl p-6 w-full max-w-lg space-y-4">
        
        <div className="flex gap-2 text-sm">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-2 border-black p-1 rounded font-bold bg-white"
          >
            <option>Antibiotics</option>
            <option>Analgesics</option>
            <option>Antipyretics</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-2 border-black p-1 rounded font-bold bg-white"
          >
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            className="w-full border-2 border-black p-2 rounded text-sm bg-white"
          />
          {showDropdown && search && (
            <div className="absolute w-full bg-white border-2 border-black mt-1 rounded max-h-32 overflow-y-auto z-10">
              {filteredMeds.map((m) => (
                <div
                  key={m.name}
                  onClick={() => selectMedicine(m)}
                  className="p-2 hover:bg-yellow-100 cursor-pointer text-sm"
                >
                  {m.name} ({m.brand})
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-2 border-black bg-white rounded">
          <div className="grid grid-cols-2 border-b border-black p-2">
            <span className="font-bold">ID</span>
            <span>{autoId}</span>
          </div>

          <div className="grid grid-cols-2 border-b border-black p-2">
            <span className="font-bold">Product Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-black px-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 border-b border-black p-2">
            <span className="font-bold">Brand</span>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="border border-black px-1"
            />
          </div>

          <div className="grid grid-cols-2 border-b border-black p-2">
            <span className="font-bold">Quantity</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border px-2 font-bold bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="border px-2 font-bold bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-black p-2">
            <span className="font-bold">Price</span>
            <button
              type="button"
              onClick={() => setPriceIncluded(!priceIncluded)}
              className={`border px-2 text-xs font-bold w-fit ${
                priceIncluded ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              {priceIncluded ? "TRUE" : "FALSE"}
            </button>
          </div>

          <div className="grid grid-cols-2 border-b border-black p-2">
            <span className="font-bold">No. of Items</span>
            <input
              type="number"
              value={noOfItems}
              onChange={(e) => setNoOfItems(Number(e.target.value))}
              className="border border-black px-1"
            />
          </div>

          <div className="p-2 flex justify-end">
            <button
              type="submit"
              className="bg-emerald-400 border-2 border-black font-bold px-4 py-1 rounded hover:bg-emerald-500"
            >
              Add
            </button>
          </div>
        </form>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-black px-4 py-1 rounded font-bold bg-white hover:bg-gray-100"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}