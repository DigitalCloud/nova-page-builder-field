<template>
    <field-wrapper>
        <div class="w-1/5 px-8 py-6">
            <slot>
                <form-label :for="field.name">
                    {{ field.name }}
                </form-label>
            </slot>
        </div>

        <div class="w-4/5 px-8 py-6">
            <a
                class="inline-block font-bold cursor-pointer mr-2 animate-text-color select-none border-primary"
                :class="{ 'text-60': localeKey !== currentLocale, 'text-primary border-b-2': localeKey === currentLocale }"
                :key="`a-${localeKey}`"
                v-for="(locale, localeKey) in field.locales"
                @click="changeTab(localeKey)"
            >
                {{ locale }}
            </a>

             <div id="editor"></div>


            <p v-if="hasError" class="my-2 text-danger">
                {{ firstError }}
            </p>
            <help-text class="help-text mt-2" v-if="field.helpText">
                {{ field.helpText }}
            </help-text>
        </div>
    </field-wrapper>

</template>

<script>

import grapesjs from 'grapesjs';
import basicBlocks from 'grapesjs-blocks-basic';
import pluginNavbar from 'grapesjs-navbar';
import pluginCountdown from 'grapesjs-component-countdown';
import pluginForms from 'grapesjs-plugin-forms';
import pluginExport from 'grapesjs-plugin-export';
// import pluginAviary from 'grapesjs-aviary';
// import pluginFilestack from 'grapesjs-plugin-filestack';
import custom from '../plugins/custom';
import { FormField, HandlesValidationErrors } from 'laravel-nova'

export default {

    mixins: [FormField, HandlesValidationErrors],

    props: ['resourceName', 'resourceId', 'field'],

    data() {
        return {
            editor: null,
             config: this.field.options,
                locales: Object.keys(this.field.locales),
                currentLocale: null
        }
    },
    methods: {
        
        /*
         * Set the initial, internal value for the field.
         */
        setInitialValue() {
            this.value = this.field.value || ''
        },

        /**
         * Fill the given FormData object with the field's internal value.
         */
        fill(formData) {
          Object.keys(this.value).forEach(locale => {
            let newValue = '<style>' + this.editor.getCss() + '</style><div>' + this.editor.getHtml() + '</div>';
            formData.append(this.field.attribute + '['+locale+']', newValue || '')
                            })
        },

        /**
         * Update the field's internal value.
         */
       handleChange(value) {
                this.value[this.currentLocale] = value
            },
          changeTab(locale) {
                if(this.currentLocale !== locale){
                    this.$nextTick(() => {
                        this.currentLocale = locale;
                        this.$refs.field.update()
                    })
                }
            },
            handleTab(e) {
                const currentIndex = this.locales.indexOf(this.currentLocale);
                if (!e.shiftKey) {
                    if (currentIndex < this.locales.length - 1) {
                        e.preventDefault();
                        this.changeTab(this.locales[currentIndex + 1]);
                    }
                } else {
                    if (currentIndex > 0) {
                        e.preventDefault();
                        this.changeTab(this.locales[currentIndex - 1]);
                    }
                }
            }
    },

    mounted() {
        this.editor = grapesjs.init({
            container: '#editor',
            storageManager: { autoload: 0 },
            width: '100%',
             plugins: [
                 basicBlocks,
                 // pluginAviary,
                 pluginExport,
                 pluginCountdown,
                 // pluginFilestack,
                 pluginForms,
                 pluginNavbar,
                 custom
             ],
            styleManager : {
                sectors: [
                    {
                        name: 'General',
                        open: false,
                        buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
                    },{
                        name: 'Dimension',
                        open: false,
                        buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                    },{
                        name: 'Typography',
                        open: false,
                        buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-shadow'],
                    },{
                        name: 'Decorations',
                        open: false,
                        buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
                    }
                ],
            },
        });
        this.editor.setComponents(this.field.value);
                    this.currentLocale = this.locales[0] || null;

    }
}
</script>
