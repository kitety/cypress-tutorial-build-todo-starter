const hostUrl = "http://localhost:3030";
describe("Smoke Test", () => {
  // EMPTY ARRAY
  beforeEach(() => {
    cy.request("GET", "/api/todos")
      .its("body")
      .each((todo) => cy.request("DELETE", `/api/todos/${todo.id}`));
  });
  context("with no todos", () => {
    it("saves new todos", () => {
      const items = [
        { text: "eggs", expectedLength: 1 },
        { text: "milk", expectedLength: 2 },
        { text: "flower", expectedLength: 3 },
      ];
      cy.visit("/");
      cy.server();
      cy.route("POST", "/api/todos").as("create");

      cy.wrap(items).each((todo) => {
        cy.focused().type(`${todo.text}{enter}`);
        // 等待延时
        cy.wait("@create");
        cy.get(".todo-list li").should("have.length", todo.expectedLength);
      });
    });
  });
  context("with active todos", () => {
    beforeEach(() => {
      cy.fixture("todos").each((todo) => {
        const newTodo = Cypress._.merge(todo, { isComplete: false });
        cy.request("POST", "/api/todos", newTodo);
      });
      cy.visit("/");
    });
    it("loading exist data from db", () => {
      cy.get(".todo-list li").should("have.length", 3);
    });
    it("delete todo", () => {
      cy.server();
      cy.route("DELETE", "/api/todos/*").as("delete");

      cy.get(".todo-list li")
        .each(($el) => {
          cy.wrap($el).find(".destroy").invoke("show").click();
          cy.wait("@delete");
        })
        .should("not.exist");
    });
    it("toggle todo", () => {
      const clickAndWait = ($el) => {
        cy.wrap($el).as("item").find(".toggle").click();
        cy.wait("@update");
      };
      cy.server();
      cy.route("PUT", "/api/todos/*").as("update");

      cy.get(".todo-list li")
        .each(($el) => {
          clickAndWait($el);
          cy.get("@item").should("have.class", "completed");
        })
        .each(($el) => {
          clickAndWait($el);
          cy.get("@item").should("not.have.class", "completed");
        });
    });
  });
});
