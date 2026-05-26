require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
  StringSelectMenuBuilder,
  SlashCommandBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

const CANAL_FUNCIONAL = "1484826121697628221";
const sessoes = new Map();

const hierarquias = {
  "coronel": { nome: "Coronel PM", insignia: "[✵✵✵]", cargo: "1484825756331937812" },
  "tenente_coronel": { nome: "Tenente-Coronel PM", insignia: "[✵✵✧]", cargo: "1484825757271330937" },
  "major": { nome: "Major PM", insignia: "[✵✧✧]", cargo: "1484825757988552846" },
  "capitao": { nome: "Capitão PM", insignia: "[✧✧✧]", cargo: "1484825760471449641" },
  "1tenente": { nome: "1º Tenente PM", insignia: "[✧✧]", cargo: "1484825762258227351" },
  "2tenente": { nome: "2º Tenente PM", insignia: "[✧]", cargo: "1484825762996551801" },
  "aspirante": { nome: "Aspirante a Oficial PM", insignia: "[✯]", cargo: "1484825765143908422" },
  "subtenente": { nome: "Subtenente PM", insignia: "[△]", cargo: "1484825768050823198" },
  "1sgt": { nome: "1º Sargento PM", insignia: "[❯❯ ❯❯❯]", cargo: "1484825769149730857" },
  "2sgt": { nome: "2º Sargento PM", insignia: "[❯ ❯❯❯]", cargo: "1484825770055569468" },
  "3sgt": { nome: "3º Sargento PM", insignia: "[❯❯❯]", cargo: "1484825771552935946" },
  "cabo": { nome: "Cabo PM", insignia: "[❯❯]", cargo: "1484825775621279845" },
  "sd1": { nome: "Soldado 1ª Classe PM", insignia: "[❯]", cargo: "1484825776745480222" },
  "sd2": { nome: "Soldado 2ª Classe PM", insignia: "[•❯]", cargo: "1484825777605316640" }
};

const unidades = {
  "qcg": { nome: "QCG", cargo: "1484825747242618881" },
  "cpa": { nome: "CPA", cargo: "1484825817539280896" },
  "cpchoque": { nome: "CPCHOQUE", cargo: "1484825818566885516" },
  "22bpm": { nome: "22°BPM", cargo: "1484825819191709747" },
  "baep": { nome: "BAEP", cargo: "1484825824895959060" },
  "caep": { nome: "CAEP", cargo: "1484825825944797235" },
  "rota": { nome: "ROTA", cargo: "1484825827018543115" },
  "anchieta": { nome: "ANCHIETA", cargo: "1484825827974582333" },
  "humaita": { nome: "HUMAITÁ", cargo: "1484825828809506866" },
  "coe": { nome: "COE", cargo: "1484825830747013151" },
  "gate": { nome: "GATE", cargo: "1484825831552581757" }
};

const cursos = {
  "sat_a": { nome: "SAT A", cargo: "1484825923760033843" },
  "sat_b": { nome: "SAT B", cargo: "1484825924624056340" },
  "pop": { nome: "POP", cargo: "1484825926570217472" },
  "modulacao": { nome: "Modulação", cargo: "1484825927535038506" },
  "abordagem": { nome: "ABORDAGEM", cargo: "1484825925446140053" },
  "tat_1": { nome: "TAT 1", cargo: "1484825928885604474" },
  "tat_2": { nome: "TAT 2", cargo: "1484825929808347157" },
  "tat_3": { nome: "TAT 3", cargo: "1484825930940551189" },
  "copom": { nome: "OPERADOR COPOM", cargo: "1484825922463862795" }
};

