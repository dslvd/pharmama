"use client";

import { useState } from "react";
import TransactionTable from "./components/TransactionTable";
import SalesTable from "./components/SalesTable";
import AddTransactionModal, {
  SubmittedItem,
} from "./components/TransactionModal";
import ViewTransactionModal from "./components/ViewTransactionModal";
import { ErrorStack } from "@/components/ErrorCard";
import Loading from "./loading";

export default function TransactionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [items, setItems] = useState<SubmittedItem[]>([]);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [trId, setTrId] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);

  return (
    <>
      <main className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold text-foreground">Transaction</h2>
        </div>

        <div className="space-y-6">
          <TransactionTable
            items={items}
            setItems={setItems}
            onOpenModal={() => setIsAddModalOpen(true)}
            onCancelTransaction={() => setItems([])}
            onError={addError}
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />

          <SalesTable
  refreshKey={refreshKey}
  onError={addError}
  onLoadingChange={setLoading}
  onViewClick={(id) => {
    setTrId(id);
    setIsViewModalOpen(true);
  }}
/>
        </div>

        {isAddModalOpen && (
          <AddTransactionModal
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={(newItems) =>
              setItems((prev) => {
                const merged = [...prev];
                newItems.forEach((entry) => {
                  const idx = merged.findIndex(
                    (m) => m.trItems.productId === entry.trItems.productId,
                  );
                  if (idx >= 0) {
                    merged[idx] = entry;
                  } else {
                    merged.push(entry);
                  }
                });
                return merged;
              })
            }
          />
        )}

        {isViewModalOpen && (
          <ViewTransactionModal
            onClose={() => setIsViewModalOpen(false)}
            transactionId={trId}
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
