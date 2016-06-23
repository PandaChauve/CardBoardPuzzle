/**
 * Created by Panda_2 on 23-06-16.
 */
namespace  PandaCardBoard{
    export enum LockerState{
        Success,
        InProgress,
        Failed
    }
    export class Locker{
        private _raycaster : THREE.Raycaster;
        private _duration : number;
        private _startTime = Date.now();
        private _mesh : THREE.Mesh;
        private _range : number;

        //FIXME introduce an effect notion
        public constructor(mesh : THREE.Mesh, caster : THREE.Raycaster, duration: number = 1500, range : number = 100000){
            this._duration = duration;
            this._mesh = mesh;
            this._raycaster = caster;
            this._range = range;
            //FIXME obj.material = materials.target;
        }
        private isLocking() :boolean{
            var intersects = this._raycaster.intersectObject(this._mesh);
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].distance < this._range) {
                    return true;
                }
            }
            return false;
        }

        public updateState(): LockerState
        {
            if(!this.isLocking())
                return LockerState.Failed;

            var ratio = (Date.now() - this._startTime) / this._duration;
            if (ratio > 1)
                ratio = 1;
            (<THREE.MeshBasicMaterial>this._mesh.material).color.b = 1 - ratio;

            return ratio == 1 ? LockerState.Success : LockerState.InProgress;
        }

        public destroy() : THREE.Mesh{
            (<THREE.MeshBasicMaterial>this._mesh.material).color.b = 1; //reset the material in case we reuse it
            return this._mesh;
            //FIXME this.object.material = materials.block;
        }

    }
}
