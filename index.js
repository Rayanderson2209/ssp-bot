require("dotenv").config();
const fs = require("fs");

const { Jimp, loadFont } = require("jimp");
const jimpFonts = require("jimp/fonts");

const FONT_SANS_32_BLACK =
  jimpFonts.SANS_32_BLACK || jimpFonts.default?.SANS_32_BLACK;

const FONT_SANS_24_BLACK =
  jimpFonts.SANS_24_BLACK || jimpFonts.default?.SANS_24_BLACK;
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
  ChannelType,
  SlashCommandBuilder,
  AuditLogEvent,
  AttachmentBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.GuildMember,
    Partials.User
  ]
});

const sessoes = new Map();
const pendentes = new Map();
const boletins = new Map();
const pontosRegistrados = new Map();
const ausenciasPendentes = new Map();
const certificados = new Map();
const presencasCursos = new Map();

const FUNCIONAL_VALIDADE_MS = 12 * 60 * 60 * 1000;
const ARQUIVO_FUNCIONAIS_PENDENTES = "./funcionais_pendentes.json";
const LIMITE_PARTE_BI = 1500;

const CERTIFICADO_BASE = "./CERTIFICADO.png";

const CANAL_FUNCIONAL = "1484826121697628221";
const CANAL_LOG_FUNCIONAL = "1484826214915899412";
const CARGO_VUNESP = "1484825992739553321";

const CARGO_PM = "1484825990231359540";
const CURSO_FORMACAO_SOLDADO = "1484825934090600478";
const CURSO_FORMACAO_SARGENTOS = "1484825933214122024";
const CURSO_FORMACAO_OFICIAL = "1484825932182327368";

const QPPM_PRACAS = "1484825774010925217";
const QPPM_PRACAS_GRADUADOS = "1484825766695796799";
const QPES_PRACAS_ESPECIAIS = "1484825764216967248";
const QOPM_SUBALTERNOS = "1484825761327222876";
const QOPM_INTERMEDIARIOS = "1484825759280402573";
const QOPM_SUPERIORES = "1484825754725257368";

const LOG_ESCOLA_FORMACAO = "1519678412208476250";
const LOG_DIRETORIA_ENSINO = "1519678923934400630";

const CERTIFICADOS_DIRETORIA = "1519680856145268836";
const CERTIFICADOS_ESCOLA = "1519679423383732254";

const CANAIS_CURSO = {
  "1484826114177110066": LOG_DIRETORIA_ENSINO,
  "1484826115502641162": LOG_DIRETORIA_ENSINO,
  "1484826117453119489": LOG_DIRETORIA_ENSINO,
  "1484826124688298054": LOG_ESCOLA_FORMACAO
};

const CATEGORIA_TICKETS = "1484826023794184263";
const CANAL_LOG_TICKETS = "1484826220905627698";

const CANAL_AUSENCIAS_ANALISE = "1509173727475142737";
const CANAL_AUSENCIAS_LOG = "1509158714526138558";

const CARGO_AUSENCIA_JUSTIFICADA = "1509157689832505435";
const CARGO_P1HR = "1484825834333143173";

const TICKET_BANNER_URL =
  "https://cdn.discordapp.com/attachments/1402409732307685446/1508603952944513034/Logo_ssp_litoral.png";

const LOG_ENTRADAS = "1484826127531773974";
const LOG_SAIDAS = "1484826130249810104";
const LOG_MENSAGENS = "1484826139410173952";
const LOG_EXONERACOES = "1484826148847489054";
const LOG_CONVITES = "1484826154039771217";

const CANAL_LOG_PONTOS_GERAL = "1484826135178248222";
const CARGOS_TICKET = [
  "1484825744390754407",
  "1484825745313370112",
  "1500286435910226172",
  "1500287874069696572",
  "1484825780310638643",
  "1484825781187379290",
  "1484825784387502180",
  "1484825799080153168",
  "1484825785532547073",
  "1484825800141176873",
  "1484825788611039233",
  "1484825803253485669",
  "1484825787373981837",
  "1484825802271887360",
  "1484825789429055489",
  "1484825803920380085",
  "1484825790800593037",
  "1484825805107367947",
  "1484825792075796551",
  "1484825806478905484",
  "1484825793120043038",
  "1484825807355383929",
  "1484825743572598784",
  "1484825747242618881",
  "1484825753857294527",
  "1484825834333143173"
];

const TIPOS_TICKET = {
  outros: {
    nome: "Outros Assuntos",
    emoji: "ℹ️",
    descricao: "Solicitar atendimento para outros tipos de assuntos."
  },

  atualizacao: {
    nome: "Atualização Funcional",
    emoji: "🪪",
    descricao: "Modificar cargos, editar perfil e alterar dados funcionais."
  },

  baixa: {
    nome: "Baixa de Funcional",
    emoji: "✍️",
    descricao: "Solicitar baixa em funcional PM."
  },

  problema: {
    nome: "Reportar Problema",
    emoji: "🤖",
    descricao: "Relatar problemas técnicos da PM, Discord ou cidade."
  }
};

const CANAIS_LOG_PONTO = {
  QCG: "1508864434007834644",
  CORREGEDORIA: "1508864278311207012",
  CPA: "1515364306873487530",
  "28BPM": "1484826391340912650",
  FORCA_TATICA: "1484826438572965950",
  CAVPM: "1484826472265814046",
  CAEP: "1484826498962817034",
  CPCHOQUE: "1508559449793630318",
  BAEP: "1484826544013574274",
  ROTA: "1484826598401245235",
  ANCHIETA: "1484826634505814107",
  HUMAITA: "1484826674251169873",
  "4BPCHOQUE": "1484826714377818172"
};

const canaisBI = {
  ssp: "1484826324530102303",
  qcg: "1484826160222441523",
  cpa: "1514029964255563967",
  corregedoria: "1484826324530102303",
  cpchoque: "1500288574162210886",
  "22bpm": "1484826380788174868",
  forca_tatica: "1484826425331548180",
  cavpm: "1484826456826843188",
  caep: "1484826491970912369",
  baep: "1484826529186844693",
  rota: "1484826591640031243",
  anchieta: "1484826628935778344",
  humaita: "1484826663530401792",
  "4bpchoque": "1484826703304855645"
};

const nomesBI = {
  ssp: "SSP",
  qcg: "QCG",
  cpa: "CPA",
  corregedoria: "Corregedoria",
  cpchoque: "CPChoque",
  "22bpm": "28º BPM",
  forca_tatica: "Força Tática",
  cavpm: "CAVPM",
  caep: "CAEP",
  baep: "BAEP",
  rota: "ROTA",
  anchieta: "Anchieta",
  humaita: "Humaitá",
  "4bpchoque": "4º BPChoque"
};

