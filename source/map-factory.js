import {EasyMap} from 'easy-maps';
import {MapPrototype} from './map';

export function MapFactory(Engine, options) {
    if(!(EasyMap.isPrototypeOf(Engine) || Engine instanceof Promise)) {
        throw new Error('Should init component with EasyMap or Promise');
    }
    let ImplementedMap = Object.create(MapPrototype);
    ImplementedMap.data = function() {
        let data = MapPrototype.data.apply(this, arguments);
        return Object.assign(data, {
            engine: Engine,
            engineOptions: options
        });
    };
    ImplementedMap.then = function() {
        Promise.resolve(Engine).then(...arguments);
    };
    return ImplementedMap;
}
