import {EasyMap, verifyEngine} from 'easy-maps';
import {MapTarget} from '../map-target';

export const ENGINE_STATUSES = {
    RESOLVED: '',
    ENGINE_PENDING: 'engine-pending',
    ENGINE_INVALID: 'engine-invalid',
    MAP_PENDING: 'map-panding',
    MAP_INVALID: 'map-invalid',
    NO_ENGINE: 'no-engine',
    NO_MAP: 'no-map'
};

export const MapPrototype = {
    name: 'tmap',
    data() {
        return {
            map: null,
            engine: null
        };
    },
    template:  `
        <div :class="className">
            <map-target v-if="isEngineResolved">
                <slot/>
            </map-target>
        </div>
    `,
    computed: {
        isEngineResolved() {
            let {map} = this;
            return map instanceof EasyMap;
        },
        className() {
            let {mapStatus, engine} = this;
            let {engineName} = engine || {};
            engineName = engineName && engineName.replace(/(\s+|(?=(?!\b)[A-Z]))/g, '-').toLowerCase();

            return [
                'easy-map',
                {
                    [`easy-map_${mapStatus}`]: mapStatus,
                    [`easy-map_${engineName}`]: engineName
                }

            ];
        },
        mapStatus() {
            const {
                RESOLVED,
                ENGINE_PENDING,
                ENGINE_INVALID,
                MAP_PENDING,
                MAP_INVALID,
                NO_ENGINE,
                NO_MAP
            } = ENGINE_STATUSES;
            let {map, engine} = this;
            if (engine === null || engine === undefined) {
                return NO_ENGINE;
            }
            if (engine instanceof Promise) {
                return ENGINE_PENDING;
            }
            if (engine instanceof Error) {
                return ENGINE_INVALID;
            }
            if (map === null || map === undefined) {
                return NO_MAP;
            }
            if (map instanceof Promise) {
                return MAP_PENDING;
            }
            if (map instanceof EasyMap) {
                return RESOLVED;
            }
            return MAP_INVALID;
        }
    },
    mounted() {
        let {engine} = this;
        this.setEngine(engine);
    },
    methods: {
        setEngine(engine) {
            engine = this.resolveEngine(engine);
            this.engine = engine;
            let {Map} = engine;
            if (Map) {
                let {$props, engineOptions} = this;
                this.setMap(new Map($props, engineOptions));
            }
        },
        resolveEngine(engine) {
            if (engine instanceof Promise) {
                let enginePromise = engine;
                let resolveValue = value => {
                    if (this.engine === enginePromise) {
                        this.setEngine(value);
                    }
                };
                enginePromise
                    .then(resolveValue, resolveValue);
                return enginePromise;
            }
            if (engine instanceof Error) {
                return engine;
            }

            try {
                verifyEngine(engine);
                return engine;
            } catch (error) {
                return error;
            }

        },
        setMap(value) {
            if (value instanceof Promise) {
                this.map = value;
                value.then(map => {
                    if(this.map === value) {
                        this.setMap(map);
                    }
                });
                return;
            }
            if (!(value instanceof EasyMap)) {
                throw new Error('Map should be instance of EasyMap');
            }
            let {View} = this.engine;
            this.view = new View(value);
            this.map = value;
        }
    },
    components: {
        'map-target': MapTarget
    }
};
