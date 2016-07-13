namespace  PandaCardBoard.FourInARow {
    enum State{
        Player,
        Locking,
        IA
    }
    export class Runner implements IRunnable{
        private _grid = new Grid();
        private _ia = new MediumIA(this._grid, Token.Blue);
        private _drawer: Drawer;
        private _state = State.IA;
        private _container : GraphicalContainer;
        private _locker : Locker;
        constructor(){
        }

        init(cont:PandaCardBoard.GraphicalContainer):void{
            this._container = cont;
            this._drawer = new Drawer(cont, this._grid);

        }
        update(delta:number):IRunnable{
            if(this._drawer.update(delta)) // animation in progress
                return;
            if(this._grid.isDraw() || this._grid.isWon())
                return;
            switch(this._state){
                case State.IA:
                    var p = this._ia.play();
                    this._grid.addToColumn(Token.Blue, p);
                    this._state = State.Player;
                    break;
                case State.Player:
                    this._locker = this._drawer.GetLock();
                    if(this._locker != null){
                        this._state = State.Locking;
                    }
                    break;
                case State.Locking:
                    let lockState = this._locker.update();
                    if(lockState == AnimationState.Failed){
                        this._locker.destroy();
                        this._locker = null;
                        this._state = State.Player;
                    }
                    else if(lockState == AnimationState.Success){
                        let locked = this._locker.destroy();
                        this._locker = null;
                        this._grid.addToColumn(Token.Red, (<Button>locked).Id);
                        this._state = State.IA;
                    }
                    break;
            }
            return null;
        }

        destroy():void{

        }
    }
}