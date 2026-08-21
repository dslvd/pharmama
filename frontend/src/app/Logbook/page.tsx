import { getAuditList } from "@/lib/api/logbook";
import { AuditAction, AuditEntity, AuditLog } from "@/lib/types/audit-log"
import { SortOrder } from "@/lib/types/product";
import { useEffect, useState } from "react"

export default function LogbookPage() {
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [entity, setEntity] = useState<AuditEntity>("ALL");
  const [action, setAction] = useState<AuditAction>("ALL");
  const [order, setOrder] = useState<SortOrder>("desc");

  useEffect(()=> {
    async function auditLog() {
      const result = await getAuditList({entity, action, order})
      
      if (result.ok) {
        setAudit(result.value)
      } else {
        console.log(result.error)
      }
    }
    auditLog()
  }, [])
  return <div className="p-6">Logbook</div>
}
