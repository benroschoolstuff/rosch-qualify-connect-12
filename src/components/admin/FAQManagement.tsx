
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const defaultFAQs: FAQ[] = [
  {
    id: '1',
    question: 'When will applications reopen?',
    answer: 'We expect to begin accepting new applications for our next cohort in the coming months. Join our waiting list to be notified.',
    category: 'Applications'
  },
  {
    id: '2',
    question: 'Do I need prior Roblox experience?',
    answer: 'While some basic familiarity is helpful, our beginner programs include introductory modules for those new to the platform.',
    category: 'Requirements'
  }
];

const FAQManagement = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFaq, setNewFaq] = useState<Omit<FAQ, 'id'>>({
    question: '',
    answer: '',
    category: 'General'
  });
  const [categories, setCategories] = useState<string[]>(['General', 'Applications', 'Requirements']);
  const [newCategory, setNewCategory] = useState('');
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // Load FAQs from localStorage
  useEffect(() => {
    const storedFaqs = localStorage.getItem('faqs');
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    } else {
      setFaqs(defaultFAQs);
      localStorage.setItem('faqs', JSON.stringify(defaultFAQs));
    }
    
    // Load categories
    const storedCategories = localStorage.getItem('faqCategories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      localStorage.setItem('faqCategories', JSON.stringify(categories));
    }
  }, []);
  
  const saveFaqs = (updatedFaqs: FAQ[]) => {
    localStorage.setItem('faqs', JSON.stringify(updatedFaqs));
    setFaqs(updatedFaqs);
  };
  
  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast({
        title: "Missing information",
        description: "Please fill out both question and answer fields.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = Date.now().toString();
    const updatedFaqs = [...faqs, { ...newFaq, id: newId }];
    
    saveFaqs(updatedFaqs);
    
    toast({
      title: "FAQ added",
      description: "Your new FAQ has been added.",
    });
    
    // Reset form
    setNewFaq({
      question: '',
      answer: '',
      category: 'General'
    });
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateFaq = () => {
    if (!editingFaq) return;
    
    const updatedFaqs = faqs.map(faq => 
      faq.id === editingFaq.id ? editingFaq : faq
    );
    
    saveFaqs(updatedFaqs);
    
    toast({
      title: "FAQ updated",
      description: "Your FAQ has been updated.",
    });
    
    setEditingFaq(null);
  };
  
  const handleRemoveFaq = (id: string) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id);
    
    saveFaqs(updatedFaqs);
    
    toast({
      title: "FAQ removed",
      description: "The FAQ has been removed.",
    });
  };
  
  const handleMoveFaq = (id: string, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(faq => faq.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === faqs.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedFaqs = [...faqs];
    
    // Swap items
    [updatedFaqs[currentIndex], updatedFaqs[newIndex]] = 
      [updatedFaqs[newIndex], updatedFaqs[currentIndex]];
    
    saveFaqs(updatedFaqs);
    
    toast({
      title: "FAQ reordered",
      description: `FAQ moved ${direction}.`,
    });
  };
  
  const handleAddCategory = () => {
    if (!newCategory || categories.includes(newCategory)) {
      toast({
        title: "Invalid category",
        description: "Please enter a unique category name.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('faqCategories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Category added",
      description: `The category "${newCategory}" has been added.`,
    });
    
    setNewCategory('');
    setIsCategoryDialogOpen(false);
  };
  
  const handleRemoveCategory = (category: string) => {
    // Check if category is in use
    const inUse = faqs.some(faq => faq.category === category);
    
    if (inUse) {
      toast({
        title: "Category in use",
        description: "This category is used by existing FAQs and cannot be removed.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCategories = categories.filter(c => c !== category);
    setCategories(updatedCategories);
    localStorage.setItem('faqCategories', JSON.stringify(updatedCategories));
    
    toast({
      title: "Category removed",
      description: `The category "${category}" has been removed.`,
    });
  };
  
  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    type: 'edit' | 'new'
  ) => {
    const { name, value } = e.target;
    
    if (type === 'edit' && editingFaq) {
      setEditingFaq({
        ...editingFaq,
        [name]: value
      });
    } else if (type === 'new') {
      setNewFaq({
        ...newFaq,
        [name]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsCategoryDialogOpen(true)}
          >
            Manage Categories
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add New FAQ
          </Button>
        </div>
      </div>
      
      {Object.keys(faqsByCategory).length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <h3 className="text-lg font-medium text-gray-900">No FAQs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first FAQ to get started.
          </p>
          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            Add FAQ
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
            <Card key={category} className="overflow-hidden">
              <CardHeader>
                <h3 className="text-xl font-semibold">{category}</h3>
              </CardHeader>
              <CardContent className="pt-0">
                <Accordion type="multiple" className="w-full">
                  {categoryFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <div className="flex items-center">
                        <AccordionTrigger className="flex-1 hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <div className="flex space-x-1 mr-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveFaq(faq.id, 'up');
                            }}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveFaq(faq.id, 'down');
                            }}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFaq(faq);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFaq(faq.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <AccordionContent>
                        <div className="pt-2 pb-4">{faq.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit FAQ Dialog */}
      <Dialog open={!!editingFaq} onOpenChange={(open) => !open && setEditingFaq(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          
          {editingFaq && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <select 
                  id="edit-category"
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingFaq.category}
                  onChange={(e) => handleInputChange(e, 'edit')}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-question">Question</Label>
                <Input 
                  id="edit-question" 
                  name="question" 
                  value={editingFaq.question}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-answer">Answer</Label>
                <Textarea 
                  id="edit-answer" 
                  name="answer" 
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditingFaq(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFaq}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add FAQ Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
            <DialogDescription>
              Add a new frequently asked question to your website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="add-category">Category</Label>
              <select 
                id="add-category"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newFaq.category}
                onChange={(e) => handleInputChange(e, 'new')}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-question">Question *</Label>
              <Input 
                id="add-question" 
                name="question" 
                value={newFaq.question}
                onChange={(e) => handleInputChange(e, 'new')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-answer">Answer *</Label>
              <Textarea 
                id="add-answer" 
                name="answer" 
                rows={4}
                value={newFaq.answer}
                onChange={(e) => handleInputChange(e, 'new')}
                required
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFaq}>
              Add FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manage Categories Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage FAQ Categories</DialogTitle>
            <DialogDescription>
              Add or remove categories for organizing your FAQs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="divide-y">
                {categories.map(category => (
                  <div 
                    key={category} 
                    className="flex items-center justify-between p-3"
                  >
                    <span>{category}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button onClick={() => setIsCategoryDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQManagement;
