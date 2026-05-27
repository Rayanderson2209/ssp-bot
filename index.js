require("dotenv").config();

const {Client,GatewayIntentBits,Partials,EmbedBuilder,Events,ActionRowBuilder,ButtonBuilder,ButtonStyle,StringSelectMenuBuilder,ModalBuilder,TextInputBuilder,TextInputStyle,PermissionsBitField,ChannelType,SlashCommandBuilder,AuditLogEvent} = require("discord.js");

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

const CANAL_FUNCIONAL = "1484826121697628221";
const CANAL_LOG_FUNCIONAL = "1484826214915899412";
const CARGO_VUNESP = "1484825992739553321";
const CATEGORIA_TICKETS = "1484826023794184263";
const CANAL_LOG_TICKETS = "1484826220905627698";

const TICKET_BANNER_URL = "https://cdn.discordapp.com/attachments/1402409732307685446/1508603952944513034/Logo_ssp_litoral.png?ex=6a1775ea&is=6a16246a&hm=9f5f28b3c8d74343efef2539234675316a894643251ae272d876af104df83085&";
const CARGOS_TICKET = ["1484825744390754407","1484825745313370112",

"1500286435910226172","1500287874069696572",

"1484825780310638643","1484825781187379290",

"1484825784387502180","1484825799080153168",

"1484825785532547073","1484825800141176873",

"1484825788611039233","1484825803253485669",

"1484825787373981837","1484825802271887360",

"1484825789429055489","1484825803920380085",

"1484825790800593037","1484825805107367947",

"1484825792075796551","1484825806478905484",

"1484825793120043038","1484825807355383929",

"1484825743572598784","1484825747242618881","1484825753857294527",

"1484825834333143173"];

const TIPOS_TICKET = {outros: {nome: "Outros Assuntos",emoji: "ℹ️",descricao: "Solicitar atendimento para outros tipos de assuntos."},

atualizacao: {nome: "Atualização Funcional",emoji: "🪪",descricao: "Modificar cargos, editar perfil e alterar dados funcionais."},

baixa: {nome: "Baixa de Funcional",emoji: "✍️",descricao: "Solicitar baixa em funcional PM."},

problema: {nome: "Reportar Problema",emoji: "🤖",descricao: "Relatar problemas técnicos da PM, Discord ou cidade."}};

const LOG_ENTRADAS = "1484826127531773974";const LOG_SAIDAS = "1484826130249810104";const LOG_MENSAGENS = "1484826139410173952";const LOG_EXONERACOES = "1484826148847489054";const LOG_CONVITES = "1484826154039771217";const CANAL_LOG_PONTOS_GERAL = "1484826135178248222";

const CANAIS_LOG_PONTO = {QCG: "1508864434007834644",CORREGEDORIA: "1508864278311207012","22BPM": "1484826391340912650",FORCA_TATICA: "1484826438572965950",CAVPM: "1484826472265814046",CAEP: "1484826498962817034",CPCHOQUE: "1508559449793630318",BAEP: "1484826544013574274",ROTA: "1484826598401245235",ANCHIETA: "1484826634505814107",HUMAITA: "1484826674251169873","4BPCHOQUE": "1484826714377818172"};
const CANALETAS_PONTO = {"1484826105289506836": { batalhaoKey: "QCG", batalhao: "QCG", nome: "CMTG - 001" },"1484826106522505237": { batalhaoKey: "QCG", batalhao: "QCG", nome: "SUBCMTG - 002" },

"1484826141364715663": { batalhaoKey: "CORREGEDORIA", batalhao: "Corregedoria", nome: "PDO - 60000" },"1484826143713398844": { batalhaoKey: "CORREGEDORIA", batalhao: "Corregedoria", nome: "PDO - 60001" },"1484826147152859267": { batalhaoKey: "CORREGEDORIA", batalhao: "Corregedoria", nome: "PDO - 60018" },"1484826150596382863": { batalhaoKey: "CORREGEDORIA", batalhao: "Corregedoria", nome: "PDO - 60038" },"1484826152475430962": { batalhaoKey: "CORREGEDORIA", batalhao: "Corregedoria", nome: "PDO - 60040" },"1500031721641476266": { batalhaoKey: "CORREGEDORIA", batalhao: "Corregedoria", nome: "PDO - 60050" },

"1484826188932448316": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "Comando Batalhão | M-22000" },"1484826193306976306": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "Sub.Comando Batalhão | M-22001" },"1484826202442043496": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "CoordOp | M-22002" },"1484826205696950454": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "Supervisão Regional | M-22003" },"1484826208477777940": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "CFP | M-22004" },"1484826211254534206": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "CGP UNO | M-22223" },"1484826212844175442": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-22132 (Duster PM)" },"1484826217864499220": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-22106 (Duster PM)" },"1505616011133456625": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-22136 (Spin 2023)" },"1484826219181641738": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-22146 (Spin 2024)" },"1484826222490812428": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-23111 (Spin 2024)" },"1484826225313845299": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-28100 (Duster)" },"1484826228493127730": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-23117 (Spin 2024)" },"1484826231156244481": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-23140 (Duster)" },"1484826235992281088": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-23151/152 (Creta)" },"1484826236869148915": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-23153/116 (Creta)" },"1484826240052494467": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-23165 (Corolla)" },"1484826243017736274": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "M-23168 (Corolla)" },"1484826246226645002": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "RPM UNO (XRE/LANDER)" },"1484826250659889262": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "RPM DOIS (XRE/LANDER)" },"1484826252438147215": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "Base Comunitária M-23270" },"1484826277939773551": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "Patrulha Rural" },"1484826281358000259": { batalhaoKey: "22BPM", batalhao: "22º BPM", nome: "RPM TRES (XRE/LANDER)" },

