const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../config/config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await closeTicket(interaction);
  }
};

async function closeTicket(interaction) {
  const channel = interaction.channel;

  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: 'This command can only be used in a ticket channel.', ephemeral: true });
  }

  const logChannel = interaction.guild.channels.cache.get(config.modLogChannelId);
  if (logChannel) {
    await logChannel.send({
      embeds: [new EmbedBuilder()
        .setTitle('Ticket Closed')
        .setColor(0xED4245)
        .addFields(
          { name: 'Channel', value: channel.name, inline: true },
          { name: 'Closed by', value: interaction.user.tag, inline: true }
        ).setTimestamp()]
    });
  }

  await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
  setTimeout(() => channel.delete().catch(() => {}), 5000);
}

module.exports.closeTicket = closeTicket;