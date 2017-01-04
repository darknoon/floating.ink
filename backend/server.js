
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var {users, works } = require('./test-data');


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    person(name:String!): Person
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

class Person {

  constructor(id) {
    var u = users.find( (u) => u.id === id );
    this._data = u;

    if (!u) throw "Invalid id";
    // todo make this.works?
  }

  id() { return this._data.id; }

  name() { this._data.name; }

  // artworks = () => this.
}

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },

  person: (args) => {
    return {
      'name': args.name,
      'id':'jayz12341',
    }
  },

  feed: () => {
    return works.map( (w) => ({
      'id': w.id,
      'name' : 'work name',
      'by': new Person(w.by),
    }) );
  },
};

var app = express();
// app.use( (req, res, next) => {
//   next();
// })
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);

console.log("server listening on port 4000");
