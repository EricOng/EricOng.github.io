var DEGREES = Math.PI/180; 

function Pt(x, y, z){
    return new THREE.Vector3(x,y,z);
}

function Location(pt, r, g){
    this.pt = pt;
    this.rotation = r || 0;
    this.group = g || 0; 
    this.buildSpace = new THREE.Geometry(); 
    this.buildLength = 0;
    this.buildWidth = 0;
    this.left = false;
    this.right = false;
    this.groundFlag = false;
    this.builtFlag = false;
    this.locator = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 10), new THREE.MeshBasicMaterial({color:0xffffff}));
    
    this.setLeft = function(flag){
        this.left = flag;
    }
    
    this.setRight = function(flag){
        this.right = flag;
    }
    
    this.setGroup = function(num){
        this.group = num;
    }
    this.setRotation = function(r){
        this.rotation = r;
    }
    this.add = function(v){
        var p = this.pt.clone();
        p.add(v);
        return p;
    }
    this.applyRotation = function(v){
        var rot = new THREE.Matrix4().makeRotationAxis(new Pt(0, 1, 0), this.rotation);
        v.applyMatrix4(rot);
        return v;
    }
    this.toString = function(){
        var ret = '';
        ret += '\n(' + this.pt.x + ' ' + this.pt.y + ' ' + this.pt.z + ')\n';
        ret += 'rotation: ' + this.rotation + '\n';
        ret += 'group: ' + this.group + '\n';
//        ret += 'corner: ' this.corner + '\n';
//        ret += 'ground: ' this.groundFlag + '\n';
//        ret += 'built: ' this.builtFlag + '\n';
        return ret;
    }
    
    this.setBuildSpace = function(geo){
        if(Math.random() > 0.7)
            geo.vertices.forEach(function(v){
                if(v.x > pt.x)
                    v.x += 6;
            });
        if(Math.random() > 0.7)
            geo.vertices.forEach(function(v){
                if(v.z > pt.z)
                    v.z += 6;
            });
        this.buildSpace = geo;
        var x = geo.vertices[1].x - geo.vertices[4].x;
        var z = geo.vertices[1].z - geo.vertices[0].z;
        this.buildLength = z;
        this.buildWidth = x;
    }
    //
    this.build = function(scale, ci){
        if(this.buildSpace.vertices == 0)
            updateLog('This Location does not know plot data');
        
        mainStruc = this.buildSpace.clone();
        this.buildSpace.faceVertexUvs[0].forEach(function(ar){
            ar.forEach(function(v){
                v.x = 0;
                v.y = 0;
            });
        });
        var center = pt.clone();
            var height = Math.random() * scale;
            while(height < scale/3)
                height = Math.random() * scale;
            mainStruc = scaleGeoY(mainStruc, height*(1+ci));
            scaleBox(mainStruc);
            addDetails1(mainStruc, height*(1.05+ci), scale, center);
        mainStruc.faceVertexUvs[0][4].forEach(function(v){
            v.x = 0;
            v.y = 0;
        });
        mainStruc.faceVertexUvs[0][5].forEach(function(v){
            v.x = 0;
            v.y = 0;
        });
        this.buildSpace.merge(mainStruc);
    }
    
    function scaleGeoY(geo, scale){
        geo.vertices[0].y *= scale;
        geo.vertices[1].y *= scale;
        geo.vertices[4].y *= scale;
        geo.vertices[5].y *= scale;
        geo.vertices.forEach(function(v){
            v.y += 0.1;
        });
        return geo;
    }
    
    function scaleGeoXZ(geo){
        var dx = (geo.vertices[1].x - geo.vertices[4].x) * 0.8;
        var dz = (geo.vertices[1].z - geo.vertices[4].z) * 0.8;
        geo.vertices[0].add(new Pt(-dx, 0, -dz))
        geo.vertices[1].add(new Pt(-dx, 0, dz))
        geo.vertices[2].add(new Pt(-dx, 0, -dz))
        geo.vertices[3].add(new Pt(-dx, 0, dz))
        geo.vertices[4].add(new Pt(dx, 0, dz))
        geo.vertices[5].add(new Pt(dx, 0, -dz))
        geo.vertices[6].add(new Pt(dx, 0, dz))
        geo.vertices[7].add(new Pt(dx, 0, -dz))
        
        return geo;
    }
    return this;
}


