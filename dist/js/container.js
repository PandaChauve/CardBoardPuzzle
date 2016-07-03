var PandaCardBoard;
(function (PandaCardBoard) {
    var GraphicalContainer = (function () {
        function GraphicalContainer(id) {
            this._raycaster = new THREE.Raycaster();
            this._renderer = new THREE.WebGLRenderer({
                antialias: true,
                clearColor: 0x000000
            });
            this._container = document.getElementById(id);
            this._container.appendChild(this._renderer.domElement);
            this._scene = new THREE.Scene();
            this._mainGroup = new THREE.Group();
            this._scene.add(this._mainGroup);
            this._camera = new THREE.PerspectiveCamera(90, 1, 0.001, 10000);
            this._camera.position.set(0, 0, 0);
            this._scene.add(this._camera);
            this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
            this._controls.target.set(this._camera.position.x + 0.1, this._camera.position.y, this._camera.position.z);
        }
        GraphicalContainer.prototype.getFrontObject = function (targets, distance) {
            var intersects = this.getRayCaster().intersectObjects(targets);
            var sect = null;
            var dist = distance;
            for (var i = 0; i < intersects.length; i++) {
                if (dist < 0)
                    dist = intersects[i].distance;
                if (intersects[i].distance <= dist) {
                    dist = intersects[i].distance;
                    sect = intersects[i];
                }
            }
            return sect;
        };
        GraphicalContainer.prototype.OffsetCamera = function () {
            var vec = new THREE.Vector3(0, 0, -20);
            vec.applyQuaternion(this._camera.quaternion);
            this._mainGroup.position.copy(vec);
            this._mainGroup.lookAt(this._camera.position);
        };
        GraphicalContainer.prototype.AddStereoEffect = function () {
            this._effect = new THREE.StereoEffect(this._renderer);
        };
        GraphicalContainer.prototype.AddDeviceOrientation = function () {
            var that = this;
            function fullscreen() {
                if (that._container.requestFullscreen) {
                    that._container.requestFullscreen();
                }
                else if (that._container.msRequestFullscreen) {
                    that._container.msRequestFullscreen();
                }
                else if (that._container.mozRequestFullScreen) {
                    that._container.mozRequestFullScreen();
                }
                else if (that._container.webkitRequestFullscreen) {
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
        GraphicalContainer.prototype.update = function (delta) {
            this.resize();
            this.updateGroup(this._mainGroup.children);
            this._camera.updateProjectionMatrix();
            this._controls.update(delta);
            this._raycaster.setFromCamera(new THREE.Vector2(0, 0), this._camera);
        };
        GraphicalContainer.prototype.render = function () {
            if (this._effect)
                this._effect.render(this._scene, this._camera);
            else
                this._renderer.render(this._scene, this._camera);
        };
        GraphicalContainer.prototype.updateGroup = function (group) {
            for (var i = 0; i < group.length; ++i) {
                if (group[i].children.length > 0)
                    this.updateGroup(group[i].children);
                if (group[i].userData && group[i].userData.update)
                    group[i].userData.update();
            }
        };
        GraphicalContainer.prototype.AddGroup = function (group) {
            this._mainGroup.add(group);
        };
        GraphicalContainer.prototype.RemoveGroup = function (group) {
            this._mainGroup.remove(group);
        };
        GraphicalContainer.prototype.getRayCaster = function () {
            return this._raycaster;
        };
        return GraphicalContainer;
    }());
    PandaCardBoard.GraphicalContainer = GraphicalContainer;
})(PandaCardBoard || (PandaCardBoard = {}));
