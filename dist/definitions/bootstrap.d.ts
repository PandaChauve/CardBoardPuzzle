declare namespace PandaCardBoard {
    class UrlParser {
        private _search;
        constructor();
        debug(): boolean;
    }
    class All {
        constructor();
        run(config: UrlParser): void;
    }
}
