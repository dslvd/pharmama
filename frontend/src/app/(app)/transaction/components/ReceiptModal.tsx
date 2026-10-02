"use client";

import { createPortal } from "react-dom";
import { Printer } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { txnId } from "@/lib/utils/format";
import Receipt, { ReceiptData } from "./Receipt";

interface ReceiptModalProps {
  data: ReceiptData;
  // shown above the title, e.g. "Sale complete"
  eyebrow?: string;
  onClose: () => void;
}

export default function ReceiptModal({
  data,
  eyebrow,
  onClose,
}: ReceiptModalProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title={`Receipt ${txnId(data.id)}`}
      eyebrow={eyebrow}
      size="sm"
      showCloseButton={false}
      className="bg-background"
      contentClassName="flex min-h-0 flex-col gap-4"
    >
      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        <Receipt data={data} />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      {/* print-only copy straight under <body>, so printing doesn't fight
          the dialog's positioning; see .receipt-print in globals.css */}
      {createPortal(
        <div className="receipt-print">
          <Receipt data={data} />
        </div>,
        document.body,
      )}
    </Modal>
  );
}
