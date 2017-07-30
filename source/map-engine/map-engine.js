export const MapEngine = {
    name: 'map-engine',
    template: '<div :class="className"><slot/></div>',
    mounted() {
        let {map, $el} = this;
        map.mount($el);
    },
    computed: {
        className() {
            let {map: {constructor: {engineName = ''}}} = this;
            engineName = engineName.replace(/[^\b](\s+|(?=[A-Z]))/g, '-').toLowerCase();
            return [
                'easy-map__engine', {
                    [`easy-map__engine-${engineName}`]: engineName
                }
            ];
        },
        map() {
            return  this.$parent.map;
        }
    }
};
