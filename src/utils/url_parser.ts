namespace  PandaCardBoard.Utils {


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
}