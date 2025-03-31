
// Webhook storage utils
const WEBHOOK_KEY = 'discord_webhook_url';

export const saveWebhookUrl = (url: string): void => {
  localStorage.setItem(WEBHOOK_KEY, url);
};

export const getWebhookUrl = (): string => {
  return localStorage.getItem(WEBHOOK_KEY) || '';
};

export const sendToDiscord = async (data: any, type: 'contact' | 'training'): Promise<boolean> => {
  const webhookUrl = getWebhookUrl();
  
  if (!webhookUrl) {
    console.error('No webhook URL configured');
    return false;
  }

  try {
    // Format the message based on form type
    const content = formatDiscordMessage(data, type);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    console.log(`Successfully sent ${type} form data to Discord`);
    return true;
  } catch (error) {
    console.error('Error sending to Discord:', error);
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
