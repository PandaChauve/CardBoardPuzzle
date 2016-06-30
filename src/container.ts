namespace  PandaCardBoard {

    export class GraphicalContainer {
        private _camera : THREE.PerspectiveCamera;
        private _renderer : THREE.Renderer;
        private _effect : THREE.StereoEffect;
        private _controls : any;
        private _container : HTMLElement ;
        private _raycaster: THREE.Raycaster;
        private _scene : THREE.Scene;
        public _mainGroup : THREE.Group;


        constructor(id : string){
            this._raycaster = new THREE.Raycaster();
            this._renderer = new THREE.WebGLRenderer({
                antialias : true
            });

            this._container = document.getElementById(id);
            this._container.appendChild(this._renderer.domElement);

            this._scene = new THREE.Scene();
            this._mainGroup = new THREE.Group();
            this._scene.add(this._mainGroup);
            this._camera = new THREE.PerspectiveCamera(90, 1, 0.001, 10000);

            this._camera.position.set(0, 0, 0);
            this._scene.add(this._camera);
            this._controls = new THREE.MouseControls(this._camera/*, this._renderer.domElement*/);
            /*
            this._controls.target.set(
                this._camera.position.x + 0.1,
                this._camera.position.y,
                this._camera.position.z
            );
            this._controls.noZoom = true;
            this._controls.noPan = true;*/
        }

        public getFrontObject(targets: THREE.Object3D[], distance : number):THREE.Intersection {
            var intersects = this.getRayCaster().intersectObjects(targets);
            var sect = null;
            var dist = distance;
            for (var i = 0; i < intersects.length; i++) {
                if(dist < 0)
                    dist = intersects[i].distance;
                if (intersects[i].distance <= dist) {
                    dist = intersects[i].distance;
                    sect = intersects[i];
                }
            }
            return sect;
        }

        public OffsetCamera(){
            var vec = new THREE.Vector3( 0, 0, -20*100 );
            vec.applyQuaternion( this._camera.quaternion );
            this._mainGroup.position.copy( vec );
            this._mainGroup.lookAt(this._camera.position);
        }

        public AddStereoEffect() : void {
            this._effect = new THREE.StereoEffect(this._renderer);
        }

        public AddDeviceOrientation(): void{
            var that = <any>this;
            function fullscreen() {
                if (that._container.requestFullscreen) {
                    that._container.requestFullscreen();
                } else if (that._container.msRequestFullscreen) {
                    that._container.msRequestFullscreen();
                } else if (that._container.mozRequestFullScreen) {
                    that._container.mozRequestFullScreen();
                } else if (that._container.webkitRequestFullscreen) {
                    that._container.webkitRequestFullscreen();
                }
            }
            function setOrientationControls(e) {
                if (!e.alpha) {
                    return;
                }
                that._controls = new THREE.DeviceOrientationControls(that._camera);
                that._controls.connect();
                that._controls.update();
                that._renderer.domElement.addEventListener('click', fullscreen, false);
                window.removeEventListener('deviceorientation', setOrientationControls, true);
            }
            window.addEventListener('deviceorientation', setOrientationControls, true);
        }

        private resize() : void{
            var width = this._container.offsetWidth;
            var height = this._container.offsetHeight;
            this._camera.aspect = width / height;
            if(this._effect)
                this._effect.setSize(width, height);
            else
                this._renderer.setSize(width, height );
        }

        public update(delta: number){
            this.resize();
            this._camera.updateProjectionMatrix();
            this._controls.update(delta);
            var mouse = new THREE.Vector2();
            mouse.x = 0;
            mouse.y = 0; 
            this._raycaster.setFromCamera(mouse, this._camera);
        }

        public render(){
            if(this._effect)
                this._effect.render(this._scene, this._camera);
            else
                this._renderer.render(this._scene, this._camera);
        }

        public AddGroup(group : THREE.Group):void{
            this._mainGroup.add(group);
        }

        public RemoveGroup(group : THREE.Group){
            this._mainGroup.remove(group);
        }

        public getRayCaster() : THREE.Raycaster
        {
            return this._raycaster;
        }
    }
}