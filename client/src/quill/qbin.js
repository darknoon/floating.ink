import jBinary from 'jbinary';

/*
* This is a declarative definition of the format of the quill format's qbin file
*/
QBin.prototype.typeSet = {
  'jBinary.all': 'PaintLayerData',
  'jBinary.littleEndian': true,

  float2: ['array', 'float32', 2],
  float3: ['array', 'float32', 3],
  float4: ['array', 'float32', 4],

  PaintLayerData: {
    strokeCount: 'uint32',
    strokes: ['array', 'Stroke']
  },


  Stroke: {
    // 36 bytes before count
    _unused0: 'int64', // 4 ~ident?
    maybe_bb: ['array', 'float32', 7], // 28
    count: 'uint32',
    entries: ['array', 'Entry', 'count'],
  },

  Color: 'float4',

  Position: ['array', 'float32', 3],

  Normal: ['array', 'float32', 3],

  Entry:{
    // Each entry is 56 bytes
    // Not sure what each of v0/v1/v2 mean but will see...
    'position':'float3',
    'norm0':'float3',
    'norm1':'float3',
    'color' : 'float4',
    'thickness':'float32',
  },
};

export default function QBin(view) {
  var bin = new jBinary(view, this.typeSet);
  var parsed = bin.read('PaintLayerData');

  this.parsed = parsed;
}

