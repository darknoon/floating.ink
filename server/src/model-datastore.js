// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.




// This is adapted from the google cloud books example, with changes for the latest version of the library
// Documentation for the google client we're using is here:
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/0.6.0/datastore

import Datastore from '@google-cloud/datastore';

// import config from require('../config';

// Create datastore for our project. Will allow us to fetch from google's cloud datastore API.
const ds = Datastore({
  projectId: 'floating-ink',
});

// These are the datatypes available in the backend. This could be more sophisticated ie classes or whatever.
const Kinds = {
  Work:'Work',
  Person:'Person',
};

function queryList(kind, limit) {
  return new Promise( (resolve, reject) => {
    const q = ds.createQuery([Kinds.Work])
      .limit(limit);

    ds.runQuery(q, (err, entities, nextQuery) => {
      if (err) {
        reject(err);
        return;
      }
      
      // console.log(`results: ${JSON.stringify(entities)}`);
      const hasMore = nextQuery.moreResults !== Datastore.NO_MORE_RESULTS ? nextQuery.endCursor : false;
      resolve({
        hasMore,
        data: entities.map(fromDatastore), 
      });
    });
  });
}

// Returns promise that resolves to {data: [Work{}...]}
export function fetchAllWorks(limit) {
  return queryList(Kinds.Work, limit);
}

export function fetchWork(id) {
  return getByKey(Kinds.Work, id);
}

export function fetchPerson(id) {
  return getByKey(Kinds.Person, id);
}

// Promise resolves to a Person or throws error
export function createPerson(name) {
  return create(Kinds.Person, {name});
}

// Promise of 
function getByKey(kind, id) {
  // console.log(`GBK: ${kind} id: ${JSON.stringify(id)}`);
  const key = ds.key([kind, parseInt(id, 10)]);
  return new Promise( (resolve, reject) => {
    ds.get(key, (err, entity) => {
      if (err) {
        reject(err);
        return;
      }
      if (!entity) {
        reject({
          code: 404,
          message: 'Not found'
        });
        return;
      }
      resolve(fromDatastore(entity));
    });
  });
}

// Below functions from 


// Translates from Datastore's entity format to
// the format expected by the application.
//
// Datastore format:
//   {
//     ds.KEY: [kind, id],
//     data: {
//       property: value
//     }
//   }
//
// Application format:
//   {
//     id: id,
//     property: value
//   }
function fromDatastore(obj) {
  // Copy the object and make its key accessible under id instead of the Symbol ds.KEY
  const withKey = Object.assign({id: obj[ds.KEY].id}, obj);
  return withKey;
}

// Translates from the application's format to the datastore's
// extended entity property format. It also handles marking any
// specified properties as non-indexed. Does not translate the key.
//
// Application format:
//   {
//     id: id,
//     property: value,
//     unindexedProperty: value
//   }
//
// Datastore extended format:
//   [
//     {
//       name: property,
//       value: value
//     },
//     {
//       name: unindexedProperty,
//       value: value,
//       excludeFromIndexes: true
//     }
//   ]
function toDatastore(obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    });
  });
  return results;
}


function update(kind, id, data) {
  return new Promise( (resolve, reject) => {
    let key;
    if (id) {
      key = ds.key([kind, parseInt(id, 10)]);
    } else {
      key = ds.key(kind);
    }

    const entity = {
      key: key,
      data: toDatastore(data, [/* exclude from indices */])
    };

    ds.save(
      entity,
      (err, response) => {
        // Update return value with generated ID
        if (err) {
          reject(err);
        } else {
          const id = key.id;
          const afterData = Object.assign({id}, data);
          resolve(afterData);
        }
      }
    );
  });
}

// Some old test data to use
function uploadTestData() {
  return create(Kinds.Work, {
      // 'id': 'happy_new_year',
      'name': 'Happy New Year',
      'baseURL': 'https://storage.googleapis.com/floating-ink/quills/happy_new_year',
      'previewURL': 'https://storage.googleapis.com/floating-ink/previews/happy_new_year.png',
      'bgColor': '#000000',
      'by': 'andrew',
    });
}

function create(kind, data) {
  return update(kind, null, data);
}

