describe('Admin Panel UI E2E', () => {
  it('loads the dashboard', () => {
    cy.visit('/');
    cy.contains('Event Composer');
  });
  it('can fetch events from API', () => {
    cy.request(Cypress.env('VITE_API_URL') + '/events').its('status').should('eq', 200);
  });
});
