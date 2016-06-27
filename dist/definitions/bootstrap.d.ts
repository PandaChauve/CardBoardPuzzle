declare namespace PandaCardBoard {
    interface IRunnable {
        init: (cont: GraphicalContainer) => void;
        update: (delta: number) => IRunnable;
        destroy: () => void;
    }
    class Runner {
        private _clock;
        constructor();
        run(config: Utils.UrlParser, game: IRunnable): void;
    }
}
