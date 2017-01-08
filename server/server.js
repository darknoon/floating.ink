import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import {users, works } from './test-data';

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    person(id:ID!): Person
    feed: [Work]
  }

  type Work {
    id: ID
    name: String
    by: Person
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
    var w = works.filter( (w) => w.by === this._data.id ).map( (ww) => new Work(ww.id) );
    return {
      list: w,
      count: w.length,
    }
  }
}

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },

  person: (args) => {
    return new Person(args.id)
  },

  feed: () => {
    return works.map( (w) => new Work(w.id) );
  },
};

var port = process.env.PORT || 4000;

var app = express();
// app.use( (req, res, next) => {
//   next();
// })
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(port);

console.log(`API server listening on port ${port}. graphiql available at /graphql`);