const hierarquias = {
  coronel: {
    nome: "Coronel PM",
    insignia: "[✵✵✵]",
    cargo: "1484825756331937812"
  },

  tenente_coronel: {
    nome: "Tenente-Coronel PM",
    insignia: "[✵✵✧]",
    cargo: "1484825757271330937"
  },

  major: {
    nome: "Major PM",
    insignia: "[✵✧✧]",
    cargo: "1484825757988552846"
  },

  capitao: {
    nome: "Capitão PM",
    insignia: "[✧✧✧]",
    cargo: "1484825760471449641"
  },

  "1tenente": {
    nome: "1º Tenente PM",
    insignia: "[✧✧]",
    cargo: "1484825762258227351"
  },

  "2tenente": {
    nome: "2º Tenente PM",
    insignia: "[✧]",
    cargo: "1484825762996551801"
  },

  aspirante: {
    nome: "Aspirante a Oficial PM",
    insignia: "[✯]",
    cargo: "1484825765143908422"
  },

  subtenente: {
    nome: "Subtenente PM",
    insignia: "[△]",
    cargo: "1484825768050823198"
  },

  "1sgt": {
    nome: "1º Sargento PM",
    insignia: "[❯❯ ❯❯❯]",
    cargo: "1484825769149730857"
  },

  "2sgt": {
    nome: "2º Sargento PM",
    insignia: "[❯ ❯❯❯]",
    cargo: "1484825770055569468"
  },

  "3sgt": {
    nome: "3º Sargento PM",
    insignia: "[❯❯❯]",
    cargo: "1484825771552935946"
  },

  cabo: {
    nome: "Cabo PM",
    insignia: "[❯❯]",
    cargo: "1484825775621279845"
  },

  sd1: {
    nome: "Soldado 1ª Classe PM",
    insignia: "[❯]",
    cargo: "1484825776745480222"
  },

  sd2: {
    nome: "Soldado 2ª Classe PM",
    insignia: "[•❯]",
    cargo: "1484825777605316640"
  },

  dir: {
    nome: "Diretor",
    insignia: "DIR",
    cargo: "1510744383761420490"
  },

  agt: {
    nome: "Agente",
    insignia: "AGT",
    cargo: "1510744274407264540"
  },

  juiz: {
    nome: "Juiz",
    insignia: "JUIZ",
    cargo: "1489652435453743194"
  },

  min: {
    nome: "Ministro",
    insignia: "MIN",
    cargo: "1510741726615175198"
  },

  mp: {
    nome: "Ministério Público",
    insignia: "MP",
    cargo: "1510742364212302005"
  },

  pj: {
    nome: "Polícia Judiciária",
    insignia: "PJ",
    cargo: "1510744042118578196"
  }
};
const unidades = {
  qcg: {
    nome: "QCG",
    cargo: "1484825747242618881"
  },

  cpa: {
    nome: "CPA",
    cargo: "1484825817539280896"
  },

  corregedoria: {
    nome: "Corregedoria",
    cargo: "1484825813269483680"
  },

  cpchoque: {
    nome: "CPCHOQUE",
    cargo: "1484825818566885516"
  },

  "22bpm": {
    nome: "28° BPM",
    cargo: "1484825819191709747"
  },

  forca_tatica: {
    nome: "Força Tática",
    cargo: "1484825821473669181"
  },

  cavpm: {
    nome: "CAVPM",
    cargo: "1500287874069696572"
  },

  caep: {
    nome: "CAEP",
    cargo: "1484825825944797235"
  },

  baep: {
    nome: "BAEP",
    cargo: "1484825824895959060"
  },

  rota: {
    nome: "ROTA",
    cargo: "1484825827018543115"
  },

  anchieta: {
    nome: "ANCHIETA",
    cargo: "1484825827974582333"
  },

  humaita: {
    nome: "HUMAITÁ",
    cargo: "1484825828809506866"
  },

  coe: {
    nome: "COE",
    cargo: "1484825830747013151"
  },

  gate: {
    nome: "GATE",
    cargo: "1484825831552581757"
  },

  policia_civil: {
    nome: "Polícia Civil",
    cargo: "1484825988704637000"
  },

  policia_federal: {
    nome: "Polícia Federal",
    cargo: "1484825987844804658"
  },

  prf: {
    nome: "PRF",
    cargo: "1504240288976212038"
  },

  receita_federal: {
    nome: "Receita Federal",
    cargo: "1498108053264928798"
  },

  bombeiros: {
    nome: "Bombeiros",
    cargo: "1484825832299040840"
  },

  judiciario: {
    nome: "Judiciário",
    cargo: "1510703380866273330"
  }
};

const prefixosUnidades = {
  policia_civil: "PC",
  policia_federal: "PF",
  prf: "PRF",
  receita_federal: "RF"
};

const cursos = {
  sat_a: {
    nome: "SAT A",
    cargo: "1484825923760033843"
  },

  sat_b: {
    nome: "SAT B",
    cargo: "1484825924624056340"
  },

  pop: {
    nome: "POP",
    cargo: "1484825926570217472"
  },

  modulacao: {
    nome: "Modulação",
    cargo: "1484825927535038506"
  },

  abordagem: {
    nome: "ABORDAGEM",
    cargo: "1484825925446140053"
  },

  tat_1: {
    nome: "TAT 1",
    cargo: "1484825928885604474"
  },

  tat_2: {
    nome: "TAT 2",
    cargo: "1484825929808347157"
  },

  tat_3: {
    nome: "TAT 3",
    cargo: "1484825930940551189"
  },

  copom: {
    nome: "OPERADOR COPOM",
    cargo: "1484825922463862795"
  },

  ccb_bombeiros: {
    nome: "CCB - Comando do Corpo de Bombeiros",
    cargo: "1484825909000146965"
  },

  subcomandante_bombeiros: {
    nome: "Sub Comandante - Bombeiros",
    cargo: "1484825910338257019"
  },

  juiz: {
    nome: "Juiz",
    cargo: "1489652435453743194"
  },

  tribunal_justica: {
    nome: "Tribunal de Justiça",
    cargo: "1489652487106596914"
  }
};

function cargosAutomaticosPorPatente(patenteKey) {
  const cargos = [CARGO_PM];

  if (["sd1", "sd2", "cabo"].includes(patenteKey)) {
    cargos.push(CURSO_FORMACAO_SOLDADO);
    cargos.push(QPPM_PRACAS);
  }

  if (["3sgt", "2sgt", "1sgt"].includes(patenteKey)) {
    cargos.push(CURSO_FORMACAO_SOLDADO);
    cargos.push(CURSO_FORMACAO_SARGENTOS);
    cargos.push(QPPM_PRACAS_GRADUADOS);
  }

  if (["subtenente", "aspirante"].includes(patenteKey)) {
    cargos.push(CURSO_FORMACAO_SOLDADO);
    cargos.push(CURSO_FORMACAO_SARGENTOS);
    cargos.push(CURSO_FORMACAO_OFICIAL);
    cargos.push(QPES_PRACAS_ESPECIAIS);
  }

  if (["2tenente", "1tenente"].includes(patenteKey)) {
    cargos.push(CURSO_FORMACAO_SOLDADO);
    cargos.push(CURSO_FORMACAO_SARGENTOS);
    cargos.push(CURSO_FORMACAO_OFICIAL);
    cargos.push(QOPM_SUBALTERNOS);
  }

  if (["capitao"].includes(patenteKey)) {
    cargos.push(CURSO_FORMACAO_SOLDADO);
    cargos.push(CURSO_FORMACAO_SARGENTOS);
    cargos.push(CURSO_FORMACAO_OFICIAL);
    cargos.push(QOPM_INTERMEDIARIOS);
  }

  if (["major", "tenente_coronel", "coronel"].includes(patenteKey)) {
    cargos.push(CURSO_FORMACAO_SOLDADO);
    cargos.push(CURSO_FORMACAO_SARGENTOS);
    cargos.push(CURSO_FORMACAO_OFICIAL);
    cargos.push(QOPM_SUPERIORES);
  }

  return cargos;
}

function todosCargosAutomaticosFuncional() {
  return [
    CARGO_PM,
    CURSO_FORMACAO_SOLDADO,
    CURSO_FORMACAO_SARGENTOS,
    CURSO_FORMACAO_OFICIAL,
    QPPM_PRACAS,
    QPPM_PRACAS_GRADUADOS,
    QPES_PRACAS_ESPECIAIS,
    QOPM_SUBALTERNOS,
    QOPM_INTERMEDIARIOS,
    QOPM_SUPERIORES
  ];
}
function salvarFuncionaisPendentes() {
  const dados = Array.from(pendentes.entries());

  fs.writeFileSync(
    ARQUIVO_FUNCIONAIS_PENDENTES,
    JSON.stringify(dados, null, 2),
    "utf-8"
  );
}

function carregarFuncionaisPendentes() {
  if (!fs.existsSync(ARQUIVO_FUNCIONAIS_PENDENTES)) return;

  try {
    const conteudo = fs.readFileSync(ARQUIVO_FUNCIONAIS_PENDENTES, "utf-8");
    const dados = JSON.parse(conteudo);

    pendentes.clear();

    for (const [userId, item] of dados) {
      pendentes.set(userId, item);
    }
  } catch (err) {
    console.error("Erro ao carregar funcionais pendentes:", err);
  }
}

