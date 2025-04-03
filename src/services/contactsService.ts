import { supabase } from '@/lib/supabase';
import { TrustedContact } from '@/lib/supabase';

// Get trusted contacts from Supabase
export const getTrustedContacts = async (): Promise<Contact[]> => {
  try {
    console.log('Fetching trusted contacts...');
    const user = await supabase.auth.getUser();
    console.log('Current user:', user.data.user?.id);
    
    if (!user.data.user) {
      console.error('No authenticated user found');
      return [];
    }

    const { data, error } = await supabase
      .from('trusted_contacts')
      .select('*')
      .eq('user_id', user.data.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching trusted contacts:', error);
      throw error;
    }
    
    console.log('Fetched contacts:', data);
    return data.map(contact => ({
      id: contact.id,
      name: contact.name,
      phone: contact.phone
    }));
  } catch (error) {
    console.error('Failed to fetch trusted contacts:', error);
    return [];
  }
};

// Add a new trusted contact
export const addTrustedContact = async (name: string, phone: string): Promise<Contact | null> => {
  try {
    console.log('Adding new contact:', { name, phone });
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    
    console.log('Current user ID:', userId);
    
    if (!userId) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    // First check if contact already exists
    const { data: existingContact, error: checkError } = await supabase
      .from('trusted_contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('phone', phone)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking existing contact:', checkError);
      throw checkError;
    }

    if (existingContact) {
      throw new Error('Contact with this phone number already exists');
    }
    
    const { data, error } = await supabase
      .from('trusted_contacts')
      .insert([
        { 
          name, 
          phone, 
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select('id, name, phone')
      .single();
    
    if (error) {
      console.error('Error adding trusted contact:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('Successfully added contact:', data);
    return {
      id: data.id,
      name: data.name,
      phone: data.phone
    };
  } catch (error: any) {
    console.error('Failed to add trusted contact:', error);
    throw new Error(error.message || 'Failed to add contact. Please try again.');
  }
};

// Remove a trusted contact
export const removeTrustedContact = async (id: string | number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('trusted_contacts')
      .delete()
      .match({ id });
    
    if (error) {
      console.error('Error removing trusted contact:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to remove trusted contact:', error);
    throw error;
  }
};

// Update a trusted contact
export const updateTrustedContact = async (updatedContact: Contact): Promise<void> => {
  try {
    const { error } = await supabase
      .from('trusted_contacts')
      .update({
        name: updatedContact.name,
        phone: updatedContact.phone
      })
      .match({ id: updatedContact.id });
    
    if (error) {
      console.error('Error updating trusted contact:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update trusted contact:', error);
    throw error;
  }
};

// For backward compatibility with the existing code
export interface Contact {
  id: number | string;
  name: string;
  phone: string;
}
