import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Trash2, Upload, Edit } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  imageSrc: string;
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Rob Hastings',
    role: 'Lead Trainer & Founder',
    bio: 'With over 10 years of experience in education technology, Rob specializes in integrating gaming platforms like Roblox into educational settings.',
    email: 'rob@rosch.uk',
    imageSrc: '/assets/rob-hastings.jpg'
  }
];

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
    imageSrc: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Load team members from localStorage
  useEffect(() => {
    const storedMembers = localStorage.getItem('teamMembers');
    if (storedMembers) {
      setTeamMembers(JSON.parse(storedMembers));
    } else {
      setTeamMembers(defaultTeamMembers);
      localStorage.setItem('teamMembers', JSON.stringify(defaultTeamMembers));
    }
  }, []);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveTeamMembers = () => {
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    toast({
      title: "Team members saved",
      description: "Your team member changes have been saved.",
    });
  };
  
  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setImagePreview(member.imageSrc);
  };
  
  const handleUpdateMember = () => {
    if (!editingMember) return;
    
    const updatedTeamMembers = teamMembers.map(member => {
      if (member.id === editingMember.id) {
        // If a new image was uploaded, use it, otherwise keep the original
        const updatedImageSrc = imagePreview && imagePreview !== member.imageSrc 
          ? imagePreview 
          : member.imageSrc;
        
        return {
          ...editingMember,
          imageSrc: updatedImageSrc
        };
      }
      return member;
    });
    
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedTeamMembers));
    
    toast({
      title: "Team member updated",
      description: `${editingMember.name}'s information has been updated.`,
    });
    
    // Reset editing state
    setEditingMember(null);
    setImagePreview(null);
    setImageFile(null);
  };
  
  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      const updatedMembers = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedMembers);
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      
      toast({
        title: "Team member removed",
        description: "The team member has been removed.",
      });
    }
  };
  
  const handleAddMember = () => {
    if (!newMember.name || !newMember.role || !newMember.bio) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Use a default image if none was provided
    const imageSrc = imagePreview || '/assets/default-profile.jpg';
    
    const newTeamMember: TeamMember = {
      id: Date.now().toString(),
      ...newMember,
      imageSrc
    };
    
    const updatedMembers = [...teamMembers, newTeamMember];
    setTeamMembers(updatedMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    
    // Reset form state
    setNewMember({
      name: '',
      role: '',
      bio: '',
      email: '',
      imageSrc: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Team member added",
      description: `${newMember.name} has been added to the team.`,
    });
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
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Team Member</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => (
          <Card key={member.id} className="h-full">
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={member.imageSrc} 
                alt={`${member.name} - ${member.role}`} 
                className="w-full h-full object-cover"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 bg-white"
                onClick={() => handleEditMember(member)}
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
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {teamMembers.length > 0 && (
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveTeamMembers}>
            Save All Changes
          </Button>
        </div>
      )}
      
      {/* Edit Member Dialog */}
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
            <Button variant="outline" onClick={() => setEditingMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Member Dialog */}
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
                    >
                      <Upload className="h-4 w-4 mr-2" /> Choose Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add Team Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
