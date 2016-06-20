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

  var camera, controls, scene, renderer, material, shape, shape1, shape2, shape3, composer, renderPass, badTVPass, shaderTime, sphereShape
  init()
  render()
  function animate () {
    requestAnimationFrame(animate)
    controls.update()
    render()
  }
  function init () {
    scene = new THREE.Scene()

    var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, transparent: true } );
  	var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, transparent: true } );
  	var multiMaterial = [ darkMaterial, wireframeMaterial ];

    sphereShape = new THREE.SphereGeometry(30, 16, 16 )

    shape = THREE.SceneUtils.createMultiMaterialObject(
      sphereShape,
      multiMaterial );

    var pos = {x: 0, y: 0, z: 0}


  	shape.position.set(pos.x, pos.y, pos.z);

    //shape.rotation.x=Math.PI/4-Math.PI/8+Math.PI/16+Math.PI/32-Math.PI/64-Math.PI/128 // wtf is this
    //shape.rotation.y=Math.PI/4
    //shape.rotation.z=0

    scene.add( shape );

    /*
    shape1 = shape.clone();
    shape1.scale.set(.85,.85,.85);
    scene.add(shape1)



    shape2 = shape.clone();
    shape2.scale.set(.7,.7,.7);
    scene.add(shape2)

    shape3 = shape.clone();
    shape3.scale.set(.3,.3,.3);
    scene.add(shape3)
    */

    //shape.applyMatrix(new THREE.Matrix4().makeTranslation( -pos.x, -pos.y, -pos.z ) );


    var w = window.innerWidth * 0.8
    var h = window.innerHeight * 0.8

    // var cameraP = new THREE.PerspectiveCamera(45, w / h, 1, 10000)
    // var cameraO = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 1, 1000)
    camera = new THREE.CombinedCamera(w / 2, h / 2, 70, 1, 1000, -500, 1000)

    // override.
    //camera.setZoom(1)
    //camera.toPerspective()
    camera.setZoom(5)
    camera.toOrthographic();

    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 150

    material = new THREE.MeshBasicMaterial({ color: 0xfff, wireframe: false })

    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true })
    renderer.setSize(w, h)

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.damping = 0.2
    controls.addEventListener('change', render)

    axis()

    document.getElementById('visualization-wrap').appendChild(renderer.domElement)

    animate()
  }

  function render () {
    renderer.render(scene, camera)
    var baseSpeed = 0.01;
    /*
    shape3.rotation.x+=3*baseSpeed
    shape3.rotation.y-=2.7*baseSpeed
    shape3.rotation.z-=0.7*baseSpeed


    shape2.rotation.x+=2.3*baseSpeed
    shape2.rotation.y-=1.4*baseSpeed
    shape2.rotation.z+=1*baseSpeed
    //shape1.rotation.x+=0.0075
    */
    shape.rotation.x+=1*baseSpeed
    shape.rotation.y-=1.1*baseSpeed
    shape.rotation.z+=0.3*baseSpeed

    console.log(sphereShape.vertices[0].x)

    //shape.rotation.y+=0.007
    //shape.rotation.z+=0.004

    //console.log('cords: ', camera.position.x, camera.position.y, camera.position.z)
    //console.log('in scene: ', camera.position.x + 50, camera.position.y + 50, camera.position.z + 50)
    //console.log(camera.rotation.x*180/Math.PI, camera.rotation.y*180/Math.PI, camera.rotation.z*180/Math.PI)
  }

  function toScene (x, y, z) {
    return [x - 50, y - 50, z - 50]
  }

  function axis () {
    var origin = new THREE.Vector3(-50, -50, -50)
    var length = 100

    //scene.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, length, 0xff0000))
    //scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, length, 0x00ff00))
    //scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, length, 0x0000ff))

    var dashed = new THREE.LineDashedMaterial({
      color: 0xdedede,
      dashSize: 3,
      gapSize: 2,
      scale: 1
    })

    // Box zeichnen

    // 0,0,0
    var x0 = [toScene(0, 0, 0), toScene(100, 0, 0)]
    var y0 = [toScene(0, 0, 0), toScene(0, 100, 0)]
    var z0 = [toScene(0, 0, 0), toScene(0, 0, 100)]
    // 1,0,0
    var y3 = [toScene(100, 0, 0), toScene(100, 0, 100)]
    var x2 = [toScene(100, 0, 0), toScene(100, 100, 0)]
    //0,1,0
    var x3 = [toScene(0, 100, 0), toScene(0, 100, 100)]
    var y2 = [toScene(0, 100, 0), toScene(100, 100, 0)]
    //0,0,1
    var z2 = [toScene(0, 0, 100), toScene(100, 0, 100)]
    var z3 = [toScene(0, 0, 100), toScene(0, 100, 100)]
    //1,0,0 / 1,0,1 / 0,1,1
    var x1 = [toScene(100, 100, 0), toScene(100, 100, 100)]
    var z1 = [toScene(100, 0, 100), toScene(100, 100, 100)]
    var y1 = [toScene(0, 100, 100), toScene(100, 100, 100)]

    for (var i = 0; i < 12; i++) {
      var a = [x3, y3, z3, x2, y2, z2, x1, y1, z1, x0, y0, z0][i]
      var lg = new THREE.Geometry()
      lg.vertices.push(new THREE.Vector3(a[0][0], a[0][1], a[0][2]))
      lg.vertices.push(new THREE.Vector3(a[1][0], a[1][1], a[1][2]))
      lg.computeLineDistances()
      var line = new THREE.Line(lg, dashed)
      scene.add(line)
    }
  }
}
