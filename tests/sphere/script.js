var sort = require('./modules/sort')
var id = require('./modules/id')
var format = require('./modules/format')
var filter = require('./modules/filter')
var domain = require('./modules/domain')
var range = require('./modules/range')

/* global d3, alert, $, THREE, TWEEN, requestAnimationFrame */

/*
 *
 *
 * Laden der Visualisation
 *
 *
 */

loadVisualization()

function loadVisualization () {

  var camera, scene, renderer, composer;
  var object, light;

  init();
  animate();

  function init() {

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    object = new THREE.Object3D();
    scene.add( object );

    var geometry = new THREE.SphereGeometry( 1, 4, 4 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
    var wireframe = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, wireframeLinewidth: 2.5 } );

    var sphere = new THREE.SphereGeometry( 70, 16,16 )
    var mainobj = new THREE.Mesh( sphere, wireframe );

    object.add(mainobj)


    scene.add( new THREE.AmbientLight( 0x222222 ) );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // postprocessing

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );


    var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 4;
    //composer.addPass( effect );


    var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    effect.uniforms[ 'amount' ].value = 0.0011;
    effect.renderToScreen = true;
    composer.addPass( effect );

    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );

  }

  function animate() {

    requestAnimationFrame( animate );

    object.rotation.x += 0.005;
    object.rotation.y += 0.01;
    object.rotation.y -= 0.005;


    composer.render();

  }
}
