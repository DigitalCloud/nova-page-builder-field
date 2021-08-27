Nova.booting((Vue, router) => {
    Vue.component('detail-page-builder-field', require('./components/DetailField'));
    Vue.component('form-page-builder-field', require('./components/FormField'));
    Vue.component('index-translatable', require('./components/IndexField'));
})
