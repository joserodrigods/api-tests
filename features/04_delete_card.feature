# language: en
@delete @crud
Feature: Excluir card no quadro configurado
  Validar que a API consegue excluir cards e tratar erros esperados.
  Impacto: garante higiene dos dados e evita acumulo de cards obsoletos no quadro.

  Background:
    Given que as credenciais estao configuradas no ambiente
    And que a lista de tarefas esta configurada no ambiente
    And eu criar um card chamado "Card Base - Delete QA" na lista de tarefas configurada no ambiente
    And o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  @TC-API-301 @happy-path
  Scenario: deve retornar 200 ao excluir card criado e 400 ou 404 ao consultar depois
    When eu excluir o card criado
    Then o status da resposta deve ser HTTP 200
    And o corpo deve confirmar exclusao do card
    When eu buscar o card criado via GET
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  @TC-API-302 @negative
  Scenario: deve retornar 400 ou 404 ao tentar excluir card que ja foi removido
    When eu excluir o card criado
    Then o status da resposta deve ser HTTP 200
    When eu excluir o card criado novamente
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  @TC-API-303 @negative @edge-case
  Scenario: deve retornar 400 ou 404 ao excluir card com id invalido
    When eu tentar excluir o card com o id "id-invalido-123"
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  @TC-API-304 @negative
  Scenario: deve retornar 401 ou 403 ao tentar excluir card sem autenticacao
    When eu tentar excluir o card criado sem autenticacao
    Then o status da resposta deve ser um dos HTTP 401 ou 403
