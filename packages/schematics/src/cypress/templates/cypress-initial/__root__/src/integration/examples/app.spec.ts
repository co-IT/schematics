describe('App', () => {
  beforeEach(() => cy.visit('/'));

  it('should have a body', () => {
    cy.get('body').should('be.visible');
  });
});
