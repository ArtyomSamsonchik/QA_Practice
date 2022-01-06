const axios = require("axios").default;
const faker = require("faker");
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
    const { data } = await axios({
    method: 'post',
    url: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestData
    });

    if (data.errors) {
      throw new Error(
        "Request error: " + data.errors[0].message.replace(/error:?/gi, "")
      );
    }

    console.log(JSON.stringify(data, null, 2));
    return data; 
    //Можно переделать проброс на более информативный
  } catch(error) { throw error; }
}

async function createProblem(accessToken, problemObj) {
  let requestData = JSON.stringify({
    query: `mutation problemCreate ($data: ProblemInput) {
      problemCreate (data: $data)
  }`,
    variables: {"data": problemObj}
  });

  try {
    const { data } = await axios({
      method: 'post',
      url: baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: requestData
    });

    if (data.errors) {
      throw new Error(
        "Request error: " + data.errors[0].message.replace(/error:?/gi, "")
      );
    }

    console.log(JSON.stringify(data, null, 2));
    return data; 

  } catch(error) { throw error; }
}

async function createRandomProblems(accessToken, count = 1) {
  let problems = [];
  
  for (let i = 0; i < count; i++) {
    let temp = {
      title: faker.random.words(2) + Date.now(),
      content: faker.lorem.paragraph(),
      company: "617a184bb95fa7cfcbf1b831",
      jobTitle: faker.name.jobTitle()
    };

    await createProblem(accessToken, temp);
    problems.push(temp);
  }

  return problems;
}


// (async function() {
//   let {data: {login: {accessToken}}} = await login("mimic@lala.com", "Qwe123Zxc^");
//   console.log(accessToken);
//   await createRandomProblems(accessToken, 5);
// })();


module.exports = {
  login,
  createProblem,
  createRandomProblems
};
