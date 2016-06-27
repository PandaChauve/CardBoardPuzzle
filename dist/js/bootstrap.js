var PandaCardBoard;
(function (PandaCardBoard) {
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
                var newRunner = game.update(clock.getDelta());
                container1.render();
                if (newRunner != null) {
                    game.destroy();
                    game = newRunner;
                    game.init(container1);
                }
            }
            animate();
        };
        return Runner;
    }());
    PandaCardBoard.Runner = Runner;
})(PandaCardBoard || (PandaCardBoard = {}));
document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.Runner();
    var p = new PandaCardBoard.Utils.UrlParser();
    greeter.run(p, p.sphere() ? new PandaCardBoard.Icosphere.Runner() : !p.p4() ? new PandaCardBoard.Demo() : new PandaCardBoard.FourInARow.Runner());
});
