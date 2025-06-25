"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getBuyOrders, updateOrderStatus, deleteOrder } from "../../../lib/routes/fetch";
import { standardFormat } from "@/lib/format-number";
import { useState, useEffect, useCallback } from 'react';
import { Select } from "@/components/FormElements/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface Order {
  orderId: number;
  user_id: number;
  phone_number: string;
  full_name?: string;
  commodity: string;
  quantity: number;
  price: number;
  created_at: string;
  status: 'PENDING' | 'MATCHED' | 'CANCELLED' | 'COMPLETED';
}

type SortField = 'orderId' | 'full_name' | 'commodity' | 'quantity' | 'price' | 'created_at' | 'status';
type SortDirection = 'asc' | 'desc' | null;

const statusOptions = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Matched", value: "MATCHED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Completed", value: "COMPLETED" },
];

export function BuyOrdersTable({ className }: { className?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await getBuyOrders();
      setOrders(response || []);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking the same field, cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      // If clicking a new field, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortOrders = (ordersToSort: Order[]) => {
    if (!sortField || !sortDirection) return ordersToSort;

    return [...ordersToSort].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'full_name') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
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
    const filterAndSortOrders = () => {
      let result = [...orders];

      // Apply status filter
      if (statusFilter && statusFilter !== 'ALL') {
        result = result.filter(order => order.status === statusFilter);
      }

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(order =>
          (order.full_name?.toLowerCase().includes(term)) ||
          (order.phone_number.includes(term)) ||
          (order.commodity.toLowerCase().includes(term)) ||
          (order.orderId.toString().includes(term)) ||
          (order.created_at.toString().includes(term))
        );
      }

      // Apply sorting
      result = sortOrders(result);

      setFilteredOrders(result);
    };

    filterAndSortOrders();
  }, [orders, statusFilter, searchTerm, sortField, sortDirection]);

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      await updateOrderStatus('buy', orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (orderId: number) => {
    try {
      await deleteOrder('buy', orderId);
      setOrders(prev => prev.filter(order => order.orderId !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const handleStatusFilterChange = (value: string) => {
    console.log('Status filter changed to:', value); // Debug log
    setStatusFilter(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'MATCHED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
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
          <h2 className="text-xl font-semibold text-dark dark:text-white">Buy Orders</h2>
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
              placeholder="Search orders by name, phone, commodity or ID..."
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
                <TableHead className="w-[80px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('orderId')}
                  >
                    ID
                    {getSortIcon('orderId')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px]">
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
                <TableHead className="min-w-[120px]">Phone</TableHead>
                <TableHead className="min-w-[120px]">
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
                <TableHead className="min-w-[100px] text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('quantity')}
                  >
                    Quantity
                    {getSortIcon('quantity')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px] text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('price')}
                  >
                    Price
                    {getSortIcon('price')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px] text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('created_at')}
                  >
                    Created
                    {getSortIcon('created_at')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px] text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {getSortIcon('status')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-[200px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading orders...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    {searchTerm || statusFilter !== 'ALL' ? (
                      "No orders match your filters"
                    ) : (
                      "No orders found"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    className="border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-3"
                  >
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell className="whitespace-nowrap">{order.full_name || 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{order.phone_number}</TableCell>
                    <TableCell className="capitalize whitespace-nowrap">{order.commodity.toLowerCase()}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">{order.quantity} t</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      ${standardFormat(order.price)}/t
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">{order.created_at}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500 text-green-500 hover:bg-green-500/10"
                              onClick={() => handleStatusChange(order.orderId, 'MATCHED')}
                            >
                              Match
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
                              onClick={() => handleStatusChange(order.orderId, 'CANCELLED')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(order.orderId)}
                        >
                          Delete
                        </Button>
                      </div>
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
