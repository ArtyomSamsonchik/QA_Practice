const axios = require("axios").default;
// axios.defaults.baseURL = 'https://enduring-server.herokuapp.com/v3/graphql';
// axios.defaults.headers.common['Authorization'] = 'Bearer '
const baseUrl = 'https://enduring-server.herokuapp.com/v3/graphql';

async function login(email, password) {
  let requestData = JSON.stringify({
    query: `query login ($email: String!, $password: String!) {
      login (email: $email, password: $password) {
          accessToken
          user {
             _id
              email
              firstName
              lastName
              about
              image
              jobTitle
              level
              languages
              roles
              links
                starredProblems
              starredPublications
              lastAccess
              createdAt
              updatedAt
              isActivated
              activationLinkId
          }
      }
  }`,
    variables: {"email": email,"password": password}
  });

  try {
    const {data} = await axios({
    method: 'post',
    url: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestData
    });

    if (data.errors) {
      throw new Error("Request error: " + data.errors[0].message.replace(/error:?/gi, ""));
    }
    console.log(JSON.stringify(data, null, 2));
    return data; 
  } catch(error) { throw error; }
}

//login("mimic@lala.com", "Qwe123Zxc^");

module.exports = {
  login
};
