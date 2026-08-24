---
name: seo
description: SEO, conteúdo e copy do tiagodanin.com. Roteia para 22 sub-skills especializadas (auditoria técnica de SEO, AI SEO/AEO, schema/JSON-LD, arquitetura de site, SEO programático, estratégia de conteúdo, copywriting, revisão de copy, CRO, analytics, e-mail, social, vídeo, imagem, lançamento, PR, diretórios, comparativos com concorrentes, lead magnets, free tools, ideias de marketing, contexto de produto). Use sempre que o pedido envolver ranquear no Google ou em LLMs, meta tags, títulos, descriptions, canonical, hreflang, sitemap, structured data, palavras-chave, tráfego orgânico, indexação, Core Web Vitals, escrever ou revisar texto de página, headline, CTA, bio, release, newsletter, post de LinkedIn/Twitter, divulgar um post ou projeto, conversão de visitantes, tracking/GA4, ou pedidos vagos como "melhora o SEO", "esse texto tá fraco", "como divulgo isso", "ninguém acha meu site". Também use antes de criar ou editar páginas e posts, quando o texto for encostar no visitante.
---

# SEO e conteúdo do tiagodanin.com

Esta skill é um **roteador**. O trabalho de verdade está nas sub-skills em subpastas daqui — cada uma é uma skill completa da biblioteca [marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT, Corey Haines), com seus próprios `references/`.

Elas vivem aqui dentro em vez de soltas em `.claude/skills/` por um motivo prático: 22 skills soltas seriam 22 descrições permanentemente no contexto, competindo entre si e disparando torto. Uma entrada só, que abre a sub-skill certa sob demanda, custa quase nada e escolhe melhor.

## Como usar

1. Leia o índice abaixo e escolha a sub-skill (ou as duas ou três) que cobrem o pedido.
2. Leia `<sub-skill>/SKILL.md` **inteiro** antes de agir. Os `references/` dela só quando o próprio SKILL.md mandar — é o que mantém o contexto enxuto.
3. Aplique as **adaptações ao projeto** desta página. Elas têm precedência sobre a sub-skill.
4. Na dúvida entre duas, leia as duas: são curtas e a sobreposição costuma ser esclarecedora.

Se o pedido for claramente uma coisa só ("adiciona JSON-LD na página de post"), vá direto na sub-skill. Não leia o índice inteiro em voz alta para o usuário nem peça permissão para abrir um arquivo.

## Índice de roteamento

### SEO técnico e descoberta
| Sub-skill | Quando |
|---|---|
| `seo-audit/` | Diagnóstico geral, "por que não ranqueio", meta tags, on-page, Core Web Vitals, indexação. Porta de entrada para pedidos vagos de SEO. |
| `ai-seo/` | Ser citado por LLMs (AEO, GEO, LLMO), aparecer em respostas de IA, `llms.txt`. |
| `schema/` | JSON-LD, structured data, rich snippets. |
| `site-architecture/` | Hierarquia de páginas, navegação, estrutura de URL, internal linking, sitemap visual. |
| `programmatic-seo/` | Páginas em escala a partir de dados/templates. Aqui é o caso de `/project/[type]/[slug]`, `/tags/[tag]`, `/skills/[slug]`. |
| `competitors/` | Páginas de comparação e "alternativa a X". |
| `directory-submissions/` | Submeter projetos a diretórios de dev/SaaS/AI para backlink e descoberta. |

### Conteúdo e texto
| Sub-skill | Quando |
|---|---|
| `content-strategy/` | O que escrever, calendário editorial, clusters de tópico, distribuição. |
| `copywriting/` | Escrever ou reescrever texto de página: home, sobre, serviços, hero, CTA. |
| `copy-editing/` | Revisar/melhorar texto que já existe, atualizar post antigo. |
| `emails/` | Newsletter, sequência, e-mail de lifecycle. |
| `social/` | LinkedIn, Twitter/X, Instagram: posts, carrosséis, distribuição de um artigo. |
| `video/` | Roteiro e produção de vídeo, incluindo Remotion/HyperFrames. |
| `image/` | Capa de post, og:image, gráfico social, banner. |
| `public-relations/` | Release, pitch para jornalista, podcast, newsjacking. Alimenta `/press` e `/press-kit`. |
| `launch/` | Lançar um projeto, feature ou post: Product Hunt, anúncio, coordenação. |

### Conversão e medição
| Sub-skill | Quando |
|---|---|
| `cro/` | Estrutura da página para converter, formulários, fricção. |
| `analytics/` | GA4, GTM, eventos, tracking de conversão. |
| `lead-magnets/` | Material em troca de e-mail. |
| `free-tools/` | "Engineering as marketing": ferramentinha gratuita como canal. |