"1484826320436199544": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "Comando - M-22001" },"1484826323338919957": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "Tático Comando - M-22011" },"1484826325679341598": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "Tático 90 - M-22090" },"1484826330037227520": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "M-22013 - Tático 13" },"1484826331677200506": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "M-22014 - Tático 14" },"1484826336437735485": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "M-22015 - Tático 15" },"1484826339499315294": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "M-22016 - Tático 16" },"1484826343328977020": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "M-22017 - Tático 17" },"1484826352044609547": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "M-22019 - Tático 19" },"1484826356104564816": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "M-22028 - Tático 28" },"1484826357488947222": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "COMANDO ROCAM" },"1484826360412377138": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "CGP ROCAM (Trail 23)" },"1484826364841558069": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "ROCAM UNO" },"1484826375314735194": { batalhaoKey: "FORCA_TATICA", batalhao: "Força Tática", nome: "ROCAM DOIS" },

"1484826382998569081": { batalhaoKey: "CAVPM", batalhao: "CAVPM", nome: "M-3-550/M-3 555/M-3 547" },"1484826386878300242": { batalhaoKey: "CAVPM", batalhao: "CAVPM", nome: "ÁGUIA 10 (AS350-B3)" },"1484826389843808308": { batalhaoKey: "CAVPM", batalhao: "CAVPM", nome: "ÁGUIA 19 (AS350-B3)" },"1484826393056378901": { batalhaoKey: "CAVPM", batalhao: "CAVPM", nome: "ÁGUIA 23 (AS350) GRAU" },"1484826396835713076": { batalhaoKey: "CAVPM", batalhao: "CAVPM", nome: "ÁGUIA 32 (AW109)" },"1484826400241225830": { batalhaoKey: "CAVPM", batalhao: "CAVPM", nome: "ÁGUIA 33 (EC135)" },
"1484826411897458738": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "Comando OESTE | E-M05000" },"1484826415395242054": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "CAEP Comando | E-M05001" },"1484826419933614230": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "Coordenador CAEP | E-M05002" },"1484826421367930943": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05004" },"1484826428745711626": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "CAEP 90 | E-M05090" },"1484826432524910733": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05006" },"1484826436299657217": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05008" },"1484826440061943879": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05009 / E-M05010" },"1484826443002282096": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05011 / E-M05012" },"1484826446122975374": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05015 / E-M05016" },"1484826447607500841": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05019 • ROCAM" },"1484826450921000960": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05020 / E-M05017" },"1484826454981218424": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "E-M05030/E-M05042" },"1484826468918759524": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "CPAM5-048" },"1484826473876426903": { batalhaoKey: "CAEP", batalhao: "CAEP", nome: "CPAM5-061" },

