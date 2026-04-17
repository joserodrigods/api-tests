# language: en
@e2e @happy-path @crud @TC-API-501
Feature: Fluxo ponta a ponta do desafio no quadro configurado
  Um unico cenario alinhado a prova pratica: autenticar na API, criar um card,
  editar esse card, excluir e confirmar que ele nao existe mais (limpeza do card criado neste fluxo).
  Impacto: valida o fluxo principal de negocio em ponta a ponta com rastreabilidade unica.

  Scenario: deve executar fluxo E2E de autenticacao, criacao, edicao e exclusao do card
    Given que as credenciais estao configuradas no ambiente
    And que a lista de tarefas esta configurada no ambiente
    When eu solicitar o membro autenticado da API
    Then o status da resposta deve ser HTTP 200
    And o corpo deve conter o identificador do membro
    When eu criar um card para o fluxo E2E com nome "Card E2E - Desafio Sensedia" e descricao "Descricao inicial E2E"
    Then o status da resposta deve ser HTTP 200
    And o corpo da resposta deve conter um identificador de card
    When eu editar o nome do card para "Card E2E - Desafio Sensedia (editado)"
    Then o status da resposta deve ser HTTP 200
    And o nome do card deve ser "Card E2E - Desafio Sensedia (editado)"
    When eu editar a descricao do card para "Descricao do fluxo E2E - desafio"
    Then o status da resposta deve ser HTTP 200
    And a descricao do card deve ser "Descricao do fluxo E2E - desafio"
    When eu excluir o card criado
    Then o status da resposta deve ser HTTP 200
    And o corpo deve confirmar exclusao do card
    When eu buscar o card criado via GET
    Then o status da resposta deve ser um dos HTTP 400 ou 404
