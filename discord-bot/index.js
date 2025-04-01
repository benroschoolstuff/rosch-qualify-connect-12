
const { Client, GatewayIntentBits, Events, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Configuration
let BOT_TOKEN = '';
let AUTHORIZED_SERVER_ID = '';

// Config file path - shared between the bot and web app
const configPath = path.join(__dirname, '../config/discord-config.json');

// Admin storage
let allowedAdmins = [];

// Load configuration from file
function loadConfig() {
  try {
    // Check if config directory exists, if not create it
    const configDir = path.join(__dirname, '../config');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Check if config file exists
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      // Set token and guild ID from config file
      BOT_TOKEN = config.botToken || '';
      AUTHORIZED_SERVER_ID = config.guildId || '';
      allowedAdmins = config.allowedAdmins || [];
      
      console.log('Configuration loaded from file');
      console.log(`Server ID: ${AUTHORIZED_SERVER_ID}`);
      console.log(`Admin count: ${allowedAdmins.length}`);
      return true;
    } else {
      console.log('Config file not found. Bot will not start until configured.');
      return false;
    }
  } catch (err) {
    console.error('Error loading configuration:', err);
    return false;
  }
}

// Add admin to allowed list
function addAdmin(discordId) {
  if (!allowedAdmins.includes(discordId)) {
    allowedAdmins.push(discordId);
    saveConfig();
    return true;
  }
  return false;
}

// Remove admin from allowed list
function removeAdmin(discordId) {
  const index = allowedAdmins.indexOf(discordId);
  if (index !== -1) {
    allowedAdmins.splice(index, 1);
    saveConfig();
    return true;
  }
  return false;
}

// Save configuration to file
function saveConfig() {
  try {
    const config = {
      botToken: BOT_TOKEN,
      guildId: AUTHORIZED_SERVER_ID,
      allowedAdmins: allowedAdmins
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Configuration saved to file');
    return true;
  } catch (err) {
    console.error('Error saving configuration:', err);
    return false;
  }
}

// Start the bot with new configuration
function startBot() {
  if (!BOT_TOKEN) {
    console.error('Bot token not configured');
    return false;
  }
  
  client.login(BOT_TOKEN).catch(error => {
    console.error('Failed to log in to Discord:', error);
    return false;
  });
  
  return true;
}

// Check for configuration changes every 30 seconds
setInterval(() => {
  const wasConfigured = BOT_TOKEN && AUTHORIZED_SERVER_ID;
  const configLoaded = loadConfig();
  
  // If config was loaded and bot wasn't previously configured, start the bot
  if (configLoaded && !wasConfigured && BOT_TOKEN && AUTHORIZED_SERVER_ID) {
    console.log('New configuration detected, starting bot...');
    startBot();
  }
}, 30000);

// Bot ready event
client.once(Events.ClientReady, () => {
  console.log(`Bot is ready! Logged in as ${client.user.tag}`);
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

// Initial configuration load
const configLoaded = loadConfig();

// Start the bot if configuration is available
if (configLoaded && BOT_TOKEN && AUTHORIZED_SERVER_ID) {
  console.log('Starting bot with loaded configuration...');
  startBot();
} else {
  console.log('Waiting for configuration...');
}
