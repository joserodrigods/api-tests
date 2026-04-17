# Exemplo de BDD para API

Pequeno projeto em **Cucumber.js** + **Axios** para verificações de caixa-preta em uma API HTTP que usa autenticação na query string e recursos escopados por board.

Este repositório mantém nomes e documentação propositalmente genéricos. Aponte `API_BASE_URL` e as credenciais no `.env` para o host REST que você usar nas suas execuções.

## Arquitetura

![Visão geral das camadas do projeto](docs/architecture_overview.svg)

Em `step_definitions/`, cada `0X_….steps.js` acompanha o `0X_….feature` correspondente; o arquivo `00.shared.steps.js` concentra steps reutilizados (credenciais e checagem de status HTTP).

## Pré-requisitos

- Node.js (compatível com as dependências do `package.json`)
- Credenciais da API e IDs de recursos configurados no `.env` (veja `.env.example`)

## Configuração

```bash
npm install
```

Copie `.env.example` para `.env` e preencha com valores reais.

Se você já usou nomes antigos de variáveis em um fork privado, renomeie-as para bater com o `.env.example` (`API_BASE_URL`, `API_KEY`, `API_TOKEN`, `BOARD_ID`, …).

## Executar os testes

```bash
# Suite completa do Cucumber (o perfil padrão exclui @template)
npm test

# Apenas cenários de autenticação (@auth)
npm run test:auth

# Apenas o cenário de desafio end-to-end (@e2e)
npm run test:e2e

# Verificação rápida do .env e GETs de exemplo (curl)
npm run test:env

# Limpar o board no Trello: remove todos os cards do BOARD_ID (use só em board de teste)
npm run cleanup:trello
```

## Relatório HTML

O relatório é gerado a partir do JSON do Cucumber (`results/cucumber-report.json`) e convertido para HTML (`results/cucumber-report.html`) pelo script `scripts/generate-report.js`. O HTML inclui o layout padrão do **cucumber-html-reporter**, um bloco de **resumo executivo** no topo (sucesso %, totais, tempo, ambiente a partir do `.env`) e, nos steps, **anexos só em falha de assert de status** e notas de **performance** quando a duração da requisição é medida.

Para gerar JSON + HTML após uma execução completa:

```bash
npm run test:report
```

### Convenção de IDs `TC-API-xxx`

`TC` significa **Test Case** (caso de teste). O sufixo numérico agrupa por **feature / fluxo**; os últimos dígitos são a ordem dentro daquele grupo. É convenção do repositório até alinhar com IDs oficiais de ferramenta (Jira, TestRail, Azure DevOps, etc.).

| Faixa de ID        | Feature / fluxo                          |
| ------------------ | ---------------------------------------- |
| `TC-API-001`–`099` | `01_authentication`                      |
| `TC-API-101`–`199` | `02_create_card`                         |
| `TC-API-201`–`299` | `03_edit_card`                           |
| `TC-API-301`–`399` | `04_delete_card`                         |
| `TC-API-401`–`499` | `05_move_card`                           |
| `TC-API-501`+      | `06_e2e` e demais fluxos ponta a ponta   |

### Tags por feature (filtro no npm)

| Tag       | Comando típico        | Arquivo de feature |
| --------- | --------------------- | ------------------ |
| `@auth`   | `npm run test:auth`   | `01_authentication` |
| `@create` | `npm run test:create` | `02_create_card`    |
| `@edit`   | `npm run test:edit`   | `03_edit_card`      |
| `@delete` | `npm run test:delete` | `04_delete_card`    |
| `@move`   | `npm run test:move`   | `05_move_card`      |
| `@e2e`    | `npm run test:e2e`    | `06_e2e`            |

### Tags de estratégia (leitura do relatório)

| Tag           | Significado                                                                 |
| ------------- | ----------------------------------------------------------------------------- |
| `@crud`       | Escopo amplo de operações sobre cards (criar, alterar, mover, excluir).       |
| `@critical`   | Cenários considerados bloqueantes para o restante da suíte.                 |
| `@happy-path` | Caminho feliz / resposta de sucesso esperada (ex.: HTTP 200).                 |
| `@negative`   | Erro ou negação esperada (ex.: 401, 400, 404 conforme o cenário).            |
| `@edge-case`  | Limite ou variação menos trivial (ids inválidos, token inválido, etc.).     |

## Limpar dados de teste no Trello

Se a automação deixou muitos cards no board configurado no `.env`, você pode remover **todos** os cards desse board (abertos e arquivados):

```bash
npm run cleanup:trello
```

**Atenção:** o script usa `BOARD_ID` do `.env` e apaga todos os cards retornados pela API do Trello para esse board. Use apenas em um **board dedicado a testes**.

