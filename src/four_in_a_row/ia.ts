namespace  PandaCardBoard.FourInARow{
    export class BasicIA{
        constructor(private _grid: Grid, private _color: Token){}

        public play() : number{
            let rnd = Math.floor(Math.random()*this._grid.getSize());
            while(!this._grid.canAddToColumn(rnd)){
                rnd++;
                rnd = rnd % this._grid.getSize();
            }
            return rnd;
        }

    }
}