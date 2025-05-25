// components/BuyOrdersTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getBuyOrders } from "../fetch";
import { standardFormat } from "@/lib/format-number";

export async function BuyOrdersTable({ className }: { className?: string }) {
  const orders = await getBuyOrders();

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >

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
          {orders.map((order: any) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={order.phone_number + order.created_at}
            >
              <TableCell className="!text-left">{order.phone_number}</TableCell>
              <TableCell>{order.commodity}</TableCell>
              <TableCell>{order.quantity} tonnes</TableCell>
              <TableCell className="!text-right">
                ${standardFormat(order.price)}/tonne
              </TableCell>
              <TableCell className="!text-right">
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
