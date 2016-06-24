var PandaCardBoard;
(function (PandaCardBoard) {
    var GraphicalContainer = (function () {
        function GraphicalContainer(id) {
            this._raycaster = new THREE.Raycaster();
            this._clock = new THREE.Clock();
            this._renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            this._container = document.getElementById(id);
            this._container.appendChild(this._renderer.domElement);
            this.scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera(90, 1, 0.001, 10000);
            this._camera.position.set(0, 10, 0);
            this.scene.add(this._camera);
            this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
            this._controls.rotateUp(Math.PI / 4);
            this._controls.target.set(this._camera.position.x + 0.1, this._camera.position.y, this._camera.position.z);
            this._controls.noZoom = true;
            this._controls.noPan = true;
        }
        GraphicalContainer.prototype.AddStereoEffect = function () {
            this._effect = new THREE.StereoEffect(this._renderer);
        };
        GraphicalContainer.prototype.AddDeviceOrientation = function () {
            function fullscreen() {
                if (this._container.requestFullscreen) {
                    this._container.requestFullscreen();
                }
                else if (this._container.msRequestFullscreen) {
                    this._container.msRequestFullscreen();
                }
                else if (this._container.mozRequestFullScreen) {
                    this._container.mozRequestFullScreen();
                }
                else if (this._container.webkitRequestFullscreen) {
                    this._container.webkitRequestFullscreen();
                }
            }
            function setOrientationControls(e) {
                if (!e.alpha) {
                    return;
                }
                this._controls = new THREE.DeviceOrientationControls(this._camera);
                this._controls.connect();
                this._controls.update();
                this._renderer.domElement.addEventListener('click', fullscreen, false);
                window.removeEventListener('deviceorientation', setOrientationControls, true);
            }
            window.addEventListener('deviceorientation', setOrientationControls, true);
        };
        GraphicalContainer.prototype.resize = function () {
            var width = this._container.offsetWidth;
            var height = this._container.offsetHeight;
            this._camera.aspect = width / height;
            if (this._effect)
                this._effect.setSize(width, height);
            else
                this._renderer.setSize(width, height);
        };
        GraphicalContainer.prototype.update = function () {
            this.resize();
            this._camera.updateProjectionMatrix();
            this._controls.update(this._clock.getDelta());
            var mouse = new THREE.Vector2();
            mouse.x = 0;
            mouse.y = 0;
            this._raycaster.setFromCamera(mouse, this._camera);
        };
        GraphicalContainer.prototype.render = function () {
            if (this._effect)
                this._effect.render(this.scene, this._camera);
            else
                this._renderer.render(this.scene, this._camera);
        };
        GraphicalContainer.prototype.getRayCaster = function () {
            return this._raycaster;
        };
        return GraphicalContainer;
    }());
    PandaCardBoard.GraphicalContainer = GraphicalContainer;
})(PandaCardBoard || (PandaCardBoard = {}));
