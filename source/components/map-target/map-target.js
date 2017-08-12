import {view} from '../../misc/computed';


export const MapTarget = {
    name: 'map-target',
    template: '<div class="easy-map__target"><slot/></div>',
    mounted() {
        let {map, view, $el} = this;
        map.mount($el);
        view.updateProps();
    },
    computed: {
        map() {
            return  this.$parent.map;
        },
        view
    }
};
