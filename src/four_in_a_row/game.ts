namespace  PandaCardBoard.FourInARow {
    export class Game{
        private _grid = new Grid();
        private _ia = new BasicIA(this._grid, Token.Blue);
        constructor(private _container : GraphicalContainer){
            let token = Token.Blue;
            while(!this._grid.isWon() && ! this._grid.isDraw())
            {
                var column = Token.Blue == token ? this._ia.play() : this.getUserPlay();
                this._grid.addToColumn(token, column);
                token = Token.Blue == token ? Token.Red : Token.Blue;
            }

            this._container;
        }
    }
}