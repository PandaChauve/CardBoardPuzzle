namespace  PandaCardBoard.FourInARow{
    export enum Token{
        None = 0,
        Red = 1,
        Blue = 2
    }
    export class Grid implements Utils.IEventEmitter{
        private _data : Token[][];
        private _size = 8;
        private _eventhandler = new Utils.EventEmitter();
        constructor(){
            this._data = [];
            for(let idx = 0; idx < this._size; idx++ ){
                this._data.push(new Array(this._size));
                for(let idx2 = 0; idx2 < this._size; idx2++){
                    this._data[idx][idx2] = Token.None;
                }
            }
        }
        public clone(): Grid
        {
            let ret = new Grid();
            for(let idx = 0; idx < this._size; idx++ ){
                for(let idx2 = 0; idx2 < this._size; idx2++){
                    ret._data[idx][idx2] = this._data[idx][idx2];
                }
            }
            return ret;
        }

        public subscribe(callback: (event: Utils.IEvent) => void) : number{
            return this._eventhandler.subscribe(callback);
        }

        public unSubscribe(id: number) : void{
            this._eventhandler.unSubscribe(id);
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
            let idx = 0;
            while(this._data[position][idx] != Token.None)
                idx++;

            this._data[position][idx] = token;


            this._eventhandler.notify({
                name: 'newToken',
                sender : this,
                content : {
                    x : position,
                    y : idx,
                    color : token
                }
            });
        }
        public removeFromColumn(position : number) : void{
            let idx = this._data[position].length -1;
            while(idx >= 0 && this._data[position][idx] == Token.None)
                idx--;
            if(idx < 0)
                return;

            this._eventhandler.notify({
                name: 'deleteToken',
                sender : this,
                content : {
                    x : position,
                    y : idx,
                    color : this._data[position][idx]
                }
            });
            this._data[position][idx] = Token.None;

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