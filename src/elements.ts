namespace  PandaCardBoard{

    export interface AnimationFunc {
        (ratio : number) : void;
    }
    export  interface VoidFunc {
        () : void;
    }
    export interface Element{
        destroy : AnimationFunc;
        lock : AnimationFunc;
        reset : VoidFunc;
        mesh : THREE.Mesh;
    }
    export enum CubeState{
        Normal,
        Lock,
        Destroy
    }

    export class Cube implements Element{
        private static _size = 100;
        private static _geometry : THREE.BoxGeometry;
        private static _baseMaterial:THREE.MeshBasicMaterial;
        private static _destroyMaterial:THREE.MeshBasicMaterial;
        private static _lockMaterial:THREE.MeshBasicMaterial;

        private _state = CubeState.Normal;

        public mesh : THREE.Mesh;

        public constructor(x:number,y:number,z:number){
            if(Cube._geometry == null){

                Cube._geometry = new THREE.BoxGeometry(Cube._size, Cube._size, Cube._size, 10, 10, 10);
                Cube._baseMaterial = new THREE.MeshBasicMaterial({color: 0x0fffff, wireframe: true});
                Cube._destroyMaterial = new THREE.MeshBasicMaterial({
                    color: 0x0fff00,
                    wireframe: true,
                    transparent: true
                });
                Cube._lockMaterial = new THREE.MeshBasicMaterial({
                    color: 0x0fffff,
                    wireframe: true
                });

            }
            this.mesh = new THREE.Mesh(Cube._geometry, Cube._baseMaterial);
            this.mesh.position.x = x * Cube._size;
            this.mesh.position.y = z * Cube._size;
            this.mesh.position.z = y * Cube._size;
            this.mesh.matrixAutoUpdate = false;
            this.mesh.updateMatrix();
            this.mesh.name = 'cube ' + x + " " + y + " " + z;
            this.mesh.userData = this;
        }

        public lock(ratio : number):void{
            console.assert(this._state == CubeState.Normal || this._state == CubeState.Lock);
            this._state = CubeState.Lock;
            this.mesh.material = Cube._lockMaterial;
            Cube._lockMaterial.color.b = 1 - ratio;
        }

        public destroy(ratio : number):void{
            console.assert(this._state == CubeState.Normal || this._state == CubeState.Destroy);
            this._state = CubeState.Destroy;
            this.mesh.material = Cube._destroyMaterial;
            if(ratio > 0.8)
                ratio = 0.8;
            Cube._destroyMaterial.opacity = 1 - ratio/0.8;
        }

        public reset():void{
            Cube._lockMaterial.color.b = 1;
            Cube._destroyMaterial.opacity = 1;
            this.mesh.material = Cube._baseMaterial;
            this._state = CubeState.Normal;
        }
    }

}