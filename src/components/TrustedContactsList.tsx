
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2 } from "lucide-react";

// Mock data for trusted contacts
const initialContacts = [
  { id: 1, name: "Mom", phone: "+91 98765 43210" },
  { id: 2, name: "Dad", phone: "+91 98765 43211" },
  { id: 3, name: "Sister", phone: "+91 98765 43212" },
];

const TrustedContactsList = () => {
  const [contacts, setContacts] = useState(initialContacts);

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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4 text-gray-500">No trusted contacts added yet</p>
        )}
        
        <Button variant="outline" className="mt-4 w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrustedContactsList;
