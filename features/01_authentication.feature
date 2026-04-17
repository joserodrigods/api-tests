# language: en
@auth @critical @crud
Feature: Autenticacao para a API HTTP configurada
  Validar que as credenciais permitem chamadas bem-sucedidas aos endpoints usados por este projeto.
  Impacto: garante acesso seguro e confiavel aos recursos principais da API.

  Background:
    Given que as credenciais estao configuradas no ambiente

  @TC-API-001 @happy-path
  Scenario: deve retornar 200 ao consultar membro autenticado com credenciais validas
    When eu solicitar o membro autenticado da API
    Then o status da resposta deve ser HTTP 200
    And o corpo deve conter o identificador do membro

  @TC-API-002 @happy-path
  Scenario: deve retornar 200 ao consultar quadro configurado com credenciais validas
    When eu solicitar o quadro configurado no ambiente
    Then o status da resposta deve ser HTTP 200
    And o corpo deve conter o identificador do quadro

  @TC-API-003 @negative
  Scenario: deve retornar 401 ao consultar membro autenticado sem API key
    When eu solicitar o membro autenticado sem API key
    Then o status da resposta deve ser HTTP 401
    And o corpo deve conter mensagem de erro de autenticacao

  @TC-API-004 @negative @edge-case
  Scenario: deve retornar 401 ao consultar membro autenticado com token invalido
    When eu solicitar o membro autenticado com token invalido
    Then o status da resposta deve ser HTTP 401
    And o corpo deve conter mensagem de erro de autenticacao
