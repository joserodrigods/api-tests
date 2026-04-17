# language: en
@create @crud
Feature: Criar card no quadro configurado
  Validar que a API consegue criar cards na lista usada por este projeto.
  Impacto: garante que usuarios consigam registrar tarefas corretamente no sistema.

  Background:
    Given que as credenciais estao configuradas no ambiente
    And que a lista de tarefas esta configurada no ambiente

  @TC-API-101 @happy-path
  Scenario: deve retornar 200 ao criar card com nome e id da lista validos
    When eu criar um card chamado "Card de Teste - Automacao QA" na lista de tarefas configurada no ambiente
    Then o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  @TC-API-102 @edge-case
  Scenario: deve retornar 200 ao criar card sem nome informado
    When eu criar um card sem nome na lista de tarefas configurada no ambiente
    Then o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  @TC-API-103 @negative
  Scenario: deve retornar 400 ao criar card com id de lista inexistente
    When eu tentar criar um card chamado "Card Teste" no id de lista "lista-que-nao-existe-123"
    Then o status da resposta deve ser HTTP 400

  @TC-API-104 @negative
  Scenario: deve retornar 401 ao tentar criar card sem autenticacao
    When eu tentar criar um card sem autenticacao
    Then o status da resposta deve ser HTTP 401