function scaleBox(geo){
    var dx = (geo.vertices[0].x - geo.vertices[5].x) * .1;
    var dz = 1;
    var dz1 = (geo.vertices[0].z - geo.vertices[1].z);
    var dz2 = (geo.vertices[0].z - geo.vertices[1].z);
    (dz1 > dz2) ? dz = dz1*0.1 : dz=dz2*0.1;
    for(var i = 0; i < Math.floor(geo.vertices.length/2); i++){
        geo.vertices[i].x -= dx;
        geo.vertices[i+4].x += dx;
    }
    geo.vertices[1].z += dz;
    geo.vertices[3].z += dz;
    geo.vertices[4].z += dz;
    geo.vertices[6].z += dz;
        
    geo.vertices[0].z -= dz;
    geo.vertices[2].z -= dz;
    geo.vertices[5].z -= dz;
    geo.vertices[7].z -= dz;
}


function addDetails1(geo, heightLimit, scale, center){
    var rgn = Math.floor(Math.random()*10);
    //RoofAccess
    if(rgn%3!=0){
        var emblemish1 = new THREE.BoxGeometry(scale*.1, heightLimit, scale*.1);
        var corner = Math.floor(Math.random() * 10);
        var dz = scale/6;
        var dir = 1;
        if(corner > 3)
            dir = -1;
        if(corner == (1 || 4 || 3 || 6))
            dz *= -1;
        for(var i = 0; i < emblemish1.vertices.length; i++){
           emblemish1.vertices[i].y += heightLimit/2;
           emblemish1.vertices[i].x += dir*scale/6;
           emblemish1.vertices[i].z += dz;
           emblemish1.vertices[i].add(center);
        }
        emblemish1.faceVertexUvs[0][4].forEach(function(v){
            v.x = 0;
            v.y = 0;
        });
        emblemish1.faceVertexUvs[0][5].forEach(function(v){
            v.x = 0;
            v.y = 0;
        });
        geo.merge(emblemish1);
    }
}


function BlockMaker(len, wid){
    //Make use of the already created vertices and faces
    this.regGeo = new THREE.BoxGeometry(len, 0.1, wid);
    
    /*
        Order of vertices
    
    -----> +x
    |       Top                             Bot
    |   4--------1                       6--------3
    v   |        |                       |        |
    +   |        |                       |        |
    z   |        |                       |        |
        5--------0                       7--------2
        
    */
    this.slantGeo = this.regGeo.clone();
    
    var dx = this.slantGeo.vertices[0].x + this.slantGeo.vertices[4].x / 4;
    this.slantGeo.vertices[0].x -= dx;
    this.slantGeo.vertices[4].x += dx;
    this.slantGeo.vertices[2].x -= dx;
    this.slantGeo.vertices[6].x += dx;
    this.slantGeo.vertices[1].x += dx;
    this.slantGeo.vertices[5].x -= dx;
    this.slantGeo.vertices[3].x += dx;
    this.slantGeo.vertices[7].x -= dx;
    
    this.leftSEGeo = this.regGeo.clone();
    this.leftSEGeo.vertices[0].x += dx;
    this.leftSEGeo.vertices[2].x += dx;
    this.leftSEGeo.vertices[1].x -= dx;
    this.leftSEGeo.vertices[3].x -= dx;
    
    this.leftNEGeo = this.regGeo.clone();
    this.leftNEGeo.vertices[0].x -= dx;
    this.leftNEGeo.vertices[2].x -= dx;
    this.leftNEGeo.vertices[1].x += dx;
    this.leftNEGeo.vertices[3].x += dx;
    
    this.rightSWGeo = this.regGeo.clone();
    this.rightSWGeo.vertices[4].x += dx;
    this.rightSWGeo.vertices[6].x += dx;
    this.rightSWGeo.vertices[5].x -= dx;
    this.rightSWGeo.vertices[7].x -= dx;
    
    this.rightNWGeo = this.regGeo.clone();
    this.rightNWGeo.vertices[4].x -= dx;
    this.rightNWGeo.vertices[6].x -= dx;
    this.rightNWGeo.vertices[5].x += dx;
    this.rightNWGeo.vertices[7].x += dx;
    
    this.slantGeo2 = this.regGeo.clone();
    this.slantGeo2.vertices[0].x += dx;
    this.slantGeo2.vertices[4].x -= dx;
    this.slantGeo2.vertices[2].x += dx;
    this.slantGeo2.vertices[6].x -= dx;
    this.slantGeo2.vertices[1].x -= dx;
    this.slantGeo2.vertices[5].x += dx;
    this.slantGeo2.vertices[3].x -= dx;
    this.slantGeo2.vertices[7].x += dx;
    
    this.getRdm = function(){
        switch(Math.round(Math.random()*10)%6) {
            case 0: return this.regGeo; 
            case 1: return this.slantGeo;
            case 2: return this.leftSEGeo;
            case 3: return this.leftNEGeo;
            case 4: return this.rightSWGeo;
            case 5: return this.rightNWGeo;
            case 6: return this.slantGeo2;
        }
    }
     this.getGeo = function(choice){
        switch(choice) {
            case 0: return this.regGeo; 
            case 1: return this.slantGeo;
            case 2: return this.leftSEGeo;
            case 3: return this.leftNEGeo;
            case 4: return this.rightSWGeo;
            case 5: return this.rightNWGeo;
            case 6: return this.slantGeo2;
        }
    }
}

