/**
 * Created by Panda_2 on 13-07-16.
 */
namespace  PandaCardBoard.FourInARow {
    enum State{
        Player,
        Locking,
        IA
    }
    export class IaDebug{
        private _grid = new Grid();
        private _ia = new MediumIA(this._grid, Token.Blue);
        private _ia2 = new MediumIA(this._grid, Token.Red);
        private _state = State.IA;
        constructor(){
            this._grid.subscribe(this.getGridEventHandler());
        }
        private getGridEventHandler() : (event: Utils.IEvent) => void{
            return function(event : Utils.IEvent):void{
                if(event.name == 'newToken'){
                    console.log((event.content.color == Token.Red ?'O' : 'X') + '->'+event.content.x+' '+event.content.y);
                    let n = document.createElement("td");
                    n.innerText = event.content.color == Token.Red ?'O' : 'X';
                    document.getElementById("col"+event.content.x).appendChild(n);
                }
            }
        }

        update(){
            if(this._grid.isDraw() || this._grid.isWon())
               return;

            switch(this._state){
                case State.IA:
                    var p = this._ia.play();
                    this._grid.addToColumn(Token.Blue, p);
                    this._state = State.Player;
                    break;
                case State.Player:
                    var p = this._ia2.play();
                    this._grid.addToColumn(Token.Red, p);
                    this._state = State.IA;
                    break;
            }
        }

    }
}


document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.FourInARow.IaDebug();
    setInterval(function () {
        greeter.update();
    }, 300);
});