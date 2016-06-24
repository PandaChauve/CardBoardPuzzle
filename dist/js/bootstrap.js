var PandaCardBoard;
(function (PandaCardBoard) {
    var State;
    (function (State) {
        State[State["Start"] = 0] = "Start";
        State[State["None"] = 1] = "None";
        State[State["Moving"] = 2] = "Moving";
        State[State["Locking"] = 3] = "Locking";
    })(State || (State = {}));
    var UrlParser = (function () {
        function UrlParser() {
            var data = document.createElement('a');
            data.href = window.location.href;
            this._search = data.search;
        }
        UrlParser.prototype.debug = function () {
            return this._search.lastIndexOf("debug") != -1;
        };
        return UrlParser;
    }());
    PandaCardBoard.UrlParser = UrlParser;
    var All = (function () {
        function All() {
        }
        All.prototype.run = function (config) {
            var container1 = new PandaCardBoard.GraphicalContainer('example');
            if (!config.debug())
                container1.AddStereoEffect();
            container1.AddDeviceOrientation();
            var group = new THREE.Group();
            var CUBE_SIZE = 100;
            var GRAB_FACTOR = 5;
            init();
            group.position.x = 600;
            group.rotation.z = Math.PI / 2;
            var state = State.Start;
            animate();
            function init() {
                var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.60);
                container1.scene.add(light);
                function AddCube(x, y, z) {
                    var cube = new PandaCardBoard.Cube(x, y, z);
                    group.add(cube.mesh);
                }
                container1.scene.add(group);
                AddCube(0.9 * GRAB_FACTOR, 0, 0);
                AddCube(0, 0, 0);
                AddCube(GRAB_FACTOR, GRAB_FACTOR, 0);
                AddCube(0, 0.9 * GRAB_FACTOR, 0);
                AddCube(-GRAB_FACTOR, GRAB_FACTOR, 0);
                AddCube(-0.9 * GRAB_FACTOR, 0, 0);
                AddCube(-GRAB_FACTOR, -GRAB_FACTOR, 0);
                AddCube(0, -0.9 * GRAB_FACTOR, 0);
                AddCube(GRAB_FACTOR, -GRAB_FACTOR, 0);
            }
            var currentLocking = null;
            var currentMover = null;
            function SetStateTo(newState) {
                console.log("new state " + newState);
                state = newState;
            }
            function getFrontObject() {
                var intersects = container1.getRayCaster().intersectObjects(group.children);
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
            function CreateMover(dest) {
                var ret = new PandaCardBoard.MoveTo(dest, group);
                return ret;
            }
            var currentHover = null;
            function render() {
                if (state == State.Start) {
                    if (!currentLocking) {
                        var sect = getFrontObject();
                        if (sect) {
                            currentLocking = new PandaCardBoard.Locker(sect.object.userData, container1.getRayCaster(), 3000);
                            currentHover = sect.object;
                        }
                    }
                    else {
                        var ret = currentLocking.update();
                        switch (ret) {
                            case PandaCardBoard.AnimationState.Failed:
                                currentLocking.destroy();
                                currentLocking = null;
                                break;
                            case PandaCardBoard.AnimationState.Success:
                                var mesh = currentLocking.destroy();
                                currentLocking = null;
                                currentMover = CreateMover(mesh);
                                group.position.x = 0;
                                group.rotation.z = 0;
                                currentHover = null;
                                SetStateTo(State.Moving);
                        }
                    }
                }
                else if (state == State.None) {
                    var sect_1 = getFrontObject();
                    if (sect_1 != null && sect_1.distance < GRAB_FACTOR * CUBE_SIZE) {
                        SetStateTo(State.Locking);
                        currentLocking = new PandaCardBoard.Locker(sect_1.object.userData, container1.getRayCaster(), 1500, GRAB_FACTOR * CUBE_SIZE);
                    }
                }
                else if (state == State.Locking) {
                    var lockingState = currentLocking.update();
                    if (lockingState == PandaCardBoard.AnimationState.Failed) {
                        currentLocking.destroy();
                        currentLocking = null;
                        SetStateTo(State.None);
                    }
                    else if (lockingState == PandaCardBoard.AnimationState.Success) {
                        var mesh = currentLocking.destroy();
                        currentLocking = null;
                        SetStateTo(State.Moving);
                        currentMover = CreateMover(mesh);
                    }
                }
                else if (state == State.Moving) {
                    var moveState = currentMover.update();
                    if (moveState == PandaCardBoard.AnimationState.Success) {
                        var mesh = currentMover.destroy();
                        currentMover = null;
                        var idx = group.children.indexOf(mesh.mesh);
                        group.children.splice(idx, 1);
                        mesh.mesh.userData = null;
                        mesh.mesh = null;
                        SetStateTo(State.None);
                    }
                }
            }
            function animate() {
                requestAnimationFrame(animate);
                container1.update();
                render();
                container1.render();
            }
        };
        return All;
    }());
    PandaCardBoard.All = All;
})(PandaCardBoard || (PandaCardBoard = {}));
document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.All();
    greeter.run(new PandaCardBoard.UrlParser());
});
