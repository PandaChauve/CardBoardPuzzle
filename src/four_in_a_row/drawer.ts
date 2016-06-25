namespace  PandaCardBoard.FourInARow {
    export class Drawer{
        private _group  = new THREE.Group();
        private _lockers  = new THREE.Group();
        constructor(private _container : GraphicalContainer, private _grid: Grid) {
            this.drawGrid();
            this._grid.subscribe(this.getGridEventHandler());
        }

        private getGridEventHandler() : (event: Utils.IEvent) => void{
            var that = this;
            return function(event : Utils.IEvent):void{
                if(event.name == 'newToken'){
                    var cube = new PandaCardBoard.GameToken(event.content.x*2 - that._grid.getSize(),event.content.y, event.content.x, 0);
                    that._group.add(cube.mesh);
                }
            }
        }

        private drawGrid() : void{
            this._lockers = new THREE.Group();
            this._lockers.userData = this;
            this._container.scene.add(this._lockers);
            for(let idx = 0; idx < this._grid.getSize(); ++idx){
                var cube = new PandaCardBoard.GameToken(idx*2 - this._grid.getSize(),this._grid.getSize()+1, 0, idx);
                this._lockers.add(cube.mesh);
            }
            this._group.userData = this;
            this._container.scene.add(this._group);
        }

        public GetLock() : Locker{
            var obj = this._container.getFrontObject(this._lockers.children, -1);
            if(obj != null){
                return new Locker(obj.object.userData, this._container.getRayCaster(), 3500);
            }
            return null;
        }

        /**
         *
         * @param dt : delta time
         * @returns {boolean is animating}
         */
        public update(dt: number) : boolean{
            //FIXME animate
            return false;
        }
    }
}