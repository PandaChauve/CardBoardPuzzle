var PandaCardBoard;
(function (PandaCardBoard) {
    var State;
    (function (State) {
        State[State["Start"] = 0] = "Start";
        State[State["None"] = 1] = "None";
        State[State["Moving"] = 2] = "Moving";
        State[State["Locking"] = 3] = "Locking";
    })(State || (State = {}));
    var All = (function () {
        function All() {
            var camera, scene, renderer;
            var effect, controls;
            var element, container;
            var clock = new THREE.Clock();
            var group = new THREE.Group();
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            mouse.x = 0;
            mouse.y = 0;
            var CUBE_SIZE = 100;
            var GRAB_FACTOR = 5;
            var materials = {
                block: null,
                accessible: null,
                target: null,
                move: null
            };
            init();
            resize();
            group.position.x = 600;
            group.rotation.z = Math.PI / 2;
            var state = State.Start;
            animate();
            function init() {
                renderer = new THREE.WebGLRenderer();
                element = renderer.domElement;
                container = document.getElementById('example');
                container.appendChild(element);
                effect = new THREE.StereoEffect(renderer);
                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(90, 1, 0.001, CUBE_SIZE * GRAB_FACTOR * 10);
                camera.position.set(0, 10, 0);
                scene.add(camera);
                controls = new THREE.OrbitControls(camera, element);
                controls.rotateUp(Math.PI / 4);
                controls.target.set(camera.position.x + 0.1, camera.position.y, camera.position.z);
                controls.noZoom = true;
                controls.noPan = true;
                function setOrientationControls(e) {
                    if (!e.alpha) {
                        return;
                    }
                    controls = new THREE.DeviceOrientationControls(camera);
                    controls.connect();
                    controls.update();
                    element.addEventListener('click', fullscreen, false);
                    window.removeEventListener('deviceorientation', setOrientationControls, true);
                }
                window.addEventListener('deviceorientation', setOrientationControls, true);
                materials.block = new THREE.MeshBasicMaterial({
                    color: 0x0fffff,
                    wireframe: true
                });
                materials.accessible = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    wireframe: true
                });
                materials.target = new THREE.MeshBasicMaterial({
                    color: 0x0fffff,
                    wireframe: true
                });
                materials.move = new THREE.MeshBasicMaterial({
                    color: 0x0fff00,
                    wireframe: true,
                    transparent: true
                });
                var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.60);
                scene.add(light);
                var geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 10, 10, 10);
                function AddCube(x, y, z) {
                    var mesh = new THREE.Mesh(geometry, materials.block);
                    mesh.position.x = x * CUBE_SIZE;
                    mesh.position.y = z * CUBE_SIZE;
                    mesh.position.z = y * CUBE_SIZE;
                    mesh.matrixAutoUpdate = false;
                    mesh.updateMatrix();
                    mesh.name = 'cube ' + x + " " + y + " " + z;
                    group.add(mesh);
                }
                scene.add(group);
                AddCube(0.9 * GRAB_FACTOR, 0, 0);
                AddCube(0, 0, 0);
                AddCube(GRAB_FACTOR, GRAB_FACTOR, 0);
                AddCube(0, 0.9 * GRAB_FACTOR, 0);
                AddCube(-GRAB_FACTOR, GRAB_FACTOR, 0);
                AddCube(-0.9 * GRAB_FACTOR, 0, 0);
                AddCube(-GRAB_FACTOR, -GRAB_FACTOR, 0);
                AddCube(0, -0.9 * GRAB_FACTOR, 0);
                AddCube(GRAB_FACTOR, -GRAB_FACTOR, 0);
                window.addEventListener('resize', resize, false);
                setTimeout(resize, 1);
            }
            function resize() {
                var width = container.offsetWidth;
                var height = container.offsetHeight;
                camera.aspect = width / height;
                effect.setSize(width, height);
            }
            function update(dt) {
                resize();
                camera.updateProjectionMatrix();
                controls.update(dt);
            }
            var currentLocking = null;
            var currentMover = null;
            function SetStateTo(newState) {
                console.log("new state " + newState);
                state = newState;
            }
            function getFrontObject() {
                var intersects = raycaster.intersectObjects(group.children);
                var sect = null;
                var dist = 100000;
                for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].distance < dist) {
                        dist = intersects[i].distance;
                        sect = intersects[i];
                    }
                }
                return sect;
            }
            function CreateMover(start, dest) {
                var ret = {
                    startPos: start.clone(),
                    endPos: dest.position.clone().multiplyScalar(-1),
                    startTime: Date.now(),
                    target: dest,
                    updateState: null
                };
                ret.target.material = materials.move;
                ret.updateState = function updateState() {
                    var ratio = (Date.now() - this.startTime) / 1500;
                    if (ratio > 1)
                        ratio = 1;
                    if (this.target) {
                        if (ratio > 0.8) {
                            var idx = group.children.indexOf(this.target);
                            group.children.splice(idx, 1);
                            this.target = null;
                        }
                        else {
                            this.target.material.opacity = 0.8 - ratio;
                        }
                    }
                    group.position.copy(this.startPos);
                    group.position.multiplyScalar(1 - ratio);
                    group.position.addScaledVector(this.endPos, ratio);
                    return ratio == 1;
                };
                return ret;
            }
            var currentHover = null;
            function hideAccessibles() {
                for (var i = 0; i < group.children.length; ++i) {
                    if (group.children[i].material == materials.accessible)
                        group.children[i].material = materials.block;
                }
            }
            function colorAccessibles(currentHover) {
                for (var i = 0; i < group.children.length; ++i) {
                    var tmp = group.children[i].position.distanceTo(currentHover.position);
                    if (group.children[i] != currentHover && tmp < GRAB_FACTOR * CUBE_SIZE * 1.1)
                        group.children[i].material = materials.accessible;
                }
            }
            function render() {
                raycaster.setFromCamera(mouse, camera);
                if (state == State.Start) {
                    if (!currentLocking) {
                        var sect = getFrontObject();
                        if (sect) {
                            currentLocking = new PandaCardBoard.Locker(sect.object, raycaster, 3000);
                            currentHover = sect.object;
                            colorAccessibles(currentHover);
                        }
                    }
                    else {
                        var ret = currentLocking.updateState();
                        switch (ret) {
                            case PandaCardBoard.LockerState.Failed:
                                currentLocking.destroy();
                                currentLocking = null;
                                break;
                            case PandaCardBoard.LockerState.Success:
                                var mesh = currentLocking.destroy();
                                currentLocking = null;
                                currentMover = CreateMover(group.position, mesh);
                                group.position.x = 0;
                                group.rotation.z = 0;
                                hideAccessibles();
                                currentHover = null;
                                SetStateTo(State.Moving);
                        }
                    }
                }
                else if (state == State.None) {
                    var sect_1 = getFrontObject();
                    if (sect_1 != null && sect_1.distance < GRAB_FACTOR * CUBE_SIZE) {
                        SetStateTo(State.Locking);
                        currentLocking = new PandaCardBoard.Locker(sect_1.object, raycaster, 1500, GRAB_FACTOR * CUBE_SIZE);
                    }
                }
                else if (state == State.Locking) {
                    var lockingState = currentLocking.updateState();
                    if (lockingState == PandaCardBoard.LockerState.Failed) {
                        currentLocking.destroy();
                        currentLocking = null;
                        SetStateTo(State.None);
                    }
                    else if (lockingState == PandaCardBoard.LockerState.Success) {
                        var mesh = currentLocking.destroy();
                        currentLocking = null;
                        SetStateTo(State.Moving);
                        currentMover = CreateMover(group.position, mesh);
                    }
                }
                else if (state == State.Moving) {
                    if (currentMover.updateState()) {
                        currentMover = null;
                        SetStateTo(State.None);
                    }
                }
                effect.render(scene, camera);
            }
            function animate() {
                requestAnimationFrame(animate);
                update(clock.getDelta());
                render();
            }
            function fullscreen() {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                }
                else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
                else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                }
                else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
            }
        }
        return All;
    }());
    PandaCardBoard.All = All;
})(PandaCardBoard || (PandaCardBoard = {}));
var greeter = new PandaCardBoard.All();
