module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'An error occurred.', flags: 64 });
      }
    }

    // Rules select menu — open modal if yes, reject if no
    if (interaction.isStringSelectMenu() && interaction.customId === 'rules_confirm') {
      const value = interaction.values[0];

      if (value === 'no') {
        return interaction.update({
          embeds: [{ title: 'Application Cancelled', description: '❌ Please read the server rules before applying.', color: 0xED4245 }],
          components: []
        });
      }

      // User said yes — show the modal
      const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

      const modal = new ModalBuilder()
        .setCustomId('whitelist_app')
        .setTitle('FiveM Whitelist Application');

      const fields = [
        ['age',      'Age (numbers only)',                          TextInputStyle.Short,     '18',              1,  3 ],
        ['playtime', 'FiveM hours played',                         TextInputStyle.Short,     '100',             1,  6 ],
        ['reason',   'Why do you want to join? (min 50 chars)',    TextInputStyle.Paragraph, null,              50, 1000],
        ['rp',       'RP experience (min 30 chars)',               TextInputStyle.Paragraph, null,              30, 1000],
      ];

      modal.addComponents(fields.map(([id, label, style, placeholder, min, max]) => {
        const input = new TextInputBuilder()
          .setCustomId(id)
          .setLabel(label)
          .setStyle(style)
          .setRequired(true)
          .setMinLength(min)
          .setMaxLength(max);
        if (placeholder) input.setPlaceholder(placeholder);
        return new ActionRowBuilder().addComponents(input);
      }));

      await interaction.showModal(modal);
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'handled') {
        return interaction.deferUpdate();
      }

      if (interaction.customId === 'close_ticket') {
        const { closeTicket } = require('../commands/tickets/close.js');
        await closeTicket(interaction);
      }

      if (interaction.customId.startsWith('accept_') || interaction.customId.startsWith('deny_')) {
        try {
          const { handleReview } = require('../commands/applications/review.js');
          await handleReview(interaction);
        } catch (err) {
          console.error('Review error:', err);
        }
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'whitelist_app') {
        try {
          const { handleApplication } = require('../commands/applications/apply.js');
          await handleApplication(interaction);
        } catch (err) {
          console.error('Application error:', err);
        }
      }
    }
  }
};