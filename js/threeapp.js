var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementsByClassName('canvasWrapper')[0].appendChild( renderer.domElement );


var geometry = new THREE.CylinderGeometry( 1, 1, 0.1, 100 );
var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
var cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(1,1,1);
scene.add( cylinder );



var light = new THREE.
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;