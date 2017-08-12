import Vue from 'vue';
import {view} from '../../misc/computed';
import {pick} from 'lodash';

function Numerable(value) {
    if (value !== undefined) {
        return !Number.isNaN(Number(value));
    }
    return value;
}
const NumerableType = {
    type: [String, Number],
    validator: Numerable
};

export const View = Vue.component('map-view', {
    render() {
        // should access props to make vue watch them
        this.viewSource();
        this.view.updateProps();
    },
    props: {
        zoom: NumerableType,
        center: {
            type: Array,
            validator(value) {
                return value instanceof Array &&
                    value.every(Numerable);
            }
        },
        rotation: NumerableType,
        transition: NumerableType,
        zoomTransition: NumerableType,
        centerTransition: NumerableType
    },
    mounted() {
        let {view, viewSource} = this;
        if (!this.viewSourceBind) {
            this.viewSourceBind = viewSource.bind(this);
        }
        view.mountSource(this.viewSourceBind);
    },
    methods: {
        viewSource() {
            return pick(this, [
                'zoom',
                'center',
                'rotation',
                'transition',
                'zoomTransition',
                'centerTransition'
            ]);
        }
    },
    computed: {
        view
    }
});
