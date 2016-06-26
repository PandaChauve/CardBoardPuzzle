namespace  PandaCardBoard.Icosphere {

    export class Sphere implements IRunnable{

        private group = new THREE.Group();

        private container1 : GraphicalContainer;
        public init(cont : GraphicalContainer) : void{
            this.container1 = cont;

            var group = this.group;
            function AddCube(x:number, y:number, z:number) {
                var cube = new PandaCardBoard.Cube(x*10, y*10, z*10);
                group.add(cube.mesh);
            }
            this.container1.scene.add(this.group);

            let t = (1.0 + Math.sqrt(5.0)) / 2.0;
            AddCube(-1,  t,  0);
            AddCube( 1,  t,  0);
            AddCube(-1, -t,  0);
            AddCube( 1, -t,  0);

            AddCube( 0, -1,  t);
            AddCube(0,  1,  t);
            AddCube( 0, -1, -t);
            AddCube( 0,  1, -t);

            AddCube( t,  0, -1);
            AddCube( t,  0,  1);
            AddCube(-t,  0, -1);
            AddCube(-t,  0,  1);

        }


        update(delta : number) : void{}
    }
}
