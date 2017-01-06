import React, { Component } from 'react';

import * as THREE from 'three'

import TrackballControls from 'three-trackballcontrols'

// var camera, scene, renderer, controls;

export class Renderer extends Component {
  render() {
    return (
      <div ref={(d) => { this.container = d; } }></div>
    );
  }

  componentDidMount() {

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x222222 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer = renderer;

    var quill = this.props.quill;
    if (quill.backgroundColor) {
      renderer.setClearColor( new THREE.Color(quill.backgroundColor[0], quill.backgroundColor[1], quill.backgroundColor[2]).getHex() );
    }

    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 0, 500 );
    this.camera = camera;

    var scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    var light = new THREE.PointLight( 0xffffff );
    light.position.copy( camera.position );
    scene.add( light );
    this.scene = scene;


    this.container.appendChild( renderer.domElement );

    addQuillToScene(quill, scene);


    var controls = new TrackballControls( camera, renderer.domElement );
  // controls = new THREE.FirstPersonControls( camera, renderer.domElement );
    controls.minDistance = 100;
    controls.maxDistance = 5000;
    this.controls = controls;

    //begin animation
    requestAnimationFrame( this.animate );
  }

  animate = (delta) => {
    this._request = requestAnimationFrame( this.animate );
    this.controls.update(delta);
    this.renderer.render( this.scene, this.camera );
  }

  componentWillUnmount() {
    delete this.camera;
    delete this.renderer;
    cancelAnimationFrame(this._request);
    delete this._request;
  }

}


function meshFromPaintLayer(l) {
  if (!l.parsedData) return null;

  var strokes = l.parsedData.parsed.strokes;
  if (!strokes.length || strokes.length === 0) return null;

  console.log("creating grometry for layer \"" + l.name + "\" with " + strokes.length + " strokes.");
  // First, determine how much space we need
  var strokeIdx;
  var vertCount = 0;
  for (strokeIdx = 0; strokeIdx < strokes.length; strokeIdx++) {
    var v = strokes[strokeIdx].entries;
    // we generate 2 points per input point (for ribbon geom)
    vertCount += v.length * 2;

    // Add 2 extra for degenerate tris
    vertCount += 2;
  }

  // Allocate arrays
  var positions = new Float32Array(vertCount * 3);
  var colors = new Float32Array(vertCount * 4);
  var pi = 0; 
  var ci = 0;

  // Extrude quill points into geometry in the arrays
  for (strokeIdx = 0; strokeIdx < strokes.length; strokeIdx++) {
    var v = strokes[strokeIdx].entries;

    var scale = 1000;

    for (var i = 0; i < v.length; i++) {
      var thick = v[i].thickness;

      var n0 = v[i].norm1;

      var norm = [
        n0[0],
        n0[2],
        n0[1],
      ];

      // add a point in the + normal direction
      var j;
      for (j=0; j<3; j++) {
        positions[pi++] = (v[i].position[j] + norm[j] * thick) * scale;
      }
      for (j=0; j<4; j++) {
        colors[ci++] = v[i].color[j];
      }

      // add a point in the - normal direction
      for (j=0; j<3; j++) {
        positions[pi++] = (v[i].position[j] - norm[j] * thick) * scale;
      }
      for (j=0; j<4; j++) {
        colors[ci++] = v[i].color[j];
      }
    }

    // Degenerate tris to move to next line
    for (var k=0; k<2; k++) {
      for (j=0; j<3; j++) {
        positions[pi++] = 0.0;
      }
      for (j=0; j<4; j++) {
        colors[ci++] = 0.0;
      }

    }
  }

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position',    new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 4));

  var vertexShader = `
    attribute vec4 customColor;
    varying vec4 vColor;
    void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  var fragmentShader = `
    varying vec4 vColor;
    void main() {
     gl_FragColor = vColor;
    }
  `;

  var material = new THREE.ShaderMaterial( {
    uniforms:       {},
    vertexShader:   vertexShader,
    fragmentShader: fragmentShader,
    blending:       THREE.NormalBlending,
    depthTest:      false,
    transparent:    true,
    side:           THREE.DoubleSide,
  });


  var mesh = new THREE.Mesh( geometry, material );
  mesh.drawMode = THREE.TriangleStripDrawMode;

  return mesh;
}

function addQuillToScene(quill, scene) {

  const recur = (layer) => {
    if (layer.type === "Paint") {
      var mesh = meshFromPaintLayer(layer);
      if (mesh) {
        scene.add(mesh);
      }
    } else {
      layer.sublayers.map(recur);
    }
  };
  recur(quill.rootLayer);
}