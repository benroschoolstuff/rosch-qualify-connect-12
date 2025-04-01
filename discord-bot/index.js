
const { Client, GatewayIntentBits, Events, PermissionFlagsBits } = require('discord.js');

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Configuration
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const AUTHORIZED_SERVER_ID = process.env.DISCORD_GUILD_ID;

// Admin storage
let allowedAdmins = [];

// Load admin list from environment or JSON file
function loadAdminList() {
  try {
    // In a production app, this would load from a database
    // For this example, we'll use a simple in-memory array
    console.log('Admin list loaded');
  } catch (err) {
    console.error('Error loading admin list:', err);
    allowedAdmins = [];
  }
}

// Add admin to allowed list
function addAdmin(discordId) {
  if (!allowedAdmins.includes(discordId)) {
    allowedAdmins.push(discordId);
    // In a production app, this would save to a database
    return true;
  }
  return false;
}

// Remove admin from allowed list
function removeAdmin(discordId) {
  const index = allowedAdmins.indexOf(discordId);
  if (index !== -1) {
    allowedAdmins.splice(index, 1);
    // In a production app, this would save to a database
    return true;
  }
  return false;
}

// Bot ready event
client.once(Events.ClientReady, () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
  loadAdminList();
});

// Message handler
client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;
  
  // Only process commands in the authorized server
  if (message.guild?.id !== AUTHORIZED_SERVER_ID) return;
  
  // Process commands
  if (message.content.startsWith('!addadmin')) {
    // Check if user has admin permissions
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await message.reply('You need Administrator permissions to use this command.');
      return;
    }
    
    const args = message.content.split(' ').slice(1);
    if (args.length < 1) {
      await message.reply('Please provide a Discord user ID to add as admin.');
      return;
    }
    
    const discordId = args[0];
    
    // Add admin
    if (addAdmin(discordId)) {
      await message.reply(`Added <@${discordId}> (${discordId}) to admin list. They can now access the admin panel.`);
    } else {
      await message.reply(`User <@${discordId}> is already an admin.`);
    }
  }
  
  // Remove admin command
  else if (message.content.startsWith('!removeadmin')) {
    // Check if user has admin permissions
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await message.reply('You need Administrator permissions to use this command.');
      return;
    }
    
    const args = message.content.split(' ').slice(1);
    if (args.length < 1) {
      await message.reply('Please provide a Discord user ID to remove from admin list.');
      return;
    }
    
    const discordId = args[0];
    
    // Remove admin
    if (removeAdmin(discordId)) {
      await message.reply(`Removed <@${discordId}> (${discordId}) from admin list.`);
    } else {
      await message.reply(`User <@${discordId}> is not in the admin list.`);
    }
  }
  
  // List admins command
  else if (message.content === '!listadmins') {
    // Check if user has admin permissions
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await message.reply('You need Administrator permissions to use this command.');
      return;
    }
    
    if (allowedAdmins.length === 0) {
      await message.reply('No admins in the list.');
    } else {
      const adminList = allowedAdmins
        .map(id => `<@${id}> (${id})`)
        .join('\n');
      
      await message.reply(`**Admin List:**\n${adminList}`);
    }
  }
  
  // Help command
  else if (message.content === '!adminhelp') {
    await message.reply(`
**Admin Bot Commands:**
\`!addadmin <discord_id>\` - Add a user to the admin list
\`!removeadmin <discord_id>\` - Remove a user from the admin list
\`!listadmins\` - Show all admin users
\`!adminhelp\` - Show this help message
    `);
  }
});

// Log in to Discord
if (!BOT_TOKEN) {
  console.error('DISCORD_BOT_TOKEN environment variable not set');
  process.exit(1);
}

if (!AUTHORIZED_SERVER_ID) {
  console.error('DISCORD_GUILD_ID environment variable not set');
  process.exit(1);
}

client.login(BOT_TOKEN).catch(error => {
  console.error('Failed to log in to Discord:', error);
  process.exit(1);
});