function createCity(NBlocks, streetWidth, MaxBlockLength, MaxBlockWidth){
    if(NBlocks < 3){
        alert("Usage: NBlocks >= 10");
        return;
    }
    var geometry_m = new THREE.Geometry();
    var locations = [];
    //(n,m) -> (x,z)
    var XMIN = -1 * NBlocks * MaxBlockWidth / 2,
        XMAX = -1 * XMAX,
        ZMIN = -1 * NBlocks * MaxBlockLength / 2,
        ZMAX = -1 * ZMIN;
    var cx = XMIN,
        cz = ZMIN;    
    
    //Create locations grid
    for(var n = 0; n < NBlocks; n++){
        for(var m = 0; m < NBlocks; m++){
            locations.push(new Location(new Pt(cx, 1, cz)));
            cx += NBlocks;
        }
        cz += NBlocks;
        cx = XMIN;
    } 
    //Show location points
//    for(loc in locations){
//        dot = locations[loc];
//        alert(dot.toString());
//        scene.add(dot.locator);
//        dot.locator.position.set(dot.pt.x, dot.pt.y, dot.pt.z);
//    }

    //define groups
    var tloc = NBlocks*NBlocks;
    var locationIndex = 0;
    while(tloc > 0){
        //determine what group
        var groupNum = Math.floor(Math.random()*100)%4; 
        
        //determine num in group
        var inGroup = 0;
        while(inGroup < 2)
            inGroup = Math.floor(Math.random() * NBlocks/4);
        
        var first = true;
        while(inGroup > 0){
            if(first && groupNum > 1) {
                locations[locationIndex].setLeft(true);
                first = false;
            }
            if(inGroup == 1 && groupNum > 1)
                locations[locationIndex].setRight(true);
            locations[locationIndex].setGroup(groupNum);
//            locations[locationIndex].setRotation(groupNum*25*DEGREES);
            inGroup--;
            if(locationIndex < locations.length - 1)
                locationIndex++;
            tloc--;
        }
    }
    
    //Generate block geometries
    for(loc in locations){
        dot = locations[loc];
        maker = new BlockMaker(MaxBlockLength-streetWidth, MaxBlockWidth-streetWidth);
        if(dot.left){
            if(dot.group == 3) 
                box = maker.getGeo(3);
            else if(dot.group == 2)
                box = maker.getGeo(2);
        } else if(dot.right){
             if(dot.group == 3) 
                 box = maker.getGeo(4);
            else if(dot.group == 2)
                box = maker.getGeo(5); 
            
        }
        else if(dot.group == 3)
            box = maker.getGeo(1);
        else if(dot.group == 2)
            box = maker.getGeo(6);
        else
            box = maker.getGeo(0);
//            box = maker.getRdm();
        for(v in box.vertices){
            //ORDER MATTERS
//            box.vertices[v] = dot.applyRotation(box.vertices[v]);
            box.vertices[v] = dot.add(box.vertices[v]);
        }
        
        //Generate building geometries
        dot.setBuildSpace(box);
        var len = locations.length/2;
        var closeness = (loc % len)/200;
        dot.build(NBlocks, closeness);
        geometry_m.merge(dot.buildSpace);
        mesh = new THREE.Mesh(box.clone(), new THREE.MeshLambertMaterial({
            color: 0x606060,
            map: getBuildingTexture(),
            side: THREE.DoubleSide
        }));
        city.add(mesh);
    }
    return geometry_m;
}

var textureLib = [];
    textureLib.push(new THREE.ImageUtils.loadTexture('textures/walls1.jpg'));
    textureLib.push(new THREE.ImageUtils.loadTexture('textures/walls2.jpg'));
    textureLib.push(new THREE.ImageUtils.loadTexture('textures/walls3.jpg'));
function getBuildingTexture(){
    var texture = undefined;
    texture = textureLib[Math.floor(Math.random() * 10) % textureLib.length];
    if(texture != undefined){
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,2);
    }
    return texture;
}