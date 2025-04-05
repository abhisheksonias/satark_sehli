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
  return `whatsapp:+91${digits}`;
};

export const sendSOSMessage = async (): Promise<void> => {
  try {
    // Get current user
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    // Get current location
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

    // Prepare message with location
    const locationLink = locationData 
      ? `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
      : 'Location not available';

    const message = `🚨 *EMERGENCY ALERT* 🚨\n\nI am in trouble and need immediate help!\n\n*My current location:* ${locationLink}\n\nPlease contact emergency services if you cannot reach me.`;

    // Send WhatsApp message to each contact
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
            From: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
            Body: message,
            To: formattedPhone
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to send WhatsApp to ${formattedPhone}:`, error);
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


export const sendLocationTrackingMessage = async (locationData: {
  latitude: number;
  longitude: number;
}) => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    const { data: contacts, error: contactsError } = await supabase
      .from('trusted_contacts')
      .select('*')
      .eq('user_id', userId);

    if (contactsError) {
      console.error("Error fetching contacts:", contactsError);
      return;
    }

    if (!contacts || contacts.length === 0) {
      console.log("No trusted contacts found");
      return;
    }

    const locationLink = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
    const message = `📍 *Location Sharing Enabled*\n\nI've started sharing my live location for safety.\n\nTrack here: ${locationLink}\n\nStay connected.`;

    for (const contact of contacts) {
      try {
        const formattedPhone = formatPhoneNumber(contact.phone);

        const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + 
          import.meta.env.VITE_TWILIO_ACCOUNT_SID + '/Messages.json', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(
              import.meta.env.VITE_TWILIO_ACCOUNT_SID + ':' + 
              import.meta.env.VITE_TWILIO_AUTH_TOKEN + ':' + 
              import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER
            ),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: 'whatsapp:+14155238886',
            Body: message,
            To: formattedPhone
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to send location message to ${formattedPhone}:`, error);
        } else {
          console.log(`Location tracking message sent to ${formattedPhone}`);
        }
      } catch (error) {
        console.error(`Error sending location tracking message:`, error);
      }
    }
  } catch (error) {
    console.error("Error in sendLocationTrackingMessage:", error);
  }
};

export const sendDestinationMessage = async (destination: string) => {
  const message = `📍 *Destination Alert*\n\nI’m heading to: *${destination}*\nI’ll keep you updated on my journey.`;

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
            From: 'whatsapp:+14155238886', // Twilio sandbox number
            Body: message,
            To: formattedPhone
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to send WhatsApp to ${formattedPhone}:`, error);
        } else {
          console.log(`Destination message sent to ${contact.trusted_contact_name} (${formattedPhone})`);
        }
      } catch (error) {
        console.error(`Error sending destination message to ${contact.trusted_contact_name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in sendDestinationMessage:", error);
    throw error;
  }
};
