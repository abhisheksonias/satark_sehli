
// Contacts service to handle trusted contacts functionality

export interface Contact {
  id: number;
  name: string;
  phone: string;
}

// Get trusted contacts from localStorage
export const getTrustedContacts = (): Contact[] => {
  const contacts = localStorage.getItem("saheliTrustedContacts");
  return contacts ? JSON.parse(contacts) : [];
};

// Save trusted contacts to localStorage
export const saveTrustedContacts = (contacts: Contact[]): void => {
  localStorage.setItem("saheliTrustedContacts", JSON.stringify(contacts));
};

// Add a new trusted contact
export const addTrustedContact = (name: string, phone: string): Contact => {
  const contacts = getTrustedContacts();
  const newContact: Contact = {
    id: Date.now(), // Simple way to generate unique ID
    name,
    phone,
  };
  
  saveTrustedContacts([...contacts, newContact]);
  return newContact;
};

// Remove a trusted contact
export const removeTrustedContact = (id: number): void => {
  const contacts = getTrustedContacts();
  const updatedContacts = contacts.filter(contact => contact.id !== id);
  saveTrustedContacts(updatedContacts);
};

// Update a trusted contact
export const updateTrustedContact = (updatedContact: Contact): void => {
  const contacts = getTrustedContacts();
  const updatedContacts = contacts.map(contact => 
    contact.id === updatedContact.id ? updatedContact : contact
  );
  saveTrustedContacts(updatedContacts);
};
