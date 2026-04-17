# language: en
@delete
Feature: Excluir card no quadro configurado
  Validar que a API consegue excluir cards e tratar erros esperados.

  Background:
    Given que as credenciais estao configuradas no ambiente
    And que a lista de tarefas esta configurada no ambiente
    And eu criar um card chamado "Card Base - Delete QA" na lista de tarefas configurada no ambiente
    And o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  Scenario: excluir card criado e confirmar exclusao via GET
    When eu excluir o card criado
    Then o status da resposta deve ser HTTP 200
    And o corpo deve confirmar exclusao do card
    When eu buscar o card criado via GET
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  Scenario: tentar excluir card ja excluido
    When eu excluir o card criado
    Then o status da resposta deve ser HTTP 200
    When eu excluir o card criado novamente
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  Scenario: tentar excluir card com id invalido
    When eu tentar excluir o card com o id "id-invalido-123"
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  Scenario: excluir card sem autenticacao
    When eu tentar excluir o card criado sem autenticacao
    Then o status da resposta deve ser um dos HTTP 401 ou 403
