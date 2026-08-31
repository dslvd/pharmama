"use client";

import { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import SalesTable from "./components/SalesTable";
import ProductPicker, { SubmittedItem } from "./components/ProductPicker";
import ViewTransactionModal from "./components/ViewTransactionModal";
import { ErrorStack } from "@/components/ErrorCard";
import Loading from "./loading";
import { Transaction } from "@/lib/types/transaction";

export default function TransactionsPage() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [items, setItems] = useState<SubmittedItem[]>([]);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [tr, setTr] = useState<Transaction | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);

  const handleAddItem = (entry: SubmittedItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (m) => m.trItems.productId === entry.trItems.productId,
      );
      if (idx >= 0) {
        const merged = [...prev];
        merged[idx] = {
          ...merged[idx],
          trItems: {
            ...merged[idx].trItems,
            quantity: merged[idx].trItems.quantity + entry.trItems.quantity,
          },
        };
        return merged;
      }
      return [...prev, entry];
    });
  };

  return (
    <>
      <main className="min-h-screen space-y-6 bg-[#f5f1e8] p-6">
        <h2 className="text-3xl font-bold text-[#1e1b3a]">Transaction</h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProductPicker onAddItem={handleAddItem} onError={addError} />
          <TransactionTable
            items={items}
            setItems={setItems}
            onCancelTransaction={() => setItems([])}
            onError={addError}
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />
        </div>

        <SalesTable
          refreshKey={refreshKey}
          onError={addError}
          onLoadingChange={setLoading}
          onViewClick={(tr) => {
            setTr(tr);
            setIsViewModalOpen(true);
          }}
        />

        {isViewModalOpen && (
          <ViewTransactionModal
            onClose={() => setIsViewModalOpen(false)}
            transaction={tr}
          />
        )}
        <ErrorStack errors={errors} />
      </main>
      {loading && (
        <div className="pointer-events-auto fixed inset-0 z-40 bg-background">
          <Loading />
        </div>
      )}
    </>
  );
}