async function recusarFuncionalExpirada(userId) {
  const dados = pendentes.get(userId);
  if (!dados) return;

  const guild = await client.guilds.fetch(dados.guildId).catch(() => null);
  if (!guild) return;

  const membro = await guild.members.fetch(userId).catch(() => null);

  if (membro) {
    const todosCargosHierarquia = Object.values(hierarquias).map(x => x.cargo);
    const todosCargosUnidade = Object.values(unidades).map(x => x.cargo);
    const todosCargosCursos = Object.values(cursos).map(x => x.cargo);

    await membro.roles.remove(todosCargosHierarquia).catch(() => {});
    await membro.roles.remove(todosCargosUnidade).catch(() => {});
    await membro.roles.remove(todosCargosCursos).catch(() => {});
    await membro.roles.remove(todosCargosAutomaticosFuncional()).catch(() => {});
    await membro.roles.add(CARGO_VUNESP).catch(() => {});

    await membro.send({
      content: "⏰ Sua solicitação de funcional expirou após 12 horas sem análise e foi recusada automaticamente."
    }).catch(() => {});
  }

  const canal = await guild.channels.fetch(dados.channelId).catch(() => null);

  if (canal && dados.messageId) {
    const mensagem = await canal.messages.fetch(dados.messageId).catch(() => null);

    if (mensagem) {
      const embedAntigo = mensagem.embeds[0];

      const expiradoEmbed = embedAntigo
        ? EmbedBuilder.from(embedAntigo)
            .setColor("#FF0000")
            .setFooter({ text: "Funcional recusada automaticamente por expiração de 12 horas" })
        : new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("⏰ Funcional Expirada")
            .setDescription(`<@${userId}> teve a funcional recusada automaticamente por expiração.`)
            .setTimestamp();

      await mensagem.edit({
        content: "⏰ Funcional expirada e recusada automaticamente.",
        embeds: [expiradoEmbed],
        components: []
      }).catch(() => {});
    }
  }

  pendentes.delete(userId);
  salvarFuncionaisPendentes();
}

function agendarExpiracaoFuncional(userId) {
  const dados = pendentes.get(userId);
  if (!dados) return;

  const tempoRestante = dados.expiresAt - Date.now();

  if (tempoRestante <= 0) {
    recusarFuncionalExpirada(userId);
    return;
  }

  setTimeout(() => {
    recusarFuncionalExpirada(userId);
  }, Math.min(tempoRestante, 2147483647));
}

function agendarTodasFuncionaisPendentes() {
  for (const userId of pendentes.keys()) {
    agendarExpiracaoFuncional(userId);
  }
}

function limitarTexto(texto, limite = LIMITE_PARTE_BI) {
  if (!texto) return "";
  return texto.length > limite ? texto.slice(0, limite) : texto;
}

function tamanhoPartesBI(dados) {
  return {
    parte1: (dados.parte1 || "").length,
    parte2: (dados.parte2 || "").length,
    parte3: (dados.parte3 || "").length,
    parte4: (dados.parte4 || "").length
  };
}

function montarTextoBI(dados) {
  const agora = new Date();

  const data = agora.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo"
  });

  const hora = agora.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit"
  });

  return `# BOLETIM GERAL - POLÍCIA MILITAR DO ESTADO DE SÃO PAULO

**Unidade:** ${nomesBI[dados.unidade] || "Não informada"}

📁 | 1º PARTE SERVIÇOS DIÁRIOS:
BOLETIM GERAL Nº ${dados.numero || "___"}/2026

${dados.parte1 || "Sem alterações."}

📁 | 2º PARTE INSTRUÇÃO E OPERAÇÕES POLICIAIS MILITARES:

${dados.parte2 || "Sem alterações."}

📁 | 3º PARTE ASSUNTOS GERAIS E ADMINISTRATIVOS:

${dados.parte3 || "Sem alterações."}

📁 | 4º PARTE JUSTIÇA E DISCIPLINA:

${dados.parte4 || "Sem alterações."}

Secretaria da Segurança Pública - Polícia Militar • ${data} ${hora}h`;
}

function botoesBI() {
  const linha1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("bi_parte1")
      .setLabel("1ª Parte")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("bi_parte2")
      .setLabel("2ª Parte")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("bi_parte3")
      .setLabel("3ª Parte")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("bi_parte4")
      .setLabel("4ª Parte")
      .setStyle(ButtonStyle.Primary)
  );

  const linha2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("preview_bi")
      .setLabel("Pré-visualizar")
      .setEmoji("👁️")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("publicar_bi")
      .setLabel("Publicar")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("cancelar_bi")
      .setLabel("Cancelar")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger)
  );

  return [linha1, linha2];
}
async function gerarCertificadoImagem({ nome, rg, curso }) {
  if (!fs.existsSync(CERTIFICADO_BASE)) {
    throw new Error("Arquivo CERTIFICADO.png não encontrado na raiz do bot.");
  }

  const imagem = await Jimp.read(CERTIFICADO_BASE);

const fonteNome = await loadFont(FONT_SANS_32_BLACK);
const fonteCurso = await loadFont(FONT_SANS_32_BLACK);
const fonteRg = await loadFont(FONT_SANS_24_BLACK);

  imagem.print({
    font: fonteNome,
    x: 515,
    y: 385,
    text: {
      text: nome.toUpperCase(),
     alignmentX: "center"
    },
    maxWidth: 450,
    maxHeight: 45
  });

  imagem.print({
    font: fonteRg,
    x: 1005,
    y: 390,
    text: rg,
    maxWidth: 220,
    maxHeight: 35
  });

  imagem.print({
    font: fonteCurso,
    x: 345,
    y: 455,
    text: {
      text: curso.toUpperCase(),
alignmentX: "center"
    },
    maxWidth: 760,
    maxHeight: 45
  });

  const saida = `./certificado_${Date.now()}.png`;

  await imagem.write(saida);

  return saida;
}

