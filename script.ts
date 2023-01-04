
interface Vertex {
    x: number;
    y: number;
    z: number;
}

interface Pixel {
    x: number;
    y: number;
}

interface Relation {
    a: Vertex;
    b: Vertex;
}

class Voxel {
    //front
    frontLeftBottom: Vertex; 
    frontLeftTop: Vertex; 
    frontRightBottom: Vertex; 
    frontRightTop: Vertex;
    //back
    backLeftBottom: Vertex; 
    backLeftTop: Vertex; 
    backRightBottom: Vertex; 
    backRightTop: Vertex;
    vertices: Vertex[];
    //relations: Relation[];
    faces: Relation[][];
    toRender: number[];
    color: string;

    constructor(start: Vertex, color: string) {
        let lengthX = 10;
        let lengthY = 10;
        let lengthZ = 10;

        this.color = color;
        this.frontLeftBottom = {x: start.x, y: start.y, z: start.z};
        this.frontLeftTop = {x: start.x, y: start.y, z: start.z};
        this.frontLeftTop.y += lengthY;

        this.frontRightTop = {x: start.x, y: start.y, z: start.z};
        this.frontRightTop.y += lengthY;
        this.frontRightTop.x += lengthX;

        this.frontRightBottom = {x: start.x, y: start.y, z: start.z};
        this.frontRightBottom.x += lengthX;

        //back
        this.backLeftBottom = {x: start.x, y: start.y, z: start.z};
        this.backLeftBottom.z += lengthZ;

        this.backLeftTop = {x: start.x, y: start.y, z: start.z};
        this.backLeftTop.y += lengthY;
        this.backLeftTop.z += lengthZ;

        this.backRightTop = {x: start.x, y: start.y, z: start.z};
        this.backRightTop.y += lengthY;
        this.backRightTop.x += lengthX;
        this.backRightTop.z += lengthZ;

        this.backRightBottom = {x: start.x, y: start.y, z: start.z};
        this.backRightBottom.x += lengthX;
        this.backRightBottom.z += lengthZ;

        this.vertices = [this.frontLeftBottom, this.frontLeftTop, this.frontRightBottom, this.frontRightTop,
                            this.backLeftBottom, this.backLeftTop, this.backRightBottom, this.backRightTop];
        this.toRender = [0, 1, 2, 3, 4, 5];

        //repeated lines for future face rendering
        this.faces = [
             //back-face
             [{a: this.backLeftBottom, b: this.backLeftTop}, {a: this.backLeftTop, b: this.backRightTop},
             {a: this.backRightTop, b: this.backRightBottom}, {a: this.backRightBottom, b: this.backLeftBottom}],

             //left-face
             [{a: this.frontLeftBottom, b: this.backLeftBottom}, {a: this.backLeftBottom, b: this.backLeftTop},
             {a: this.backLeftTop, b: this.frontLeftTop}, {a: this.frontLeftTop, b: this.frontLeftBottom}],
             //right-face
             [{a: this.frontRightBottom, b: this.backRightBottom}, {a: this.backRightBottom, b: this.backRightTop},
             {a: this.backRightTop, b: this.frontRightTop}, {a: this.frontRightTop, b: this.frontRightBottom}],

              //top-face
              [{a: this.frontRightBottom, b: this.backRightBottom}, {a: this.backRightBottom, b: this.backLeftBottom},
                {a: this.backLeftBottom, b: this.frontLeftBottom}, {a: this.frontLeftBottom, b: this.frontRightBottom}],

            //bottom-face
            [{a: this.frontRightTop, b: this.backRightTop}, {a: this.backRightTop, b: this.backLeftTop},
                {a: this.backLeftTop, b: this.frontLeftTop}, {a: this.frontLeftTop, b: this.frontRightTop}],

             //front-face this should render last
             [{a: this.frontLeftBottom, b: this.frontLeftTop}, {a: this.frontLeftTop, b: this.frontRightTop}, 
             {a: this.frontRightTop, b: this.frontRightBottom}, {a: this.frontRightBottom, b: this.frontLeftBottom}],

        ];
    }

    move(vec: Vertex) {
        this.vertices.forEach( (v) => {
            v.x += vec.x;
            v.y += vec.y;
            v.z += vec.z;
        });
    }
}

function getRad(deg: number) {
    return (deg%360) * (Math.PI/180);
}

class Camera {
    position: Vertex;
    rotation: Vertex;
    focalLength: number;
    fov: number;

    move(vec: Vertex) {
        this.position.x += vec.x;
        this.position.y += vec.y;
        this.position.z += vec.z;
    }

