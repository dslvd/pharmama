import { Badge } from "@/components/ui/table";
import { TransactionStatus } from "@/lib/types/transaction";
import { titleCase } from "@/lib/utils/format";
import { statusClass } from "@/lib/utils/status";

export default function StatusBadge({ status }: { status: TransactionStatus }) {
  return <Badge className={statusClass(status)}>{titleCase(status)}</Badge>;
}
