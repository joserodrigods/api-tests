# language: en
@auth
Feature: Autenticacao para a API HTTP configurada
  Validar que as credenciais permitem chamadas bem-sucedidas aos endpoints usados por este projeto.

  Background:
    Given que as credenciais estao configuradas no ambiente

  Scenario: credenciais validas retornam o membro autenticado
    When eu solicitar o membro autenticado da API
    Then o status da resposta deve ser HTTP 200
    And o corpo deve conter o identificador do membro

  Scenario: credenciais validas permitem acesso ao quadro configurado
    When eu solicitar o quadro configurado no ambiente
    Then o status da resposta deve ser HTTP 200
    And o corpo deve conter o identificador do quadro

  Scenario: autenticacao falha sem API key
    When eu solicitar o membro autenticado sem API key
    Then o status da resposta deve ser HTTP 401
    And o corpo deve conter mensagem de erro de autenticacao

  Scenario: autenticacao falha com token invalido
    When eu solicitar o membro autenticado com token invalido
    Then o status da resposta deve ser HTTP 401
    And o corpo deve conter mensagem de erro de autenticacao
