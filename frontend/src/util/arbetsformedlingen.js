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
        console.log("https://jobed-connect-api.jobtechdev.se/v1/occupations/match-by-text?limit=10&offset=0&input_text="+encodeURIComponent(inputText)+"&include_metadata=true")
        const response = await fetch("https://jobed-connect-api.jobtechdev.se/v1/occupations/match-by-text?limit=10&offset=0&input_text="+encodeURIComponent(inputText)+"&include_metadata=true", {
        method: 'POST',
        headers: {
          'accept': 'application/json'
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
        'accept': 'application/json'
      },
      redirect: 'follow'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// TODO: use skillids when/if available
// TODO: freetext seems to work by AND function - how/when to use?
// TODO: relevance sounds interesting, but is always 1?
export const jobsearchSearch = async (occupationNameIds, occupationGroupIds, skillIds, freetext, limit) => {
  try {
    const searchUrl = "https://jobsearch.api.jobtechdev.se/search?" +
      occupationNameIds.map(x => "occupation-name=" + x).join("&") +"&" +
      occupationGroupIds.map(x => "occupation-group=" + x).join("&") +
      "&offset=0&limit=" + limit.toString()
    console.log('URL: ' + searchUrl)
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-feature-freetext-bool-method': 'or'
      },
      redirect: 'follow'
    });
    // console.log('RESPONSE: ' + response)
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
