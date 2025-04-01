import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Trash2, Upload, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  image_src: string;
}

const TeamManagement = () => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    bio: '',
    email: '',
    image_src: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error loading team members:', error);
          toast({
            title: "Error",
            description: "Failed to load team members. Please try again.",
            variant: "destructive",
          });
        } else {
          setTeamMembers(data || []);
        }
      } catch (error) {
        console.error('Error loading team members:', error);
      }
    };
    
    loadTeamMembers();
  }, [toast]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setImagePreview(member.image_src);
  };
  
  const handleUpdateMember = async () => {
    if (!editingMember) return;
    setIsLoading(true);
    
    try {
      const updatedImageSrc = imagePreview && imagePreview !== editingMember.image_src 
        ? imagePreview 
        : editingMember.image_src;
      
      const updatedMember = {
        ...editingMember,
        image_src: updatedImageSrc
      };
      
      const { error } = await supabase
        .from('team_members')
        .update({
          name: updatedMember.name,
          role: updatedMember.role,
          bio: updatedMember.bio,
          email: updatedMember.email,
          image_src: updatedMember.image_src,
        })
        .eq('id', updatedMember.id);
      
      if (error) throw error;
      
      setTeamMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === updatedMember.id ? updatedMember : member
        )
      );
      
      toast({
        title: "Team member updated",
        description: `${updatedMember.name}'s information has been updated.`,
      });
      
      setEditingMember(null);
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveMember = async (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setIsLoading(true);
      
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== id));
        
        toast({
          title: "Team member removed",
          description: "The team member has been removed.",
        });
      } catch (error) {
        console.error('Error removing team member:', error);
        toast({
          title: "Error",
          description: "Failed to remove team member. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role || !newMember.bio) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const imageSrc = imagePreview || '/assets/default-profile.jpg';
      
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          name: newMember.name,
          role: newMember.role,
          bio: newMember.bio,
          email: newMember.email || null,
          image_src: imageSrc
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setTeamMembers(prevMembers => [...prevMembers, data]);
      
      setNewMember({
        name: '',
        role: '',
        bio: '',
        email: '',
        image_src: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Team member added",
        description: `${newMember.name} has been added to the team.`,
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: 'edit' | 'new'
  ) => {
    const { name, value } = e.target;
    
    if (type === 'edit' && editingMember) {
      setEditingMember({
        ...editingMember,
        [name]: value
      });
    } else if (type === 'new') {
      setNewMember({
        ...newMember,
        [name]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={isLoading}>
          Add Team Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => (
          <Card key={member.id} className="h-full">
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={member.image_src} 
                alt={`${member.name} - ${member.role}`} 
                className="w-full h-full object-cover"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 bg-white"
                onClick={() => handleEditMember(member)}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <p className="text-sm text-gray-500">{member.role}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 line-clamp-3">{member.bio}</p>
              {member.email && (
                <div className="mt-2">
                  <Label>Email</Label>
                  <p className="text-sm">{member.email}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => handleRemoveMember(member.id)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          
          {editingMember && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={editingMember.name}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input 
                  id="edit-role" 
                  name="role" 
                  value={editingMember.role}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  name="email" 
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Bio</Label>
                <Textarea 
                  id="edit-bio" 
                  name="bio" 
                  rows={4}
                  value={editingMember.bio}
                  onChange={(e) => handleInputChange(e, 'edit')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-image">Profile Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        id="edit-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('edit-image')?.click()}
                        className="w-full"
                        disabled={isLoading}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Choose Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setEditingMember(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateMember}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to display on the website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name *</Label>
              <Input 
                id="add-name" 
                name="name" 
                value={newMember.name}
                onChange={(e) => handleInputChange(e, 'new')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-role">Role *</Label>
              <Input 
                id="add-role" 
                name="role" 
                value={newMember.role}
                onChange={(e) => handleInputChange(e, 'new')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input 
                id="add-email" 
                name="email" 
                type="email"
                value={newMember.email}
                onChange={(e) => handleInputChange(e, 'new')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-bio">Bio *</Label>
              <Textarea 
                id="add-bio" 
                name="bio" 
                rows={4}
                value={newMember.bio}
                onChange={(e) => handleInputChange(e, 'new')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-image">Profile Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="w-20 h-20 rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      id="add-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('add-image')?.click()}
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Choose Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddMember}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Team Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
