"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { sendCustomMessage, getRegisteredUsers } from "@/lib/routes/fetch";
import { useState, useEffect, useCallback } from 'react';
import { Select } from "@/components/FormElements/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextAreaGroup } from "../FormElements/InputGroup/text-area";
import { SearchIcon, Loader2, Send, CheckCircle, XCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";


interface User {
  phone_number: string;
  full_name: string;
  id_number: string;
  location: string;
  commodity: string;
  created_at: string;
}

type SortField = 'phone_number' | 'full_name' | 'location' | 'commodity' | 'created_at';
type SortDirection = 'asc' | 'desc' | null;

export default function SendCustomMessage({ className }: { className?: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Message sending state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentMessages, setSentMessages] = useState<Set<string>>(new Set());
  const [failedMessages, setFailedMessages] = useState<Set<string>>(new Set());

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getRegisteredUsers();
      console.log(response);
      setUsers(response || []);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      setIsRefreshing(false);
      window.alert('Failed to load registered users');
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const sortUsers = (usersToSort: User[]) => {
    if (!sortField || !sortDirection) return usersToSort;

    return [...usersToSort].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
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

      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(user =>
          user.full_name.toLowerCase().includes(term) ||
          user.phone_number.includes(term) ||
          user.location.toLowerCase().includes(term) ||
          user.commodity.toLowerCase().includes(term) ||
          user.id_number.includes(term)
        );
      }

      // Apply sorting
      result = sortUsers(result);

      setFilteredUsers(result);
    };

    filterAndSortUsers();
  }, [users, searchTerm, sortField, sortDirection]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const handleUserSelection = (phoneNumber: string, isSelected: boolean) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (isSelected) {
      newSelectedUsers.add(phoneNumber);
    } else {
      newSelectedUsers.delete(phoneNumber);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      // Deselect all
      setSelectedUsers(new Set());
    } else {
      // Select all filtered users
      const allPhoneNumbers = new Set(filteredUsers.map(user => user.phone_number));
      setSelectedUsers(allPhoneNumbers);
    }
  };

  const handleSendMessage = async () => {
    if (selectedUsers.size === 0) {
      window.alert('Please select at least one user');
      return;
    }

    if (!message.trim()) {
      window.alert('Please enter a message');
      return;
    }

    setIsSending(true);
    const newSentMessages = new Set<string>();
    const newFailedMessages = new Set<string>();

    try {
      // Send messages to all selected users
      const promises = Array.from(selectedUsers).map(async (phoneNumber) => {
        try {
          await sendCustomMessage({
            phone_number: phoneNumber,
            message: message.trim()
          });
          newSentMessages.add(phoneNumber);
          return { phoneNumber, success: true };
        } catch (error) {
          console.error(`Failed to send message to ${phoneNumber}:`, error);
          newFailedMessages.add(phoneNumber);
          return { phoneNumber, success: false };
        }
      });

      await Promise.all(promises);

      setSentMessages(prev => new Set([...prev, ...newSentMessages]));
      setFailedMessages(prev => new Set([...prev, ...newFailedMessages]));

      if (newSentMessages.size > 0) {
        window.alert(`Message sent successfully to ${newSentMessages.size} user(s)`);
      }

      if (newFailedMessages.size > 0) {
        window.alert(`Failed to send message to ${newFailedMessages.size} user(s)`);
      }

      // Clear selections and message after sending
      setSelectedUsers(new Set());
      setMessage('');

    } catch (error) {
      console.error('Error sending messages:', error);
      window.alert('Failed to send messages');
    } finally {
      setIsSending(false);
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

  const getMessageStatus = (phoneNumber: string) => {
    if (sentMessages.has(phoneNumber)) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (failedMessages.has(phoneNumber)) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className={cn(
      "rounded-lg border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2",
      className,
    )}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-dark dark:text-white">Send Custom Message</h2>
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

        {/* Message Form */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-3 rounded-lg">
          <div className="mb-4">
            <TextAreaGroup
              label="Message Content"
              placeholder="Enter your custom message here..."
              defaultValue={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedUsers.size > 0 ? (
                <>Selected {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''}</>
              ) : (
                'No users selected'
              )}
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={isSending || selectedUsers.size === 0 || !message.trim()}
              className="flex items-center gap-2"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, phone, location, commodity or ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-md border border-stroke dark:border-dark-3 overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-dark-3 [&>tr]:hover:bg-transparent">
              <TableRow className="border-b border-stroke dark:border-dark-3">
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
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
                <TableHead className="min-w-[120px]">ID Number</TableHead>
                <TableHead className="min-w-[120px]">
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
                <TableHead className="min-w-[120px] text-right">
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
                <TableHead className="min-w-[80px] text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {searchTerm ? (
                      "No users match your search"
                    ) : (
                      "No registered users found"
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.phone_number}
                    className="border-b border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-3"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.phone_number)}
                        onChange={(e) => handleUserSelection(user.phone_number, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{user.phone_number}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.full_name}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.id_number}</TableCell>
                    <TableCell className="whitespace-nowrap">{user.location}</TableCell>
                    <TableCell className="capitalize whitespace-nowrap">{user.commodity.toLowerCase()}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {getMessageStatus(user.phone_number)}
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
