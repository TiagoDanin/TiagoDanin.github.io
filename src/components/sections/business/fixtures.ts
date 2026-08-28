import type { BusinessOffering, BusinessProof, BusinessRecord, BusinessStep } from '@/lib/business';
import type { BusinessStackGroup } from './BusinessStack';

export const PROOF: BusinessProof[] = [
  {
    value: '141',
    label: 'repositórios públicos',
    detail: 'Código, issues e histórico de commits, tudo aberto.',
    href: '/projects',
  },
  {
    value: '66',
    label: 'pacotes publicados no npm',
    detail: '1,2M downloads somados.',
    href: '/rankings/npm',
  },
  {
    value: '19',
    label: 'palestras em eventos',
    detail: 'A maioria com gravação disponível.',
    href: '/talks',
  },
  {
    value: '33',
    label: 'artigos técnicos',
    detail: 'Desenvolvimento mobile, segurança e open source.',
    href: '/blog',
  },
];

export const OFFERINGS: BusinessOffering[] = [
  {
    code: '6201-5/01',
    icon: 'Smartphone',
    title: 'Desenvolvimento sob encomenda',
    description:
      'Aplicativos mobile feitos a partir de um briefing, da primeira conversa até a publicação na loja.',
    bullets: [
      'Flutter e React Native, com Kotlin e Swift nativos quando o app precisa',
      'Publicação e resposta às revisões na Google Play e na App Store',
      'Firebase, pipelines de CI/CD e testes automatizados desde o início do projeto',
    ],
    href: '/mobile',
    linkLabel: 'Desenvolvimento mobile',
  },
  {
    code: '6203-1/00',
    icon: 'Package',
    title: 'Licenciamento de software',
    description: 'Produtos e bibliotecas que eu já mantenho, licenciados em vez de refeitos do zero.',
    bullets: [
      'Pacotes open source publicados no npm, PyPI, LuaRocks e AUR',
      'Aplicativos publicados na Google Play e na Microsoft Store',
      'Licença comercial e suporte para qualquer coisa já lançada',
    ],
    href: '/projects',
    linkLabel: 'Catálogo completo',
  },
  {
    code: '6204-0/00',
    icon: 'Shield',
    title: 'Consultoria em tecnologia',
    description: 'Revisar o que já existe e ajudar o time que vai continuar mantendo aquilo.',
    bullets: [
      'Análise de segurança e revisão de código de aplicativos mobile',
      'Revisão de arquitetura em bases React Native e Flutter',
      'Engenharia de release: pipelines, feature flags e rollout gradual',
    ],
    href: '/cybersecurity',
    linkLabel: 'Trabalho de segurança',
  },
];

export const PROCESS: BusinessStep[] = [
  {
    title: 'Escopo',
    detail:
      'Você descreve o problema. Eu volto com o que entendi, o que construiria e o que deixaria de fora de propósito.',
  },
  {
    title: 'Orçamento escrito',
    detail:
      'Preço, prazo e tudo que está fora do escopo, por escrito. Nada começa antes de você ter esse documento.',
  },
  {
    title: 'Entrega iterativa',
    detail:
      'Builds que você instala e abre, em cadência fixa. Você vê o app rodando muito antes de ele ficar pronto.',
  },
  {
    title: 'Passagem de bastão',
    detail:
      'Código, credenciais, contas de loja e documentação ficam com você no fim. Suporte depois disso é acordo separado.',
  },
];

export const REGISTRY: BusinessRecord[] = [
  { label: 'Razão social', value: 'TIAGO DANIN TECH SOLUTIONS LTDA' },
  { label: 'CNPJ', value: '67.171.570/0001-15' },
  { label: 'Natureza jurídica', value: 'Sociedade Empresária Limitada' },
  { label: 'Porte', value: 'Microempresa' },
  { label: 'Regime tributário', value: 'Simples Nacional' },
  { label: 'Situação cadastral', value: 'Ativa desde 3 de junho de 2026' },
  { label: 'Município', value: 'Belém, Pará, Brasil' },
];

export const RESOLVE_HREF = (href: string) => href;

export const STACK: BusinessStackGroup[] = [
  {
    category: 'Mobile Development',
    items: [
      { name: 'Flutter', icon: 'SiFlutter', color: '#02569B' },
      { name: 'React Native', icon: 'SiReact', color: '#007F9D' },
      { name: 'Kotlin', icon: 'SiKotlin', color: '#7F52FF' },
      { name: 'Swift', icon: 'SiSwift', color: '#CE442F' },
    ],
  },
  {
    category: 'DevOps',
    items: [
      { name: 'Firebase', icon: 'SiFirebase', color: '#C7871B' },
      { name: 'GitLab CI/CD', icon: 'SiGitlab', color: '#B4472A' },
      { name: 'Docker', icon: 'SiDocker', color: '#1D63ED' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', icon: 'SiNodedotjs', color: '#3C823B' },
      { name: 'PostgreSQL', icon: 'SiPostgresql', color: '#31648C' },
    ],
  },
];

export const FIT: BusinessStep[] = [
  {
    title: "Funciona: projeto com escopo fechado",
    detail:
      "Você tem um app para construir, ou uma entrega com objetivo claro. Escopo, prazo e preço saem por escrito antes da primeira linha de código.",
  },
  {
    title: "Funciona: revisão pontual",
    detail:
      "Seu app está apanhando na revisão da loja, a arquitetura React Native ou Flutter travou o time, ou você quer uma análise de segurança antes do lançamento. Contrato por entrega, com data para acabar.",
  },
  {
    title: "Funciona: licença e suporte do que já existe",
    detail:
      "Você precisa de algo que eu já publico e mantenho. Sai licença comercial e suporte, em vez de um orçamento para refazer do zero.",
  },
  {
    title: "Não funciona: alocação de squad",
    detail:
      "Não vendo time nem dedicação integral. Quem faz o trabalho sou eu, e a agenda é combinada projeto a projeto, antes de qualquer contrato.",
  },
  {
    title: "Não funciona: trabalho por hora sem escopo",
    detail:
      "Contrato aberto, sem escopo e sem critério de pronto, acaba em discussão sobre a fatura. Prefiro escrever o escopo e cobrar por ele.",
  },
  {
    title: "Não funciona: projeto que depende de time de design e QA",
    detail:
      "Não tenho equipe de design nem de QA. Se o seu projeto precisa disso, eu digo na primeira resposta.",
  },
];
