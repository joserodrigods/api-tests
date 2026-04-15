# language: en
# Reference file: copy sections for new features. Do not implement these steps literally.
# Tag with @template to exclude from `npm test` (see cucumber.js: tags not @template).

@template @doc
Feature: Feature title (business behavior or API behavior name)
  Optional free text: context, scope, documentation links, or acceptance criteria in natural language.

  # Tags can be placed on Feature, Rule, Scenario, Scenario Outline, or Examples.
  # Common conventions (not reserved words): @smoke @regression @wip @skip @api

  Background:
    # Steps executed before each scenario in this feature (common setup).
    Given a background step not implemented yet

  Rule: Business rule or invariant grouping related scenarios
    Optional rule description.

    @rule-example
    Scenario: expected behavior when the rule applies
      Given a precondition
      When an action occurs
      Then an observable result should occur

  @parameterized
  Scenario Outline: same flow with different data (data-driven)
    Given the resource identifier is "<id>"
    When I request the resource details
    Then the response status should be HTTP <status_code>

    @api-cases
    Examples:
      | id        | status_code |
      | abc123    | 200         |
      | invalid   | 404         |

  Scenario: using a data table in a step (Data Table)
    Given there are the following items in the list:
      | name   | quantity |
      | item A | 2          |
      | item B | 1          |
    When I consolidate the list
    Then the total number of items should be 3

  Scenario: using long text or payload (Doc String)
    When I send the following JSON body to the API:
      """
      {
        "name": "example",
        "active": true
      }
      """
    Then the response status should be HTTP 201

  @smoke
  Scenario: minimal critical flow example (smoke = quick check of essentials)
    Given minimal preconditions for the system to be usable
    When I execute the main flow action
    Then I obtain success without blocking errors
