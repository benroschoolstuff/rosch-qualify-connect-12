
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface WaitingListEntry {
  id: string;
  name: string;
  email: string;
  discordId: string;
  qualification: string;
  status: 'new' | 'contacted' | 'accepted' | 'rejected';
}

const BulkEmail = () => {
  const { toast } = useToast();
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAll, setSelectedAll] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Load waiting list from localStorage
  useEffect(() => {
    const storedList = localStorage.getItem('waitingList');
    if (storedList) {
      const parsedList = JSON.parse(storedList) as WaitingListEntry[];
      setWaitingList(parsedList);
    }
  }, []);
  
  // Filter waiting list based on status
  const filteredList = statusFilter === 'all' 
    ? waitingList 
    : waitingList.filter(entry => entry.status === statusFilter);
  
  // Handle select all checkbox
  useEffect(() => {
    if (selectedAll) {
      setSelectedEntries(filteredList.map(entry => entry.id));
    } else if (selectedEntries.length === filteredList.length) {
      setSelectedEntries([]);
    }
  }, [selectedAll]);
  
  // Check if all entries are selected
  useEffect(() => {
    setSelectedAll(selectedEntries.length === filteredList.length && filteredList.length > 0);
  }, [selectedEntries, filteredList]);
  
  const handleSelectEntry = (id: string) => {
    if (selectedEntries.includes(id)) {
      setSelectedEntries(selectedEntries.filter(entryId => entryId !== id));
    } else {
      setSelectedEntries([...selectedEntries, id]);
    }
  };
  
  const handleSelectAll = () => {
    setSelectedAll(!selectedAll);
  };
  
  const handleSendEmails = async () => {
    if (!emailSubject || !emailContent) {
      toast({
        title: "Missing information",
        description: "Please enter both a subject and content for your email.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedEntries.length === 0) {
      toast({
        title: "No recipients selected",
        description: "Please select at least one recipient from the waiting list.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Get selected entries
      const recipients = waitingList.filter(entry => selectedEntries.includes(entry.id));
      
      // This is a mock implementation since we can't actually send emails from the frontend
      // In a real implementation, this would call a backend API to send emails
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update status for all selected entries to "contacted"
      const updatedList = waitingList.map(entry => {
        if (selectedEntries.includes(entry.id)) {
          return { ...entry, status: 'contacted' as const };
        }
        return entry;
      });
      
      // Update local storage
      localStorage.setItem('waitingList', JSON.stringify(updatedList));
      setWaitingList(updatedList);
      
      // Reset form
      setEmailSubject('');
      setEmailContent('');
      setSelectedEntries([]);
      
      toast({
        title: "Emails sent successfully",
        description: `${recipients.length} emails have been sent to waiting list entries.`,
      });
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: "Failed to send emails",
        description: "There was an error sending the emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Compose Email Campaign</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              placeholder="Compose your email message..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={8}
              className="resize-y"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use {"{name}"} to personalize the email with the recipient's name.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Select Recipients</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {filteredList.length === 0 ? (
          <div className="text-center py-8 border rounded-md bg-gray-50">
            <p className="text-gray-500">No recipients match your current filter.</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedAll}
                        onCheckedChange={handleSelectAll}
                        id="select-all"
                      />
                      <Label htmlFor="select-all" className="ml-2">Select All</Label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredList.map((entry) => (
                  <tr key={entry.id} className={selectedEntries.includes(entry.id) ? "bg-blue-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedEntries.includes(entry.id)}
                        onCheckedChange={() => handleSelectEntry(entry.id)}
                        id={`select-${entry.id}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${entry.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            entry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : 
                            entry.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}
                      >
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedEntries.length} of {filteredList.length} recipients selected
          </div>
          
          <Button 
            onClick={handleSendEmails} 
            disabled={selectedEntries.length === 0 || !emailSubject || !emailContent || isSending}
          >
            {isSending ? 'Sending...' : 'Send Email Campaign'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkEmail;