"1508557841051422842": { batalhaoKey: "CPCHOQUE", batalhao: "CPChoque", nome: "COMANDO CPCHOQUE" },"1508558769259548703": { batalhaoKey: "CPCHOQUE", batalhao: "CPChoque", nome: "SUBCOMANDO CPCHOQUE" },"1508559060104908970": { batalhaoKey: "CPCHOQUE", batalhao: "CPChoque", nome: "COORDENAÇÃO CPCHOQUE" },"1508559180645269624": { batalhaoKey: "CPCHOQUE", batalhao: "CPChoque", nome: "CPCHOQUE 005" },"1508559202057064589": { batalhaoKey: "CPCHOQUE", batalhao: "CPChoque", nome: "CPCHOQUE 006" },"1508562463103258837": { batalhaoKey: "CPCHOQUE", batalhao: "CPChoque", nome: "CPCHOQUE 007" },

"1484826485301841991": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "Comando BAEP" },"1484826488577720332": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "Sub Comando BAEP" },"1484826494370058422": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "Coordenador BAEP" },"1484826497360334969": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "Supervisão BAEP E-07100" },"1484826500753653770": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "Supervisão BAEP E-07300" },"1484826509565759488": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "BAEP COMANDO E-07106" },"1484826513047031859": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "BAEP COMANDO E-07301" },"1484826514888589333": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-07090 BLAZER/TRAIL 22" },"1484826518235385948": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-103/203 SW4" },"1484826521574047754": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-07104/204 TRAIL-12" },"1484826526439575552": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-07104/204/480 TRAIL 12" },"1484826538863235072": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-210/212/213 TRAIL 21/22" },"1484826542407155734": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-214/215/218/220 TRAIL 21" },"1484826545754341386": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-07315/418/470/471" },"1484826548753137667": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-07381 - ROCAM BAEP" },"1484826552167436410": { batalhaoKey: "BAEP", batalhao: "BAEP", nome: "E-07385/389 - ROCAM BAEP" },

"1484826637877907528": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "COMANDO AGUIAR - 91000" },"1484826650653888512": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "COMANDO ROTA - 91001" },"1484826654013652992": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "COORDENADOR AGUIAR" },"1484826655577997362": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "ROTA UNO - 91100" },"1484826661542166619": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "COMANDO 10 - 91102" },"1484826665178890350": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "ROTA 90 - 91090" },"1484826666743234570": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "91110 - TRAILBLAZER" },"1484826670925090858": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "91111 - TRAILBLAZER" },"1484826676104790098": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "91112 - TRAILBLAZER" },"1484826678445477898": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "91128 - TRAILBLAZER" },"1484826683847475303": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "91132 - TRAILBLAZER" },"1484826696929771662": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "91142 - TRAILBLAZER" },"1484826700117311580": { batalhaoKey: "ROTA", batalhao: "ROTA", nome: "DEJEM ROTA - 3-387" },

"1484826721898201250": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "COMANDO ANCHIETA - 92000" },"1484826724813242408": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "SUBCOMANDO ANCHIETA" },"1484826728625864794": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "COORDENADOR ANCHIETA" },"1484826730454843544": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 1 - 92100" },"1484826736288993404": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 2 - 92200" },"1484826739690442833": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 3 - 92300" },"1484826743062925413": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 4 - 92400" },"1484826745655005217": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 111 - 92111" },"1484826747470872607": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 119 - 92119" },"1484826753015742505": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 205 - 92205" },"1484826754819297421": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 212 - 92212" },"1484826757759500358": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 213 - 92213" },"1484826767729627197": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ANCHIETA 215 - 92215" },"1484826776562827274": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "APOIO ROCAM - 92424" },"1484826780203487272": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ROCAM 425 - 92425" },"1484826783193763900": { batalhaoKey: "ANCHIETA", batalhao: "Anchieta", nome: "ROCAM 427 - 92427" },

