var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PandaCardBoard;
(function (PandaCardBoard) {
    (function (CubeState) {
        CubeState[CubeState["Normal"] = 0] = "Normal";
        CubeState[CubeState["Lock"] = 1] = "Lock";
        CubeState[CubeState["Destroy"] = 2] = "Destroy";
    })(PandaCardBoard.CubeState || (PandaCardBoard.CubeState = {}));
    var CubeState = PandaCardBoard.CubeState;
    var Cube = (function () {
        function Cube(x, y, z) {
            this._state = CubeState.Normal;
            if (Cube._geometry == null) {
                Cube._geometry = new THREE.BoxGeometry(Cube._size, Cube._size, Cube._size, 10, 10, 10);
                Cube._baseMaterial = new THREE.MeshBasicMaterial({ color: 0x0fffff, wireframe: true });
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
        Cube.prototype.lock = function (ratio) {
            console.assert(this._state == CubeState.Normal || this._state == CubeState.Lock);
            this._state = CubeState.Lock;
            this.mesh.material = Cube._lockMaterial;
            Cube._lockMaterial.color.b = 1 - ratio;
        };
        Cube.prototype.destroy = function (ratio) {
            console.assert(this._state == CubeState.Normal || this._state == CubeState.Destroy);
            this._state = CubeState.Destroy;
            this.mesh.material = Cube._destroyMaterial;
            if (ratio > 0.8)
                ratio = 0.8;
            Cube._destroyMaterial.opacity = 1 - ratio / 0.8;
        };
        Cube.prototype.reset = function () {
            Cube._lockMaterial.color.b = 1;
            Cube._destroyMaterial.opacity = 1;
            this.mesh.material = Cube._baseMaterial;
            this._state = CubeState.Normal;
        };
        Cube._size = 100;
        return Cube;
    }());
    PandaCardBoard.Cube = Cube;
    var GameToken = (function () {
        function GameToken(x, y, z, _tokenColor) {
            this._tokenColor = _tokenColor;
            this._state = CubeState.Normal;
            if (GameToken._geometry == null) {
                GameToken._geometry = new THREE.BoxGeometry(GameToken._size, GameToken._size, GameToken._size, 10, 10, 10);
                GameToken._baseMaterial = [new THREE.MeshBasicMaterial({ color: 0x0fffff }), new THREE.MeshBasicMaterial({ color: 0x0f0fff })];
                GameToken._lockMaterial = [new THREE.MeshBasicMaterial({
                        color: 0x0fffff,
                        wireframe: true
                    }), new THREE.MeshBasicMaterial({
                        color: 0x0f0fff,
                        wireframe: true
                    })];
            }
            this.mesh = new THREE.Mesh(GameToken._geometry, GameToken._baseMaterial[this._tokenColor]);
            this.mesh.position.x = x * GameToken._size;
            this.mesh.position.y = z * GameToken._size;
            this.mesh.position.z = y * GameToken._size;
            this.mesh.matrixAutoUpdate = false;
            this.mesh.updateMatrix();
            this.mesh.name = 'cube ' + x + " " + y + " " + z;
            this.mesh.userData = this;
        }
        GameToken.prototype.lock = function (ratio) {
            console.assert(this._state == CubeState.Normal || this._state == CubeState.Lock);
            this._state = CubeState.Lock;
            this.mesh.material = GameToken._lockMaterial[this._tokenColor];
            GameToken._lockMaterial[this._tokenColor].color.b = 1 - ratio;
        };
        GameToken.prototype.destroy = function (ratio) {
        };
        GameToken.prototype.reset = function () {
            GameToken._lockMaterial[this._tokenColor].color.b = 1;
            this.mesh.material = GameToken._baseMaterial[this._tokenColor];
            this._state = CubeState.Normal;
        };
        GameToken._size = 100;
        return GameToken;
    }());
    PandaCardBoard.GameToken = GameToken;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(x, y, z, Id) {
            _super.call(this, x, y, z, 0);
            this.Id = Id;
        }
        return Button;
    }(GameToken));
    PandaCardBoard.Button = Button;
})(PandaCardBoard || (PandaCardBoard = {}));
