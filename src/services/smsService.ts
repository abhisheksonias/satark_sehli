import { supabase } from '@/lib/supabase';
import { getCurrentLocation } from './locationService';

// Format phone number to E.164 format
const formatPhoneNumber = (phone: string): string => {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian phone number (10 digits)
  if (digits.length !== 10) {
    throw new Error('Invalid phone number format');
  }
  
  // Add country code for India
  return `+91${digits}`;
};

// Send SOS message to trusted contacts
export const sendSOSMessage = async (): Promise<void> => {
  try {
    // Get current user
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    // Get trusted contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('trusted_contacts')
      .select('*')
      .eq('user_id', userId);

    if (contactsError) {
      console.error("Error fetching trusted contacts:", contactsError);
      return;
    }

    if (!contacts || contacts.length === 0) {
      console.log("No trusted contacts found");
      return;
    }

    // Send SOS message to each contact
    for (const contact of contacts) {
      try {
        if (!contact.phone) {
          console.error(`Phone number missing for contact: ${contact.trusted_contact_name}`);
          continue;
        }

        const formattedPhone = formatPhoneNumber(contact.phone);
        
        const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + 
          import.meta.env.VITE_TWILIO_ACCOUNT_SID + '/Messages.json', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(
              import.meta.env.VITE_TWILIO_ACCOUNT_SID + ':' + 
              import.meta.env.VITE_TWILIO_AUTH_TOKEN
            ),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
            Body: "HELP ME! I am in trouble. Please check on me.",
            To: formattedPhone
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to send SMS to ${formattedPhone}:`, error);
        } else {
          console.log(`SOS message sent to ${contact.trusted_contact_name} (${formattedPhone})`);
        }
      } catch (error) {
        console.error(`Error sending SOS to ${contact.trusted_contact_name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in sendSOSMessage:", error);
    throw error;
  }
}; 