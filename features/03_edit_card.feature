# language: en
@edit @crud
Feature: Editar card no quadro configurado
  Validar que a API consegue editar diferentes atributos de um card existente.
  Impacto: garante consistencia na atualizacao das tarefas durante o fluxo de trabalho.

  Background:
    Given que as credenciais estao configuradas no ambiente
    And que a lista de tarefas esta configurada no ambiente
    And eu criar um card chamado "Card Base - Automacao QA" na lista de tarefas configurada no ambiente
    And o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  @TC-API-201 @happy-path
  Scenario: deve retornar 200 ao editar nome do card
    When eu editar o nome do card para "Card Editado - Automacao QA"
    Then o status da resposta deve ser HTTP 200
    And o nome do card deve ser "Card Editado - Automacao QA"

  @TC-API-202 @happy-path
  Scenario: deve retornar 200 ao editar descricao do card
    When eu editar a descricao do card para "Descricao adicionada pela automacao QA"
    Then o status da resposta deve ser HTTP 200
    And a descricao do card deve ser "Descricao adicionada pela automacao QA"

  @TC-API-203 @happy-path
  Scenario: deve retornar 200 ao adicionar data de vencimento no card
    When eu definir a data de vencimento do card para "2026-12-31T23:59:00.000Z"
    Then o status da resposta deve ser HTTP 200
    And a data de vencimento do card deve conter "2026-12-31"

  @TC-API-204 @happy-path
  Scenario: deve retornar 200 ao marcar data de vencimento como concluida
    Given que o card possui data de vencimento definida em "2026-12-31T23:59:00.000Z"
    When eu marcar a data de vencimento do card como concluida
    Then o status da resposta deve ser HTTP 200
    And o campo dueComplete do card deve ser true

  @TC-API-205 @happy-path
  Scenario: deve retornar 200 ao adicionar label no card
    When eu adicionar a label "green" no card criado
    Then o status da resposta deve ser HTTP 200
    And o card deve conter a label "green"

  @TC-API-206 @happy-path
  Scenario: deve retornar 200 ao adicionar membro no card
    When eu adicionar o membro autenticado no card criado
    Then o status da resposta deve ser HTTP 200
    And o card deve conter o membro autenticado

  @TC-API-207 @happy-path
  Scenario: deve retornar 200 ao alterar posicao do card na lista
    When eu alterar a posicao do card para "top"
    Then o status da resposta deve ser HTTP 200
    And a posicao do card deve ser numerica

  @TC-API-208 @happy-path
  Scenario: deve retornar 200 ao arquivar card
    When eu arquivar o card criado
    Then o status da resposta deve ser HTTP 200
    And o campo closed do card deve ser true

  @TC-API-209 @negative
  Scenario: deve retornar 400 ou 404 ao editar card com id inexistente
    When eu tentar editar o nome do card para "Card Invalido" usando o id "card-que-nao-existe-123"
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  @TC-API-210 @negative
  Scenario: deve retornar 401 ou 403 ao editar card sem autenticacao
    When eu tentar editar o card sem autenticacao
    Then o status da resposta deve ser um dos HTTP 401 ou 403
