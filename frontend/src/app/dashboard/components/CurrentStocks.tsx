import { Package } from "lucide-react";
import StatCard from "../StatCard";

export default function CurrentStocks() {
  return (
    <StatCard
      icon={<Package className="h-5 w-5 text-blue-600" />}
      iconClassName="bg-blue-100"
      label="Current Stocks"
      value="—"
    />
  );
}