client.once("ready", async () => {
  console.log(`✅ Bot online como ${client.user.tag}`);

  carregarFuncionaisPendentes();
  agendarTodasFuncionaisPendentes();

  await client.application.commands.set([
    new SlashCommandBuilder()
      .setName("painel-funcional")
      .setDescription("Envia o painel de solicitação de funcional.")
      .toJSON(),

    new SlashCommandBuilder()
      .setName("boletim")
      .setDescription("Criar e publicar boletim interno.")
      .toJSON(),

    new SlashCommandBuilder()
      .setName("certificado")
      .setDescription("Emitir certificado de curso.")
      .toJSON(),

    new SlashCommandBuilder()
      .setName("painel-ticket")
      .setDescription("Envia o painel fixo de atendimento P1/RH.")
      .toJSON(),

    new SlashCommandBuilder()
      .setName("painel-ausencia")
      .setDescription("Envia o painel de justificativa de ausência.")
      .toJSON()
  ]);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "certificado"
    ) {
      certificados.set(interaction.user.id, {
        origem: "",
        alunoId: "",
        rg: "",
        cursoKey: ""
      });

      const menuOrigem = new StringSelectMenuBuilder()
        .setCustomId("cert_origem")
        .setPlaceholder("Selecione onde publicar")
        .addOptions([
          {
            label: "Escola de Formação",
            value: "escola"
          },
          {
            label: "Diretoria de Ensino",
            value: "diretoria"
          }
        ]);

      return interaction.reply({
        content: "🎓 Selecione a origem do certificado:",
        components: [new ActionRowBuilder().addComponents(menuOrigem)],
        ephemeral: true
      });
    }

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "cert_origem"
    ) {
      const dados = certificados.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Certificado não encontrado. Use /certificado novamente.",
          ephemeral: true
        });
      }

      dados.origem = interaction.values[0];

      certificados.set(interaction.user.id, dados);

      const modal = new ModalBuilder()
        .setCustomId("modal_cert_dados")
        .setTitle("Dados do Certificado");

      const alunoInput = new TextInputBuilder()
        .setCustomId("aluno")
        .setLabel("ID ou menção do militar")
        .setPlaceholder("Ex: @Rayan ou 123456789")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const rgInput = new TextInputBuilder()
        .setCustomId("rg")
        .setLabel("RE/RG do militar")
        .setPlaceholder("Ex: 123456")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(alunoInput),
        new ActionRowBuilder().addComponents(rgInput)
      );

      return interaction.showModal(modal);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "modal_cert_dados"
    ) {
      const dados = certificados.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Certificado não encontrado. Use /certificado novamente.",
          ephemeral: true
        });
      }

      const alunoBruto = interaction.fields.getTextInputValue("aluno");
      const alunoId = alunoBruto.replace(/\D/g, "");
      const rg = interaction.fields.getTextInputValue("rg");

      dados.alunoId = alunoId;
      dados.rg = rg;

      certificados.set(interaction.user.id, dados);

      const menuCursos = new StringSelectMenuBuilder()
        .setCustomId("cert_curso")
        .setPlaceholder("Selecione o curso")
        .addOptions(
          Object.entries(cursos).map(([value, item]) => ({
            label: item.nome,
            value
          }))
        );

      return interaction.reply({
        content: "📚 Selecione o curso concluído:",
        components: [new ActionRowBuilder().addComponents(menuCursos)],
        ephemeral: true
      });
    }
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "cert_curso"
    ) {
      const dados = certificados.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Certificado não encontrado. Use /certificado novamente.",
          ephemeral: true
        });
      }

      dados.cursoKey = interaction.values[0];

      certificados.set(interaction.user.id, dados);

      const curso = cursos[dados.cursoKey];

      const confirmar = new ButtonBuilder()
        .setCustomId("publicar_certificado")
        .setLabel("Publicar Certificado")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success);

      const cancelar = new ButtonBuilder()
        .setCustomId("cancelar_certificado")
        .setLabel("Cancelar")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger);

      return interaction.update({
        content:
          `🎓 Certificado pronto:\n\n` +
          `👤 Militar: <@${dados.alunoId}>\n` +
          `🆔 RE/RG: **${dados.rg}**\n` +
          `📚 Curso: **${curso.nome}**\n` +
          `🏫 Publicação: **${dados.origem === "escola" ? "Escola de Formação" : "Diretoria de Ensino"}**`,
        components: [
          new ActionRowBuilder().addComponents(confirmar, cancelar)
        ]
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId === "cancelar_certificado"
    ) {
      certificados.delete(interaction.user.id);

      return interaction.update({
        content: "❌ Certificado cancelado.",
        components: []
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId === "publicar_certificado"
    ) {
      const dados = certificados.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Certificado não encontrado.",
          ephemeral: true
        });
      }

      const membro = await interaction.guild.members
        .fetch(dados.alunoId)
        .catch(() => null);

      if (!membro) {
        return interaction.reply({
          content: "❌ Militar não encontrado no servidor.",
          ephemeral: true
        });
      }

      const curso = cursos[dados.cursoKey];

      await membro.roles.add(curso.cargo).catch(() => {});

      const canalDestinoId =
        dados.origem === "escola"
          ? CERTIFICADOS_ESCOLA
          : CERTIFICADOS_DIRETORIA;

      const canalDestino = await interaction.guild.channels
        .fetch(canalDestinoId)
        .catch(() => null);

      if (!canalDestino) {
        return interaction.reply({
          content: "❌ Canal de certificados não encontrado.",
          ephemeral: true
        });
      }

      const arquivoCertificado = await gerarCertificadoImagem({
        nome: membro.displayName,
        rg: dados.rg,
        curso: curso.nome
      });

      const attachment = new AttachmentBuilder(arquivoCertificado, {
        name: `certificado-${membro.id}.png`
      });

      await canalDestino.send({
        content:
          `🎓 Certificado emitido para ${membro}\n` +
          `📚 Curso: **${curso.nome}**\n` +
          `👨‍🏫 Instrutor: ${interaction.user}`,
        files: [attachment]
      });

      fs.unlink(arquivoCertificado, () => {});

      certificados.delete(interaction.user.id);

      return interaction.update({
        content: "✅ Certificado publicado e cargo aplicado no militar.",
        components: []
      });
    }

    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "boletim"
    ) {
      boletins.set(interaction.user.id, {
        unidade: "",
        numero: "",
        parte1: "",
        parte2: "",
        parte3: "",
        parte4: ""
      });

      const menuBI = new StringSelectMenuBuilder()
        .setCustomId("selecionar_bi")
        .setPlaceholder("Selecione a unidade do boletim")
        .addOptions([
          { label: "SSP", value: "ssp" },
          { label: "QCG", value: "qcg" },
          { label: "CPA", value: "cpa" },
          { label: "Corregedoria", value: "corregedoria" },
          { label: "CPChoque", value: "cpchoque" },
          { label: "28º BPM", value: "22bpm" },
          { label: "Força Tática", value: "forca_tatica" },
          { label: "CAVPM", value: "cavpm" },
          { label: "CAEP", value: "caep" },
          { label: "BAEP", value: "baep" },
          { label: "ROTA", value: "rota" },
          { label: "Anchieta", value: "anchieta" },
          { label: "Humaitá", value: "humaita" },
          { label: "4º BPChoque", value: "4bpchoque" }
        ]);

      return interaction.reply({
        content: "📁 Selecione a unidade que vai publicar o Boletim Interno:",
        components: [new ActionRowBuilder().addComponents(menuBI)],
        ephemeral: true
      });
    }

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "selecionar_bi"
    ) {
      const dados = boletins.get(interaction.user.id);

      dados.unidade = interaction.values[0];

      boletins.set(interaction.user.id, dados);

      return interaction.update({
        content:
          `📋 Boletim selecionado para: **${nomesBI[dados.unidade]}**\n\n` +
          `Agora preencha cada parte. Limite de cada parte: **${LIMITE_PARTE_BI} caracteres**.`,
        components: botoesBI()
      });
    }
    if (
      interaction.isButton() &&
      ["bi_parte1", "bi_parte2", "bi_parte3", "bi_parte4"].includes(interaction.customId)
    ) {
      const modal = new ModalBuilder()
        .setCustomId(`modal_${interaction.customId}`)
        .setTitle("Editar Parte do Boletim");

      if (interaction.customId === "bi_parte1") {
        const numeroInput = new TextInputBuilder()
          .setCustomId("numero")
          .setLabel("Número do Boletim Geral")
          .setPlaceholder("Ex: 001")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const textoInput = new TextInputBuilder()
          .setCustomId("texto")
          .setLabel("1ª Parte - Serviços Diários")
          .setPlaceholder(`Limite: ${LIMITE_PARTE_BI} caracteres`)
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(LIMITE_PARTE_BI)
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(numeroInput),
          new ActionRowBuilder().addComponents(textoInput)
        );
      } else {
        const labels = {
          bi_parte2: "2ª Parte - Instrução e Operações",
          bi_parte3: "3ª Parte - Assuntos Gerais",
          bi_parte4: "4ª Parte - Justiça e Disciplina"
        };

        const textoInput = new TextInputBuilder()
          .setCustomId("texto")
          .setLabel(labels[interaction.customId])
          .setPlaceholder(`Limite: ${LIMITE_PARTE_BI} caracteres`)
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(LIMITE_PARTE_BI)
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(textoInput)
        );
      }

      return interaction.showModal(modal);
    }

    if (
      interaction.isModalSubmit() &&
      ["modal_bi_parte1", "modal_bi_parte2", "modal_bi_parte3", "modal_bi_parte4"].includes(interaction.customId)
    ) {
      const dados = boletins.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Boletim não encontrado. Use /boletim novamente.",
          ephemeral: true
        });
      }

      const texto = limitarTexto(
        interaction.fields.getTextInputValue("texto") || ""
      );

      if (interaction.customId === "modal_bi_parte1") {
        dados.numero = interaction.fields.getTextInputValue("numero") || "___";
        dados.parte1 = texto;
      }

      if (interaction.customId === "modal_bi_parte2") dados.parte2 = texto;
      if (interaction.customId === "modal_bi_parte3") dados.parte3 = texto;
      if (interaction.customId === "modal_bi_parte4") dados.parte4 = texto;

      boletins.set(interaction.user.id, dados);

      return interaction.reply({
        content: "✅ Parte salva com sucesso.",
        ephemeral: true
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId === "preview_bi"
    ) {
      const dados = boletins.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Boletim não encontrado.",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: montarTextoBI(dados),
        ephemeral: true
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId === "cancelar_bi"
    ) {
      boletins.delete(interaction.user.id);

      return interaction.update({
        content: "❌ Boletim cancelado.",
        components: []
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId === "publicar_bi"
    ) {
      const dados = boletins.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Boletim não encontrado.",
          ephemeral: true
        });
      }

      const canal = await interaction.guild.channels
        .fetch(canaisBI[dados.unidade])
        .catch(() => null);

      if (!canal) {
        return interaction.reply({
          content: "❌ Canal do boletim não encontrado.",
          ephemeral: true
        });
      }

      const partes = [
        `# BOLETIM GERAL - POLÍCIA MILITAR DO ESTADO DE SÃO PAULO`,
        `📁 | 1º PARTE SERVIÇOS DIÁRIOS:\n${dados.parte1 || "Sem alterações."}`,
        `📁 | 2º PARTE INSTRUÇÃO E OPERAÇÕES POLICIAIS MILITARES:\n${dados.parte2 || "Sem alterações."}`,
        `📁 | 3º PARTE ASSUNTOS GERAIS E ADMINISTRATIVOS:\n${dados.parte3 || "Sem alterações."}`,
        `📁 | 4º PARTE JUSTIÇA E DISCIPLINA:\n${dados.parte4 || "Sem alterações."}`
      ];

      for (const parte of partes) {
        await canal.send({ content: parte }).catch(() => {});
      }

      boletins.delete(interaction.user.id);

      return interaction.update({
        content: "✅ Boletim publicado com sucesso.",
        components: []
      });
    }

    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "painel-funcional"
    ) {
      const embed = new EmbedBuilder()
        .setTitle("🪪 Solicitação de Funcional")
        .setDescription("Clique abaixo para solicitar sua funcional.")
        .setColor("#87CEEB");

      const botao = new ButtonBuilder()
        .setCustomId("abrir_funcional")
        .setLabel("Solicitar Funcional")
        .setEmoji("🪪")
        .setStyle(ButtonStyle.Primary);

      return interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(botao)]
      });
    }
    if (
      interaction.isButton() &&
      interaction.customId === "abrir_funcional"
    ) {
      const modal = new ModalBuilder()
        .setCustomId("modal_funcional")
        .setTitle("Solicitação de Funcional");

      const nomeInput = new TextInputBuilder()
        .setCustomId("nome")
        .setLabel("Nome completo")
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

      return interaction.showModal(modal);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "modal_funcional"
    ) {
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

      return interaction.reply({
        content: "🎖️ Agora selecione sua hierarquia:",
        components: [new ActionRowBuilder().addComponents(menuPatente)],
        ephemeral: true
      });
    }

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "selecionar_patente"
    ) {
      const sessao = sessoes.get(interaction.user.id);

      if (!sessao) {
        return interaction.reply({
          content: "❌ Sessão expirada. Abra a funcional novamente.",
          ephemeral: true
        });
      }

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

      return interaction.update({
        content: "🏢 Agora selecione sua unidade:",
        components: [new ActionRowBuilder().addComponents(menuUnidade)]
      });
    }

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "selecionar_unidade"
    ) {
      const sessao = sessoes.get(interaction.user.id);

      if (!sessao) {
        return interaction.reply({
          content: "❌ Sessão expirada. Abra a funcional novamente.",
          ephemeral: true
        });
      }

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

      return interaction.update({
        content: "📚 Agora selecione seus cursos:",
        components: [new ActionRowBuilder().addComponents(menuCursos)]
      });
    }

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "selecionar_cursos"
    ) {
      const sessao = sessoes.get(interaction.user.id);

      if (!sessao) {
        return interaction.reply({
          content: "❌ Sessão expirada. Abra a funcional novamente.",
          ephemeral: true
        });
      }

      sessao.cursos = interaction.values;

      const patente = hierarquias[sessao.patente];
      const unidade = unidades[sessao.unidade];

      const novoNick =
        prefixosUnidades[sessao.unidade]
          ? `${prefixosUnidades[sessao.unidade]} | ${sessao.nome} | ${sessao.rg}`
          : `${patente.insignia} ${sessao.nome} | ${sessao.rg}`;

      const cursosTexto =
        sessao.cursos.length
          ? sessao.cursos.map(c => cursos[c].nome).join(", ")
          : "Nenhum curso informado";

      pendentes.set(interaction.user.id, {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
        nome: sessao.nome,
        rg: sessao.rg,
        patenteKey: sessao.patente,
        unidadeKey: sessao.unidade,
        cursosKeys: sessao.cursos,
        novoNick,
        expiresAt: Date.now() + FUNCIONAL_VALIDADE_MS,
        messageId: null,
        channelId: CANAL_LOG_FUNCIONAL
      });

      const logEmbed = new EmbedBuilder()
        .setTitle("📝 Nova Solicitação de Funcional")
        .setColor("#FFD700")
        .addFields(
          { name: "👤 Solicitante", value: `<@${interaction.user.id}>`, inline: true },
          { name: "👮 Nome", value: sessao.nome, inline: true },
          { name: "🆔 RG", value: sessao.rg, inline: true },
          { name: "🎖️ Hierarquia", value: patente.nome, inline: true },
          { name: "🏢 Unidade", value: unidade.nome, inline: true },
          { name: "📚 Cursos", value: cursosTexto },
          { name: "🏷️ Nickname", value: novoNick },
          { name: "⏰ Validade", value: "Esta solicitação expira automaticamente em 12 horas." }
        )
        .setTimestamp();

      const aprovar = new ButtonBuilder()
        .setCustomId(`aprovar_funcional_${interaction.user.id}`)
        .setLabel("Aprovar Funcional")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success);

      const negar = new ButtonBuilder()
        .setCustomId(`negar_funcional_${interaction.user.id}`)
        .setLabel("Negar Funcional")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger);

      const canalLog = await interaction.guild.channels
        .fetch(CANAL_LOG_FUNCIONAL)
        .catch(() => null);

      if (canalLog) {
        const mensagemLog = await canalLog.send({
          embeds: [logEmbed],
          components: [new ActionRowBuilder().addComponents(aprovar, negar)]
        });

        const dadosPendentes = pendentes.get(interaction.user.id);

        if (dadosPendentes) {
          dadosPendentes.messageId = mensagemLog.id;
          dadosPendentes.channelId = canalLog.id;
          pendentes.set(interaction.user.id, dadosPendentes);
          salvarFuncionaisPendentes();
          agendarExpiracaoFuncional(interaction.user.id);
        }
      }

      if (!canalLog) {
        salvarFuncionaisPendentes();
        agendarExpiracaoFuncional(interaction.user.id);
      }

      sessoes.delete(interaction.user.id);

      await interaction.user.send({
        content: "📨 Sua funcional foi enviada para análise. Ela ficará disponível por 12 horas."
      }).catch(() => {});

      return interaction.update({
        content: "✅ Solicitação enviada com sucesso.",
        components: []
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId.startsWith("aprovar_funcional_")
    ) {
      await interaction.deferUpdate();

      const userId = interaction.customId.replace("aprovar_funcional_", "");
      const dados = pendentes.get(userId);

      if (!dados) {
        return interaction.followUp({
          content: "❌ Solicitação não encontrada ou já expirada.",
          ephemeral: true
        });
      }

      if (dados.expiresAt && Date.now() > dados.expiresAt) {
        await recusarFuncionalExpirada(userId);

        return interaction.followUp({
          content: "⏰ Esta funcional expirou após 12 horas e foi recusada automaticamente.",
          ephemeral: true
        });
      }

      const membro = await interaction.guild.members.fetch(userId).catch(() => null);

      if (!membro) {
        return interaction.followUp({
          content: "❌ Membro não encontrado.",
          ephemeral: true
        });
      }

      const patente = hierarquias[dados.patenteKey];
      const unidade = unidades[dados.unidadeKey];

      const todosCargosHierarquia = Object.values(hierarquias).map(x => x.cargo);
      const todosCargosUnidade = Object.values(unidades).map(x => x.cargo);

      await membro.roles.remove(todosCargosHierarquia).catch(() => {});
      await membro.roles.remove(todosCargosUnidade).catch(() => {});
      await membro.roles.remove(todosCargosAutomaticosFuncional()).catch(() => {});
      await membro.roles.remove(CARGO_VUNESP).catch(() => {});

      await membro.roles.add(patente.cargo).catch(() => {});
      await membro.roles.add(unidade.cargo).catch(() => {});

      for (const cargoAuto of cargosAutomaticosPorPatente(dados.patenteKey)) {
        await membro.roles.add(cargoAuto).catch(() => {});
      }

      for (const cursoKey of dados.cursosKeys) {
        await membro.roles.add(cursos[cursoKey].cargo).catch(() => {});
      }

      await membro.setNickname(dados.novoNick).catch(() => {});

      await membro.send({
        content: "✅ Sua funcional foi aprovada."
      }).catch(() => {});

      pendentes.delete(userId);
      salvarFuncionaisPendentes();

      const aprovadoEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("#00FF7F")
        .setFooter({ text: `Funcional aprovada por ${interaction.user.tag}` });

      return interaction.message.edit({
        content: "✅ Funcional aceita.",
        embeds: [aprovadoEmbed],
        components: []
      });
    }
    if (
      interaction.isButton() &&
      interaction.customId.startsWith("negar_funcional_")
    ) {
      await interaction.deferUpdate();

      const userId = interaction.customId.replace("negar_funcional_", "");
      const dados = pendentes.get(userId);

      if (!dados) {
        return interaction.followUp({
          content: "❌ Solicitação não encontrada ou já expirada.",
          ephemeral: true
        });
      }

      if (dados.expiresAt && Date.now() > dados.expiresAt) {
        await recusarFuncionalExpirada(userId);

        return interaction.followUp({
          content: "⏰ Esta funcional expirou após 12 horas e foi recusada automaticamente.",
          ephemeral: true
        });
      }

      const membro = await interaction.guild.members.fetch(userId).catch(() => null);

      if (membro) {
        const todosCargosHierarquia = Object.values(hierarquias).map(x => x.cargo);
        const todosCargosUnidade = Object.values(unidades).map(x => x.cargo);
        const todosCargosCursos = Object.values(cursos).map(x => x.cargo);

        await membro.roles.remove(todosCargosHierarquia).catch(() => {});
        await membro.roles.remove(todosCargosUnidade).catch(() => {});
        await membro.roles.remove(todosCargosCursos).catch(() => {});
        await membro.roles.remove(todosCargosAutomaticosFuncional()).catch(() => {});
        await membro.roles.add(CARGO_VUNESP).catch(() => {});

        await membro.send({
          content: "❌ Sua funcional foi negada."
        }).catch(() => {});
      }

      pendentes.delete(userId);
      salvarFuncionaisPendentes();

      const negadoEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("#FF0000")
        .setFooter({ text: `Funcional negada por ${interaction.user.tag}` });

      return interaction.message.edit({
        content: "❌ Funcional negada.",
        embeds: [negadoEmbed],
        components: []
      });
    }

    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "painel-ticket"
    ) {
      const embed = new EmbedBuilder()
        .setColor("#ff7a00")
        .setTitle("P1 - RECURSOS HUMANOS")
        .setDescription(
          "🚨 P1 - RECURSOS HUMANOS | SSP LITORAL PAULISTA 🚨\n\n" +
          "Selecione abaixo o tipo de atendimento desejado."
        )
        .setImage(TICKET_BANNER_URL);

      const menu = new StringSelectMenuBuilder()
        .setCustomId("selecionar_ticket")
        .setPlaceholder("Escolha uma opção...")
        .addOptions(
          Object.entries(TIPOS_TICKET).map(([value, item]) => ({
            label: item.nome,
            description: item.descricao,
            emoji: item.emoji,
            value
          }))
        );

      return interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(menu)]
      });
    }

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "selecionar_ticket"
    ) {
      const tipo = interaction.values[0];
      const dadosTipo = TIPOS_TICKET[tipo];

      const modal = new ModalBuilder()
        .setCustomId(`modal_ticket_${tipo}`)
        .setTitle(`Atendimento - ${dadosTipo.nome}`);

      const nomeInput = new TextInputBuilder()
        .setCustomId("nome")
        .setLabel("Nome completo")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const rgInput = new TextInputBuilder()
        .setCustomId("rg")
        .setLabel("RG/Passaporte")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const batalhaoInput = new TextInputBuilder()
        .setCustomId("batalhao")
        .setLabel("Batalhão/Unidade")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const relatoInput = new TextInputBuilder()
        .setCustomId("relato")
        .setLabel("Relate sua solicitação")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nomeInput),
        new ActionRowBuilder().addComponents(rgInput),
        new ActionRowBuilder().addComponents(batalhaoInput),
        new ActionRowBuilder().addComponents(relatoInput)
      );

      return interaction.showModal(modal);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId.startsWith("modal_ticket_")
    ) {
      const tipo = interaction.customId.replace("modal_ticket_", "");
      const dadosTipo = TIPOS_TICKET[tipo];

      const nome = interaction.fields.getTextInputValue("nome");
      const rg = interaction.fields.getTextInputValue("rg");
      const batalhao = interaction.fields.getTextInputValue("batalhao");
      const relato = interaction.fields.getTextInputValue("relato");

      const nomeCanal =
        `ticket-${interaction.user.username}`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .slice(0, 90);

      const overwrites = [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        },
        ...CARGOS_TICKET
          .filter(cargoId => interaction.guild.roles.cache.has(cargoId))
          .map(cargoId => ({
            id: cargoId,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          }))
      ];

      const canalTicket = await interaction.guild.channels.create({
        name: nomeCanal,
        type: ChannelType.GuildText,
        parent: CATEGORIA_TICKETS,
        permissionOverwrites: overwrites
      });

      const embedTicket = new EmbedBuilder()
        .setColor("#ff7a00")
        .setTitle(`${dadosTipo.emoji} Atendimento Aberto`)
        .addFields(
          { name: "👤 Solicitante", value: `${interaction.user}`, inline: true },
          { name: "🪪 Nome", value: nome, inline: true },
          { name: "🆔 RG", value: rg, inline: true },
          { name: "🏢 Unidade", value: batalhao, inline: true },
          { name: "📝 Relato", value: relato.slice(0, 1000) }
        )
        .setTimestamp();

      const fechar = new ButtonBuilder()
        .setCustomId("fechar_ticket")
        .setLabel("Fechar Ticket")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Danger);

      await canalTicket.send({
        content: `${interaction.user} atendimento aberto.`,
        embeds: [embedTicket],
        components: [new ActionRowBuilder().addComponents(fechar)]
      });

      const canalLog = await interaction.guild.channels
        .fetch(CANAL_LOG_TICKETS)
        .catch(() => null);

      if (canalLog) {
        const logEmbed = new EmbedBuilder()
          .setColor("#00FF7F")
          .setTitle("🎫 Ticket Aberto")
          .addFields(
            { name: "👤 Solicitante", value: `${interaction.user}`, inline: true },
            { name: "📌 Categoria", value: dadosTipo.nome, inline: true },
            { name: "📍 Canal", value: `${canalTicket}`, inline: true }
          )
          .setTimestamp();

        await canalLog.send({ embeds: [logEmbed] }).catch(() => {});
      }

      return interaction.reply({
        content: `✅ Ticket criado em ${canalTicket}.`,
        ephemeral: true
      });
    }
    if (
      interaction.isButton() &&
      interaction.customId === "fechar_ticket"
    ) {
      const canalLog = await interaction.guild.channels
        .fetch(CANAL_LOG_TICKETS)
        .catch(() => null);

      const mensagens = await interaction.channel.messages
        .fetch({ limit: 100 })
        .catch(() => null);

      let transcript = "TRANSCRIPT DO TICKET\n\n";
      let donoTicket = null;

      if (mensagens) {
        const mensagensOrdenadas = mensagens.sort(
          (a, b) => a.createdTimestamp - b.createdTimestamp
        );

        for (const msg of mensagensOrdenadas.values()) {
          const data = new Date(msg.createdTimestamp).toLocaleString("pt-BR");

          transcript += `[${data}] ${msg.author.tag}: ${msg.content || "[Sem texto]"}\n`;

          if (!donoTicket) {
            donoTicket = await interaction.guild.members
              .fetch(msg.author.id)
              .catch(() => null);
          }
        }
      }

      const buffer = Buffer.from(transcript, "utf-8");

      if (canalLog) {
        const logEmbed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("🔒 Ticket Fechado")
          .addFields(
            { name: "📍 Canal", value: interaction.channel.name, inline: true },
            { name: "👮 Fechado por", value: `${interaction.user}`, inline: true }
          )
          .setTimestamp();

        await canalLog.send({
          embeds: [logEmbed],
          files: [
            {
              attachment: buffer,
              name: `transcript-${interaction.channel.name}.txt`
            }
          ]
        }).catch(() => {});
      }

      if (donoTicket) {
        await donoTicket.send({
          content: "📄 Seu ticket foi encerrado.",
          files: [
            {
              attachment: buffer,
              name: `transcript-${interaction.channel.name}.txt`
            }
          ]
        }).catch(() => {});
      }

      await interaction.reply({
        content: "🔒 Ticket fechado. Canal será apagado em 5 segundos."
      });

      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 5000);
    }

    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "painel-ausencia"
    ) {
      const embed = new EmbedBuilder()
        .setColor("#ff7a00")
        .setTitle("📋 Justificativa de Ausência")
        .setDescription(
          "Utilize este painel para justificar sua ausência junto ao setor de P1/RH.\n\n" +
          "Clique no botão abaixo e preencha corretamente:\n" +
          "• Nome\n" +
          "• Posto/Graduação\n" +
          "• Batalhão/Unidade\n" +
          "• Motivo da ausência\n\n" +
          "⚠️ O pedido será analisado pelo setor responsável."
        );

      const botao = new ButtonBuilder()
        .setCustomId("abrir_ausencia")
        .setLabel("Justificar Ausência")
        .setEmoji("📋")
        .setStyle(ButtonStyle.Primary);

      return interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(botao)]
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId === "abrir_ausencia"
    ) {
      const modal = new ModalBuilder()
        .setCustomId("modal_ausencia")
        .setTitle("Justificativa de Ausência");

      const nomeInput = new TextInputBuilder()
        .setCustomId("nome")
        .setLabel("Nome")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const graduacaoInput = new TextInputBuilder()
        .setCustomId("graduacao")
        .setLabel("Posto/Graduação")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const batalhaoInput = new TextInputBuilder()
        .setCustomId("batalhao")
        .setLabel("Batalhão/Unidade")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const motivoInput = new TextInputBuilder()
        .setCustomId("motivo")
        .setLabel("Motivo")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(nomeInput),
        new ActionRowBuilder().addComponents(graduacaoInput),
        new ActionRowBuilder().addComponents(batalhaoInput),
        new ActionRowBuilder().addComponents(motivoInput)
      );

      return interaction.showModal(modal);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "modal_ausencia"
    ) {
      const nome = interaction.fields.getTextInputValue("nome");
      const graduacao = interaction.fields.getTextInputValue("graduacao");
      const batalhao = interaction.fields.getTextInputValue("batalhao");
      const motivo = interaction.fields.getTextInputValue("motivo");

      ausenciasPendentes.set(interaction.user.id, {
        userId: interaction.user.id,
        nome,
        graduacao,
        batalhao,
        motivo
      });

      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("📋 Nova Justificativa de Ausência")
        .addFields(
          { name: "👤 Solicitante", value: `${interaction.user}`, inline: true },
          { name: "🪪 Nome", value: nome, inline: true },
          { name: "🎖️ Posto/Graduação", value: graduacao, inline: true },
          { name: "🏢 Batalhão/Unidade", value: batalhao, inline: true },
          { name: "📝 Motivo", value: motivo.slice(0, 1000) }
        )
        .setTimestamp();

      const aprovar = new ButtonBuilder()
        .setCustomId(`aprovar_ausencia_${interaction.user.id}`)
        .setLabel("Aprovar Ausência")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success);

      const negar = new ButtonBuilder()
        .setCustomId(`negar_ausencia_${interaction.user.id}`)
        .setLabel("Negar Ausência")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger);

      const canalAnalise = await interaction.guild.channels
        .fetch(CANAL_AUSENCIAS_ANALISE)
        .catch(() => null);

      if (canalAnalise) {
        await canalAnalise.send({
          content: `<@&${CARGO_P1HR}> nova justificativa de ausência para análise.`,
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(aprovar, negar)]
        });
      }

      return interaction.reply({
        content: "✅ Sua justificativa de ausência foi enviada para análise do P1/RH.",
        ephemeral: true
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId.startsWith("aprovar_ausencia_")
    ) {
      await interaction.deferUpdate();

      if (
        !interaction.member.roles.cache.has(CARGO_P1HR) &&
        !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
      ) {
        return interaction.followUp({
          content: "❌ Apenas P1-HR pode aprovar justificativas de ausência.",
          ephemeral: true
        });
      }

      const userId = interaction.customId.replace("aprovar_ausencia_", "");
      const dados = ausenciasPendentes.get(userId);

      if (!dados) {
        return interaction.followUp({
          content: "❌ Solicitação de ausência não encontrada ou o bot foi reiniciado.",
          ephemeral: true
        });
      }

      const membro = await interaction.guild.members.fetch(userId).catch(() => null);

      if (!membro) {
        return interaction.followUp({
          content: "❌ Membro não encontrado no servidor.",
          ephemeral: true
        });
      }

      await membro.roles.add(CARGO_AUSENCIA_JUSTIFICADA).catch(() => {});

      await membro.send({
        content: "✅ Sua justificativa de ausência foi aprovada pelo P1/RH. A tag AUSEN.JUST. foi aplicada."
      }).catch(() => {});

      const canalLog = await interaction.guild.channels
        .fetch(CANAL_AUSENCIAS_LOG)
        .catch(() => null);

      if (canalLog) {
        const logEmbed = new EmbedBuilder()
          .setColor("#00FF7F")
          .setTitle("✅ Ausência Justificada Aprovada")
          .addFields(
            { name: "👤 Militar", value: `<@${userId}>`, inline: true },
            { name: "🪪 Nome", value: dados.nome, inline: true },
            { name: "🎖️ Posto/Graduação", value: dados.graduacao, inline: true },
            { name: "🏢 Batalhão/Unidade", value: dados.batalhao, inline: true },
            { name: "👮 Aprovado por", value: `${interaction.user}`, inline: true },
            { name: "📝 Motivo", value: dados.motivo.slice(0, 1000) }
          )
          .setTimestamp();

        await canalLog.send({ embeds: [logEmbed] }).catch(() => {});
      }

      ausenciasPendentes.delete(userId);

      const aprovadoEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("#00FF7F")
        .setFooter({ text: `Ausência aprovada por ${interaction.user.tag}` });

      return interaction.message.edit({
        content: "✅ Justificativa de ausência aprovada.",
        embeds: [aprovadoEmbed],
        components: []
      });
    }

    if (
      interaction.isButton() &&
      interaction.customId.startsWith("negar_ausencia_")
    ) {
      await interaction.deferUpdate();

      if (
        !interaction.member.roles.cache.has(CARGO_P1HR) &&
        !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
      ) {
        return interaction.followUp({
          content: "❌ Apenas P1-HR pode negar justificativas de ausência.",
          ephemeral: true
        });
      }

      const userId = interaction.customId.replace("negar_ausencia_", "");
      const dados = ausenciasPendentes.get(userId);

      if (!dados) {
        return interaction.followUp({
          content: "❌ Solicitação de ausência não encontrada ou o bot foi reiniciado.",
          ephemeral: true
        });
      }

      const membro = await interaction.guild.members.fetch(userId).catch(() => null);

      if (membro) {
        await membro.send({
          content: "❌ Sua justificativa de ausência foi negada pelo P1/RH. Abra um ticket no RH para tentar solicitar outra ausência."
        }).catch(() => {});
      }

      ausenciasPendentes.delete(userId);

      const negadoEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("#FF0000")
        .setFooter({ text: `Ausência negada por ${interaction.user.tag}` });

      return interaction.message.edit({
        content: "❌ Justificativa de ausência negada.",
        embeds: [negadoEmbed],
        components: []
      });
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

client.on(Events.GuildMemberAdd, async (member) => {
  const canal = client.channels.cache.get(LOG_ENTRADAS);
  if (!canal) return;

  const embed = new EmbedBuilder()
    .setColor("#00FF7F")
    .setDescription(`📥 | ${member} entrou no servidor.`)
    .setTimestamp();

  canal.send({ embeds: [embed] }).catch(() => {});
});

client.on(Events.GuildMemberRemove, async (member) => {
  const canalSaidas = client.channels.cache.get(LOG_SAIDAS);
  const canalExoneracoes = client.channels.cache.get(LOG_EXONERACOES);

  if (canalSaidas) {
    const embedSaida = new EmbedBuilder()
      .setColor("#FFA500")
      .setDescription(`📤 | ${member.user.tag} saiu do servidor.`)
      .setTimestamp();

    canalSaidas.send({ embeds: [embedSaida] }).catch(() => {});
  }

  const audit = await member.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberKick
  }).catch(() => null);

  const kickLog = audit?.entries.first();

  if (
    kickLog &&
    kickLog.target?.id === member.id &&
    Date.now() - kickLog.createdTimestamp < 7000 &&
    canalExoneracoes
  ) {
    const embedKick = new EmbedBuilder()
      .setColor("#FF0000")
      .setDescription(`🚫 | ${member.user.tag} foi exonerado por ${kickLog.executor}.`)
      .setTimestamp();

    canalExoneracoes.send({ embeds: [embedKick] }).catch(() => {});
  }
});

