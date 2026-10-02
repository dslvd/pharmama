"use client";

import { useCallback, useState } from "react";
import TransactionTable from "./components/TransactionTable";
import SalesTable from "./components/SalesTable";
import ProductPicker, { SubmittedItem } from "./components/ProductPicker";
import ReceiptModal from "./components/ReceiptModal";
import {
  ReceiptData,
  receiptFromSale,
  receiptFromTransaction,
} from "./components/Receipt";
import { useAuth } from "@/lib/auth";
import { ErrorStack } from "@/components/ErrorCard";
import Loading from "./loading";

export default function TransactionsPage() {
  const [items, setItems] = useState<SubmittedItem[]>([]);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  // justSold: opened by checkout rather than "View"
  const [receipt, setReceipt] = useState<{
    data: ReceiptData;
    justSold: boolean;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const addError = useCallback(
    (message: string) =>
      setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]),
    [],
  );

  const handleAddItem = (entry: SubmittedItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (m) => m.trItems.stockId === entry.trItems.stockId,
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
      <main className="min-h-screen space-y-6 p-6">
        <h2 className="text-3xl font-bold text-foreground">Transaction</h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProductPicker
            onAddItem={handleAddItem}
            onError={addError}
            cartItems={items}
            refreshKey={refreshKey}
          />
          <TransactionTable
            items={items}
            setItems={setItems}
            onCancelTransaction={() => setItems([])}
            onError={addError}
            onSuccess={(tx, sold) => {
              setRefreshKey((k) => k + 1);
              setReceipt({
                data: receiptFromSale(tx, sold, user?.name ?? "—"),
                justSold: true,
              });
            }}
          />
        </div>

        <SalesTable
          refreshKey={refreshKey}
          onError={addError}
          onLoadingChange={setLoading}
          onViewClick={(tr) =>
            setReceipt({ data: receiptFromTransaction(tr), justSold: false })
          }
        />

        {receipt && (
          <ReceiptModal
            data={receipt.data}
            eyebrow={receipt.justSold ? "Sale complete" : undefined}
            onClose={() => setReceipt(null)}
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
