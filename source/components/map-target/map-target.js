export const MapTarget = {
    name: 'map-target',
    template: '<div class="easy-map__target"> <slot v-if="mapMounted" /> </div>',
    data() {
        return {
            mapMounted: false
        };
    },
    mounted() {
        let {map, $el} = this;
        map.mount($el);
        this.mapMounted = true;
    },
    computed: {
        map() {
            return  this.$parent.map;
        }
    }
};