client.on(Events.GuildBanAdd, async (ban) => {
  const canal = client.channels.cache.get(LOG_EXONERACOES);
  if (!canal) return;

  const audit = await ban.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberBanAdd
  }).catch(() => null);

  const banLog = audit?.entries.first();
  const executor = banLog?.executor ? `${banLog.executor}` : "Não identificado";

  const embed = new EmbedBuilder()
    .setColor("#FF0000")
    .setDescription(`⛔ | ${ban.user.tag} foi banido/exonerado por ${executor}.`)
    .setTimestamp();

  canal.send({ embeds: [embed] }).catch(() => {});
});

client.on(Events.MessageDelete, async (message) => {
  if (!message.guild) return;
  if (!message.author) return;
  if (message.author.bot) return;

  const canal = client.channels.cache.get(LOG_MENSAGENS);
  if (!canal) return;

  const conteudo = message.content
    ? message.content.slice(0, 1000)
    : "Mensagem sem texto ou não armazenada em cache.";

  const embed = new EmbedBuilder()
    .setColor("#5865F2")
    .setDescription(`🎉 | O chat teve 1 mensagem deletada por ${message.author}!`)
    .addFields(
      { name: "📍 Canal", value: `${message.channel}`, inline: true },
      { name: "💬 Conteúdo", value: conteudo }
    )
    .setTimestamp();

  canal.send({ embeds: [embed] }).catch(() => {});
});