client.once("ready", async () => {
  console.log(`✅ Bot online como ${client.user.tag}`);

  await client.application.commands.set([
    new SlashCommandBuilder()
      .setName("painel-funcional")
      .setDescription("Envia o painel de solicitação de funcional.")
      .toJSON()
  ]);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === "painel-funcional") {
      const embed = new EmbedBuilder()
        .setTitle("🪪 Solicitação de Funcional")
        .setDescription(
          "Bem-vindo ao setor de identificação funcional da **PMESP | SSP Litoral Paulista**.\n\n" +
          "Clique no botão abaixo para solicitar sua funcional.\n\n" +
          "📌 O sistema solicitará:\n" +
          "• Nome completo do personagem\n" +
          "• RG/Passaporte\n" +
          "• Hierarquia\n" +
          "• Unidade/Batalhão\n" +
          "• Cursos\n\n" +
          "⚠️ Solicitações incorretas poderão ser revisadas pela equipe de RH."
        )
        .setColor("#87CEEB")
        .setFooter({ text: "SSP Litoral Paulista • P1 Recursos Humanos" });

      const botao = new ButtonBuilder()
        .setCustomId("abrir_funcional")
        .setLabel("Solicitar Funcional")
        .setEmoji("🪪")
        .setStyle(ButtonStyle.Primary);

      await interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(botao)]
      });
    }

    if (interaction.isButton() && interaction.customId === "abrir_funcional") {
      const modal = new ModalBuilder()
        .setCustomId("modal_funcional")
        .setTitle("Solicitação de Funcional");

      const nomeInput = new TextInputBuilder()
        .setCustomId("nome")
        .setLabel("Nome completo do personagem")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const rgInput = new TextInputBuilder()
        .setCustomId("rg")
        .setLabel("RG/Passaporte")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nomeInput),
        new ActionRowBuilder().addComponents(rgInput)
      );

      await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === "modal_funcional") {
      const nome = interaction.fields.getTextInputValue("nome");
      const rg = interaction.fields.getTextInputValue("rg");

      sessoes.set(interaction.user.id, { nome, rg });

      const menuPatente = new StringSelectMenuBuilder()
        .setCustomId("selecionar_patente")
        .setPlaceholder("Selecione sua hierarquia")
        .addOptions(
          Object.entries(hierarquias).map(([value, item]) => ({
            label: item.nome,
            value
          }))
        );

      await interaction.reply({
        content: "🎖️ Agora selecione sua **hierarquia**:",
        components: [new ActionRowBuilder().addComponents(menuPatente)],
        ephemeral: true
      });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "selecionar_patente") {
      const sessao = sessoes.get(interaction.user.id);
      sessao.patente = interaction.values[0];
      sessoes.set(interaction.user.id, sessao);

      const menuUnidade = new StringSelectMenuBuilder()
        .setCustomId("selecionar_unidade")
        .setPlaceholder("Selecione sua unidade")
        .addOptions(
          Object.entries(unidades).map(([value, item]) => ({
            label: item.nome,
            value
          }))
        );

      await interaction.update({
        content: "🏢 Agora selecione sua **unidade/batalhão**:",
        components: [new ActionRowBuilder().addComponents(menuUnidade)]
      });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "selecionar_unidade") {
      const sessao = sessoes.get(interaction.user.id);
      sessao.unidade = interaction.values[0];
      sessoes.set(interaction.user.id, sessao);

      const menuCursos = new StringSelectMenuBuilder()
        .setCustomId("selecionar_cursos")
        .setPlaceholder("Selecione seus cursos")
        .setMinValues(0)
        .setMaxValues(Object.keys(cursos).length)
        .addOptions(
          Object.entries(cursos).map(([value, item]) => ({
            label: item.nome,
            value
          }))
        );

      await interaction.update({
        content: "📚 Agora selecione seus **cursos**. Se não tiver curso, apenas envie sem selecionar.",
        components: [new ActionRowBuilder().addComponents(menuCursos)]
      });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "selecionar_cursos") {
      const sessao = sessoes.get(interaction.user.id);
      sessao.cursos = interaction.values;

      const membro = interaction.member;
      const patente = hierarquias[sessao.patente];
      const unidade = unidades[sessao.unidade];

      const todosCargosHierarquia = Object.values(hierarquias).map(x => x.cargo);
      const todosCargosUnidade = Object.values(unidades).map(x => x.cargo);

      await membro.roles.remove(todosCargosHierarquia).catch(() => {});
      await membro.roles.remove(todosCargosUnidade).catch(() => {});

      await membro.roles.add(patente.cargo).catch(() => {});
      await membro.roles.add(unidade.cargo).catch(() => {});

      for (const cursoSelecionado of sessao.cursos) {
        await membro.roles.add(cursos[cursoSelecionado].cargo).catch(() => {});
      }

      const novoNick = `${patente.insignia} ${sessao.nome} | ${unidade.nome}`;
      await membro.setNickname(novoNick).catch(() => {});

      const cursosTexto = sessao.cursos.length
        ? sessao.cursos.map(c => cursos[c].nome).join(", ")
        : "Nenhum curso informado";

      const embed = new EmbedBuilder()
        .setTitle("🪪 Funcional Emitida")
        .setColor("#87CEEB")
        .addFields(
          { name: "👮 Nome", value: sessao.nome, inline: true },
          { name: "🆔 RG", value: sessao.rg, inline: true },
          { name: "🎖️ Hierarquia", value: patente.nome, inline: true },
          { name: "🏢 Unidade", value: unidade.nome, inline: true },
          { name: "📚 Cursos", value: cursosTexto },
          { name: "🏷️ Novo nickname", value: novoNick }
        )
        .setFooter({ text: "SSP Litoral Paulista • Sistema de Funcional" })
        .setTimestamp();

      await interaction.update({
        content: "✅ Funcional emitida com sucesso!",
        embeds: [embed],
        components: []
      });

      sessoes.delete(interaction.user.id);
    }
  } catch (err) {
    console.error(err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Ocorreu um erro ao processar sua solicitação.",
        ephemeral: true
      }).catch(() => {});
    }
  }
});

client.login(process.env.TOKEN);