    rotate(deg: {x: number, y: number, z:number}) {
        this.rotation.x = (0 + deg.x)%360;
        this.rotation.y = (0+ deg.y)%360;
        this.rotation.z = (0  + deg.z)%360;

        let degx = getRad(this.rotation.x);
        let degy = getRad(this.rotation.y);
        let degz = getRad(this.rotation.z);
        /*
        https://en.wikipedia.org/wiki/Rotation_matrix
        */
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;
        this.position.x = x*Math.cos(degy)*Math.cos(degz) +
                            y*(Math.sin(degx)*Math.sin(degy)*Math.cos(degz) - Math.cos(degx)*Math.sin(degz)) +
                            z*(Math.cos(degx)*Math.sin(degy)*Math.cos(degz) + Math.sin(degx)*Math.sin(degz));

        this.position.y = x*Math.cos(degy)*Math.sin(degz) +
                            y*(Math.sin(degx)*Math.sin(degy)*Math.sin(degz) + Math.cos(degx)*Math.cos(degz)) +
                            z*(Math.cos(degx)*Math.sin(degy)*Math.sin(degz) - Math.sin(degx)*Math.cos(degz));

        this.position.z = x*(-Math.sin(degy)) +
                            y*Math.sin(degx)*Math.cos(degy) +
                            z*Math.cos(degx)*Math.cos(degy);
    }

    constructor(position: Vertex, rotation: Vertex, fov: number) {
        this.position = {x: position.x, y: position.y, z: position.z};
        this.rotation = {x:0, y:0, z:0};
        this.rotate(rotation);
        this.fov = fov;
        let rad = getRad(fov/2);
        this.focalLength = (360/Math.sin(rad)) * Math.sin(getRad(90) - rad);
    }
}

let nullVoxel = new Voxel({x:0, y:0, z:0}, "");

let world: Voxel[][][] = [];

function createWorld() {
    for (var i = 0; i < 16; i++) {
        let world2: Voxel[][] = [];
        for (var j = 0; j < 16; j++) {
            let world3: Voxel[] = [];
            for (var k = 0; k < 16; k++) {
                world3.push(nullVoxel);
            }
            world2.push(world3);
        }
        world.push(world2);
    }
}

createWorld();


let cube = new Voxel({x:10, y:100, z:100}, "#4d3f31");
let cube1 = new Voxel({x:0, y:100, z:120}, "#4g3f31");
let cube2 = new Voxel({x:10, y:100, z:110}, "#cfba14");
let cube3 = new Voxel({x:10, y:90, z:110}, "#2b8042");

let cubes:Voxel[] = [cube, cube1, cube2, cube3];
//let world:Voxel[][][] = new Array(16, 16, 25);
//console.log(world);
//create world and check in the beginning, if the block has neighbours

//check for neighbours
cubes.forEach((c) => {
    let PosX = c.frontLeftBottom.x / 10;
    let PosY = c.frontLeftBottom.y / 10;
    let PosZ = c.frontLeftBottom.z / 10;
    world[PosX][PosY][PosZ] = c;
});

function voxelAt(v: Vertex) {
    console.log(world[v.x][v.y][v.z]);
    if(world[v.x][v.y][v.z].color == "") {
        return false;
    }
    return true;
}

//check for neighbours
cubes.forEach((c) => {
    let PosX = c.frontLeftBottom.x / 10;
    let PosY = c.frontLeftBottom.y / 10;
    let PosZ = c.frontLeftBottom.z / 10;
    let toRemove: number[] = [];

    if(PosZ != 15 && voxelAt({x: PosX, y: PosY, z: PosZ + 1})) {
        toRemove.push(0);
    }

    if(PosZ != 0 && voxelAt({x: PosX, y: PosY, z: PosZ - 1})) {
        toRemove.push(5);
    }

    if(PosY != 0 && voxelAt({x: PosX, y: PosY - 1, z: PosZ})) {
        toRemove.push(3);
    }

    if(PosZ != 15 && voxelAt({x: PosX, y: PosY + 1, z: PosZ - 1})) {
        toRemove.push(4);
    }

    if(PosX != 0 && voxelAt({x: PosX - 1, y: PosY, z: PosZ})) {
        toRemove.push(1);
    }

    if(PosX != 15 && voxelAt({x: PosX + 1, y: PosY, z: PosZ})) {
        toRemove.push(2);
    }


    //remove faces
    toRemove.forEach(r => {
        for (var i = 0; i<c.toRender.length; i++) {
            if(c.toRender[i] == r) {
                c.toRender.splice(i, 1);
            }
        }
    });
});


