
namespace  PandaCardBoard{
    export enum AnimationState{
        Success,
        InProgress,
        Failed
    }


    export abstract class Animator{
        private _duration : number;
        private _startTime = Date.now();
        protected _element : IElement;

        public constructor(elem : IElement, duration: number = 1500){
            this._duration = duration;
            this._element = elem;
        }
        protected getRatio() : number{
            var ratio = (Date.now() - this._startTime) / this._duration;
            if (ratio > 1)
                ratio = 1;
            return ratio;

        }

        protected abstract validator() : boolean;

        protected abstract animate(ratio:number) : void;

        public update(): AnimationState
        {
            if(!this.validator())
                return AnimationState.Failed;

            var ratio = this.getRatio();

            this.animate(ratio);

            return ratio == 1 ? AnimationState.Success : AnimationState.InProgress;
        }

        public destroy() : IElement{
            this._element.reset();
            return this._element;
        }
    }

    export class Locker extends Animator{
        private _raycaster : THREE.Raycaster;
        private _range : number;

        public constructor(elem : IElement, caster : THREE.Raycaster, duration: number = 1500, range : number = -1)
        {
            super(elem, duration);
            this._raycaster = caster;
            this._range = range;
        }

        protected validator():boolean {
            var intersects = this._raycaster.intersectObject(this._element.mesh);
            for (var i = 0; i < intersects.length; i++) {
                if(this._range < 0)
                    this._range = intersects[i].distance;
                if (intersects[i].distance <= this._range) {
                    return true;
                }
            }
            return false;
        }

        protected animate(ratio:number):void {
            this._element.lock(ratio);
        }
    }

    export class Deleter extends Animator{
        private _range : number;

        public constructor(mesh : IElement, duration: number = 1500, range : number = 100000)
        {
            super(mesh, duration);
            this._range = range;
        }

        protected validator():boolean {
            return true;
        }

        protected animate(ratio:number):void {
            this._element.destroy(ratio);
        }
    }

    export class MoveTo extends Animator{
        private _startPos : THREE.Vector3;
        private _moved : THREE.Object3D;

        public constructor(mesh : IElement, moved : THREE.Object3D, duration: number = 1500)
        {
            super(mesh, duration);
            this._startPos = moved.position.clone();
            this._moved = moved;
        }

        protected validator():boolean {
            return true;
        }

        protected animate(ratio:number):void {
            this._element.destroy(Math.min(1, ratio*1.2)); //speed it to make it disappear before hitting
            this._moved.position.copy(this._startPos);
            this._moved.position.multiplyScalar(1 - ratio);
            this._moved.position.addScaledVector(this._element.mesh.position, -ratio);
        }
    }
}
