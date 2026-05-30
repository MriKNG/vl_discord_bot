# Velorian Discord Bot

A custom Discord moderation and whitelist management bot built with Discord.js v14

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-22%2B-green)
![License](https://img.shields.io/badge/license-VELORIAN--NC-red)

## Project Status
This project is currently in active development.

Features, commands, and configuration options are subject to change between releases.

## Security Note
Never commit your `.env` file or Discord bot token.

If your token is exposed, immediately regenerate it through the [Discord Developer Portal](https://discord.com/developers/home).

## Features
- Moderation commands
- Warning system with auto-ban
- Application system
- Ticket system
- Staff review tools
- Slash commands

## License
This project is licensed under the VELORIAN Non-commercial License v1.0.

You may:
- Use the bot
- Modify the bot
- Share modified versions

You may not:
- Sell the bot
- Sell modified versions
- Offer paid hosting using the bot
- Include the bot in commercial products

See the LICENSE file for full details.

## Requirements
- Node.js 22+
- Discord Bot Application via [Discord Developer Portal](https://discord.com/developers/home)
- Discord.js v14

## Installation
### Clone the repository
```bash
git clone https://github.com/MriKNG/vl_discord_bot.git
cd vl_discord_bot
```

### Install dependencies
```bash
npm install
```

### Environment setup
#### Environment variables
Create a `.env` file:

```env
TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
```
#### Configuration setup
```text
config/config.js
```

```js
whitelistRoleId: 'ROLE_ID_HERE',
applicationChannelId: 'CHANNEL_ID_HERE',
modLogChannelId: 'CHANNEL_ID_HERE',
staffRoleId: 'ROLE_ID_HERE',
ticketCategoryId: 'CATEGORY_ID_HERE',
maxWarningsBeforeBan: 3,
```

#### Deploy commands
```bash
npm run deploy
```

#### Start bot
```bash
npm start
```

### Available Features (v1.0.0)
#### Moderation
- `/warn` - Warn a user, automatic ban after configured max warnings
- `/kick` - Kick a user from the Discord server
- `/ban` - Ban a user from the Discord server

#### Applications
- `/apply` - Submit an application, questions can be adjusted in apply.js
- Application answer will automatically be sent to your configured channel
- Staff can review, accept and deny applications

#### Tickets
- `/ticket` - Open a support ticket
- `/close` - Close a support ticket
- Automatic staff access

### Disclaimer
This project is provided as-is without warranty or support.

The author reserves the right to issue commercial licenses separately.
