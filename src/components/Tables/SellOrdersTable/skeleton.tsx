import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function SellOrdersTableSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className,
    )}>
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Sell Orders
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">Phone</TableHead>
            <TableHead>Commodity</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="!text-right">Price</TableHead>
            <TableHead className="!text-right">Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={100}>
                <Skeleton className="h-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
