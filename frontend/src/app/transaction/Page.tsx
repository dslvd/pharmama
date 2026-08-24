"use client";

import { useState } from "react";
import TransactionPanel from "./components/Transactionpanel";
import TransactionTable from "./components/TransactionTable";
import SalesTable from "./components/SalesTable";
import AddTransactionModal from "./components/TransactionModal";
import ViewTransactionModal from "./components/ViewTransactionModal";

export default function TransactionsPage() {
  const [isTransactionStarted, setIsTransactionStarted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleStartTransaction = () => {
    setIsTransactionStarted(true);
    setIsAddModalOpen(true);
  };

  const handleCancelTransaction = () => {
    setIsTransactionStarted(false);
    setIsAddModalOpen(false);
  };

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold text-foreground">Transaction</h2>
      </div>

      <div className="space-y-6">
        {/* Swaps the top section dynamically */}
        {!isTransactionStarted ? (
          <TransactionPanel onAddTransaction={handleStartTransaction} />
        ) : (
          <TransactionTable 
            onOpenModal={() => setIsAddModalOpen(true)} 
            onCancelTransaction={handleCancelTransaction} 
          />
        )}

        {/* Bottom table remains constant */}
        <SalesTable onViewClick={() => setIsViewModalOpen(true)} />
      </div>

      {isAddModalOpen && (
        <AddTransactionModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {isViewModalOpen && (
        <ViewTransactionModal onClose={() => setIsViewModalOpen(false)} />
      )}
    </main>
  );
}