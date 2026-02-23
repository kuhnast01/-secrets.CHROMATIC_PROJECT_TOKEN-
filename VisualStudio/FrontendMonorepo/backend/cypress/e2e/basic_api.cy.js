describe('API E2E Smoke Test', () => {
  it('GET /healthz should return 200', () => {
    cy.request('/healthz').its('status').should('eq', 200);
  });
  it('GET /events should return 200', () => {
    cy.request('/events').its('status').should('eq', 200);
  });
  it('GET /users should return 200', () => {
    cy.request('/users').its('status').should('eq', 200);
  });
});
