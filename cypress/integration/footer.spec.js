describe("Footer", () => {
  context("with a single todo", () => {
    it("displays a singular todo in count", () => {
      cy.seedAndVisit([{ id: 1, name: "test", isComplete: false }]);
      cy.get(".todo-count").should("contain", "1 todo left");
    });
  });
  context("with multiple todos", () => {
    beforeEach(() => {
      cy.seedAndVisit();
    });
    it("displays multiple todos in count", () => {
      cy.get(".todo-count").should("contain", "2 todos left");
    });
    it("handle filter todos", () => {
      const filters = [
        { link: "Active", expectedLength: 2 },
        { link: "Completed", expectedLength: 1 },
      ];
      cy.wrap(filters).each((filter) => {
        cy.contains(filter.link).click();
        cy.get(".todo-list li").should("have.length", filter.expectedLength);
      });
    });

    // it.only("filter to active todos", () => {
    //   cy.contains("Completed").click();
    //   cy.get(".todo-list li").should("have.length", 1);
    // });
  });
});
