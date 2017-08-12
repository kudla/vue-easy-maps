function createContextGetter(prop) {
    return function() {
        let host = this.$parent;
        while(host) {
            if (prop in host) {
                return host[prop];
            }
            host = host.$parent;
        }
    };
}

export const engine = createContextGetter('engine');
export const map = createContextGetter('map');
export const view = createContextGetter('view');
