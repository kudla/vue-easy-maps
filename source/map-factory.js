import {verifyEngine} from 'easy-maps';
import {MapPrototype} from './components/map';

export function MapFactory(engine, options) {
    if(!(engine instanceof Promise)) {
        verifyEngine(engine);
    }
    let ImplementedMap = Object.create(MapPrototype);
    ImplementedMap.data = function() {
        let data = MapPrototype.data.apply(this, arguments);
        return Object.assign(data, {
            engine: engine,
            engineOptions: options
        });
    };
    ImplementedMap.then = function() {
        Promise.resolve(engine).then(...arguments);
    };
    return ImplementedMap;
}
