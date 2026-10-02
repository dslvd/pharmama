import { Transaction, TransactionStatus } from "@/lib/types/transaction";
import { formatDate, formatTime, peso, txnId } from "@/lib/utils/format";

export interface ReceiptLine {
  productId: number;
  name: string;
  genericName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ReceiptData {
  id: number;
  createdAt: Date | string;
  cashier: string;
  status: TransactionStatus;
  total: number;
  lines: ReceiptLine[];
}

// a sale can be split across stock batches; show one line per product
function mergeLines(lines: ReceiptLine[]): ReceiptLine[] {
  const byProduct = new Map<number, ReceiptLine>();
  for (const line of lines) {
    const existing = byProduct.get(line.productId);
    if (existing) {
      existing.quantity += line.quantity;
      existing.subtotal += line.subtotal;
    } else {
      byProduct.set(line.productId, { ...line });
    }
  }
  return [...byProduct.values()];
}

// from a saved transaction (sales history "View")
export const receiptFromTransaction = (t: Transaction): ReceiptData => ({
  id: t.id,
  createdAt: t.createdAt,
  cashier: t.user?.name ?? `User #${t.handledBy}`,
  status: t.status,
  total: t.totalAmount,
  lines: mergeLines(
    (t.transactionItems ?? []).map((item) => ({
      productId: item.productId,
      name: item.product?.name ?? `Product #${item.productId}`,
      genericName: item.product?.genericName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
  ),
});

function Divider() {
  return <div className="my-3 border-t border-dashed border-foreground/30" />;
}

function Row({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex justify-between gap-4 ${className}`}>
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export default function Receipt({ data }: { data: ReceiptData }) {
  const units = data.lines.reduce((sum, l) => sum + l.quantity, 0);
  const voided = data.status !== "COMPLETED";

  return (
    <div
      className="receipt-paper relative mx-auto w-full max-w-[20rem] bg-card px-5 pb-8 pt-6 font-mono text-xs leading-relaxed text-foreground shadow-md"
    >
      {voided && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -rotate-12 rounded-md border-4 border-danger/60 px-3 py-1 text-2xl font-extrabold tracking-widest text-danger/60"
        >
          {data.status}
        </div>
      )}

      <header className="text-center">
        <p className="text-base font-bold tracking-wide">PharMaMa</p>
        <p className="text-muted-foreground">Iloilo Branch</p>
        <p className="mt-2 font-semibold tracking-[0.2em]">SALES RECEIPT</p>
      </header>

      <Divider />

      <Row label="Txn" value={txnId(data.id)} />
      <Row label="Date" value={formatDate(data.createdAt)} />
      <Row label="Time" value={formatTime(data.createdAt)} />
      <Row label="Cashier" value={data.cashier} />

      <Divider />

      <ul className="space-y-2">
        {data.lines.map((line) => (
          <li key={line.productId}>
            <p className="font-semibold">{line.name}</p>
            {line.genericName && (
              <p className="text-muted-foreground">{line.genericName}</p>
            )}
            <Row
              label={`${line.quantity} x ${peso(line.unitPrice)}`}
              value={peso(line.subtotal)}
              className="tabular-nums"
            />
          </li>
        ))}
      </ul>

      <Divider />

      <Row
        label={`${units} ${units === 1 ? "item" : "items"}`}
        value=""
        className="text-muted-foreground"
      />
      <Row
        label="TOTAL"
        value={peso(data.total)}
        className="mt-1 text-sm font-bold tabular-nums"
      />
      {voided && (
        <Row
          label="Status"
          value={data.status}
          className="mt-1 font-semibold text-danger"
        />
      )}

      <Divider />

      <footer className="text-center text-muted-foreground">
        <p>Thank you and get well soon!</p>
        <p className="mt-1 text-[10px]">This is not an official receipt.</p>
      </footer>
    </div>
  );
}
