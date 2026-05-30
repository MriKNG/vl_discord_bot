const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config.js');

const dbPath = path.join(__dirname, '../../data/warnings.json');

function loadWarnings() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}');
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveWarnings(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    const warnings = loadWarnings();
    if (!warnings[target.id]) warnings[target.id] = [];

    warnings[target.id].push({
      reason,
      moderator: interaction.user.tag,
      date: new Date().toISOString()
    });
    saveWarnings(warnings);

    const count = warnings[target.id].length;

    await target.send({
      embeds: [new EmbedBuilder().setTitle('You have received a warning')
        .setColor(0xFEE75C)
        .addFields(
          { name: 'Server', value: interaction.guild.name },
          { name: 'Reason', value: reason },
          { name: 'Total Warnings', value: `${count}` }
        ).setTimestamp()]
    }).catch(() => {});

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle('Warning Issued')
        .setColor(0xFEE75C)
        .addFields(
          { name: 'User', value: target.user.tag, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Total Warnings', value: `${count}`, inline: true }
        ).setTimestamp()]
    });

    // Auto-ban on max warnings
    if (count >= config.maxWarningsBeforeBan) {
      await target.ban({ reason: `Reached ${count} warnings` });
      await interaction.followUp({ content: `⚠️ ${target.user.tag} has been auto-banned for reaching ${count} warnings.` });
    }
  }
};