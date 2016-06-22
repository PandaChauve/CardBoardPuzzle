/**
 * Created by Panda_2 on 22-06-16.
 */
class Greeter {
    constructor(public greeting: string) { }
    greet() {
        return "<h1>" + this.greeting + "</h1>";
    }
};

var greeter = new Greeter("Hello, worldcv!");