"1484826799098564729": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "COMANDO HUMAITÁ - 93000" },"1484826802156470353": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "SUBCOMANDO HUMAITÁ" },"1484826803691589682": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "COORDENADOR HUMAITÁ" },"1484826807562666128": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "HUMAITÁ COMANDO" },"1484826811488665610": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "HUMAITÁ (UNO, DOIS, TRÊS)" },"1484826814143660123": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "Humaitá - 93121" },"1484826819969417216": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "Humaitá - 93122" },"1484826821781360650": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "Humaitá - 93129" },"1484826827078897674": { batalhaoKey: "HUMAITA", batalhao: "Humaitá", nome: "Humaitá - 93213" },
"1484826840295145493": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COMANDO 4ºBPCHq • 94000" },"1484826844493778984": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "SUBCOMANDO 4ºBPCHq" },"1484826845957591150": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COORDOP 4ºBPCHq • 94002" },"1484826847857344553": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COMANDO COE • 94003" },"1484826850189381662": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COE COMANDO UNO • 94100" },"1484826852651438201": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COE COMANDO DOIS • 94200" },"1484826855264620596": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COE • 94101" },"1484826858062086154": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COE • 94102" },"1484826859936940032": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COE • 94103" },"1484826861610602586": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "COE • 94201" },"1484826863346909296": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "GATE COMANDO TRÊS" },"1484826865284681750": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "GATE • 94303" },"1484826867596001280": { batalhaoKey: "4BPCHOQUE", batalhao: "4º BPChoque", nome: "GATE • 94301" }};
const canaisBI = {ssp: "1484826324530102303",qcg: "1484826160222441523",corregedoria: "1484826324530102303",cpchoque: "1500288574162210886","22bpm": "1484826380788174868",forca_tatica: "1484826425331548180",cavpm: "1484826456826843188",caep: "1484826491970912369",baep: "1484826529186844693",rota: "1484826591640031243",anchieta: "1484826628935778344",humaita: "1484826663530401792","4bpchoque": "1484826703304855645"};

const nomesBI = {ssp: "SSP",qcg: "QCG",corregedoria: "Corregedoria",cpchoque: "CPChoque","22bpm": "22º BPM",forca_tatica: "Força Tática",cavpm: "CAVPM",caep: "CAEP",baep: "BAEP",rota: "ROTA",anchieta: "Anchieta",humaita: "Humaitá","4bpchoque": "4º BPChoque"};

const hierarquias = {"coronel": { nome: "Coronel PM", insignia: "[✵✵✵]", cargo: "1484825756331937812" },"tenente_coronel": { nome: "Tenente-Coronel PM", insignia: "[✵✵✧]", cargo: "1484825757271330937" },"major": { nome: "Major PM", insignia: "[✵✧✧]", cargo: "1484825757988552846" },"capitao": { nome: "Capitão PM", insignia: "[✧✧✧]", cargo: "1484825760471449641" },"1tenente": { nome: "1º Tenente PM", insignia: "[✧✧]", cargo: "1484825762258227351" },"2tenente": { nome: "2º Tenente PM", insignia: "[✧]", cargo: "1484825762996551801" },"aspirante": { nome: "Aspirante a Oficial PM", insignia: "[✯]", cargo: "1484825765143908422" },"subtenente": { nome: "Subtenente PM", insignia: "[△]", cargo: "1484825768050823198" },"1sgt": { nome: "1º Sargento PM", insignia: "[❯❯ ❯❯❯]", cargo: "1484825769149730857" },"2sgt": { nome: "2º Sargento PM", insignia: "[❯ ❯❯❯]", cargo: "1484825770055569468" },"3sgt": { nome: "3º Sargento PM", insignia: "[❯❯❯]", cargo: "1484825771552935946" },"cabo": { nome: "Cabo PM", insignia: "[❯❯]", cargo: "1484825775621279845" },"sd1": { nome: "Soldado 1ª Classe PM", insignia: "[❯]", cargo: "1484825776745480222" },"sd2": { nome: "Soldado 2ª Classe PM", insignia: "[•❯]", cargo: "1484825777605316640" }};

const unidades = {"qcg": { nome: "QCG", cargo: "1484825747242618881" },"cpa": { nome: "CPA", cargo: "1484825817539280896" },"cpchoque": { nome: "CPCHOQUE", cargo: "1484825818566885516" },"22bpm": { nome: "22°BPM", cargo: "1484825819191709747" },"baep": { nome: "BAEP", cargo: "1484825824895959060" },"caep": { nome: "CAEP", cargo: "1484825825944797235" },"rota": { nome: "ROTA", cargo: "1484825827018543115" },"anchieta": { nome: "ANCHIETA", cargo: "1484825827974582333" },"humaita": { nome: "HUMAITÁ", cargo: "1484825828809506866" },"coe": { nome: "COE", cargo: "1484825830747013151" },"gate": { nome: "GATE", cargo: "1484825831552581757" }};

const cursos = {"sat_a": { nome: "SAT A", cargo: "1484825923760033843" },"sat_b": { nome: "SAT B", cargo: "1484825924624056340" },"pop": { nome: "POP", cargo: "1484825926570217472" },"modulacao": { nome: "Modulação", cargo: "1484825927535038506" },"abordagem": { nome: "ABORDAGEM", cargo: "1484825925446140053" },"tat_1": { nome: "TAT 1", cargo: "1484825928885604474" },"tat_2": { nome: "TAT 2", cargo: "1484825929808347157" },"tat_3": { nome: "TAT 3", cargo: "1484825930940551189" },"copom": { nome: "OPERADOR COPOM", cargo: "1484825922463862795" }};

