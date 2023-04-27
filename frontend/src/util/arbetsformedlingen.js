import { GuidanceContext } from '../context/GuidanceContext'

export const jobadEnrichTextDocuments = async (docHeadline, docText) => {
    try {
      const response = await fetch("https://jobad-enrichments-api.jobtechdev.se/enrichtextdocuments", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "documents_input": [
            {
              "doc_id": "123ABC",
              "doc_headline": docHeadline,
              "doc_text": docText,
            }
          ],
          "include_terms_info": false,
          "include_sentences": false,
          "sort_by_prediction_score": "NOT_SORTED"
        }),
        redirect: 'follow'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
};

export const jobedOccupationsMatchByText = async (inputText) => {
    try {
        console.log("https://jobed-connect-api.jobtechdev.se/v1/occupations/match-by-text?limit=10&offset=0&input_text="+encodeURIComponent(inputText))
        const response = await fetch("https://jobed-connect-api.jobtechdev.se/v1/occupations/match-by-text?limit=10&offset=0&input_text="+encodeURIComponent(inputText), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
};

export const taxonomyGraphql = async (query, variables, operationName) => {
  try {
      console.log("https://taxonomy.api.jobtechdev.se/v1/taxonomy/graphql?query="+encodeURIComponent(query))
      const response = await fetch("https://taxonomy.api.jobtechdev.se/v1/taxonomy/graphql?query="+encodeURIComponent(query), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const jobsearchSearch = async (occupationName, occupationGroups, freetext, relevanceThreshold) => {
//   try {
//       console.log()
//       const response = await fetch("", {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       redirect: 'follow'
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };