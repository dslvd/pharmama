"use client";

import { useState, useEffect } from "react";
import { getTransactionList } from "@/lib/api/transaction";
import { Transaction } from "@/lib/types/transaction";
import TransactionPanel from "./components/Transactionpanel";
import TransactionTable from "./components/TransactionTable";
import SalesTable from "./components/SalesTable";

export default function TransactionsPage() {
  const [showTables, setShowTables] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadTransactions() {
      const result = await getTransactionList();
      if (result.ok) {
        setTransactions(result.value);
      } else {
        console.error(result.error);
      }
    }
    loadTransactions();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-foreground">Transaction</h1>

      {/* Show blank panel with plus button when tables aren't opened */}
      {!showTables ? (
        <TransactionPanel onAddTransaction={() => setShowTables(true)} />
      ) : (
        /* Connected Component View */
        <div className="space-y-6">
          <TransactionTable transactions={transactions} />
          <SalesTable transactions={transactions} />
        </div>
      )}
    </div>
  );
}