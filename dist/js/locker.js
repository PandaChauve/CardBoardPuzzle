var PandaCardBoard;
(function (PandaCardBoard) {
    (function (LockerState) {
        LockerState[LockerState["Success"] = 0] = "Success";
        LockerState[LockerState["InProgress"] = 1] = "InProgress";
        LockerState[LockerState["Failed"] = 2] = "Failed";
    })(PandaCardBoard.LockerState || (PandaCardBoard.LockerState = {}));
    var LockerState = PandaCardBoard.LockerState;
    var Locker = (function () {
        function Locker(mesh, caster, duration, range) {
            if (duration === void 0) { duration = 1500; }
            if (range === void 0) { range = 100000; }
            this._startTime = Date.now();
            this._duration = duration;
            this._mesh = mesh;
            this._raycaster = caster;
            this._range = range;
        }
        Locker.prototype.isLocking = function () {
            var intersects = this._raycaster.intersectObject(this._mesh);
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].distance < this._range) {
                    return true;
                }
            }
            return false;
        };
        Locker.prototype.updateState = function () {
            if (!this.isLocking())
                return LockerState.Failed;
            var ratio = (Date.now() - this._startTime) / this._duration;
            if (ratio > 1)
                ratio = 1;
            this._mesh.material.color.b = 1 - ratio;
            return ratio == 1 ? LockerState.Success : LockerState.InProgress;
        };
        Locker.prototype.destroy = function () {
            this._mesh.material.color.b = 1;
            return this._mesh;
        };
        return Locker;
    }());
    PandaCardBoard.Locker = Locker;
})(PandaCardBoard || (PandaCardBoard = {}));
