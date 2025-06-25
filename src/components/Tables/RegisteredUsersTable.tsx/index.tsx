"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getRegisteredUsers } from "../../../lib/routes/fetch";
import { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface User {
  phone_number: string;
  full_name: string;
  id_number: string;
  location: string;
  commodity: string;
  created_at: string;
}

type SortField = 'phone_number' | 'full_name' | 'id_number' | 'location' | 'commodity' | 'created_at';
type SortDirection = 'asc' | 'desc' | null;

export function RegisteredUsersTable({ className }: { className?: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getRegisteredUsers();
      setUsers(response || []);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortUsers = (usersToSort: User[]) => {
    if (!sortField || !sortDirection) return usersToSort;

    return [...usersToSort].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  useEffect(() => {
    const filterAndSortUsers = () => {
      let result = [...users];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(user =>
          (user.full_name?.toLowerCase().includes(term)) ||
          (user.phone_number.includes(term)) ||
          (user.id_number.includes(term)) ||
          (user.location.toLowerCase().includes(term)) ||
          (user.commodity.toLowerCase().includes(term)))
      }

      result = sortUsers(result);
      setFilteredUsers(result);
    };

    filterAndSortUsers();
  }, [users, searchTerm, sortField, sortDirection]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  return (
    <div className={cn(
      "rounded-lg border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2",
      className,
    )}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-dark dark:text-white">Registered Users</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              placeholder="Search users by name, phone, location or commodity..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border border-stroke dark:border-dark-3 overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-dark-3 [&>tr]:hover:bg-transparent">
              <TableRow className="border-b border-stroke dark:border-dark-3">
                <TableHead className="min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('phone_number')}
                  >
                    Phone
                    {getSortIcon('phone_number')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('full_name')}
                  >
                    Name
                    {getSortIcon('full_name')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('id_number')}
                  >
                    ID Number
                    {getSortIcon('id_number')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('location')}
                  >
                    Location
                    {getSortIcon('location')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('commodity')}
                  >
                    Commodity
                    {getSortIcon('commodity')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('created_at')}
                  >
                    Registered
                    {getSortIcon('created_at')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm ? (
                      "No users match your search"
                    ) : (
                      "No users found"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.phone_number}
                    className="border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-3"
                  >
                    <TableCell className="whitespace-nowrap">{user.phone_number}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.full_name}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.id_number}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.location}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.commodity}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
