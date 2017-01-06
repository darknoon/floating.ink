
import jDataView from 'jdataview';

import QBin from './qbin'

class Quill {
  constructor(q) {
    var mainSequence = q.info["Sequence"];
    this.backgroundColor = mainSequence["BackgroundColor"];
    this.rootLayer = new QuillLayer(mainSequence["RootLayer"], q.buffer);
  }
}

function QuillLayer(l, buffer) {
  this.name = l["Name"];
  this.visible = l["Visible"];
  this.opacity = l["Opacity"];
  this.type = l["Type"];
  var impl = l["Implementation"];
  //this._raw = l;
  // todo: Transform
  this.sublayers = (impl["Children"] || []).map(function(child) {
    return new QuillLayer(child, buffer)
  });
  if (impl["DataFileOffset"]) {
    var offset =  parseInt(impl["DataFileOffset"], 16);
    this._dataFileOffset = offset;

    var len = buffer.byteLength - offset;
    if (len > 56 + 20) {
      // Grab a view on the data?
      // For some reason jBinary doesn't like passing in DataView, which doesn't use the littleEndian in the constructor
      var view = new jDataView(buffer, offset, len, true);

      var buf = new QBin(view);

      // Read the count?
      this._rawData = view;
      this.parsedData = buf;
    }
  }
}

// url -> promise of a Quill
export function loadFromURL(quillURL) {
  // Load main part

  var infoURL = quillURL + '/Quill.json';
  var dataURL = quillURL + '/Quill.qbin';

  console.log("Reading " + infoURL);

  var r1 = fetch(infoURL).then(function(response) {
    return response.json();
  });

  var r2 = fetch(dataURL, {
    method: 'get'
  }).then(function(response) {
    return response.arrayBuffer();
  });


  return Promise.all([r1, r2]).then(function(responses) {
    console.log("Fetched quill " + infoURL + ". Parsing...");
    var info = responses[0];
    var buffer = responses[1];

    return {
      "info" : info,
      "buffer" : buffer,
      "name" : quillURL,
    }

  }).then(parseQuill).catch(function(err) {
    console.log("Error " + err);
  });

}


function parseQuill(q) {
  var version = q.info["Version"];
  if (version !== 1) {
    throw new Error(`Invalid quill version: ${version}`);
  }

  return new Quill(q)
  // body...
}
