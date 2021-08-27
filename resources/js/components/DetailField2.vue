Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@behzodjon 
mrmonat
/
nova-translatable
2
8020
Code
Issues
8
Pull requests
6
Actions
Security
Insights
nova-translatable/resources/js/components/DetailField.vue
@d8vjork
d8vjork Add currentLocale meta to form & detail (#43)
Latest commit e0b092a on May 18, 2020
 History
 3 contributors
@mrmonat@RonMelkhior@d8vjork
46 lines (39 sloc)  1.18 KB
 
<template>
    <panel-item :field="field">
        <template slot="value">

            <a 
                class="inline-block font-bold cursor-pointer mr-2 animate-text-color select-none border-primary" 
                :class="{ 'text-60': localeKey !== currentLocale, 'text-primary border-b-2': localeKey === currentLocale }"
                :key="`a-${localeKey}`" 
                v-for="(locale, localeKey) in field.locales"
                @click="changeTab(localeKey)"
            >
                {{ locale }}
            </a>

            <div class="mt-4">
                <div v-if="field.asHtml" v-html="value"></div>
                <div v-else :class="{ 'truncate': field.truncate }">{{ value }}</div>
            </div>

        </template>
    </panel-item>
</template>

<script>
export default {
    props: ['resource', 'resourceName', 'resourceId', 'field'],
    data() {
        return {
            currentLocale: this.field.currentLocale
        }
    },
    methods: {
        changeTab(locale) {
            this.currentLocale = locale
        }
    },
    computed: {
        value() {
            return this.field.value[this.currentLocale] || '—'
        }
    },
}
</script>
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete Octotree
 Login with GitHub
