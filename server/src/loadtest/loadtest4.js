import http from 'k6/http'

export const options = {
  scenarios: {
    standard: {
      executor: 'ramping-arrival-rate',
      startRate: 50,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 1000,
      stages: [
        { duration: '50s', target: 100 },
        { duration: '50s', target: 100 },
      ],
    },
  },
}


// initial setting - login
export function setup() {
  var payload = JSON.stringify({
    email: 'Yingge',
    password: 'Iamstupid',
  })
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  http.post('http://localhost:3005/auth/login', payload, params)
  var jar = http.cookieJar()
  var token = jar.cookiesForURL('http://localhost:3005').authToken[0]
  return { authToken: token }
}



export default function (data) {
  const payload = JSON.stringify({

    operationName: 'updateChatHistory',
    variables: {
      name: "Yingge",
      text: "I am stupid"
    },
    query:
      'mutation updateChatHistory($name: String!, $text: String!)  {\\n updateChatHistory(name: $name, text: $text)\\n}\\n"}'
  })
  const params = {
    headers: {
      'Content-Type': 'application/json',
      cookies: {
        authToken: data.authToken,
      },
    },
  }
  http.post('http://localhost:3005/graphql', payload, params)
}