// Module
module PandaCardBoard.Utils {

    class Subscription {
        constructor (            
            public id: number, 
            public callback: (payload?: any) => void) {
        }        
    }

    export interface IEvent{
        name?: string,
        content? : any,
        sender? : any
    }
    export interface IEventEmitter {
        subscribe(callback: (event: IEvent) => void): number;
        unSubscribe(id: number): void;
    }

    export class EventEmitter implements IEventEmitter {

        private _subscriptions: Subscription[];
        private _nextId: number;

        constructor () {
            this._subscriptions = [];
            this._nextId = 0;
        }

        public subscribe(callback: (event: IEvent) => void) : number{
            var subscription = new Subscription(this._nextId++, callback);
            this._subscriptions[subscription.id] = subscription;
            return subscription.id;
        }

        public unSubscribe(id: number) : void{
            this._subscriptions[id] = undefined; //FIXME splice
        }

        public notify(event: IEvent) :void {
            for (let index = 0; index < this._subscriptions.length; index++) {
                if (this._subscriptions[index]) {
                    this._subscriptions[index].callback(event);
                }
            }
        }
    }

    // Class
    export class TypedEventEmitter {

        private _eventList: EventEmitter[];

        constructor () {
            this._eventList = [];
        }

        subscribe(eventType: string, callback: (event: IEvent) => void ) : number {
            let  msg = this._eventList[eventType] ||
                (this._eventList[eventType] = new EventEmitter());
                       
            return msg.subscribe(callback);                        
        }
        
        unSubscribe(eventType: string, token: number) : void {
            if (this._eventList[eventType]) {
                this._eventList[eventType].unSubscribe(token);
            }
        }

        publish(eventType: string, event: IEvent) : void {
            if (this._eventList[eventType]) {
                this._eventList[eventType].notify(event);
            }
        }
    }
}
