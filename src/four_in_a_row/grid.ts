namespace  PandaCardBoard.FourInARow{
    export enum Token{
        None = 0,
        Red = 1,
        Blue = 2
    }
    export class Grid{
        private _data : Token[][];
        private _size = 8;
        constructor(){
            this._data = [];
            for(let idx = 0; idx < this._size; idx++ ){
                this._data.push(new Array(this._size));
                for(let idx2 = 0; idx2 < this._size; idx2++){
                    this._data[idx][idx2] = Token.None;
                }
            }
        }

        public isDraw(){
            for(let idx = 0 ; idx < this._size; ++idx){
                if(this.canAddToColumn(idx))
                    return false;
            }

            return true;
        }

        public getSize(){
            return this._size;
        }

        public canAddToColumn(position : number) : boolean{
            return (this._data[position][this._size -1] == Token.None);
        }

        public addToColumn(token : Token, position : number) : void{
            if(!this.canAddToColumn(position))
                throw "Invalid column";

            for(let idx = 0; idx < this._size; ++idx)
                if(this._data[position][idx] == Token.None )
                    this._data[position][idx] = token;

        }

        public isWon() : boolean{
            return this.hasCompleteColumn() || this.hasCompleteRow() || this.hasCompleteDiagonal();
        }

        private hasCompleteRow() : boolean{
            //can be optimized
            for(let x = 0; x + 3< this._size; x++ ) {
                for (let y = 0; y < this._size; y++) {
                    var z = this._data[x][y];
                    if(z == this._data[x+1][y]&& z  == this._data[x+2][y]&& z  == this._data[x+3][y] && z != Token.None)
                        return true;
                }
            }
            return false;
        }

        private hasCompleteColumn() : boolean{
            //can be optimized
            for(let x = 0; x< this._size; x++ ) {
                for (let y = 0; y+3< this._size; y++) {
                    var z = this._data[x][y];
                    if(z == this._data[x][y+1] && z == this._data[x][y+2] && z == this._data[x][y+3] && z != Token.None)
                        return true;
                }
            }
            return false;
        }

        private hasCompleteDiagonal(): boolean{
            for(let x = 0; x + 3< this._size; x++ ) {
                for (let y = 0; y+3< this._size; y++) {
                    var z = this._data[x][y];
                    if(z == this._data[x+1][y+1] && z == this._data[x+2][y+2] && z == this._data[x+3][y+3] && z != Token.None)
                        return true;
                }
            }
            for(let x = 0; x +3 < this._size; x++ ) {
                for (let y = 3; y < this._size; y++) {
                    var z = this._data[x][y];
                    if(z == this._data[x+1][y-1] && z == this._data[x+2][y-2] && z == this._data[x+3][y-3] && z != 0)
                        return true;
                }
            }
            return false;
        }


    }
}