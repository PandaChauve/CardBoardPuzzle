namespace  PandaCardBoard.Icosphere {

    export class Runner implements IRunnable{

        private _group = new THREE.Group();
        private _lock : Locker;

        private _container : GraphicalContainer;
        public init(cont : GraphicalContainer) : void{
            this._container = cont;

            var group = this._group;
            function AddCube(x:number, y:number, z:number) {
                var cube = new PandaCardBoard.Cube(x*10, y*10, z*10);
                group.add(cube.mesh);
            }
            this._container.AddGroup(this._group);

            let t = (1.0 + Math.sqrt(5.0)) / 2.0;

            for(let idx = 0; idx < 4; ++idx){
                let first = (idx %2 == 0  ? -1 : 1);
                let second = (idx < 2  ? t : -t);
                AddCube(first,  second,  0);
                AddCube(0, first,  second);
                AddCube(second, 0, first);
            }
        }

        private GetLock() : Locker{
            var obj = this._container.getFrontObject(this._group.children, -1);
            if(obj != null){
                return new Locker(obj.object.userData, this._container.getRayCaster(), 1500);
            }
            return null;
        }


        update(delta : number) : IRunnable{
            if(!this._lock){
                this._lock = this.GetLock();
            }
            else {
                let state = this._lock.update();
                if(state == AnimationState.Failed){
                    this._lock.destroy();
                    this._lock = null;
                }
                else if(state == AnimationState.Success){
                    this._lock.destroy();
                    this._lock = null;
                    this._container.OffsetCamera();
                    return new FourInARow.Runner();
                }
            }
            return null;
        }

        destroy():void{
            this._container.RemoveGroup(this._group);

        }
    }
}
