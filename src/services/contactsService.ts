
import { supabase } from '@/lib/supabase';
import { TrustedContact } from '@/lib/supabase';

// Get trusted contacts from Supabase
export const getTrustedContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching trusted contacts:', error);
    return [];
  }
  
  return data.map(contact => ({
    id: contact.id,
    name: contact.name,
    phone: contact.phone
  }));
};

// Add a new trusted contact
export const addTrustedContact = async (name: string, phone: string): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from('trusted_contacts')
    .insert([
      { name, phone, user_id: supabase.auth.getUser().then(u => u.data.user?.id) }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding trusted contact:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    phone: data.phone
  };
};

// Remove a trusted contact
export const removeTrustedContact = async (id: number | string): Promise<void> => {
  const { error } = await supabase
    .from('trusted_contacts')
    .delete()
    .match({ id });
  
  if (error) {
    console.error('Error removing trusted contact:', error);
  }
};

// Update a trusted contact
export const updateTrustedContact = async (updatedContact: Contact): Promise<void> => {
  const { error } = await supabase
    .from('trusted_contacts')
    .update({
      name: updatedContact.name,
      phone: updatedContact.phone
    })
    .match({ id: updatedContact.id });
  
  if (error) {
    console.error('Error updating trusted contact:', error);
  }
};

// For backward compatibility with the existing code
export interface Contact {
  id: number | string;
  name: string;
  phone: string;
}
