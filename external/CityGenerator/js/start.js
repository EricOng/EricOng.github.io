///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////                                                                       ////
////          GLOBALS                                                      ////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var container, effectController;
var camera, scene, renderer;
var canvas;
var TOTAL_Z, TOTAL_X, SPACING, ZSEG;
var MAX = 16777215;
var DEGREES = Math.PI/180;
var RESET_INDEX;
    var cityGeo = new THREE.Geometry();
    var cityTex = new THREE.ImageUtils.loadTexture('textures/walls1.jpg');
    cityTex.wrapS = cityTex.wrapT = THREE.MirroredRepeatWrapping;
    cityTex.repeat.set(1,2);
    var cityMat = new THREE.MeshLambertMaterial({
            color: 0x606060,
            map: cityTex,
            side: THREE.DoubleSide
        }); 
    var city = new THREE.Object3D();

var exporter = new THREE.OBJExporter();

    init();
    //setupGui(); 
    animate();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////                                                                       ////
////             SETUP AND EXECUTE                                         ////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function init(){
    canvas = document.getElementById("canvas");

    //renderer
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(canvas.width, canvas.height);

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(100,50,300);

    //scene
    scene = new THREE.Scene();
    ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    //utilities
//    scene.add(new THREE.AxisHelper(100));
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', light_update);
    //sounds

    //lights
    var ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    sun = new THREE.DirectionalLight(0x808080, 1);
//    var sun2 = new THREE.DirectionalLight(0x404040);
//    sun.position.set(0, 0.5, 0);
//    sun2.position.set(-1, 0.5, -1);
    scene.add(sun);
//    scene.add(sun2);

    //gui
    effectController = {
        height: 1,
        size: 1,
        width: 1,
        length: 1,
        loadfile: function(){
            document.getElementById('aFile').click();
        },
        randomize: function(){
            updateLog('Randomizing. . .');
            height = size = width = length = 1;
            scene.remove(city);
            city = new THREE.Object3D();
            cityGeo = createCity(20, 6, 20, 20);
            pseudoRoad_o.scale.set(1,1,1);
            scene.add(city);
            updateLog('Finished.');
        },
        exporter : function(){
            updateLog('Parsing data for export. . .');
            data = '';
            var geometry_container = new THREE.Geometry();
            city.children.forEach(function(mesh){
                var geo = mesh.geometry.clone();
                geo.applyMatrix(new THREE.Matrix4().scale(city.scale));
//                updateLog(geo);
                geometry_container.merge(geo);
            });
            data = exporter.parse(geometry_container);
//            updateLog(data);
            saveAs(new Blob([data], {type: "text/plain;charset=utf-8"}),
                   ("City.obj"));
            updateLog('Export Concluded');
        }
    };
    var gui = new dat.GUI({ autoPlace: false});
   
    document.getElementById('gui-wrapper').appendChild(gui.domElement);
    var h = gui.addFolder("Feature/s");
    h.open();
    h.add(effectController, "height", 0, 10).name("City Height").onChange(function(i){
        city.scale.y = i;
        city.children.forEach(function(mesh){
            mesh.material.map.repeat.y = Math.round(i);
        });
        
    });
//    h.add(effectController, "size", 0, 3).name("City Size").onChange(function(i){
//        city.scale.x = i;
//        city.scale.z = i;
//        pseudoRoad_o.scale.x = i;
//        pseudoRoad_o.scale.y = i;
//    });
    h.add(effectController, "width", 0, 10).name("City Width").onChange(function(i){
        city.scale.x = i;
        pseudoRoad_o.scale.x = i;
    });
    h.add(effectController, "length", 0, 10).name("City Length").onChange(function(i){
        city.scale.z = i;
        pseudoRoad_o.scale.y = i;
    });
    h.add(effectController, "randomize").name("Randomize");
    h.add(effectController, "exporter").name("Export City");

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        h.add(effectController, 'loadfile').name("Add a texture");
    } else {
      updateLog('The File APIs are not fully supported in this browser.');
    } 
    
    //init objects
    addObjects();
}

function animate(){
    requestAnimationFrame(animate);
    render();
}
function render(){
    renderer.render(scene, camera); 
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////                                                                       ////
////             LIGHTS, SKIES, FLOOR                                      ////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function light_update(){
    sun.position.copy(camera.position);
}

function createRdmLighting(container){
    //Src: http://www.paulirish.com/2009/random-hex-color-code-snippets/ 
    color = '#'+Math.floor(Math.random()*16777215).toString(16);
    light = new THREE.PointLight(color, 0.05);
    light.position.set(Math.random(),Math.random(),Math.random());
    container.add(light);
}