client.on(Events.InviteCreate, async (invite) => {
  const canal = client.channels.cache.get(LOG_CONVITES);
  if (!canal) return;

  const criador = invite.inviter ? `${invite.inviter}` : "Não identificado";

  const embed = new EmbedBuilder()
    .setColor("#57F287")
    .setDescription(`🔗 | ${criador} criou um novo convite em ${invite.channel}.`)
    .addFields({
      name: "📎 Convite",
      value: `https://discord.gg/${invite.code}`
    })
    .setTimestamp();

  canal.send({ embeds: [embed] }).catch(() => {});
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  try {
    const canalAtual = newState.channel;
    if (!canalAtual) return;

    const membros = canalAtual.members.filter(m => !m.user.bot);

    if (membros.size < 2) return;
    if (membros.size > 4) return;

    if (pontosRegistrados.has(canalAtual.id)) return;

    const agora = new Date();

    const data = agora.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo"
    });

    const hora = agora.toLocaleTimeString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit"
    });

    const integrantes = membros
      .map(m => `• ${m.displayName}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("#2B2D31")
      .setTitle("📋 Ponto / Presença Registrada")
      .setDescription("🚔 Uma guarnição ou turma iniciou atividade em canaleta operacional.")
      .addFields(
        { name: "👮 Integrantes", value: integrantes },
        { name: "📅 Data", value: data, inline: true },
        { name: "🕒 Horário", value: hora, inline: true },
        { name: "🚓 Canaleta", value: canalAtual.name }
      )
      .setTimestamp();

    if (CANAIS_CURSO[canalAtual.id]) {
      const canalCursoLog = await newState.guild.channels
        .fetch(CANAIS_CURSO[canalAtual.id])
        .catch(() => null);

      if (canalCursoLog) {
        await canalCursoLog.send({ embeds: [embed] }).catch(() => {});
      }

      presencasCursos.set(canalAtual.id, {
        canalId: canalAtual.id,
        registradoEm: Date.now(),
        membros: membros.map(m => m.id)
      });

      pontosRegistrados.set(canalAtual.id, {
        canalId: canalAtual.id,
        registradoEm: Date.now(),
        membros: membros.map(m => m.id)
      });

      return;
    }

    const canalLogGeral = await newState.guild.channels
      .fetch(CANAL_LOG_PONTOS_GERAL)
      .catch(() => null);

    if (canalLogGeral) {
      await canalLogGeral.send({ embeds: [embed] }).catch(() => {});
    }

    const nomeCanal = canalAtual.name.toLowerCase();

    let unidadePonto = null;

    if (
      nomeCanal.includes("cpa") ||
      nomeCanal.includes("m-cpa") ||
      nomeCanal.includes("comando cpa")
    ) {
      unidadePonto = "CPA";
    } else if (
      nomeCanal.includes("pontos-ft") ||
      nomeCanal.includes("força tática") ||
      nomeCanal.includes("forca tatica") ||
      nomeCanal.includes("forca-tatica") ||
      nomeCanal.includes("ft")
    ) {
      unidadePonto = "FORCA_TATICA";
    } else if (
      nomeCanal.includes("28") ||
      nomeCanal.includes("22") ||
      nomeCanal.includes("bpm")
    ) {
      unidadePonto = "28BPM";
    } else if (nomeCanal.includes("qcg")) {
      unidadePonto = "QCG";
    } else if (nomeCanal.includes("corregedoria")) {
      unidadePonto = "CORREGEDORIA";
    } else if (nomeCanal.includes("cav")) {
      unidadePonto = "CAVPM";
    } else if (nomeCanal.includes("caep")) {
      unidadePonto = "CAEP";
    } else if (
      nomeCanal.includes("choque") ||
      nomeCanal.includes("cpchoque")
    ) {
      unidadePonto = "CPCHOQUE";
    } else if (nomeCanal.includes("baep")) {
      unidadePonto = "BAEP";
    } else if (nomeCanal.includes("rota")) {
      unidadePonto = "ROTA";
    } else if (nomeCanal.includes("anchieta")) {
      unidadePonto = "ANCHIETA";
    } else if (
      nomeCanal.includes("humaita") ||
      nomeCanal.includes("humaitá")
    ) {
      unidadePonto = "HUMAITA";
    } else if (
      nomeCanal.includes("4bp") ||
      nomeCanal.includes("4º") ||
      nomeCanal.includes("4°")
    ) {
      unidadePonto = "4BPCHOQUE";
    }

    if (unidadePonto && CANAIS_LOG_PONTO[unidadePonto]) {
      const canalLogUnidade = await newState.guild.channels
        .fetch(CANAIS_LOG_PONTO[unidadePonto])
        .catch(() => null);

      if (canalLogUnidade) {
        await canalLogUnidade.send({ embeds: [embed] }).catch(() => {});
      }
    }

    pontosRegistrados.set(canalAtual.id, {
      canalId: canalAtual.id,
      registradoEm: Date.now(),
      membros: membros.map(m => m.id)
    });

  } catch (err) {
    console.error("Erro no sistema de ponto automático:", err);
  }
});

client.login(process.env.TOKEN);