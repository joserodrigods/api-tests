# language: en
@move @crud
Feature: Transitar card entre listas do quadro configurado
  Validar que a API consegue mover um card entre listas e tratar erros esperados.
  Impacto: garante fluidez do fluxo Kanban com transicoes corretas entre etapas.

  Background:
    Given que as credenciais estao configuradas no ambiente
    And que a lista de tarefas esta configurada no ambiente
    And que as listas de transicao estao configuradas no ambiente
    And eu criar um card chamado "Card Base - Move QA" na lista de tarefas configurada no ambiente
    And o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card

  @TC-API-401 @happy-path
  Scenario: deve retornar 200 ao mover card da lista to do para em progresso
    When eu mover o card criado para a lista em progresso configurada
    Then o status da resposta deve ser HTTP 200
    And o idList do card deve ser o da lista em progresso configurada
    And o idBoard do card deve ser o do quadro configurado

  @TC-API-402 @happy-path
  Scenario: deve retornar 200 ao mover card de em progresso para concluido
    When eu mover o card criado para a lista em progresso configurada
    Then o status da resposta deve ser HTTP 200
    When eu mover o card criado para a lista concluida configurada
    Then o status da resposta deve ser HTTP 200
    And o idList do card deve ser o da lista concluida configurada
    And o campo dateLastActivity do card nao deve ser nulo

  @TC-API-403 @negative
  Scenario: deve retornar 400 ou 404 ao mover card para lista inexistente
    When eu tentar mover o card criado para a lista de id "lista-que-nao-existe-123"
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  @TC-API-404 @negative @edge-case
  Scenario: deve retornar 400 ou 404 ao mover card com id de card invalido
    When eu tentar mover o card com o id "id-invalido-123" para a lista to do configurada
    Then o status da resposta deve ser um dos HTTP 400 ou 404

  @TC-API-405 @negative
  Scenario: deve retornar 401 ou 403 ao tentar mover card sem autenticacao
    When eu tentar mover o card criado para a lista to do configurada sem autenticacao
    Then o status da resposta deve ser um dos HTTP 401 ou 403