### Fundação e ideias
| Sub-skill | Quando |
|---|---|
| `product-marketing/` | Posicionamento, ICP, contexto que as outras skills leem. Ver a nota abaixo antes de rodar. |
| `marketing-ideas/` | Está sem ideia, quer ângulos de divulgação. |

`tools/` guarda o registro de integrações e CLIs que algumas sub-skills citam (`tools/integrations/ga4.md`, `tools/REGISTRY.md` etc.). Abra só quando a sub-skill apontar para lá.

### Nomes que as sub-skills citam mas não existem aqui

Só 22 das 50 skills do repo foram copiadas — as demais eram de SaaS B2B e não se aplicam a um site pessoal. Quando um `## Related Skills` mandar ver `ab-testing`, `ad-creative`, `ads`, `aso`, `attribution`, `churn-prevention`, `community-marketing`, `marketing-plan`, `marketing-psychology`, `onboarding`, `popups`, `referrals`, `revops`, `sales-enablement` ou `signup`, **não procure a pasta**: ela não está aqui. Siga com o que você tem e, se aquilo era mesmo essencial, diga ao usuário qual skill falta em vez de improvisar um substituto silencioso.

## Adaptações ao projeto

As sub-skills foram escritas para SaaS com trial, pricing e funil de vendas. Este projeto é outra coisa, e aplicá-las ao pé da letra produz recomendações que não fazem sentido. Traduza:

**O "produto" é a marca pessoal do Tiago.** Não há preço, trial, checkout, onboarding nem churn. A conversão que importa é: alguém ler um post até o fim, seguir, assinar, mandar mensagem, contratar, ou usar um projeto open source. Quando uma sub-skill falar em "signup" ou "activation", mapeie para o equivalente real (contato, download do CV, clique no repositório) ou pule a seção e diga que pulou.

**Posicionamento já existe.** `PRODUCT.md` e `DESIGN.md` na raiz são a fonte de verdade de registro, público, personalidade e anti-referências. Leia antes de qualquer coisa que produza texto ou layout. Se `product-marketing/` for rodar e quiser criar `.agents/product-marketing.md`, derive dele o que já está em `PRODUCT.md` em vez de entrevistar o usuário de novo — e nunca escreva ali algo que contradiga o `PRODUCT.md`. Os dois arquivos são git-ignored; não os cite como se fossem públicos.

**Copy vai para `contents/`, nunca para o código.** Esta é a regra mais fácil de quebrar seguindo uma sub-skill, porque elas mandam "atualize o hero da homepage" e o caminho preguiçoso é editar o JSX. Não faça isso. Prosa editável mora em `contents/<collection>/index.json` (ou `.mdx`, para posts e talks) e é lida com `queryCollection`. Se a copy nova não tem coleção, crie a coleção e o schema em `studio.config.ts`. O `CLAUDE.md` da raiz detalha o padrão.

**Tudo é bilíngue EN/PT, com peso igual.** Rotas de conteúdo existem em duas versões (`/post/[slug]` e `/post/[slug]/pt`), e o idioma de post/talk vem do sufixo do arquivo (`.pt.mdx`). Copy nova nasce nos dois idiomas, não em inglês com "traduzir depois". Português é o do Brasil, com acentuação correta; não é tradução literal do inglês.

**Restrições de escrita do projeto valem acima da sub-skill.** Sem em-dash (—) em copy de interface: en-dash só em intervalo de datas, vírgula no resto (prosa de blog é livre). Sem copy de template SaaS ("We help X grow", "Let's build something amazing"). Sem hype. O princípio do `PRODUCT.md` é **show, don't tell**: um link para o repositório vale mais que um adjetivo.

**O site é estático.** Export do Next para GitHub Pages, sem servidor, sem A/B test em runtime, sem personalização por visitante, sem redirect dinâmico. Recomendação que dependa de servidor precisa virar solução de build time ou ser descartada com uma frase explicando por quê. Metadata sai de `generateMetadata` por página, com origem hardcoded; sitemaps e RSS são gerados por script.

**Não rode build nem script de dados por conta própria.** `yarn build`, `yarn deploy` e os `data:*` são lentos e sobrescrevem arquivos gerados: só com autorização explícita do usuário.

## Sobre citar métricas

Várias sub-skills trazem benchmarks numéricos (taxa de abertura, CTR, conversão típica). Eles vêm do repo upstream, são de SaaS B2B e não foram verificados para este contexto. Use como ordem de grandeza para decidir, não como fato para escrever numa página do site. Se um número desses for parar em texto público, ele precisa de fonte real.

---

Sub-skills sob `seo/` são de [marketingskills](https://github.com/coreyhaines31/marketingskills) por Corey Haines, licença MIT (cópia em `LICENSE`). Foram copiadas sem alteração de conteúdo — atualizar significa recopiar do upstream, então evite editá-las: ajustes específicos deste projeto pertencem a este arquivo.
