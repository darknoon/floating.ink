
const endpoint ='/graphql';

export default class API {

  _fetch(query, variables) {

    var request = new Request(endpoint, {
      method: 'POST',
      body: JSON.stringify({query, variables}),
      headers: new Headers({
        'content-type':'application/json',
      }),
    });

    return fetch(request).then( res => res.json() );
  }

  getWork(id) {
    var query =
    `query WorkByID($work: ID!) {
      work(id: $work) {
        name,
        id,
        baseURL
      }
    }`;
    return this._fetch(query, {work:id});
  }

  // Returns a promise eventually resolving to a POJO {data: feed: {...}}
  getFeed() {

    var query = 
    `{
      feed {
        id
        name
        baseURL
        previewURL
        bgColor
      }
    }`;
    return this._fetch(query, {});

    // .catch( err => console.log(`GraphQL fetch error: ${err.message}`))

  }

}

