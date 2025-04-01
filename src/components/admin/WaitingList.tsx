import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type WaitingListStatus = 'new' | 'contacted' | 'accepted' | 'rejected';

function isValidStatus(status: string): status is WaitingListStatus {
  return ['new', 'contacted', 'accepted', 'rejected'].includes(status);
}

interface WaitingListEntry {
  id: string;
  name: string;
  email: string;
  discord_id: string | null;
  qualification: string | null;
  message: string | null;
  status: WaitingListStatus;
  created_at: string;
}

const WaitingList = () => {
  const { toast } = useToast();
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [filteredList, setFilteredList] = useState<WaitingListEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<WaitingListEntry | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadWaitingList = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('waiting_list')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error loading waiting list:', error);
          toast({
            title: "Error",
            description: "Failed to load waiting list data. Please try again.",
            variant: "destructive",
          });
        } else if (data) {
          const typedData: WaitingListEntry[] = data.map(item => ({
            ...item,
            status: isValidStatus(item.status) ? item.status : 'new'
          }));
          
          setWaitingList(typedData);
          setFilteredList(typedData);
        }
      } catch (error) {
        console.error('Error loading waiting list:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWaitingList();
  }, [toast]);
  
  useEffect(() => {
    let filtered = waitingList;
    
    if (searchTerm) {
      filtered = filtered.filter(entry => {
        return (
          entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.discord_id && entry.discord_id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }
    
    setFilteredList(filtered);
  }, [searchTerm, statusFilter, waitingList]);
  
  const handleStatusChange = async (id: string, newStatus: WaitingListStatus) => {
    try {
      const { error } = await supabase
        .from('waiting_list')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      const updatedList = waitingList.map(entry => {
        if (entry.id === id) {
          return { ...entry, status: newStatus };
        }
        return entry;
      });
      
      setWaitingList(updatedList);
      
      if (selectedEntry && selectedEntry.id === id) {
        setSelectedEntry({ ...selectedEntry, status: newStatus });
      }
      
      toast({
        title: "Status updated",
        description: `Entry status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleViewDetails = (entry: WaitingListEntry) => {
    setSelectedEntry(entry);
    setShowDetail(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Contacted</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Discord ID', 'Qualification', 'Status', 'Message'];
    
    const csvRows = [
      headers.join(','),
      ...filteredList.map(entry => {
        const qualification = entry.qualification 
          ? entry.qualification
              .split("-")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : '';
        
        const message = entry.message ? `"${entry.message.replace(/"/g, '""')}"` : '';
        
        return [
          formatDate(entry.created_at),
          entry.name,
          entry.email,
          entry.discord_id || '',
          qualification,
          entry.status,
          message
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `waiting-list-export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search by name, email, or Discord ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <Button variant="outline" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Loading...</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please wait while we fetch the waiting list data.
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No waiting list entries found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {waitingList.length === 0 
              ? "The waiting list is currently empty."
              : "No entries match your current filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Discord ID</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDate(entry.created_at)}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.discord_id || "—"}</TableCell>
                  <TableCell>
                    {entry.qualification ? (
                      entry.qualification
                        .split("-")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                    ) : "—"}
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(entry)}
                      >
                        View
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">Status</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(entry.id, 'new')}>
                            Mark as New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(entry.id, 'contacted')}>
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(entry.id, 'accepted')}>
                            Mark as Accepted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(entry.id, 'rejected')}>
                            Mark as Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Waiting List Entry Details</DialogTitle>
            <DialogDescription>
              Full information for this waiting list entry.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1">{formatDate(selectedEntry.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1">{getStatusBadge(selectedEntry.status)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1">{selectedEntry.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{selectedEntry.email}</p>
              </div>
              
              {selectedEntry.discord_id && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Discord ID</p>
                  <p className="mt-1">{selectedEntry.discord_id}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-500">Interested Qualification</p>
                <p className="mt-1">
                  {selectedEntry.qualification ? (
                    selectedEntry.qualification
                      .split("-")
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                  ) : "None specified"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Message</p>
                <p className="mt-1 whitespace-pre-wrap">{selectedEntry.message || "No message provided"}</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetail(false)}
                >
                  Close
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>Update Status</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      handleStatusChange(selectedEntry.id, 'new');
                    }}>
                      Mark as New
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleStatusChange(selectedEntry.id, 'contacted');
                    }}>
                      Mark as Contacted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleStatusChange(selectedEntry.id, 'accepted');
                    }}>
                      Mark as Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      handleStatusChange(selectedEntry.id, 'rejected');
                    }}>
                      Mark as Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaitingList;
