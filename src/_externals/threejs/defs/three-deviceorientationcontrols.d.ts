
/// <reference path="./three.d.ts" />

//this may not be accurate
declare namespace THREE {
    class DeviceOrientationControls {
        constructor(object: Camera);
        update(): void;
        connect(): void;
        disconnect(): void;
        align(): void;
        update(): void;

        // EventDispatcher mixins
        addEventListener(type: string, listener: (event: any) => void): void;
        removeEventListener(type: string, listener: (event: any) => void): void;
        dispatchEvent(event: { type: string; target: any; }): void;
    }
}
