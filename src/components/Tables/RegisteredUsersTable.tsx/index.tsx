// components/RegisteredUsersTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getRegisteredUsers } from "../fetch";

export async function RegisteredUsersTable({ className }: { className?: string }) {
  const users = await getRegisteredUsers();

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
            <TableHead>Name</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Commodity</TableHead>
            <TableHead className="!text-right">Registered</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user: any) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={user.phone_number}
            >
              <TableCell className="!text-left">{user.phone_number}</TableCell>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.id_number}</TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.commodity}</TableCell>
              <TableCell className="!text-right">
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