function SkyBox(src_t, x, y, z){
    geometry = new THREE.BoxGeometry(x,y,z);
    texture = new THREE.ImageUtils.loadTexture(src_t);
    materialArray = [];
    for(var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: texture
        }));

    uvMap = [new Pt2(0,0), new Pt2(0.5, 0), new Pt2(1, 0), 
             new Pt2(0, 0.33), new Pt2(0.5, 0.33), new Pt2(1, 0.33),
             new Pt2(0, 0.66), new Pt2(0.5, 0.66), new Pt2(1, 0.66), 
             new Pt2(0, 1), new Pt2(0.5, 1), new Pt2(1, 1)
            ];
    geometry.faceVertexUvs[0] = [];
    //X
    geometry.faceVertexUvs[0][0] = [ uvMap[3], uvMap[4], uvMap[6] ];
    geometry.faceVertexUvs[0][1] = [ uvMap[4], uvMap[7], uvMap[6] ];
    //-X
    geometry.faceVertexUvs[0][2] = [ uvMap[1], uvMap[2], uvMap[4] ];
    geometry.faceVertexUvs[0][3] = [ uvMap[2], uvMap[5], uvMap[4] ];
    //Y
    geometry.faceVertexUvs[0][4] =  [ uvMap[6], uvMap[7], uvMap[9] ];
    geometry.faceVertexUvs[0][5] = [ uvMap[7], uvMap[10], uvMap[9] ];
    //-Y
    geometry.faceVertexUvs[0][6] =  [ uvMap[4], uvMap[5], uvMap[7] ];
    geometry.faceVertexUvs[0][7] = [ uvMap[5], uvMap[8], uvMap[7] ];
    //Z
    geometry.faceVertexUvs[0][8] =  [ uvMap[0], uvMap[1], uvMap[3] ];
    geometry.faceVertexUvs[0][9] = [ uvMap[1], uvMap[4], uvMap[3] ];
    //-Z
    geometry.faceVertexUvs[0][10] =  [ uvMap[7], uvMap[8], uvMap[10] ];
    geometry.faceVertexUvs[0][11] = [ uvMap[8], uvMap[11], uvMap[10] ];

    material = new THREE.MeshFaceMaterial(materialArray);
    this.mesh = new THREE.Mesh(geometry, material);
    return this.mesh;
}

function SkySphere(src_t, r){
    geometry = new THREE.SphereGeometry(r, (r<100)?r:r*1.5);
    texture = new THREE.ImageUtils.loadTexture(src_t);
    material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.BackSide
    });


    this.mesh = new THREE.Mesh(geometry, material);
    return this.mesh;
}

function createFloor(x,z){
   var geometry = new THREE.BoxGeometry( x, -5, z);
    var material = new THREE.MeshLambertMaterial( {color: 0x202020, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    scene.add( plane );
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////                                                                       ////
////           ADD OBJECTS TO SCENE                                        ////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function addObjects(){
    TOTAL_X = TOTAL_Z = 1000;
    CUR_X = CUR_Z = 0;
    var pseudoRoad_g = new THREE.PlaneGeometry(400, 400);
    var pseudoRoad_m = new THREE.MeshLambertMaterial({color: 0x101010,
                                                    side: THREE.DoubleSide});
    pseudoRoad_o = new THREE.Mesh(pseudoRoad_g, pseudoRoad_m);
    pseudoRoad_o.rotation.x = 90 * DEGREES;
    pseudoRoad_o.position.set(-8, -0.1, -8);
    scene.add(pseudoRoad_o);
//    scene.add(new SkyBox('textures/clouds1.jpg', TOTAL_X*1.5, TOTAL_X*1.5, TOTAL_Z*1.5));
    scene.add(new SkySphere('textures/clouds.jpg', TOTAL_X));

    RESET_INDEX = scene.children.length;
    updateLog('\tControls\n');
    updateLog('Rotate: LMouse + Drag ');
    updateLog('Move: RMouse + Drag');
    updateLog('Zoom: MMouse + Scroll');
    cityGeo = createCity(20, 6, 20, 20);
    scene.add(city);
}

function updateLog(message){
    document.getElementById('actionLogger').value += '\n' + message;
}

function addfile(){
    var t = document.getElementById('aFile').files;

    for(var i = 0; i < t.length; i++){
        var f = t[i];
        updateLog('File: ' + f.name + '\nSize: ' + f.size + ' bytes');

        reader = new FileReader();
        reader.onload = function(e){
            var img = new Image();
            img.onload = function(){
                updateLog('Image Resolution: \n\t' + this.width + ' x ' + this.height);
                if(!isPowerofTwo(this.width) || !isPowerofTwo(this.height)){
                    updateLog('Failed to add:\n -Dimensions are not powers of two.');
                    return;
                }
                textureLib.push(
                    new THREE.ImageUtils.loadTexture(reader.result));
                updateLog(f.name 
                          + ' added to texture library, new size: ' 
                          + textureLib.length);
            }
            img.src = reader.result;
        }
    }
    reader.readAsDataURL(f);
//        reader.readAsText(f);
}

function isPowerofTwo(num){
    return (num != 0) && ((num & (num - 1)) == 0);
}