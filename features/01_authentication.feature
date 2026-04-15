# language: en
@auth
Feature: Authentication for the configured HTTP API
  Validate that credentials allow successful calls to the endpoints used by this harness.

  Background:
    Given credentials are configured in the environment

  @smoke
  Scenario: valid credentials return the authenticated member
    When I request the authenticated member from the API
    Then the response status should be HTTP 200
    And the body should contain the member identifier

  Scenario: valid credentials allow access to the configured board
    When I request the board configured in the environment
    Then the response status should be HTTP 200
    And the body should contain the board identifier
