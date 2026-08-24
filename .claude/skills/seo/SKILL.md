---
name: seo
description: SEO, conteúdo e copy do tiagodanin.com. Roteia e combina 22 sub-skills especializadas (auditoria técnica de SEO, AI SEO/AEO, schema/JSON-LD, arquitetura de site, SEO programático, estratégia de conteúdo, copywriting, revisão de copy, CRO, analytics, e-mail, social, vídeo, imagem, lançamento, PR, diretórios, páginas de comparação, lead magnets, free tools, ideias de marketing, posicionamento). Use sempre que o pedido envolver ranquear no Google ou em LLMs, meta tags, títulos, description, canonical, hreflang, sitemap, structured data, palavras-chave, tráfego orgânico, indexação, Core Web Vitals, escrever ou revisar texto de página, headline, CTA, bio, release, newsletter, post de LinkedIn/Twitter, divulgar um post ou projeto, converter visitante, tracking/GA4, ou pedidos vagos como "melhora o SEO", "esse texto tá fraco", "como divulgo isso", "ninguém acha meu site". Também antes de criar ou editar qualquer página, post ou copy que o visitante vá ler.
---

# SEO e conteúdo do tiagodanin.com

Roteador de 22 sub-skills da biblioteca [marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT, Corey Haines), cada uma completa com seus `references/`, em subpastas daqui.

Estão agrupadas por dois motivos. O primeiro é custo: 22 descrições soltas em `.claude/skills/` ficariam permanentemente no contexto competindo entre si. O segundo é o que importa no dia a dia: **quase toda tarefa real precisa de mais de uma**. Publicar um post não é "copywriting", é ângulo + texto + on-page + schema + capa + distribuição. Agrupadas, dá para encadear numa entrega só em vez de disparar cinco skills que não conversam.

## Fluxo

1. **Leia o contexto do projeto primeiro.** `PRODUCT.md` e `DESIGN.md` na raiz definem registro, público e limites visuais; `CLAUDE.md` define onde o conteúdo mora. Sem isso as sub-skills produzem copy de SaaS genérico.
2. **Escolha as sub-skills.** Uma é dona da entrega, as outras entram como etapas. Veja *Combinações*.
3. **Leia cada `<sub-skill>/SKILL.md` inteiro** antes de agir. Os `references/` só quando o próprio SKILL.md apontar: é o que segura o contexto.
4. **Entregue o resultado, não o relatório.** Cada sub-skill sabe produzir um documento longo de diagnóstico. Empilhar três vira ruído. O que vale aqui é o diff: o JSON da coleção, o `.mdx`, o `generateMetadata` corrigido. Diagnóstico só quando o usuário pediu diagnóstico, ou em três linhas antes do diff.

Se o pedido é uma coisa só ("adiciona JSON-LD no post"), vá direto na sub-skill. Não narre o roteamento nem peça permissão para abrir arquivo.

## Índice

**SEO técnico e descoberta**

| Sub-skill | Quando |
|---|---|
| `seo-audit/` | Diagnóstico geral, "por que não ranqueio", meta tags, on-page, Core Web Vitals, indexação. Porta de entrada para pedido vago de SEO. |
| `ai-seo/` | Ser citado por LLMs (AEO, GEO, LLMO), aparecer em resposta de IA, `llms.txt`. |
| `schema/` | JSON-LD, structured data, rich snippets. |
| `site-architecture/` | Hierarquia, navegação, estrutura de URL, internal linking. |
| `programmatic-seo/` | Páginas em escala a partir de dados. Aqui: `/project/[type]/[slug]`, `/tags/[tag]`, `/skills/[slug]`, `/timeline/[year]/[slug]`. |
| `competitors/` | Página de comparação, "alternativa a X". |
| `directory-submissions/` | Submeter projeto a diretórios para backlink e descoberta. |

**Conteúdo e texto**

| Sub-skill | Quando |
|---|---|
| `content-strategy/` | O que escrever, clusters de tópico, calendário, distribuição. |
| `copywriting/` | Escrever ou reescrever texto de página: hero, sobre, serviços, CTA. |
| `copy-editing/` | Revisar texto que já existe, atualizar post antigo. |
| `emails/` | Newsletter, sequência, e-mail de lifecycle. |
| `social/` | LinkedIn, Twitter/X, Instagram: post, carrossel, distribuição de artigo. |
| `video/` | Roteiro e produção, incluindo Remotion/HyperFrames. |
| `image/` | Capa de post, og:image, gráfico social, banner. |
| `public-relations/` | Release, pitch para jornalista, podcast, newsjacking. |
| `launch/` | Lançar projeto, feature ou post: Product Hunt, anúncio, coordenação. |

