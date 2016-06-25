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

  var camera, scene, renderer, composer, controls, container;
	var object, light;

  var clock;

	init();
	animate();

	function init() {

    clock = new THREE.Clock();

    container = document.createElement( 'div' );
		document.body.appendChild( container );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		//

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 400;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    controls = new THREE.FlyControls( camera );
		controls.movementSpeed = 1000;
    controls.domElement = document.querySelector("#WebGL-output");
		controls.rollSpeed = Math.PI / 24;
		controls.autoForward = false;
		controls.dragToLook = true;

    /**
     *
     *  City.
     *
     */

		//object = new THREE.Object3D();
		//scene.add( object );

		//var geometry = new THREE.SphereGeometry( 1, 4, 4 );
    var unit = 2;
    var gridPadding = 0.8 * unit // 1 units
    var houseSizeUnits = 8;
    var gridSize = gridPadding + houseSizeUnits * unit;
    var gridDepth = -100;

    var helper = new THREE.GridHelper( 2000, gridSize, 0x0000ff, 0x808080 );
		helper.position.y = gridDepth;
		scene.add( helper );

    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );


    function addHouse(x, z, heightUnit){
      var height = heightUnit * unit;
      var collection = new THREE.Object3D();
      //house
      var houseSize = gridSize-gridPadding * 2;
      var houseGeom = new THREE.BoxBufferGeometry(houseSize, height, houseSize);
      var house = new THREE.Mesh(houseGeom, material);
      house.position.x = x;
      house.position.y = gridDepth+height/2;
      house.position.z = z;
      collection.add(house);
      //lights
      var lightGeom = new THREE.SphereGeometry( .1, 1, 1 );
      var lightMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
      var light = new THREE.Mesh( lightGeom, lightMaterial );
      var amount = 0.6;

      // complex algorithm

      var numLightsWidth = houseSizeUnits - 1;
      var numLightsHeight = heightUnit - 1;

      for(var yUnit = 0; yUnit < numLightsHeight; yUnit++){
        for(var xUnit = 0; xUnit < numLightsWidth; xUnit++){
          var lightX = x + xUnit * unit + unit / 2;
          var lightY = gridDepth+height/2 + yUnit * unit + unit / 2;
          var light_2 = light.clone();
          light_2.position.set(lightX, lightY, z)
          collection.add(light_2);
        }
      }

      /*

      # of lights in width: houseSizeUnits - 1

      do x + locX * n + unit / 2 for width

      # of lights in height: heightUnit-1

      do y + locy * n + unit / 2 for height

      ---------
      | * * * |
      | * * * |
      | * * * |
      | * * * |
      ---------

      */


      scene.add(collection);
    }

    var grid = {
      start: { x: -10, z: -10 },
      end: { x: 10, z: 10 }
    }

    for(var x = grid.start.x; x<=grid.end.x; x++){
      for(var z = grid.start.z; z<=grid.end.z; z++){
        addHouse(x*gridSize,z*gridSize,Math.round(Math.random()*(50 - 10)) + 10)
      }
    }

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
true
    /*
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );

		var effect = new THREE.ShaderPass( THREE.DotScreenShader );
		effect.uniforms[ 'scale' ].value = 4;
		composer.addPass( effect );

		var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		effect.uniforms[ 'amount' ].value = 0.0015;
		effect.renderToScreen = true;
		composer.addPass( effect );
    */
		//

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
		composer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

    var delta = clock.getDelta();
    controls.update( delta );



		//object.rotation.x += 0.005;
		//object.rotation.y += 0.01;


    //controls.movementSpeed = 0.001;

    console.log(camera.position)

    requestAnimationFrame( animate );
    // if effects, use this.
		//composer.render();
    // otherwise this
    renderer.render(scene, camera);
	}
}
