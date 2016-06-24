var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PandaCardBoard;
(function (PandaCardBoard) {
    (function (AnimationState) {
        AnimationState[AnimationState["Success"] = 0] = "Success";
        AnimationState[AnimationState["InProgress"] = 1] = "InProgress";
        AnimationState[AnimationState["Failed"] = 2] = "Failed";
    })(PandaCardBoard.AnimationState || (PandaCardBoard.AnimationState = {}));
    var AnimationState = PandaCardBoard.AnimationState;
    var Animator = (function () {
        function Animator(elem, duration) {
            if (duration === void 0) { duration = 1500; }
            this._startTime = Date.now();
            this._duration = duration;
            this._element = elem;
        }
        Animator.prototype.getRatio = function () {
            var ratio = (Date.now() - this._startTime) / this._duration;
            if (ratio > 1)
                ratio = 1;
            return ratio;
        };
        Animator.prototype.update = function () {
            if (!this.validator())
                return AnimationState.Failed;
            var ratio = this.getRatio();
            this.animate(ratio);
            return ratio == 1 ? AnimationState.Success : AnimationState.InProgress;
        };
        Animator.prototype.destroy = function () {
            this._element.reset();
            return this._element;
        };
        return Animator;
    }());
    PandaCardBoard.Animator = Animator;
    var Locker = (function (_super) {
        __extends(Locker, _super);
        function Locker(mesh, caster, duration, range) {
            if (duration === void 0) { duration = 1500; }
            if (range === void 0) { range = 100000; }
            _super.call(this, mesh, duration);
            this._raycaster = caster;
            this._range = range;
        }
        Locker.prototype.validator = function () {
            var intersects = this._raycaster.intersectObject(this._element.mesh);
            for (var i = 0; i < intersects.length; i++) {
                if (intersects[i].distance < this._range) {
                    return true;
                }
            }
            return false;
        };
        Locker.prototype.animate = function (ratio) {
            this._element.lock(ratio);
        };
        return Locker;
    }(Animator));
    PandaCardBoard.Locker = Locker;
    var Deleter = (function (_super) {
        __extends(Deleter, _super);
        function Deleter(mesh, duration, range) {
            if (duration === void 0) { duration = 1500; }
            if (range === void 0) { range = 100000; }
            _super.call(this, mesh, duration);
            this._range = range;
        }
        Deleter.prototype.validator = function () {
            return true;
        };
        Deleter.prototype.animate = function (ratio) {
            this._element.destroy(ratio);
        };
        return Deleter;
    }(Animator));
    PandaCardBoard.Deleter = Deleter;
    var MoveTo = (function (_super) {
        __extends(MoveTo, _super);
        function MoveTo(mesh, moved, duration) {
            if (duration === void 0) { duration = 1500; }
            _super.call(this, mesh, duration);
            this._startPos = moved.position.clone();
            this._moved = moved;
        }
        MoveTo.prototype.validator = function () {
            return true;
        };
        MoveTo.prototype.animate = function (ratio) {
            this._element.destroy(Math.min(1, ratio * 1.2));
            this._moved.position.copy(this._startPos);
            this._moved.position.multiplyScalar(1 - ratio);
            this._moved.position.addScaledVector(this._element.mesh.position, -ratio);
        };
        return MoveTo;
    }(Animator));
    PandaCardBoard.MoveTo = MoveTo;
})(PandaCardBoard || (PandaCardBoard = {}));
