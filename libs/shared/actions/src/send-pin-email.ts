'use server';

import { auth } from '@clerk/nextjs/server';
import { getGlobalPin, decryptPin, triggerMail } from '@rocket-house-productions/actions/server';


interface SendPinEmailParams {
  email: string;
  firstName: string;
  skipAuth?: boolean;
}

export async function sendPinEmail({ email, firstName, skipAuth = false }: SendPinEmailParams) {
  if (!skipAuth) {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: 'You must be signed in to send emails'
      };
    }
  }


  try {
    const { pinCipher, pinIv, pinAuthTag } = await getGlobalPin({ skipAuth: true });

    if (!pinCipher || !pinIv || !pinAuthTag) {
      throw new Error('No pin found');
    }

    const parentPin = await decryptPin(pinCipher, pinIv, pinAuthTag);

    console.log('Decrypted Parent PIN:', parentPin);

    if (!parentPin) {
      throw new Error('Failed to decrypt pin');
    }

    // Create email message
    const emailMessage = `
      Hi ${firstName || 'Parent'},
      
      We'd like to remind you of your <strong>Parent PIN</strong> that keeps your account secure:
      
      <p></p><strong>Your Parent PIN:</strong></p> 
      
      <h3>${parentPin}</h3>
      
      With this Pin, you can:
      
      <ul>
        <li>Manage your account details</li>
        <li>Make purchases</li>
        <li>Upgrade memberships</li>
      </ul>
      
      👉 Remember to keep this PIN safe and private. It ensures your child can enjoy their lessons while you stay in control of account and payment settings.
      
      Thank you for being part of the Kids Guitar Dojo family!
      
      Warm Regards,
      
      The Kids Guitar Dojo Team🎶
    `;

    const mailData = {
      email: email,
      name: firstName || 'Parent',
      subject: "Here's Your Parent PIN for Easy Access 🎸",
      message: emailMessage,
    };

    const result = await triggerMail({}, mailData, skipAuth = true);

    if (result.errors) {
      console.error('Error sending PIN email:', result.errors);
      return { success: false, error: 'Failed to send email' };
    }

    console.log('PIN email sent successfully to:', email);
    return { success: true, data: result.data };

  } catch (error) {
    console.error('Error in sendPinEmail:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
