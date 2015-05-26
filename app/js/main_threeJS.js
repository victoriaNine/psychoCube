var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
 
var scene = new THREE.Scene;

var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
var cubeTexture = THREE.ImageUtils.loadTexture('img/box.png');
var materials = [];
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xff0000 })); // right face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xffff00 })); // left face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xffffff })); // top face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0x00ffff })); // bottom face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0x0000ff })); // front face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xff00ff })); // back face
var cubeMaterial = new THREE.MeshFaceMaterial(materials);
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.rotation.y = Math.PI * 45 / 180;
scene.add(cube);

var particles = new THREE.Geometry;
for (var p = 0; p < 2000; p++) {
    var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
    particles.vertices.push(particle);
}
var particleTexture = THREE.ImageUtils.loadTexture('img/snowflake.png');
var particleMaterial = new THREE.PointCloudMaterial({ map: particleTexture, transparent: true, size: 5 });
var particleSystem = new THREE.PointCloud(particles, particleMaterial);
scene.add(particleSystem);

var smokeParticles = new THREE.Geometry;
for (var i = 0; i < 300; i++) {
    var particle = new THREE.Vector3(Math.random() * 32 - 16, Math.random() * 230, Math.random() * 32 - 16);
    smokeParticles.vertices.push(particle);
}
var smokeTexture = THREE.ImageUtils.loadTexture('img/smoke.png');
var smokeMaterial = new THREE.PointCloudMaterial({ map: smokeTexture, opacity:Math.random() + .1, transparent: true, blending: THREE.AdditiveBlending, size: 50, depthWrite: false, depthTest: false });
var smoke = new THREE.PointCloud(smokeParticles, smokeMaterial);
smoke.sortParticles = true;
smoke.position.x = -150;
scene.add(smoke);

var skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
var skyboxMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.BackSide });
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(0, 300, 200);
scene.add(pointLight);

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.y = 160;
camera.position.z = 400;
camera.lookAt(cube.position);
scene.add(camera);

var clock = new THREE.Clock;
var controls = new THREE.TrackballControls(camera, renderer.domElement);

var uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v2", value: new THREE.Vector2 },
    texture: { type: "t", value: THREE.ImageUtils.loadTexture('img/box.png') }
};

var animation, skinnedMesh, item, pivot;
var loader = new THREE.JSONLoader;
loader.load('js/model.js', function (geometry, materials) {
    skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    skinnedMesh.position.y = 50;
    skinnedMesh.scale.set(15, 15, 15);
    scene.add(skinnedMesh);

    item = new THREE.Mesh(new THREE.BoxGeometry(100, 10, 10), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
    var itemMaterial = new THREE.ShaderMaterial({
    	uniforms: uniforms,
	    vertexShader: document.getElementById('cubeVertexShader').innerHTML,
	    fragmentShader: document.getElementById('cubeFragmentShader').innerHTML
	});
	//item = new THREE.Mesh(new THREE.BoxGeometry(100, 10, 10), itemMaterial);
	item.position.x = 50;
	pivot = new THREE.Object3D();
	pivot.scale.set(.15, .15, .15);
	pivot.add(item);
	//pivot.useQuaternion = true;
	skinnedMesh.add(pivot);
     
    animate(skinnedMesh);
});

var currentSequence = 'standing';

function animate(skinnedMesh) {
    var materials = skinnedMesh.material.materials;
 
    for(var k in materials)
        materials[k].skinning = true;
 
    //THREE.AnimationHandler.add(skinnedMesh.geometry.animation);
    animation = new THREE.Animation(skinnedMesh, skinnedMesh.geometry.animation, THREE.AnimationHandler.CATMULLROM);
    animation.play(0);
    animation.loop = false;
}

function render() {
	requestAnimationFrame(render);

	var delta = clock.getDelta();
    cube.rotation.y -= delta;
	particleSystem.rotation.y += delta;

	for(var i = 0; i < smokeParticles.vertices.length; i++) {
		particle = smokeParticles.vertices[i];
		particle.y += delta * 50;
		 
		if (particle.y >= 230) {
		    particle.y = Math.random() * 16;
		    particle.x = Math.random() * 32 - 16;
		    particle.z = Math.random() * 32 - 16;
		}
	}
	smokeParticles.verticesNeedUpdate = true;

	if(animation) {
		THREE.AnimationHandler.update(delta);//animation.update(delta);
		if(currentSequence == 'standing') {
	        if(animation.currentTime > 4) {
	            animation.stop();
	            animation.play(0); // play the animation not looped, from 0s
	        }
	    }
	    else if(currentSequence == 'walking') {
	        if(animation.currentTime <= 4 || animation.currentTime > 8) {
	            animation.stop();
	            animation.play(4); // play the animation not looped, from 4s
	        }
	    }

	    pivot.position = new THREE.Vector3().setFromMatrixPosition(skinnedMesh.skeleton.bones[2].matrix);
		pivot.quaternion.setFromRotationMatrix(skinnedMesh.skeleton.bones[2].matrix);
		uniforms.time.value += delta * 10;
	}

	controls.update();
    renderer.render(scene, camera);
}

document.addEventListener('keyup', function(e) {
    if(e.keyCode == 'A'.charCodeAt(0)) {
        currentSequence = (currentSequence == 'standing' ? 'walking': 'standing');
    }
});
 
render();


/*var renderer, camera, scene, light, geo, material, mesh, controls;

function init() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	light = new THREE.DirectionalLight(0xFFFFFF, .8);
	light.position.z = 100;
	scene.add(light);

	light = new THREE.DirectionalLight(0xFFFFFF, .8);
	light.position.z = -100;
	scene.add(light);

	geo = new THREE.BoxGeometry(20, 20, 20);
	material = new THREE.MeshLambertMaterial({ color:0xFF0000 });
	mesh = new THREE.Mesh(geo, material);
	scene.add(mesh);

	camera.position.z = 100;

	controls = new THREE.TrackballControls(camera, renderer.domElement);
}

function animate() {
	requestAnimationFrame(animate);

	mesh.rotation.x += .01;
	mesh.rotation.y += .01;
	mesh.rotation.z += .01;

	controls.update();

	renderer.render(scene, camera);
}

init();
animate();*/