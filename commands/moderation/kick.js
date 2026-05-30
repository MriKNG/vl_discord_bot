const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });

    await target.send({
      embeds: [new EmbedBuilder().setTitle('You have been kicked')
        .setColor(0xFEE75C).setDescription(`**Server:** ${interaction.guild.name}\n**Reason:** ${reason}`)]
    }).catch(() => {});

    await target.kick(reason);

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle('Member Kicked')
        .setColor(0xFEE75C)
        .addFields(
          { name: 'User', value: target.user.tag, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Moderator', value: interaction.user.tag, inline: true }
        ).setTimestamp()]
    });
  }
};