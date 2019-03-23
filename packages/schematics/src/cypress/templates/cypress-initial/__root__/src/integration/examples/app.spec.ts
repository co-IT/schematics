describe('App', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h1').contains('Welcome to angular-cypress-with-nxbuilder!');
  });
});
