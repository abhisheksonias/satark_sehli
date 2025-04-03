import { supabase } from '@/lib/supabase';
import { getCurrentLocation } from './locationService';

// Format phone number to E.164 format
const formatPhoneNumber = (phone: string): string => {
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
    // Get current user's trusted contacts
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Get current location directly
    let locationData;
    try {
      const position = await getCurrentLocation();
      locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      locationData = null;
    }

    // Get trusted contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('trusted_contacts')
      .select('phone')
      .eq('user_id', userId);

    if (contactsError) {
      throw new Error('Failed to fetch trusted contacts');
    }

    if (!contacts || contacts.length === 0) {
      throw new Error('No trusted contacts found');
    }

    // Prepare message with location
    const locationLink = locationData 
      ? `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
      : 'Location not available';

    const message = `🚨 EMERGENCY ALERT 🚨\n\nI am in trouble and need immediate help!\n\nMy current location: ${locationLink}\n\nPlease contact emergency services if you cannot reach me.`;

    // Send SMS to each contact individually
    for (const contact of contacts) {
      try {
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
            Body: message,
            To: formattedPhone
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to send SMS to ${formattedPhone}:`, error);
        }
      } catch (error) {
        console.error(`Error sending SMS to ${contact.phone}:`, error);
      }
    }
  } catch (error) {
    console.error('Error sending SOS message:', error);
    throw error;
  }
}; 