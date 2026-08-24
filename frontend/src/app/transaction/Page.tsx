"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import TransactionPanel from "./components/Transactionpanel";
import TransactionTable from "./components/TransactionTable";
import SalesTable from "./components/SalesTable";
import AddTransactionModal from "./components/TransactionModal";
import ViewTransactionModal from "./components/ViewTransactionModal";

export default function TransactionsPage() {
  const [showTable, setShowTable] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleStartTransaction = () => {
    setShowTable(true);
    setIsAddModalOpen(true);
  };

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        {showTable && (
          <button
            onClick={() => setShowTable(false)}
            aria-label="Go Back"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h2 className="text-4xl font-bold text-foreground">Transaction</h2>
      </div>

      {!showTable ? (
        <div className="space-y-6">
          <TransactionPanel onAddTransaction={handleStartTransaction} />
          <SalesTable onViewClick={() => setIsViewModalOpen(true)} />
        </div>
      ) : (
        <div className="space-y-6">
          <TransactionTable onOpenModal={() => setIsAddModalOpen(true)} />
          <SalesTable onViewClick={() => setIsViewModalOpen(true)} />
        </div>
      )}

      {isAddModalOpen && (
        <AddTransactionModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {isViewModalOpen && (
        <ViewTransactionModal onClose={() => setIsViewModalOpen(false)} />
      )}
    </main>
  );
}