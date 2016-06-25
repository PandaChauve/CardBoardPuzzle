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
        UrlParser.prototype.demo = function () {
            return this._search.lastIndexOf("4ir") == -1;
        };
        return UrlParser;
    }());
    PandaCardBoard.UrlParser = UrlParser;
    var Demo = (function () {
        function Demo() {
            this.group = new THREE.Group();
            this.currentLocking = null;
            this.currentMover = null;
            this.CUBE_SIZE = 100;
            this.GRAB_FACTOR = 5;
            this.currentHover = null;
        }
        Demo.prototype.init = function (cont) {
            this.container1 = cont;
            this.group.position.x = 600;
            this.group.rotation.z = Math.PI / 2;
            this.state = State.Start;
            var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.60);
            this.container1.scene.add(light);
            var group = this.group;
            function AddCube(x, y, z) {
                var cube = new PandaCardBoard.Cube(x, y, z);
                group.add(cube.mesh);
            }
            this.container1.scene.add(this.group);
            AddCube(0.9 * this.GRAB_FACTOR, 0, 0);
            AddCube(0, 0, 0);
            AddCube(this.GRAB_FACTOR, this.GRAB_FACTOR, 0);
            AddCube(0, 0.9 * this.GRAB_FACTOR, 0);
            AddCube(-this.GRAB_FACTOR, this.GRAB_FACTOR, 0);
            AddCube(-0.9 * this.GRAB_FACTOR, 0, 0);
            AddCube(-this.GRAB_FACTOR, -this.GRAB_FACTOR, 0);
            AddCube(0, -0.9 * this.GRAB_FACTOR, 0);
            AddCube(this.GRAB_FACTOR, -this.GRAB_FACTOR, 0);
        };
        Demo.prototype.SetStateTo = function (newState) {
            console.log("new state " + newState);
            this.state = newState;
        };
        Demo.prototype.getFrontObject = function () {
            return this.container1.getFrontObject(this.group.children, -1);
        };
        Demo.prototype.CreateMover = function (dest) {
            this.SetStateTo(State.Moving);
            return new PandaCardBoard.MoveTo(dest, this.group);
        };
        Demo.prototype.update = function (delta) {
            if (this.state == State.Start) {
                if (!this.currentLocking) {
                    var sect = this.getFrontObject();
                    if (sect) {
                        this.currentLocking = new PandaCardBoard.Locker(sect.object.userData, this.container1.getRayCaster(), 3000);
                        this.currentHover = sect.object;
                    }
                }
                else {
                    var ret = this.currentLocking.update();
                    if (ret != PandaCardBoard.AnimationState.InProgress) {
                        var mesh = this.currentLocking.destroy();
                        this.currentLocking = null;
                        if (ret == PandaCardBoard.AnimationState.Success) {
                            this.group.position.x = 0;
                            this.group.rotation.z = 0;
                            this.currentHover = null;
                            this.currentMover = this.CreateMover(mesh);
                        }
                    }
                }
            }
            else if (this.state == State.None) {
                var sect = this.getFrontObject();
                if (sect != null && sect.distance < this.GRAB_FACTOR * this.CUBE_SIZE) {
                    this.SetStateTo(State.Locking);
                    this.currentLocking = new PandaCardBoard.Locker(sect.object.userData, this.container1.getRayCaster(), 1500, this.GRAB_FACTOR * this.CUBE_SIZE);
                }
            }
            else if (this.state == State.Locking) {
                var lockingState = this.currentLocking.update();
                if (lockingState == PandaCardBoard.AnimationState.Failed) {
                    this.currentLocking.destroy();
                    this.currentLocking = null;
                    this.SetStateTo(State.None);
                }
                else if (lockingState == PandaCardBoard.AnimationState.Success) {
                    var mesh = this.currentLocking.destroy();
                    this.currentLocking = null;
                    this.currentMover = this.CreateMover(mesh);
                }
            }
            else if (this.state == State.Moving) {
                var moveState = this.currentMover.update();
                if (moveState == PandaCardBoard.AnimationState.Success) {
                    var mesh = this.currentMover.destroy();
                    this.currentMover = null;
                    var idx = this.group.children.indexOf(mesh.mesh);
                    this.group.children.splice(idx, 1);
                    this.SetStateTo(State.None);
                }
            }
        };
        return Demo;
    }());
    PandaCardBoard.Demo = Demo;
    var All = (function () {
        function All() {
            this._clock = new THREE.Clock(false);
        }
        All.prototype.run = function (config, game) {
            this._clock.start();
            var container1 = new PandaCardBoard.GraphicalContainer('example');
            if (!config.debug())
                container1.AddStereoEffect();
            container1.AddDeviceOrientation();
            game.init(container1);
            var clock = this._clock;
            function animate() {
                requestAnimationFrame(animate);
                container1.update(clock.getDelta());
                game.update(clock.getDelta());
                container1.render();
            }
            animate();
        };
        return All;
    }());
    PandaCardBoard.All = All;
})(PandaCardBoard || (PandaCardBoard = {}));
document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.All();
    var p = new PandaCardBoard.UrlParser();
    greeter.run(p, p.demo() ? new PandaCardBoard.Demo() : new PandaCardBoard.FourInARow.Game());
});
