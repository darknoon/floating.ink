import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { users, works } from './test-data';
import cors from 'cors';

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    person(id:ID!): Person
    work(id:ID!): Work
    feed: [Work]
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
  constructor(id) {
    var w = works.find( (w) => w.id == id );
    if (!w) throw Error(`${id} is not a valid work id.`);
    this._data = w;
  }

  id = () => this._data.id;

  name = () => this._data.name;

  by = () => new Person(this._data.by);

  baseURL = () => this._data.baseURL;

  previewURL = () => this._data.previewURL;

  bgColor = () => this._data.bgColor;
}

class Person {

  constructor(id) {
    var u = users.find( (u) => u.id === id );
    if (!u) throw Error(`${id} is not a valid user id.`);
    this._data = u;
  }

  id = () => this._data.id;

  name = () => this._data.name;

  works() {
    return works.filter( (w) => w.by === this._data.id ).map( (ww) => new Work(ww.id) );
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  person: (args) => new Person(args.id),

  work: (args) => new Work(args.id),

  feed: () => works.map( (w) => new Work(w.id) ),
};

var port = process.env.PORT || 4000;

var app = express();

// Enable CORS via cors module so we can run api server on a different domain :/
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(port);

console.log(`API server listening on port ${port}. graphiql available at /graphql`);
