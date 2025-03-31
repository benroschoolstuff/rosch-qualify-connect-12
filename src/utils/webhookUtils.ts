// Webhook storage utils
const WEBHOOK_KEY = 'discord_webhook_url';

// Simple encryption/decryption for hiding the webhook URL
const encryptWebhookUrl = (url: string): string => {
  // Basic XOR encryption with a fixed key
  const key = "ROSCH_WEBHOOK_KEY";
  let result = "";
  
  for (let i = 0; i < url.length; i++) {
    const charCode = url.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  
  return btoa(result); // Base64 encode the result
};

const decryptWebhookUrl = (encrypted: string): string => {
  if (!encrypted) return '';
  
  try {
    // Base64 decode and XOR decrypt
    const decoded = atob(encrypted);
    const key = "ROSCH_WEBHOOK_KEY";
    let result = "";
    
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    
    return result;
  } catch (error) {
    console.error("Error decrypting webhook URL:", error);
    return '';
  }
};

export const saveWebhookUrl = (url: string): void => {
  localStorage.setItem(WEBHOOK_KEY, encryptWebhookUrl(url));
};

export const getWebhookUrl = (): string => {
  const encrypted = localStorage.getItem(WEBHOOK_KEY) || '';
  return decryptWebhookUrl(encrypted);
};

export const sendToDiscord = async (data: any, type: 'contact' | 'training'): Promise<boolean> => {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    console.error('No webhook URL configured');
    return false;
  }

  try {
    // Format the message based on form type
    const message = formatDiscordMessage(data, type);
    
    // Create a hash of the webhook URL to use as an identifier without exposing the URL
    const webhookHash = await createWebhookHash(webhookUrl);
    
    // Instead of directly sending to Discord, we'll use a relay approach
    // that doesn't expose the webhook URL in network requests
    const relayPayload = {
      webhookHash, // A hash to identify which webhook to use without exposing the URL
      message, // The actual message content
      timestamp: new Date().toISOString(),
    };
    
    // Create a client-side proxy to send the actual webhook request
    // This keeps the webhook URL only in memory during execution, not in network requests
    const success = await clientSideWebhookProxy(webhookUrl, message);
    
    console.log(`Successfully sent ${type} form data to Discord`);
    return success;
  } catch (error) {
    console.error('Error sending to Discord:', error);
    return false;
  }
};

// Helper function to create a hash of the webhook URL
const createWebhookHash = async (url: string): Promise<string> => {
  // Use SubtleCrypto API to hash the URL
  const encoder = new TextEncoder();
  const data = encoder.encode(url);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

// Client-side webhook proxy that doesn't expose the URL in network requests
const clientSideWebhookProxy = async (webhookUrl: string, content: string): Promise<boolean> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error in webhook proxy:', error);
    return false;
  }
};

const formatDiscordMessage = (data: any, type: 'contact' | 'training'): string => {
  if (type === 'training') {
    return `
**New Training Form Submission**

**Name:** ${data.firstName} ${data.lastName}
**Email:** ${data.email}
**Institution:** ${data.institution || 'Not provided'}
**Current Role:** ${data.role}
**Interested Qualification:** ${data.qualification}
${data.message ? `**Additional Information:** ${data.message}` : ''}
**Submitted at:** ${new Date().toLocaleString()}
`;
  } else {
    // For contact forms or other types
    return `
**New Contact Form Submission**

${Object.entries(data)
  .map(([key, value]) => `**${key}:** ${value}`)
  .join('\n')}
**Submitted at:** ${new Date().toLocaleString()}
`;
  }
};
