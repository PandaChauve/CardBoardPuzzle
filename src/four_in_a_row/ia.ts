namespace  PandaCardBoard.FourInARow{
    import Token = PandaCardBoard.FourInARow.Token;


    class IaHelper
    {
        public static RevertToken(color: Token) : Token{
            return color == Token.Blue ? Token.Red : Token.Blue;
        }
        private static WinPlay( grid : Grid, color :Token) : number{
            for(let idx = 0; idx < grid.getSize(); ++idx){
                if(grid.canAddToColumn(idx)){
                    grid.addToColumn(color, idx);
                    if(grid.isWon()) {
                        grid.removeFromColumn(idx);
                        return idx;
                    }
                    grid.removeFromColumn(idx);
                }
            }
            return -1;
        }
        public static  OneMove( grid : Grid, color :Token) : number{
            let ret = IaHelper.WinPlay(grid, color); //win in one play ?
            if(ret == -1)
                ret = IaHelper.WinPlay(grid, IaHelper.RevertToken(color)); //stop direct adversary win

            return ret;
        };

        public static RandomPlay( grid : Grid) : number{
            let rnd = Math.floor(Math.random()*grid.getSize());
            while(!grid.canAddToColumn(rnd)){
                rnd++;
                rnd = rnd % grid.getSize();
            }
            return rnd;
        };

        private static IsSafe(grid : Grid, cur : number, color :Token){
            grid.addToColumn(color, cur);
            let om = IaHelper.WinPlay(grid, IaHelper.RevertToken(color));
            grid.removeFromColumn(cur);
            return om == -1;
        }

        public static SafeRandomPlay( grid : Grid, color :Token) : number{
            let size = grid.getSize();
            let rnd = Math.floor(Math.random()*size);
            for(let idx = 0; idx < size; ++idx){
                let cur = (idx + rnd) % size;
                if(grid.canAddToColumn(cur) && IaHelper.IsSafe(grid, cur, color))
                    return cur;
            }
            return IaHelper.RandomPlay(grid);
        };
    }
    //random
    export class DumbIA{
        constructor(private _grid: Grid, private _color: Token){}

        public play() : number{
            return IaHelper.RandomPlay(this._grid);
        }

    }

    //if a win is available it takes it
    //if th adversary is gonna win block it
    export class BasicIA{
        constructor(private _grid: Grid, private _color: Token){}
        public play() : number{
            let tmpGrid = this._grid.clone(); //create a temp to avoid notifs

            let ret = IaHelper.OneMove(tmpGrid, this._color); //win in one play ?
            if(ret != -1) {
                return ret;
            }

            return IaHelper.RandomPlay(this._grid);
        }
    }

    //if a win is available it takes it
    //if th adversary is gonna win block it
    //dont give him a win
    export class MediumIA{
        constructor(private _grid: Grid, private _color: Token){}
        public play() : number{
            let tmpGrid = this._grid.clone(); //create a temp to avoid notifs

            let ret = IaHelper.OneMove(tmpGrid, this._color); //win in one play ?
            if(ret != -1) {
                return ret;
            }

            return IaHelper.SafeRandomPlay(tmpGrid, this._color);
        }
    }
}