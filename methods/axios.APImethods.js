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

    console.log("AXIOS 'login' response data:\n" + JSON.stringify(data, null, 2));
    return data; 
    //Можно переделать проброс на более информативный, доваить имя ф-ции
  } catch(error) { throw error; }
}

async function createProblem(accessToken, problemQueryData) {
  let requestData = JSON.stringify({
    query: `mutation problemCreate ($data: ProblemInput) {
      problemCreate (data: $data) {
          _id
          title
          content
          company {
              _id
              title
              description
              image
              link
          }
          jobTitle
          owner {
              _id
          }
      }
  }`,
    variables: {"data": problemQueryData}
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

    console.log("AXIOS 'create problem' response data:\n" + JSON.stringify(data, null, 2));
    return data; 

  } catch(error) { throw error; }
}

async function createProblemsArray(
  accessToken,
  problemsResponseDataArr,
  problemsQueryDataArr
) {  
  for (let i = 0; i < problemsQueryDataArr.length; i++) {
    console.log(`Creating ${i + 1}-th problem of ${problemsQueryDataArr.length}:`);
    problemsResponseDataArr.push(
      await createProblem(accessToken, problemsQueryDataArr[i])
    );
  }
}

async function generateProblemsQueryData(count = 1, {
  title = () => faker.random.words(1) + " " + Date.now(),
  content = () => faker.lorem.paragraph(),
  companyId = () => "617a184bb95fa7cfcbf1b831",   //Google
  jobTitle = () => faker.name.jobTitle()    
} = {}) {
  let problemsQueryDataArr = [];

  for (let i = 0; i < count; i++) {
    problemsQueryDataArr.push({
      title: title(i),
      content: content(i),
      company: companyId(i),
      jobTitle: jobTitle(i)
    });
  }

  return problemsQueryDataArr;
}

async function deleteProblem(accessToken, problemId) {
  let requestData = JSON.stringify({
    query: `mutation problemDelete ($problemId: ID!) {
      problemDelete (problemId: $problemId)
  }`,
    variables: {"problemId": problemId}
  });

  try {
    const { data } = await axios({
      method: 'post',
      url: baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: requestData,
    });

    if (data.errors) {
      throw new Error(
        "Request error: " + data.errors[0].message.replace(/error:?/gi, "")
      );
    }

    console.log("AXIOS 'delete problem' response data:\n" + JSON.stringify(data, null, 2));
    return data; 

  } catch(error) { throw error; }
}

async function deleteProblemsArray(accessToken, problemsIdArr) {
  for (let i = 0; i < problemsIdArr.length; i++) {
    console.log(`Deleting ${i + 1}-th problem of ${problemsIdArr.length}:`);
    await deleteProblem(accessToken, problemsIdArr[i]);
  }
}

async function createCompany(accessToken, companyRequestData) {
  let requestData = JSON.stringify({
    query: `mutation companyCreate ($data: CompanyInput) {
      companyCreate (data: $data) {
        _id
        title
        description
        image
        link
      }
    }`,
    variables: {"data": companyRequestData}
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

    console.log("AXIOS 'Create company' response data:\n" + JSON.stringify(data, null, 2));
    return data; 

  } catch(error) { throw error; }
}

async function createCompaniesArray(
  accessToken,
  companiesResponseDataArr,
  companiesRequestDataArr
) {
  for (let i = 0; i < companiesRequestDataArr.length; i++) {
    console.log(`Creating ${i + 1}-th company of ${companiesRequestDataArr.length}:`);
    companiesResponseDataArr.push(
      await createCompany(accessToken, companiesRequestDataArr[i])
    );
  }
}

async function generateCompaniesRequestData(count = 1, {
  title = () => faker.company.companyName(0),
  description = () => faker.lorem.sentence(5),
  image = () => faker.image.imageUrl(640, 480, 'business')
} = {}) {
  let companiesRequestData = [];

  for (let i = 0; i < count; i++) {
    companiesRequestData.push({
      title: title(i),
      description: description(i)
    });
  }

  return companiesRequestData;
}

async function deleteCompany(accessToken, companyId) {
  let requestData = JSON.stringify({
    query: `mutation companyDelete ($companyId: ID!) {
      companyDelete (companyId: $companyId)
    }`,
    variables: {"companyId": companyId}
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

    console.log("AXIOS 'Delete company' response data:\n" + JSON.stringify(data, null, 2));
    return data; 

  } catch(error) { throw error; }
}

async function deleteCompaniesArray(accessToken, companiesIdArr) {
  for (let i = 0; i < companiesIdArr.length; i++) {
    console.log(`Deleting ${i+ 1}-th company of ${companiesIdArr.length}:`);
    await deleteCompany(accessToken, companiesIdArr[i]);
  }
}

// (async function() {
//   let {data: {login: {accessToken}}} = await login("mimic@lala.com", "Qwe123Zxc^");

//   let titleCallback = () => {
//     let count = 0;
//     let title = "Problem Title";
//     return () => title += count++;
//   };
//   let problemsQueryData = await generateProblemsQueryData(
//     5,
//     {title: titleCallback()}
//   );
//   let problems = await createProblemsArray(accessToken, problemsQueryData);
//   await deleteProblemsArray(
//     accessToken,
//     problems.map(el => el.data.problemCreate._id)
//   );


//   let {data: {companyCreate: {_id}}} = await createCompany(accessToken, {
//     "title": "Title",
//     "description": "x",
//     "image": "x"
//   });
//   await deleteCompany(accessToken, _id);
// })();


module.exports = {
  login,
  createProblem,
  createProblemsArray,
  generateProblemsQueryData,
  deleteProblem,
  deleteProblemsArray,
  createCompany,
  createCompaniesArray,
  generateCompaniesRequestData,
  deleteCompany,
  deleteCompaniesArray
};
