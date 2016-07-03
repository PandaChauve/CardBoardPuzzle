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
    var Element = (function () {
        function Element() {
        }
        Element.prototype.setPosition = function (x, y, z) {
            this.mesh.position.x = x;
            this.mesh.position.y = z;
            this.mesh.position.z = y;
        };
        Element.prototype.lock = function (ratio) { };
        Element.prototype.destroy = function (ratio) { };
        Element.prototype.reset = function () { };
        Element.prototype.update = function () { };
        Element._size = 1;
        return Element;
    }());
    PandaCardBoard.Element = Element;
    var Cube = (function (_super) {
        __extends(Cube, _super);
        function Cube(x, y, z) {
            _super.call(this);
            this._state = CubeState.Normal;
            if (Cube._geometry == null) {
                Cube._geometry = new THREE.BoxGeometry(Element._size, Element._size, Element._size, 10, 10, 10);
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
            this.setPosition(x, y, z);
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
        return Cube;
    }(Element));
    PandaCardBoard.Cube = Cube;
    var GameToken = (function (_super) {
        __extends(GameToken, _super);
        function GameToken(x, y, z, _tokenColor) {
            _super.call(this);
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
            this.setPosition(x, y, z);
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
        return GameToken;
    }(Element));
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
    var ShateredGlaceCube = (function (_super) {
        __extends(ShateredGlaceCube, _super);
        function ShateredGlaceCube(x, y, z) {
            _super.call(this);
            this._clock = new THREE.Clock(true);
            console.log("new cube");
            var material = new THREE.RawShaderMaterial({
                uniforms: {
                    time: { value: 1.0 }
                },
                vertexShader: "\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\t\t\tuniform mat4 modelViewMatrix; // optional\n\t\t\tuniform mat4 projectionMatrix; // optional\n\t\t\tattribute vec3 position;\n\t\t\tattribute vec4 color;\n\t\t\tvarying vec3 vPosition;\n\t\t\tvarying vec4 vColor;\n\t\t\tvoid main()\t{\n\t\t\t\tvPosition = position;\n\t\t\t\tvColor = color;\n\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position*1., 1.0 );\n\t\t\t}\n            ",
                fragmentShader: "\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\t\t\tuniform float time;\n\t\t\tvarying vec3 vPosition;\n\t\t\tvarying vec4 vColor;\n\t\t\tvoid main()\t{\n\t\t\t\tvec4 color = vec4( vColor );\n\t\t\t\tcolor.r += sin( vPosition.x * time ) * 0.5;\n\t\t\t\tgl_FragColor = color;\n\t\t\t}",
                transparent: true,
                side: THREE.DoubleSide,
            });
            var triangles = 500;
            var geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array(triangles * 3 * 3);
            for (var i = 0, l = triangles * 3 * 3; i < l; i += 3) {
                vertices[i] = (Math.random() - 0.5) * 3;
                vertices[i + 1] = (Math.random() - 0.5) * 3;
                vertices[i + 2] = (Math.random() - 0.5) * 3;
            }
            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            var colors = new Uint8Array(triangles * 3 * 4);
            for (var i = 0, l = triangles * 3 * 4; i < l; i += 4) {
                colors[i] = Math.random() * 255;
                colors[i + 1] = Math.random() * 255;
                colors[i + 2] = Math.random() * 255;
                colors[i + 3] = Math.random() * 255;
            }
            geometry.addAttribute('color', new THREE.BufferAttribute(colors, 4, true));
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.scale.set(1, 1, 1);
            this.setPosition(x, y, z);
            this.mesh.userData = this;
        }
        ;
        ShateredGlaceCube.prototype.update = function () {
            var t = this._clock.getElapsedTime();
            this.mesh.material.uniforms.time.value = t * 0.005;
            this.mesh.rotation.y = t * 0.05;
        };
        return ShateredGlaceCube;
    }(Element));
    PandaCardBoard.ShateredGlaceCube = ShateredGlaceCube;
    var LightCube = (function (_super) {
        __extends(LightCube, _super);
        function LightCube(x, y, z) {
            _super.call(this);
            this._clock = new THREE.Clock(true);
            console.log("new cube");
            var material = new THREE.RawShaderMaterial({
                uniforms: {
                    amplitude: { type: "f", value: 1.0 },
                    color: { type: "c", value: new THREE.Color(0xffffff) },
                    texture: { type: "t", value: LightCube._txt }
                },
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                vertexShader: "\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\t\t\tuniform float amplitude;\n\t\t\tuniform mat4 modelViewMatrix; // optional\n\t\t\tuniform mat4 projectionMatrix; // optional\n\t\t\tattribute float size;\n\t\t\tattribute vec3 customColor;\n\t\t\tvarying vec3 vColor;\n\t\t\tattribute vec3 position;\n\t\t\tvoid main() {\n\t\t\t\tvColor = customColor;\n\t\t\t\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\tgl_PointSize = size * ( 10.0 / length( mvPosition.xyz ) );\n\t\t\t\tgl_Position = projectionMatrix * mvPosition;\n\t\t\t}\n            ",
                fragmentShader: "\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\t\t\tuniform vec3 color;\n\t\t\tuniform sampler2D texture;\n\t\t\tvarying vec3 vColor;\n\t\t\tvoid main() {\n\t\t\t\tgl_FragColor = vec4( color * vColor, 1.0 );\n\t\t\t\tgl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );\n\t\t\t\t//gl_FragColor =vec4( color*vColor, 1.0 );  // draw red\n\t\t\t}"
            });
            var points = 300;
            var geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array(points * 3);
            for (var i = 0, l = points * 3; i < l; i += 3) {
                vertices[i] = (Math.random() - 0.5) * 3;
                vertices[i + 1] = (Math.random() - 0.5) * 3;
                vertices[i + 2] = (Math.random() - 0.5) * 3;
            }
            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            var colors = new Uint8Array(points * 3);
            for (var i = 0, l = points * 3; i < l; i += 3) {
                colors[i] = Math.random() * 255;
                colors[i + 1] = Math.random() * 255;
                colors[i + 2] = Math.random() * 255;
            }
            geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3, true));
            var size = new Uint8Array(points);
            for (var i = 0, l = points; i < l; i += 1) {
                size[i] = 17;
            }
            geometry.addAttribute('size', new THREE.BufferAttribute(size, 1, false));
            this.mesh = new THREE.Points(geometry, material);
            this.mesh.scale.set(1, 1, 1);
            this.setPosition(x, y, z);
            this.mesh.userData = this;
        }
        ;
        LightCube.prototype.update = function () {
            var t = this._clock.getElapsedTime();
            var att = this.mesh.geometry.getAttribute('size');
            var time = t;
            for (var i = 0; i < att.array.length; i += 1) {
                att.setX(i, 55 + 55 * Math.sin(0.1 * i + time));
            }
            att.version++;
        };
        LightCube._txt = THREE.ImageUtils.loadTexture("../resources/spark.png");
        return LightCube;
    }(Element));
    PandaCardBoard.LightCube = LightCube;
})(PandaCardBoard || (PandaCardBoard = {}));
