namespace  PandaCardBoard{

enum State{
    Start,
    None,
    Moving,
    Locking
}

export class UrlParser{
    private _search;
    // see http://medialize.github.io/URI.js/ for more complex url
    constructor(){
        var data = document.createElement('a');
        data.href = window.location.href;
        this._search = data.search;
    }

    debug() : boolean{
        return this._search.lastIndexOf("debug") != -1;
    }
}

    export class All {
    constructor() {}
    run(config : UrlParser){
        var container1 = new GraphicalContainer('example');

        if(!config.debug())
            container1.AddStereoEffect();
        container1.AddDeviceOrientation();
        var group = new THREE.Group();

        var CUBE_SIZE = 100;
        var GRAB_FACTOR = 5;
        init();
        group.position.x = 600;
        group.rotation.z = Math.PI / 2;
        let state  = State.Start;
        animate();

        function init() {
            var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.60);
            container1.scene.add(light);

            function AddCube(x : number, y : number, z : number) {
                var cube = new PandaCardBoard.Cube(x,y,z);
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

        var currentLocking = <Locker>null;
        var currentMover = <MoveTo>null;

        function SetStateTo(newState : State) {
            console.log("new state " + newState);
            state = newState;
        }

        function getFrontObject() : THREE.Intersection {
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

        function CreateMover(dest : Element) {
            SetStateTo(State.Moving);
            return new MoveTo(dest, group);
        }

        var currentHover = null;

        function render() {
            if (state == State.Start) {
                if(!currentLocking) {
                    let sect = getFrontObject();
                    if (sect)
                    {
                        currentLocking = new Locker(sect.object.userData, container1.getRayCaster(), 3000);
                        currentHover = sect.object;
                    }
                }
                else{
                    let ret = currentLocking.update();
                    if(ret != AnimationState.InProgress){
                        let mesh = currentLocking.destroy();
                        currentLocking = null;
                        if(ret == AnimationState.Success){
                            group.position.x = 0;
                            group.rotation.z = 0;
                            currentHover = null;
                            currentMover = CreateMover(mesh);
                        }
                    }
                }
            } else if (state == State.None) {
                let sect = getFrontObject();
                if (sect != null && sect.distance < GRAB_FACTOR * CUBE_SIZE) {
                    SetStateTo(State.Locking);
                    currentLocking = new Locker(sect.object.userData, container1.getRayCaster(), 1500, GRAB_FACTOR * CUBE_SIZE);
                }
            } else if (state == State.Locking) {
                let lockingState = currentLocking.update();
                if (lockingState == AnimationState.Failed) {
                    currentLocking.destroy();
                    currentLocking = null;
                    SetStateTo(State.None);
                } else if (lockingState == AnimationState.Success) {
                    let mesh = currentLocking.destroy();
                    currentLocking = null;
                    currentMover = CreateMover(mesh);
                }

            } else if (state == State.Moving) {
                let moveState = currentMover.update();
                if(moveState == AnimationState.Success){
                    let mesh = currentMover.destroy();
                    currentMover = null;
                    let idx = group.children.indexOf(mesh.mesh);
                    group.children.splice(idx, 1);
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


    }
}

}

document.addEventListener("DOMContentLoaded", function(){
    var greeter = new PandaCardBoard.All();
    greeter.run( new PandaCardBoard.UrlParser())
});