**Conversão e medição**

| Sub-skill | Quando |
|---|---|
| `cro/` | Estrutura da página para converter, formulário, fricção. |
| `analytics/` | GA4, GTM, eventos, tracking de conversão. |
| `lead-magnets/` | Material em troca de e-mail. |
| `free-tools/` | Ferramenta gratuita como canal ("engineering as marketing"). |

**Fundação**

| Sub-skill | Quando |
|---|---|
| `product-marketing/` | Posicionamento e ICP que as outras leem. Ver *Adaptações*. |
| `marketing-ideas/` | Sem ideia, quer ângulos de divulgação. |

`tools/` tem o registro de integrações e CLIs citado por algumas sub-skills (`tools/integrations/ga4.md`, `tools/REGISTRY.md`). Abra só quando apontarem para lá.

## Combinações

Pipelines para as tarefas que aparecem de verdade neste projeto. A primeira sub-skill é a dona; as seguintes são etapas dentro da mesma entrega, não relatórios paralelos. Adapte, não siga como receita cega: se uma etapa não muda nada no caso concreto, pule e diga que pulou.

| Tarefa | Encadeamento |
|---|---|
| Publicar post novo | `content-strategy` (ângulo, tags, cluster) → `copywriting` (texto EN+PT) → `seo-audit` (title, description, headings) → `schema` (Article) → `image` (capa e og) → `social` + `emails` (distribuição) |
| Melhorar post que já existe | `copy-editing` → `seo-audit` → `ai-seo` (citabilidade) → `schema` |
| Auditoria de SEO do site | `seo-audit` (diagnóstico) → `site-architecture` (URL, internal link) → `schema` → `ai-seo` → `analytics` (medir o que mudou) |
| Nova landing de serviço (`/mobile`, `/cybersecurity`, …) | `product-marketing` (ângulo e público) → `copywriting` → `cro` (estrutura, CTA) → `seo-audit` → `schema` (Service/FAQ) |
| Página convertendo mal | `cro` (estrutura primeiro) → `copy-editing` (texto depois) → `analytics` |
| Lançar projeto open source | `launch` → `copywriting` (README e página) → `social` → `public-relations` → `directory-submissions` |
| Páginas geradas em escala | `programmatic-seo` (template e dado) → `site-architecture` (URL, hierarquia) → `schema` → `seo-audit` (amostra de 3 páginas) |
| Imprensa e press kit | `public-relations` → `copywriting` (bios em `contents/bios`) → `image` (fotos em `contents/presskit`) |
| Captar e-mail | `lead-magnets` ou `free-tools` → `cro` (onde e como pedir) → `emails` (o que vem depois) |
| Ideias de divulgação | `marketing-ideas` → `content-strategy` (filtrar o que cabe) → a sub-skill do canal escolhido |

**Desempate quando duas parecem servir:** `copywriting` escreve do zero, `copy-editing` mexe no que existe. `cro` muda estrutura e oferta, `copywriting` muda palavras; se a página está mal montada, copy nova não salva, comece por `cro`. `seo-audit` é diagnóstico do que existe, `content-strategy` é decisão do que criar. `schema` implementa JSON-LD, `seo-audit` aponta que falta.

## Mapa: superfície do site → onde o conteúdo mora

Sub-skill nenhuma sabe disso, e é o que separa recomendação abstrata de patch aplicável.

| Superfície | Conteúdo |
|---|---|
| Home, hero, bio | `contents/about/`, `contents/expertise/` |
| Blog e posts | `contents/posts/*.mdx` (EN) e `*.pt.mdx` (PT) |
| Talks | `contents/talks/*.mdx` |
| Projetos | `contents/github/`, `npm/`, `private/`, `pypi/`, `luarocks/`, `atom/`, `googleplay/`, `windows/`, `aur/`, `offline/` |
| `/press` e `/press-kit` | `contents/press/`, `contents/presskit/`, `contents/bios/` |
| `/skills`, `/timeline`, `/services` | `contents/skills/`, `contents/timeline/`, `contents/work/`, `contents/volunteer/` |
| `/links`, `/all-contacts`, rodapé, menu | `contents/links/`, `contents/contacts/`, `contents/sociallinks/`, `contents/menu/` |
| Depoimentos | `contents/testimonials/` |
| Title, description, canonical, hreflang, OG | `generateMetadata` da própria página em `src/app/**` |
| Prioridade no sitemap | `next-sitemap.config.cjs`, função `transform` |

