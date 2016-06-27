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
                    var cube = new PandaCardBoard.GameToken(20,event.content.x*1.5 - that._grid.getSize()*0.75, event.content.y*1.5-that._grid.getSize()*0.75, event.content.color-1 );
                    that._group.add(cube.mesh);
                }
            }
        }

        private drawGrid() : void{
            this._lockers = new THREE.Group();
            this._lockers.userData = this;
            this._container.AddGroup(this._lockers);
            for(let idx = 0; idx < this._grid.getSize(); ++idx){
                var cube = new PandaCardBoard.Button(20 , idx*1.5 - this._grid.getSize()*0.75, this._grid.getSize()*1.5+2 - this._grid.getSize()*0.75, idx);
                this._lockers.add(cube.mesh);
            }
            this._group.userData = this;
            this._container.AddGroup(this._group);
        }

        public GetLock() : Locker{
            var obj = this._container.getFrontObject(this._lockers.children, -1);
            if(obj != null){
                return new Locker(obj.object.userData, this._container.getRayCaster(), 3500);
            }
            return null;
        }

        public destroy() : void{
            this._container.RemoveGroup(this._group);
            this._container.RemoveGroup(this._lockers);
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