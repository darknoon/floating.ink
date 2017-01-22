import { buildSchema } from 'graphql';

import { fetchWork, fetchAllWorks, createPerson, fetchPerson } from './model-datastore';

import { works, users } from './test-data';

/* Model interface:
{
  fetchUser(id) => Promise<User>
  fetchWork(id) => Promise<Work>
  fetchAllWorks(limit) => Promise<Array<Work>>
}

*/

// Concrete implementations: model-datastore

// Construct a schema, using GraphQL schema language
export const schema = buildSchema(`
  type Query {
    person(id:ID!): Person
    work(id:ID!): Work
    feed: [Work]
  }

  type Mutation {
    
    createPerson(person: CreatePersonInput!): Person # Create a new person. People start out without any works.
  }

  input CreatePersonInput {
    name: String
  }

  type Work {
    id: ID
    name: String
    baseURL: String
    previewURL: String
    by: Person
    bgColor: String
  }

  type Person {
    name: String
    id: ID
    works: [Work]
  }
`);

class Work {

  constructor(data) {
    if (!data.id) throw Error(`Cannot initialize Work with data: ${JSON.stringify(data)}`);
    this._data = data;
  }

  id = () => this._data.id;

  name = () => this._data.name;

  by = () => fetchPerson(this._data.by.id);

  baseURL = () => this._data.baseURL;

  previewURL = () => this._data.previewURL;

  bgColor = () => this._data.bgColor;
}

class Person {

  constructor(data) {
    if (!data.id) throw Error(`Cannot initialize Person with data: ${JSON.stringify(data)}`);
    this._data = data;
  }

  id = () => this._data.id;

  name = () => this._data.name;

  works() {
    return [];
    // return works.filter( (w) => w.by === this._data.id ).map( (ww) => new Work(ww.id) );
  }
}

function getFeed() {
  // Query the cloud db instead
  return fetchAllWorks().then( r => r.data.map( d => new Work(d) ) );
}


/*
mutation CreatePerson($input: CreatePersonInput!) {
  createPerson(person: $input) {
    name
    id,
 }
}
*/

// The root provides a resolver function for each API endpoint
export const root = {
  person: (args) => fetchPerson(args.id),

  work: (args) => fetchWork(args.id),

  feed: getFeed,

  createPerson(args) {
    // This doesn't return a Person instance yet, but it will have .id and .name
    // These are the only fields that are relevant on newly-created People
    return createPerson(args.person.name);
  }
};

