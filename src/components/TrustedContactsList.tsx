
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTrustedContacts, addTrustedContact, removeTrustedContact, Contact } from "@/services/contactsService";

const TrustedContactsList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load contacts from Supabase on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const loadedContacts = await getTrustedContacts();
        setContacts(loadedContacts);
      } catch (error) {
        console.error("Error loading contacts:", error);
        toast({
          title: "Error",
          description: "Failed to load your trusted contacts.",
          variant: "destructive",
        });
      }
    };
    
    fetchContacts();
  }, [toast]);

  const handleAddContact = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both name and phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newContact = await addTrustedContact(newName, newPhone);
      if (newContact) {
        setContacts([...contacts, newContact]);
        setNewName("");
        setNewPhone("");
        setDialogOpen(false);
        
        toast({
          title: "Contact Added",
          description: `${newName} has been added to your trusted contacts.`,
        });
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveContact = async (id: string | number) => {
    try {
      await removeTrustedContact(id);
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      setContacts(updatedContacts);
      
      toast({
        title: "Contact Removed",
        description: "Contact has been removed from your trusted list.",
      });
    } catch (error) {
      console.error("Error removing contact:", error);
      toast({
        title: "Error",
        description: "Failed to remove contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-purple-600" />
          Trusted Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.length > 0 ? (
          <ul className="space-y-2">
            {contacts.map(contact => (
              <li key={contact.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.phone}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleRemoveContact(contact.id)}
                >
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4 text-gray-500">No trusted contacts added yet</p>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4 w-full" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Trusted Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter contact name" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter phone number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleAddContact}>
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TrustedContactsList;