Landing pages de serviço vivem em `src/app/<slug>/page.tsx` (`mobile`, `web-development`, `cybersecurity`, `ai-automation`, `game-development`, `github-pages`, `chrome-extensions`, `mentorship`, `apps`) e leem coleções, e a copy delas continua sendo conteúdo, não JSX.

## Adaptações ao projeto

As sub-skills foram escritas para SaaS B2B com trial, preço e funil. Este site é outra coisa; ao pé da letra elas geram recomendação que não se aplica. Traduza:

**O "produto" é a marca pessoal do Tiago.** Não há preço, trial, checkout, onboarding nem churn. Conversão é ler um post até o fim, seguir, assinar, mandar mensagem, contratar, usar um projeto. Quando a sub-skill falar em "signup" ou "activation", mapeie para o equivalente real ou pule a seção dizendo que pulou.

**Posicionamento já existe.** `PRODUCT.md` e `DESIGN.md` são a fonte de verdade. Se `product-marketing/` for criar `.agents/product-marketing.md`, derive do `PRODUCT.md` em vez de entrevistar o usuário de novo, e nunca escreva ali algo que o contradiga. Os dois são git-ignored: não os cite como material público.

**Copy vai para `contents/`, nunca para o código.** É a regra mais fácil de quebrar seguindo uma sub-skill, porque elas dizem "atualize o hero" e o caminho preguiçoso é editar o JSX. Prosa editável mora em `contents/<collection>/index.json` (ou `.mdx`). Se não existe coleção para a copy nova, crie a coleção e o schema em `studio.config.ts`. Detalhe no `CLAUDE.md`.

**Bilíngue de verdade, EN e PT com peso igual.** Rotas de conteúdo existem em duas versões (`/post/[slug]` e `/post/[slug]/pt`); o idioma de post e talk vem do sufixo do arquivo. Copy nasce nos dois idiomas, não em inglês com "traduzo depois". Português é do Brasil, acentuado, e não é decalque do inglês: headline que só funciona em inglês precisa de outra headline em português, não de tradução.

**Restrições de escrita valem acima da sub-skill.** Sem em-dash (—) em copy de interface: en-dash só em intervalo de data, vírgula no resto (prosa de blog é livre). Sem copy de template SaaS ("We help X grow", "Let's build something amazing"). Sem hype. O princípio do `PRODUCT.md` é **show, don't tell**: link para o repositório vale mais que adjetivo.

**O site é estático.** Export do Next para GitHub Pages: sem servidor, sem A/B test em runtime, sem personalização por visitante, sem redirect dinâmico, sem captura de formulário sem serviço externo. Recomendação que dependa de servidor vira solução de build time ou é descartada com uma frase explicando por quê.

**Não rode build nem script de dados por conta própria.** `yarn build`, `yarn deploy` e os `data:*` são lentos e sobrescrevem arquivos gerados: só com autorização explícita.

## Números e nomes ausentes

As sub-skills trazem benchmarks (taxa de abertura, CTR, conversão típica) vindos de SaaS B2B, não verificados para este contexto. Servem para decidir, não para publicar. Número que for parar em página do site precisa de fonte real.

Só 22 das 50 skills do repo foram copiadas; o resto era vendas B2B. Quando um `## Related Skills` mandar ver `ab-testing`, `ad-creative`, `ads`, `aso`, `attribution`, `churn-prevention`, `community-marketing`, `marketing-plan`, `marketing-psychology`, `onboarding`, `popups`, `referrals`, `revops`, `sales-enablement` ou `signup`, a pasta não existe aqui: siga com o que tem e, se aquilo era essencial, diga qual falta em vez de improvisar substituto silencioso.

---

Sub-skills copiadas sem alteração de [marketingskills](https://github.com/coreyhaines31/marketingskills), MIT (cópia em `LICENSE`). Atualizar significa recopiar do upstream, então não as edite: ajuste específico deste projeto pertence a este arquivo.
