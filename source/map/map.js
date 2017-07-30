import {EasyMap} from 'easy-maps';
import {MapEngine} from '../map-engine';

export const ENGINE_STATUSES = {
    PENDING: 'pending',
    RESOLVED: '',
    INVALID: 'invalid',
    NONE: 'none'
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
            <map-engine v-if="isEngineResolved">
                <slot/>
            </map-engine>
        </div>
    `,
    computed: {
        isEngineResolved() {
            let {map} = this;
            return map instanceof EasyMap;
        },
        className() {
            let {mapStatus} = this;
            return [
                'easy-map',
                {
                    [`easy-map_engine-${mapStatus}`]: mapStatus
                }

            ];
        },
        mapStatus() {
            const {
                PENDING,
                RESOLVED,
                INVALID,
                NONE
            } = ENGINE_STATUSES;
            let {map} = this;
            if (map === null || map === undefined) {
                return NONE;
            }
            if (map instanceof Promise) {
                return PENDING;
            }
            if (map instanceof EasyMap) {
                return RESOLVED;
            }
            return INVALID;
        }
    },
    mounted() {
        let {engine: Engine} = this;
        this.resolveEngine(Engine);
    },
    methods: {
        resolveEngine(Engine) {
            if (Engine instanceof Promise) {
                let enginePromise = Engine
                    .then(Engine => {
                        if (this.engine === enginePromise) {
                            this.resolveEngine(Engine);
                        }
                    });
                this.engine = enginePromise;
                return;
            }
            if (!EasyMap.isPrototypeOf(Engine)) {
                throw new Error('Engine should extend EasyMap');
            }
            this.engine = Engine;
            let {$props, engineOptions} = this;
            this.resolveMap(new Engine($props, engineOptions));
        },
        resolveMap(value) {
            if (value instanceof Promise) {
                this.map = value;
                value.then(map => {
                    if(this.map === value) {
                        this.resolveMap(map);
                    }
                });
                return;
            }
            if (!(value instanceof EasyMap)) {
                throw new Error('Map should be instance of EasyMap');
            }
            this.map = value;
        }
    },
    components: {
        'map-engine': MapEngine
    }
};
