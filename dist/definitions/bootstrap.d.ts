declare namespace PandaCardBoard {
    class UrlParser {
        private _search;
        constructor();
        debug(): boolean;
        demo(): boolean;
    }
    interface IRunnable {
        init: (cont: GraphicalContainer) => void;
        update: (delta: number) => void;
    }
    class Demo implements IRunnable {
        private group;
        private currentLocking;
        private currentMover;
        private CUBE_SIZE;
        private GRAB_FACTOR;
        private state;
        private container1;
        private currentHover;
        constructor();
        init(cont: GraphicalContainer): void;
        private SetStateTo(newState);
        private getFrontObject();
        private CreateMover(dest);
        update(delta: number): void;
    }
    class All {
        private _clock;
        constructor();
        run(config: UrlParser, game: IRunnable): void;
    }
}
