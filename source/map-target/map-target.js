export const MapTarget = {
    name: 'map-target',
    template: '<div class="easy-map__target"><slot/></div>',
    mounted() {
        let {map, $el} = this;
        map.mount($el);
    },
    computed: {
        map() {
            return  this.$parent.map;
        }
    }
};
