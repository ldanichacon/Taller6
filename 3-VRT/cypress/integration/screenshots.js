describe('Screenshots paleta aleatoria', function() {
  it('Visits paleta de colores, generates two screenshots', function() {
    cy.visit('https://lawchacon.github.io/')
    cy.contains('Generar nueva paleta').click()
    cy.screenshot('1st')
    cy.contains('Generar nueva paleta').click()
    cy.screenshot('2nd')
  })
})