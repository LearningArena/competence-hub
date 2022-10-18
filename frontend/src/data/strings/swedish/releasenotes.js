export const swedishReleasenotes = {
  heading: 'Release notes',
  releaseText : 'Releasenote',
  aText : 'Svar',
  content: [
    {
      releasenotes: [
        {
          release: 'Version 1.7 - 15 juni 2021',
          content: '<h5>Användarorienterad utveckling</h5><ul><li><b>Förbättring</b>: Det går nu att själv begära lösenordsbyte vid inloggningsskärmen. Detta gjordes innan av backendutvecklarna, så är en tid och säkerhetsvinst för alla involverade.</li><li><b>Förbättring</b>: Kurssökning tar inte längre hänsyn till versaler eller gemener.</li><li><b>Buggfix</b>: Vid publicering av en kurs syntes ibland inte kursen i utbudet, detta är nu åtgärdat.</li><li><b>Buggfix</b>: Det går inte att mata in organisationsnummer på fel format längre, vilket minimerar fel och felsökning.</li></ul>   <h5>Backendspecifik utveckling</h5><ul><li><b>Förbättring</b>: Backoffice/CMS: Möjlighet att byta organisationsägare, kursägare, efterlysningsägare och filägare samt medlemmar.</li><li><b>Förbättring</b>: API: GraphQL-”pairing”, förenkling för att kunna hantera relationer smidigare. Krävdes för att lättare utveckla såväl frontend som backend i backoffice.</li></ul> <i>Arbetet går nu ner lite i intensitet under semesterperioden, men vi kommer återuppta utvecklingshastigheten i höst.</i>'
          }
      ]
    },
  ]
}
