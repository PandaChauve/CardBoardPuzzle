var PandaCardBoard;
(function (PandaCardBoard) {
    var UrlParser = (function () {
        function UrlParser() {
            var data = document.createElement('a');
            data.href = window.location.href;
            this._search = data.search;
        }
        UrlParser.prototype.debug = function () {
            return this._search.lastIndexOf("debug") != -1;
        };
        UrlParser.prototype.p4 = function () {
            return this._search.lastIndexOf("4ir") != -1;
        };
        UrlParser.prototype.sphere = function () {
            return this._search.lastIndexOf("sphere") != -1;
        };
        return UrlParser;
    }());
    PandaCardBoard.UrlParser = UrlParser;
    var Runner = (function () {
        function Runner() {
            this._clock = new THREE.Clock(false);
        }
        Runner.prototype.run = function (config, game) {
            this._clock.start();
            var container1 = new PandaCardBoard.GraphicalContainer('example');
            if (!config.debug())
                container1.AddStereoEffect();
            container1.AddDeviceOrientation();
            game.init(container1);
            var clock = this._clock;
            function animate() {
                requestAnimationFrame(animate);
                container1.update(clock.getDelta());
                game.update(clock.getDelta());
                container1.render();
            }
            animate();
        };
        return Runner;
    }());
    PandaCardBoard.Runner = Runner;
})(PandaCardBoard || (PandaCardBoard = {}));
document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.Runner();
    var p = new PandaCardBoard.UrlParser();
    greeter.run(p, p.sphere() ? new PandaCardBoard.Icosphere.Sphere() : !p.p4() ? new PandaCardBoard.Demo() : new PandaCardBoard.FourInARow.Game());
});
