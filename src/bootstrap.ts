namespace  PandaCardBoard {
    export interface IRunnable{
        init : (cont :GraphicalContainer ) => void
        update : (delta:number ) => IRunnable
        destroy : () => void
    }

    export class Runner {
        private _clock = new THREE.Clock(false);
        constructor() {

        }

        run(config:Utils.UrlParser, game : IRunnable) {
            this._clock.start();
            var container1 = new GraphicalContainer('example');

            if (!config.debug())
                container1.AddStereoEffect();
            container1.AddDeviceOrientation();

            game.init(container1);

            var clock = this._clock;
            function animate() {
                requestAnimationFrame(animate);
                container1.update(clock.getDelta());
                let newRunner = game.update(clock.getDelta());
                container1.render();

                if(newRunner != null){
                    game.destroy();
                    game = newRunner;
                    game.init(container1);
                }
            }

            animate();
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.Runner();
    var p = new PandaCardBoard.Utils.UrlParser();
    greeter.run(p, p.sphere() ? new PandaCardBoard.Icosphere.Runner() : !p.p4() ? new PandaCardBoard.Demo() : new PandaCardBoard.FourInARow.Runner());
});