function montarTextoBI(dados) {
  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const hora = agora.toLocaleTimeString("pt-BR", {timeZone: "America/Sao_Paulo",hour: "2-digit",minute: "2-digit"});

  return `# BOLETIM GERAL - POLÍCIA MILITAR DO ESTADO DE SÃO PAULO

**Unidade:** ${nomesBI[dados.unidade] || "Não informada"}

📁 | **1º PARTE SERVIÇOS DIÁRIOS:**
BOLETIM GERAL Nº ${dados.numero || "___"}/2026

${dados.parte1 || "Sem alterações."}

📁 | **2º PARTE INSTRUÇÃO E OPERAÇÕES POLICIAIS MILITARES:**

${dados.parte2 || "Sem alterações."}

📁 | **3º PARTE ASSUNTOS GERAIS E ADMINISTRATIVOS:**

${dados.parte3 || "Sem alterações."}

📁 | **4º PARTE JUSTIÇA E DISCIPLINA:**

${dados.parte4 || "Sem alterações."}

Secretaria da Segurança Pública - Polícia Militar • ${data} ${hora}h`;
}

function botoesBI() {
  const linha1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("bi_parte1").setLabel("1ª Parte").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("bi_parte2").setLabel("2ª Parte").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("bi_parte3").setLabel("3ª Parte").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("bi_parte4").setLabel("4ª Parte").setStyle(ButtonStyle.Primary)
  );

  const linha2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("preview_bi").setLabel("Pré-visualizar").setEmoji("👁️").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("publicar_bi").setLabel("Publicar").setEmoji("✅").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("cancelar_bi").setLabel("Cancelar").setEmoji("❌").setStyle(ButtonStyle.Danger)
  );

  return [linha1, linha2];
}
client.once("ready", async () => {
  console.log(`✅ Bot online como ${client.user.tag}`);

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
      .setName("painel-ticket")
      .setDescription("Envia o painel fixo de atendimento P1/RH.")
      .toJSON()
  ]);
});
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === "boletim") {
      boletins.set(interaction.user.id, {unidade: "",numero: "",parte1: "",parte2: "",parte3: "",parte4: ""});

      const menuBI = new StringSelectMenuBuilder()
        .setCustomId("selecionar_bi")
        .setPlaceholder("Selecione a unidade do boletim")
        .addOptions([
          { label: "SSP", value: "ssp" },
          { label: "QCG", value: "qcg" },
          { label: "Corregedoria", value: "corregedoria" },
          { label: "CPChoque", value: "cpchoque" },
          { label: "22º BPM", value: "22bpm" },
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

    if (interaction.isStringSelectMenu() && interaction.customId === "selecionar_bi") {
      const dados = boletins.get(interaction.user.id);
      dados.unidade = interaction.values[0];
      boletins.set(interaction.user.id, dados);

      return interaction.update({
        content: `📋 Boletim selecionado para: **${nomesBI[dados.unidade]}**\n\nAgora preencha cada parte. Você pode pré-visualizar antes de publicar.`,
        components: botoesBI()
      });
    }

    if (interaction.isButton() && ["bi_parte1", "bi_parte2", "bi_parte3", "bi_parte4"].includes(interaction.customId)) {
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
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        modal.addComponents(new ActionRowBuilder().addComponents(numeroInput), new ActionRowBuilder().addComponents(textoInput));
      } else {
        const labels = {
          bi_parte2: "2ª Parte - Instrução e Operações",
          bi_parte3: "3ª Parte - Assuntos Gerais",
          bi_parte4: "4ª Parte - Justiça e Disciplina"
        };

        const textoInput = new TextInputBuilder()
          .setCustomId("texto")
          .setLabel(labels[interaction.customId])
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false);

        modal.addComponents(new ActionRowBuilder().addComponents(textoInput));
      }

      return interaction.showModal(modal);
    }
    if (interaction.isModalSubmit() && ["modal_bi_parte1", "modal_bi_parte2", "modal_bi_parte3", "modal_bi_parte4"].includes(interaction.customId)) {
      const dados = boletins.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Boletim não encontrado. Use /boletim novamente.",
          ephemeral: true
        });
      }

      const texto = interaction.fields.getTextInputValue("texto") || "";

      if (interaction.customId === "modal_bi_parte1") {
        dados.numero = interaction.fields.getTextInputValue("numero") || "___";
        dados.parte1 = texto;
      }

      if (interaction.customId === "modal_bi_parte2") dados.parte2 = texto;
      if (interaction.customId === "modal_bi_parte3") dados.parte3 = texto;
      if (interaction.customId === "modal_bi_parte4") dados.parte4 = texto;

      boletins.set(interaction.user.id, dados);

      return interaction.reply({
        content: "✅ Parte salva com sucesso. Use **Pré-visualizar** para conferir ou edite novamente.",
        ephemeral: true
      });
    }

    if (interaction.isButton() && interaction.customId === "preview_bi") {
      const dados = boletins.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Boletim não encontrado. Use /boletim novamente.",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: montarTextoBI(dados),
        ephemeral: true
      });
    }

    if (interaction.isButton() && interaction.customId === "cancelar_bi") {
      boletins.delete(interaction.user.id);

      return interaction.update({
        content: "❌ Boletim cancelado.",
        components: []
      });
    }

    if (interaction.isButton() && interaction.customId === "publicar_bi") {
      const dados = boletins.get(interaction.user.id);

      if (!dados) {
        return interaction.reply({
          content: "❌ Boletim não encontrado. Use /boletim novamente.",
          ephemeral: true
        });
      }

      const canalID = canaisBI[dados.unidade];
      const canal = await interaction.guild.channels.fetch(canalID).catch(() => null);

      if (!canal) {
        return interaction.reply({
          content: "❌ Canal do boletim não encontrado.",
          ephemeral: true
        });
      }

      await canal.send({ content: montarTextoBI(dados) });

      boletins.delete(interaction.user.id);

      return interaction.update({
        content: `✅ Boletim publicado com sucesso em **${nomesBI[dados.unidade]}**.`,
        components: []
      });
    }

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
          "⚠️ A funcional será analisada por um comandante antes da liberação."
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
        content: "📚 Agora selecione seus **cursos**.",
        components: [new ActionRowBuilder().addComponents(menuCursos)]
      });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "selecionar_cursos") {
      const sessao = sessoes.get(interaction.user.id);
      sessao.cursos = interaction.values;

      const patente = hierarquias[sessao.patente];
      const unidade = unidades[sessao.unidade];

      const novoNick = `${patente.insignia} ${sessao.nome} | ${sessao.rg}`;
      const cursosTexto = sessao.cursos.length
        ? sessao.cursos.map(c => cursos[c].nome).join(", ")
        : "Nenhum curso informado";

      pendentes.set(interaction.user.id, {
        userId: interaction.user.id,
        nome: sessao.nome,
        rg: sessao.rg,
        patenteKey: sessao.patente,
        unidadeKey: sessao.unidade,
        cursosKeys: sessao.cursos,
        novoNick
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
          { name: "🏷️ Nickname proposto", value: novoNick }
        )
        .setFooter({ text: "Aguardando análise do comando" })
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

      const canalLog = await interaction.guild.channels.fetch(CANAL_LOG_FUNCIONAL).catch(() => null);

      if (canalLog) {
        await canalLog.send({
          embeds: [logEmbed],
          components: [new ActionRowBuilder().addComponents(aprovar, negar)]
        });
      }

      await interaction.update({
        content: "✅ Sua solicitação foi enviada para análise do comando.",
        components: [],
        embeds: []
      });

      sessoes.delete(interaction.user.id);
    }

    if (interaction.isButton() && interaction.customId.startsWith("aprovar_funcional_")) {
      await interaction.deferUpdate();

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.followUp({
          content: "❌ Você não tem permissão para aprovar funcionais.",
          ephemeral: true
        });
      }

      const userId = interaction.customId.replace("aprovar_funcional_", "");
      const dados = pendentes.get(userId);

      if (!dados) {
        return interaction.followUp({
          content: "❌ Solicitação não encontrada ou o bot foi reiniciado.",
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
      const patente = hierarquias[dados.patenteKey];
      const unidade = unidades[dados.unidadeKey];

      const todosCargosHierarquia = Object.values(hierarquias).map(x => x.cargo);
      const todosCargosUnidade = Object.values(unidades).map(x => x.cargo);

      await membro.roles.remove(todosCargosHierarquia).catch(() => {});
      await membro.roles.remove(todosCargosUnidade).catch(() => {});
      await membro.roles.remove(CARGO_VUNESP).catch(() => {});

      await membro.roles.add(patente.cargo).catch(() => {});
      await membro.roles.add(unidade.cargo).catch(() => {});

      for (const cursoKey of dados.cursosKeys) {
        await membro.roles.add(cursos[cursoKey].cargo).catch(() => {});
      }

      await membro.setNickname(dados.novoNick).catch(() => {});

      pendentes.delete(userId);

      const aprovadoEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("#00FF7F")
        .setFooter({ text: `Funcional aprovada por ${interaction.user.tag}` });

      await interaction.message.edit({
        content: "✅ Funcional aceita.",
        embeds: [aprovadoEmbed],
        components: []
      });
    }

    if (interaction.isButton() && interaction.customId.startsWith("negar_funcional_")) {
      await interaction.deferUpdate();

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.followUp({
          content: "❌ Você não tem permissão para negar funcionais.",
          ephemeral: true
        });
      }

      const userId = interaction.customId.replace("negar_funcional_", "");
      const dados = pendentes.get(userId);

      if (!dados) {
        return interaction.followUp({
          content: "❌ Solicitação não encontrada ou o bot foi reiniciado.",
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
        await membro.roles.add(CARGO_VUNESP).catch(() => {});
      }

      pendentes.delete(userId);

      const negadoEmbed = EmbedBuilder.from(interaction.message.embeds[0])
        .setColor("#FF0000")
        .setFooter({ text: `Funcional negada por ${interaction.user.tag}` });

      await interaction.message.edit({
        content: "❌ Funcional negada. O membro ficou apenas com o cargo VUNESP.",
        embeds: [negadoEmbed],
        components: []
      });
    }
    if (interaction.isChatInputCommand() && interaction.commandName === "painel-ticket") {
      const embed = new EmbedBuilder()
        .setColor("#ff7a00")
        .setTitle("P1 - RECURSOS HUMANOS")
        .setDescription(
          "🚨 **P1 - RECURSOS HUMANOS | SSP LITORAL PAULISTA** 🚨\n\n" +
          "Ao abrir o atendimento, informe corretamente os dados solicitados no formulário.\n\n" +
          "📌 **Atendimentos disponíveis:**\n" +
          "• Atualização Funcional\n" +
          "• Baixa de Funcional\n" +
          "• Reportar Problema\n" +
          "• Outros Assuntos\n\n" +
          "⚠️ **Mantenha postura no canal.**\n" +
          "Sem flood, sem cobranças desnecessárias e aguarde a equipe de serviço.\n\n" +
          "**P1 - PMESP**\n" +
          "Hierarquia e disciplina."
        )
        .setImage(TICKET_BANNER_URL)
        .setFooter({ text: "SSP Litoral Paulista • Sistema de Atendimento P1/RH" });

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

    if (interaction.isStringSelectMenu() && interaction.customId === "selecionar_ticket") {
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
        .setLabel("Relate detalhadamente sua solicitação")
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
    if (interaction.isModalSubmit() && interaction.customId.startsWith("modal_ticket_")) {
      const tipo = interaction.customId.replace("modal_ticket_", "");
      const dadosTipo = TIPOS_TICKET[tipo];

      const nome = interaction.fields.getTextInputValue("nome");
      const rg = interaction.fields.getTextInputValue("rg");
      const batalhao = interaction.fields.getTextInputValue("batalhao");
      const relato = interaction.fields.getTextInputValue("relato");

      const nomeCanal = `ticket-${interaction.user.username}`
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
        .setTitle(`${dadosTipo.emoji} Atendimento Aberto - ${dadosTipo.nome}`)
        .setDescription("📂 Um novo atendimento foi aberto no sistema P1/RH.")
        .addFields(
          { name: "👤 Solicitante", value: `${interaction.user}`, inline: true },
          { name: "🪪 Nome", value: nome, inline: true },
          { name: "🆔 RG", value: rg, inline: true },
          { name: "🏢 Batalhão", value: batalhao, inline: true },
          { name: "📌 Categoria", value: dadosTipo.nome, inline: true },
          { name: "📝 Relato/Solicitação", value: relato.slice(0, 1000) }
        )
        .setImage(TICKET_BANNER_URL)
        .setFooter({ text: "SSP Litoral Paulista • Atendimento P1/RH" })
        .setTimestamp();

      const fechar = new ButtonBuilder()
        .setCustomId("fechar_ticket")
        .setLabel("Fechar Ticket")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Danger);

      await canalTicket.send({
        content: `${interaction.user} atendimento aberto. Aguarde a equipe responsável.`,
        embeds: [embedTicket],
        components: [new ActionRowBuilder().addComponents(fechar)]
      });

      const canalLog = await interaction.guild.channels.fetch(CANAL_LOG_TICKETS).catch(() => null);

      if (canalLog) {
        const logEmbed = new EmbedBuilder()
          .setColor("#00FF7F")
          .setTitle("🎫 Ticket Aberto")
          .addFields(
            { name: "👤 Solicitante", value: `${interaction.user}`, inline: true },
            { name: "📌 Categoria", value: dadosTipo.nome, inline: true },
            { name: "📍 Canal", value: `${canalTicket}`, inline: true }
          )
          .setImage(TICKET_BANNER_URL)
          .setTimestamp();

        await canalLog.send({ embeds: [logEmbed] }).catch(() => {});
      }

      await interaction.reply({
        content: `✅ Seu atendimento foi aberto em ${canalTicket}.`,
        ephemeral: true
      });

      return;
    }

    if (interaction.isButton() && interaction.customId === "fechar_ticket") {
      const canalLog = await interaction.guild.channels.fetch(CANAL_LOG_TICKETS).catch(() => null);

      if (canalLog) {
        const logEmbed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("🔒 Ticket Fechado")
          .addFields(
            { name: "📍 Canal", value: interaction.channel.name, inline: true },
            { name: "👮 Fechado por", value: `${interaction.user}`, inline: true }
          )
          .setImage(TICKET_BANNER_URL)
          .setTimestamp();

        await canalLog.send({ embeds: [logEmbed] }).catch(() => {});
      }

      await interaction.reply({
        content: "🔒 Ticket fechado. Este canal será excluído em 5 segundos.",
        ephemeral: false
      });

      setTimeout(() => {
        interaction.channel.delete().catch(() => {});
      }, 5000);
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
    Date.now() - kickLog.createdTimestamp < 7000
  ) {
    if (canalExoneracoes) {
      const embedKick = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription(`🚫 | ${member.user.tag} foi exonerado por ${kickLog.executor}.`)
        .setTimestamp();

      canalExoneracoes.send({ embeds: [embedKick] }).catch(() => {});
    }
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
    const canalAntigo = oldState.channel;

    if (canalAntigo && CANALETAS_PONTO[canalAntigo.id]) {
      const membrosAntigo = canalAntigo.members.filter(m => !m.user.bot);

      if (membrosAntigo.size < 2) {
        pontosRegistrados.delete(canalAntigo.id);
      }
    }

    if (!canalAtual) return;

    const dadosCanaleta = CANALETAS_PONTO[canalAtual.id];
    if (!dadosCanaleta) return;

    const membros = canalAtual.members.filter(m => !m.user.bot);
    const quantidade = membros.size;

    if (quantidade < 2) {
      pontosRegistrados.delete(canalAtual.id);
      return;
    }

    if (quantidade > 4) return;

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
      .setTitle("📋 Ponto Registrado")
      .setDescription("🚔 Uma guarnição iniciou patrulhamento em canaleta operacional.")
      .addFields(
        {
          name: "👮 Integrantes da Viatura",
          value: integrantes || "Não identificado"
        },
        {
          name: "📅 Data",
          value: data,
          inline: true
        },
        {
          name: "🕒 Horário de Entrada",
          value: hora,
          inline: true
        },
        {
          name: "🏢 Batalhão",
          value: dadosCanaleta.batalhao,
          inline: true
        },
        {
          name: "🚓 Canaleta / Prefixo",
          value: dadosCanaleta.nome
        }
      )
      .setFooter({
        text: "SSP Litoral Paulista • Sistema Automático de Ponto"
      })
      .setTimestamp();

    const canalLogBatalhaoId = CANAIS_LOG_PONTO[dadosCanaleta.batalhaoKey];

    const canalLogBatalhao = canalLogBatalhaoId
      ? await newState.guild.channels.fetch(canalLogBatalhaoId).catch(() => null)
      : null;

    const canalLogGeral = await newState.guild.channels
      .fetch(CANAL_LOG_PONTOS_GERAL)
      .catch(() => null);

    if (canalLogBatalhao) {
      await canalLogBatalhao.send({ embeds: [embed] }).catch(() => {});
    }

    if (canalLogGeral && canalLogGeral.id !== canalLogBatalhao?.id) {
      await canalLogGeral.send({ embeds: [embed] }).catch(() => {});
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