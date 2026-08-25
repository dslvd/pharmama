"use client";

import { useCallback, useState } from "react";
import TransactionPanel from "./components/Transactionpanel";
import TransactionTable from "./components/TransactionTable";
import SalesTable from "./components/SalesTable";
import AddTransactionModal, {
  SubmittedItem,
} from "./components/TransactionModal";
import ViewTransactionModal from "./components/ViewTransactionModal";
import { ErrorStack } from "@/components/ErrorCard";
import Loading from "./loading";

export default function TransactionsPage() {
  const [isTransactionStarted, setIsTransactionStarted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [items, setItems] = useState<SubmittedItem[]>([]);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const addError = useCallback(
    (message: string) =>
      setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]),
    [],
  );

  const handleStartTransaction = () => {
    setIsTransactionStarted(true);
    setIsAddModalOpen(true);
  };

  const handleCancelTransaction = () => {
    setIsTransactionStarted(false);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <main className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-foreground">Transaction</h2>
      </div>

      <div className="space-y-6">
        {!isTransactionStarted ? (
          <TransactionPanel onAddTransaction={handleStartTransaction} />
        ) : (
          <TransactionTable
            items={items}
            setItems={setItems}
            onOpenModal={() => setIsAddModalOpen(true)}
            onCancelTransaction={handleCancelTransaction}
            onError={addError}
          />
        )}

        <SalesTable
          onError={addError}
          onLoadingChange={setLoading}
          onViewClick={() => setIsViewModalOpen(true)}
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
        <ViewTransactionModal onClose={() => setIsViewModalOpen(false)} />
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
