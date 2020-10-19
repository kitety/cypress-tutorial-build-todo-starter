describe("Input Form", () => {
  beforeEach(() => {
    cy.seedAndVisit([]);
  });
  it("should focus input onload", () => {
    cy.focused().should("have.class", "new-todo");
  });
  it("accepts input", () => {
    const typeText = "hello cypress";
    cy.get(".new-todo").type(typeText).should("have.value", typeText);
  });
  context("Form submission", () => {
    beforeEach(() => {
      cy.server();
    });
    it("add a new todo on submit", () => {
      const itemText = "hello cypress";
      cy.route("POST", "/api/todos", {
        name: itemText,
        id: 1,
        isComplete: false,
      });
      cy.get(".new-todo")
        .type(itemText)
        .type("{enter}")
        .should("have.value", "");
      cy.get(".todo-list li").should("have.length", 1).and("contain", itemText);
    });
    it("shows an error message on a failed submit", () => {
      cy.route({
        url: "/api/todos",
        method: "POST",
        status: 500,
        response: {},
      });
      cy.get(".new-todo").type("{enter}");
      cy.get(".todo-list li").should("not.exist");
      cy.get(".error").should("be.visible");
    });
  });
});