//nice values through trying out
let camera = new Camera({
    "x": -15,
    "y": 85,
    "z": -1050
}, {x: -0.2, y:0 ,z:0}, 90);

//wrong but I do not care rn
function get3Dproj(v: Vertex) {
    let d = (camera.focalLength - camera.position.z);
    return {x: ((v.x - camera.position.x) * d/(v.z)), y:   (v.y - camera.position.y) * d/(v.z)};
}

function numInArray(a: number, arr: number[]) {
    var ret = false;
    arr.forEach(b => {
        if (b === a) {
            ret = true;
        }
    });
    return ret;
}


async function draw (ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0,0,720,480);
    ctx.fillStyle = "#FFFFFF4f";
    ctx.fillRect(0, 0, 720, 480);
    let facesToDraw: {face: {face: Pixel[], origFace: Relation[]}, color: string}[] = [];
    //remove faces next to each other
    //next to do, do a filtering what faces would actually be visible to the cam
    //idea: calculate the distance between each relation and get shortest ones
    //calculate pixels

    let distances: {dist: number, index: number}[] = [];
    cubes.forEach(c => {
        distances = [];
        var j = 0;
        for (var t = 0; t<c.faces.length; t++) {
            let face = c.faces[t];
            let meanX = 0;
            let meanY = 0;
            let meanZ = 0;
            for (var i = 0; i<4; i++) {
                meanX += (face[i].a.x / 4);
                meanY += (face[i].a.y / 4);
                meanZ += (face[i].a.z / 4);
            }

            //calculate the distance
            let dist: number = Math.sqrt( Math.pow(camera.position.x - meanX , 2) +
                                            Math.pow(camera.position.y - meanY , 2) +
                                            Math.pow(camera.position.z - meanZ , 2));
            distances.push({dist: dist, index: j});
            //distances.push({dist: dist, index: j});
            j++;
        //});
        }
        distances.sort(function(a, b) {return b.dist - a.dist});
        distances.reverse();
        
        
        for (var j=0; j<3; j++) {
        //c.faces.forEach((face) => {
            if (!numInArray(distances[j].index, c.toRender)) {
                continue;
            }
            let face = c.faces[distances[j].index];
            var z = 0;
            let drawnPixel: Pixel[] = [];
            for (var i = 0; i<4; i++) {
                if(face[i].a.z >= z) {
                    z=face[i].a.z;
                }
                let rel = face[i];
                let p:Pixel = get3Dproj(rel.a);
                drawnPixel.push(p);
            }
            //decide which faces to draw
            facesToDraw.push({face: {face: drawnPixel, origFace: face}, color: c.color});
        //});
        }
        
    });

    //draw the faces
    facesToDraw.forEach((f) => {
        let color:string = f.color;
        let face:Pixel[] = f.face.face;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        
        for (var i = 1; i<3; i++) {
            ctx.moveTo(face[0].x, face[0].y);
            let p1=face[i];
            let p2=face[i + 1];
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            //ctx.stroke();
        }
        ctx.closePath();
        ctx.fill();
    });

    //outline the faces    
    facesToDraw.forEach((f) => {
        let face:Pixel[] = f.face.face;
        for (var i = 0; i<4; i++) {
            let p1=face[i];
            let p2=face[(i + 1) % 4];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.closePath();
        }
    });

 }

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let ctx = canvas.getContext("2d");
setInterval(() => {
    if (ctx != null) {
        draw(ctx);
    }
}, 100);

//keyboard input
function handleUserKeyPress (event: any ) {
    const { key } = event;
    if (key === "w") {
        camera.move({x: 0, y: 0, z: 10});
    }
    if (key === "s") {
        camera.move({x: 0, y: 0, z: -10});
    }
    if (key === "a") {
        camera.move({x: 1, y: 0, z: 0});
    }
    if (key === "d") {
        camera.move({x: -1, y: 0, z: 0});
    }
    if (key === "Shift") {
        camera.move({x: 0, y: -1, z: 0});
    }
    if (key === " ") {
        camera.move({x: 0, y: 1, z: 0});
    }

    if (key === "e") {
        camera.rotate({x: 0, y: 0, z: 1});
    }

    if (key === "q") {
        camera.rotate({x: 0, y: 0, z: -1});
    }

    if (key === "c") {
        camera.rotate({x: 0.1, y: 0, z: 0});
    }

    if (key === "v") {
        camera.rotate({x: -0.1, y: 0, z: 0});
    }
}
window.addEventListener('keydown', handleUserKeyPress)
