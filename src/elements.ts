namespace  PandaCardBoard{

    export interface AnimationFunc {
        (ratio : number) : void;
    }
    export  interface VoidFunc {
        () : void;
    }
    export interface IElement{
        destroy : AnimationFunc;
        lock : AnimationFunc;
        reset : VoidFunc;
        update : VoidFunc;
        mesh : THREE.Mesh | THREE.Points;
    }
    export enum CubeState{
        Normal,
        Lock,
        Destroy
    }

    export abstract class Element{
        protected static _size = 1;
        public mesh :  THREE.Mesh | THREE.Points;
        protected setPosition(x:number,y:number,z:number) : void
        {
            this.mesh.position.x = x ;
            this.mesh.position.y = z ;
            this.mesh.position.z = y ;
        }

        public lock(ratio : number):void{}
        public destroy(ratio : number):void{}
        public reset():void{ }
        public update():void{ }
    }

    export class Cube extends Element implements IElement{
        private static _geometry : THREE.BoxGeometry;
        private static _baseMaterial:THREE.MeshBasicMaterial;
        private static _destroyMaterial:THREE.MeshBasicMaterial;
        private static _lockMaterial:THREE.MeshBasicMaterial;

        private _state = CubeState.Normal;


        public constructor(x:number,y:number,z:number){
            super();
            if(Cube._geometry == null){

                Cube._geometry = new THREE.BoxGeometry(Element._size, Element._size, Element._size, 10, 10, 10);
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
            this.setPosition(x,y,z);
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

    export class GameToken extends Element implements IElement{
        private static _geometry : THREE.BoxGeometry;
        private static _baseMaterial:THREE.MeshBasicMaterial[];
        private static _lockMaterial:THREE.MeshBasicMaterial[];

        private _state = CubeState.Normal;


        public constructor(x:number,y:number,z:number, private _tokenColor : number){
            super();
            if(GameToken._geometry == null){

                GameToken._geometry = new THREE.BoxGeometry(GameToken._size, GameToken._size, GameToken._size, 10, 10, 10);
                GameToken._baseMaterial = [new THREE.MeshBasicMaterial({color: 0x0fffff}), new THREE.MeshBasicMaterial({color: 0x0f0fff})];
                GameToken._lockMaterial = [new THREE.MeshBasicMaterial({
                    color: 0x0fffff,
                    wireframe: true
                }),new THREE.MeshBasicMaterial({
                    color: 0x0f0fff,
                    wireframe: true
                })];

            }
            this.mesh = new THREE.Mesh(GameToken._geometry, GameToken._baseMaterial[this._tokenColor]);
            this.setPosition(x,y,z);
            this.mesh.matrixAutoUpdate = false;
            this.mesh.updateMatrix();
            this.mesh.name = 'cube ' + x + " " + y + " " + z;
            this.mesh.userData = this;
        }

        public lock(ratio : number):void{
            console.assert(this._state == CubeState.Normal || this._state == CubeState.Lock);
            this._state = CubeState.Lock;
            this.mesh.material = GameToken._lockMaterial[this._tokenColor];
            GameToken._lockMaterial[this._tokenColor].color.b = 1 - ratio;
        }

        public destroy(ratio : number):void{
        }

        public reset():void{
            GameToken._lockMaterial[this._tokenColor].color.b = 1;
            this.mesh.material = GameToken._baseMaterial[this._tokenColor];
            this._state = CubeState.Normal;
        }
    }

    export class Button extends GameToken{

        public constructor(x:number,y:number,z:number, public Id:number){
            super(x,y,z,0);
        }
    }

    export class ShateredGlaceCube extends Element implements IElement {
        private _clock = new THREE.Clock(true);
        constructor(x:number,y:number,z:number) {
            super();
            console.log("new cube");

            var material = new THREE.RawShaderMaterial({
                uniforms: {
                    time: { value: 1.0 }
                },
                vertexShader:`
			precision mediump float;
			precision mediump int;
			uniform mat4 modelViewMatrix; // optional
			uniform mat4 projectionMatrix; // optional
			attribute vec3 position;
			attribute vec4 color;
			varying vec3 vPosition;
			varying vec4 vColor;
			void main()	{
				vPosition = position;
				vColor = color;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position*1., 1.0 );
			}
            `,
                fragmentShader: `
			precision mediump float;
			precision mediump int;
			uniform float time;
			varying vec3 vPosition;
			varying vec4 vColor;
			void main()	{
				vec4 color = vec4( vColor );
				color.r += sin( vPosition.x * time ) * 0.5;
				gl_FragColor = color;
			}`,
                transparent: true,
                side: THREE.DoubleSide,
            });
            var triangles = 500;

            var geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array( triangles * 3 * 3 );
            for ( var i = 0, l = triangles * 3 * 3; i < l; i += 3 ) {
                vertices[ i     ] = (Math.random() - 0.5)*3;
                vertices[ i + 1 ] = (Math.random() - 0.5)*3;
                vertices[ i + 2 ] = (Math.random() - 0.5)*3;
            }
            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            var colors = new Uint8Array( triangles * 3 * 4 );
            for ( var i = 0, l = triangles * 3 * 4; i < l; i += 4 ) {
                colors[ i     ] = Math.random() * 255;
                colors[ i + 1 ] = Math.random() * 255;
                colors[ i + 2 ] = Math.random() * 255;
                colors[ i + 3 ] = Math.random() * 255;
            }
            geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 4, true) );

            this.mesh = new THREE.Mesh( geometry, material );
            this.mesh.scale.set(1,1,1);
            //this.mesh.matrixAutoUpdate = false;
            this.setPosition(x,y,z);
            this.mesh.userData = this;
        };

        update () {
            let t = this._clock.getElapsedTime();
            (<THREE.RawShaderMaterial>this.mesh.material).uniforms.time.value = t*0.005;

            this.mesh.rotation.y = t * 0.05;
            //this.mesh.updateMatrix();
        }

    }


    export class LightCube extends Element implements IElement {
        private _clock = new THREE.Clock(true);
        private _colorsCopy : Uint8Array;
        private static  _txt = THREE.ImageUtils.loadTexture("../resources/spark.png");
        constructor(x:number,y:number,z:number) {
            super();
            console.log("new cube");

            var material = new THREE.RawShaderMaterial({

                uniforms: {
                    amplitude: {type: "f", value: 1.0},
                    texture: {type: "t", value: LightCube._txt}
                },
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                vertexShader:`
			precision mediump float;
			precision mediump int;
			uniform float amplitude;
			uniform mat4 modelViewMatrix; // optional
			uniform mat4 projectionMatrix; // optional
			attribute float size;
			attribute vec3 customColor;
			varying vec3 vColor;
			attribute vec3 position;
			void main() {
				vColor = customColor;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_PointSize = size * ( 10.0 / length( mvPosition.xyz ) );
				gl_Position = projectionMatrix * mvPosition;
			}
            `,
                fragmentShader: `
			precision mediump float;
			precision mediump int;
			uniform sampler2D texture;
			varying vec3 vColor;
			void main() {
				gl_FragColor = vec4( vColor, 1.0 );
				gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
			}`
            });

            var points = 50;


            var geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array( points*3 );
            function setVertice(x,y,z, num): boolean{
                let i= num*3;
                if(x*x+y*y+z*z > 1)
                    return false;
                vertices[ i     ] = x;
                vertices[ i + 1 ] = y;
                vertices[ i + 2 ] = z;
                return true;
            }
            for(let idx  = 0; idx < points; idx++){
                while(!setVertice(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1,idx));

            }

            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            var colors = new Uint8Array( points * 3);
            for ( var i = 0, l = points * 3; i < l; i += 3 ) {
                colors[ i     ] = 255;//Math.random() * 255;
                colors[ i + 1 ] = 255;//Math.random() * 255;
                colors[ i + 2 ] = 255;//Math.random() * 255;
            }
            this._colorsCopy = colors.slice(0);
            geometry.addAttribute( 'customColor', new THREE.BufferAttribute( this._colorsCopy, 3, true));
            var size = new Uint8Array( points);
            for ( var i = 0, l = points ; i < l; i += 1 ) {
                size[ i     ] = 55;
            }
            geometry.addAttribute( 'size', new THREE.BufferAttribute( size, 1, false) );

            this.mesh = new THREE.Points( geometry, material );
            this.mesh.scale.set(1,1,1);
            this.setPosition(x,y,z);
            this.mesh.userData = this;
        };

        public lock(ratio : number):void{
            var att = <THREE.BufferAttribute>(<THREE.BufferGeometry>this.mesh.geometry).getAttribute('customColor');
            for ( var i = 0; i < att.array.length; i += 1 ) {
                let current = this._colorsCopy[i*3];
                att.setX(i, current + (255 - current)*ratio);
                current = this._colorsCopy[i*3+1];
                att.setY(i, current - ( current)*ratio);
                current = this._colorsCopy[i*3+2];
                att.setZ(i, current - ( current)*ratio);
            }
            att.version++;
        };

        public reset():void{
            (<THREE.BufferGeometry>this.mesh.geometry).addAttribute( 'customColor', new THREE.BufferAttribute( this._colorsCopy.slice(0), 3, true));
        };

        private _updateCounter = 0;
        public update () {
            this._updateCounter++;
            var att = <THREE.BufferAttribute>(<THREE.BufferGeometry>this.mesh.geometry).getAttribute('size');
            for ( var i = 0; i < att.array.length; i += 1 ) {
                if((this._updateCounter + i )% 20 == 0)
                    att.setX(i,  100 * Math.random());
            }
            att.version++;
        };

    }

}
