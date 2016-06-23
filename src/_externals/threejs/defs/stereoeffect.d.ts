
/// <reference path="./three.d.ts" />

declare namespace THREE {
    class StereoEffect {
        constructor(object: Renderer);
        setSize(width: number, height: number ) :void;
        render(scene: Scene, camera: Camera): void;
        setSize(width:number, height:number, updateStyle?:boolean): void;
    }
}
