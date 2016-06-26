declare namespace PandaCardBoard {
    class UrlParser {
        private _search;
        constructor();
        debug(): boolean;
        p4(): boolean;
        sphere(): boolean;
    }
    interface IRunnable {
        init: (cont: GraphicalContainer) => void;
        update: (delta: number) => void;
    }
    class Runner {
        private _clock;
        constructor();
        run(config: UrlParser, game: IRunnable): void;
    }
}
