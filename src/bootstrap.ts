namespace  PandaCardBoard {

    enum State{
        Start,
        None,
        Moving,
        Locking
    }

    export class UrlParser {
        private _search;
        // see http://medialize.github.io/URI.js/ for more complex url
        constructor() {
            var data = document.createElement('a');
            data.href = window.location.href;
            this._search = data.search;
        }

        debug():boolean {
            return this._search.lastIndexOf("debug") != -1;
        }
        demo():boolean {
            return this._search.lastIndexOf("4ir") == -1;
        }
    }

    export interface IRunnable{
        init : (cont :GraphicalContainer ) => void
        update : (delta:number ) => void
    }

    export class Demo implements IRunnable{

        private group = new THREE.Group();

        private currentLocking = <Locker>null;
        private currentMover = <MoveTo>null;
        private CUBE_SIZE = 100;
        private GRAB_FACTOR = 5;
        private state : State;
        private container1 : GraphicalContainer;
        private currentHover = null;

        constructor() {
        }



        public init(cont : GraphicalContainer) : void{
            this.container1 = cont;
            this.group.position.x = 600;
            this.group.rotation.z = Math.PI / 2;
            this.state = State.Start;
            var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.60);
            this.container1.scene.add(light);
            var group = this.group;
            function AddCube(x:number, y:number, z:number) {
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
        }


        private SetStateTo(newState:State) {
            console.log("new state " + newState);
            this.state = newState;
        }

        private getFrontObject():THREE.Intersection {
            return this.container1.getFrontObject(this.group.children, -1);
        }

        private CreateMover(dest:Element) {
            this.SetStateTo(State.Moving);
            return new MoveTo(dest, this.group);
        }


        update(delta : number) : void{
            if (this.state == State.Start) {
                if (!this.currentLocking) {
                    let sect = this.getFrontObject();
                    if (sect) {
                        this.currentLocking = new Locker(sect.object.userData, this.container1.getRayCaster(), 3000);
                        this.currentHover = sect.object;
                    }
                }
                else {
                    let ret = this.currentLocking.update();
                    if (ret != AnimationState.InProgress) {
                        let mesh = this.currentLocking.destroy();
                        this.currentLocking = null;
                        if (ret == AnimationState.Success) {
                            this.group.position.x = 0;
                            this.group.rotation.z = 0;
                            this.currentHover = null;
                            this.currentMover = this.CreateMover(mesh);
                        }
                    }
                }
            } else if (this.state == State.None) {
                let sect = this.getFrontObject();
                if (sect != null && sect.distance < this.GRAB_FACTOR * this.CUBE_SIZE) {
                    this.SetStateTo(State.Locking);
                    this.currentLocking = new Locker(sect.object.userData, this.container1.getRayCaster(), 1500, this.GRAB_FACTOR * this.CUBE_SIZE);
                }
            } else if (this.state == State.Locking) {
                let lockingState = this.currentLocking.update();
                if (lockingState == AnimationState.Failed) {
                    this.currentLocking.destroy();
                    this.currentLocking = null;
                    this.SetStateTo(State.None);
                } else if (lockingState == AnimationState.Success) {
                    let mesh = this.currentLocking.destroy();
                    this.currentLocking = null;
                    this.currentMover = this.CreateMover(mesh);
                }

            } else if (this.state == State.Moving) {
                let moveState = this.currentMover.update();
                if (moveState == AnimationState.Success) {
                    let mesh = this.currentMover.destroy();
                    this.currentMover = null;
                    let idx = this.group.children.indexOf(mesh.mesh);
                    this.group.children.splice(idx, 1);
                    this.SetStateTo(State.None);
                }
            }
        }
    }

    export class All {
        private _clock = new THREE.Clock(false);
        constructor() {

        }

        run(config:UrlParser, game : IRunnable) {
            this._clock.start();
            var container1 = new GraphicalContainer('example');

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


        }
    }

}

document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.All();
    var p = new PandaCardBoard.UrlParser();
    greeter.run(p, p.demo() ? new PandaCardBoard.Demo() : new PandaCardBoard.FourInARow.Game());
});