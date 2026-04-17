# language: en
@create
Feature: Criar card no quadro configurado
  Validar que a API consegue criar cards na lista usada por este projeto.

  Background:
    Given que as credenciais estao configuradas no ambiente
    And que a lista de tarefas esta configurada no ambiente

  Scenario: criar um card com nome e id da lista validos
    When eu criar um card chamado "Card de Teste - Automacao QA" na lista de tarefas configurada no ambiente
    Then o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  Scenario: criar um card sem nome
    When eu criar um card sem nome na lista de tarefas configurada no ambiente
    Then o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  Scenario: criar um card falha quando o id da lista nao existe
    When eu tentar criar um card chamado "Card Teste" no id de lista "lista-que-nao-existe-123"
    Then o status da resposta deve ser HTTP 400

  Scenario: criar um card sem autenticacao
    When eu tentar criar um card sem autenticacao
    Then o status da resposta deve ser HTTP 401
