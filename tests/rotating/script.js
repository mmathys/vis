var glslify = require('glslify');


/* global d3, alert, $, THREE, TWEEN, requestAnimationFrame, glslify */

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
  var points_fluuuid;
  var clock;

  init();
  animate();

  function init() {

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Camera & Scene setup

    var near = 1;
    var far = 700;
    var someStrangeFactor = 5;
    camera = new THREE.OrthographicCamera( window.innerWidth / - someStrangeFactor, window.innerWidth / someStrangeFactor, window.innerHeight / someStrangeFactor, window.innerHeight / - someStrangeFactor, near, far );

    camera.position.z = 400;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    // root object

    object = new THREE.Object3D();

    // Particle system by FLUUUID

    var shader_fluuuid = new THREE.ShaderMaterial({
      uniforms: {
        color : {type: 'c', value: new THREE.Color(0xFFFFFF)},
        time  : {type : 'f', value: 0},
      },
      transparent    : true,
      vertexShader   : glslify('./glsl/particle_vert.glsl'),
      fragmentShader : glslify('./glsl/particle_frag.glsl'),
    })

    console.log("hai")
    console.log(shader_fluuuid.material)

    var cluster = Math.pow(512, 2);

    var maxParticles = cluster ;
    var spread = 550;

    var geometry = new THREE.BufferGeometry();

    var pPosition = new Float32Array(maxParticles * 3);
    // let _index = new Float32Array(maxParticles);

    //BOOKMARK
    for (var i = 0, a = 0; i < pPosition.length; i+=3, a++) {
      var range = {
        w: window.innerWidth /  2 / spread - (Math.random() * window.innerWidth /  2 / (spread / 2)),
        h: window.innerHeight /  2 / spread - (Math.random() * window.innerHeight /  2 / (spread / 2))
      }
      pPosition[i + 0] = range.w/1;
      pPosition[i + 1] = range.h/1;
      pPosition[i + 2] = 0;

      // _index[a] = a;

      // this.index[a] = a;
    };

    geometry.addAttribute('position', new THREE.BufferAttribute(pPosition, 3));
    // geometry.addAttribute('_index', new THREE.BufferAttribute(_index, 1));

    points_fluuuid = new THREE.Points(geometry, shader_fluuuid);
    scene.add(points_fluuuid)
    //console.log(ergebnis);

    // Adding objects

    scene.add( object );

    //var testSphere = new THREE.SphereGeometry( 100.6, 128, 128 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
    //var testMesh = new THREE.Mesh(testSphere, material);
    //object.add(testMesh);

    var wireframe = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );

    var tetra = new THREE.TetrahedronGeometry( 28, 0 )
    var northlane = new THREE.Mesh( tetra, material );

    //initial rotation
    object.rotation.x = Math.PI/4-Math.PI/8+Math.PI/16+Math.PI/32-Math.PI/64-Math.PI/128;
    object.rotation.y = Math.PI/4;
    object.rotation.z = 0;

    //object.add(northlane)
    northlane.scale.multiplyScalar( 1 );
    object.add(northlane)

    var stepScale = 1.3;

    var northlane2 = northlane.clone();
    var scale2 = 1+stepScale;
    northlane2.scale.set(scale2, scale2, scale2)
    object.add(northlane2)

    var northlane3 = northlane.clone();
    var scale3 = scale2+stepScale;
    northlane3.scale.set(scale3, scale3, scale3)
    object.add(northlane3)

    /*
    for ( var i = 0; i < 100; i ++ ) {

      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
      mesh.position.multiplyScalar( Math.random() * 400 );
      mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
      object.add( mesh );

    }

    */

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // postprocessing

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    /*
    var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 4;
    composer.addPass( effect );
    */


    var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    effect.uniforms[ 'amount' ].value = 0.0012;
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

    var particleMovementSpeed = 0.01;
    var rotationSpeed = 0.002;

    var el = clock.getElapsedTime()*particleMovementSpeed;

    //TODO
    if(points_fluuuid.material){
      points_fluuuid.material.uniforms.time.value = el;
    }else{
      console.log("undeinfed!")
    }


    object.rotation.x -= rotationSpeed/2;
    object.rotation.y += rotationSpeed;
    object.rotation.y -= rotationSpeed/2;


    composer.render();

  }
}
