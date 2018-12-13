<template>
    <div id="editor"></div>
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
            editor: null
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
            let newValue = '<style>' + this.editor.getCss() + '</style><div>' + this.editor.getHtml() + '</div>';
            formData.append(this.field.attribute, newValue || '')
        },

        /**
         * Update the field's internal value.
         */
        handleChange(value) {
            this.value = value
        },
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
    }
}
</script>
