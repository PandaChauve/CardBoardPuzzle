namespace  PandaCardBoard {


    export class UrlParser {
        private _search;
        // see http://medialize.github.io/URI.js/ for more complex url
        constructor() {
            var data = document.createElement('a');
            data.href = window.location.href;
            this._search = data.search;
        }

        debug():boolean {
            return this._search.lastIndexOf("debug") != -1;
        }
        p4():boolean {
            return this._search.lastIndexOf("4ir") != -1;
        }
        sphere():boolean {
            return this._search.lastIndexOf("sphere") != -1;
        }
    }

    export interface IRunnable{
        init : (cont :GraphicalContainer ) => void
        update : (delta:number ) => void
    }

    export class Runner {
        private _clock = new THREE.Clock(false);
        constructor() {

        }

        run(config:UrlParser, game : IRunnable) {
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
                game.update(clock.getDelta());
                container1.render();
            }

            animate();


        }
    }

}

document.addEventListener("DOMContentLoaded", function () {
    var greeter = new PandaCardBoard.Runner();
    var p = new PandaCardBoard.UrlParser();
    greeter.run(p, p.sphere() ? new PandaCardBoard.Icosphere.Sphere() : !p.p4() ? new PandaCardBoard.Demo() : new PandaCardBoard.FourInARow.Game());
});