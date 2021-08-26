<?php

namespace DigitalCloud\PageBuilderField;

use Laravel\Nova\Fields\Field;

class PageBuilderField extends Field
{
    /**
     * The field's component.
     *
     * @var string
     */
    public $component = 'translatable-builder';


    public function __construct($name, $attribute = null, $resolveCallback = null)
    {
        parent::__construct($name, $attribute, $resolveCallback);
        $this->hideFromIndex();

        $locales = array_map(function ($value) {
            return __($value);
        }, config('translatable.locales'));

        $this->withMeta([
            'locales' => $locales,
            'indexLocale' => app()->getLocale(),
            'options' => [
                'assets_endpoint' => config('nova.translatable-grapesjs.assets_endpoint', 0),
            ],
        ]);
    }

      /**
     * Set the locale to display on index.
     *
     * @param  string $locale
     * @return $this
     */
    public function indexLocale($locale)
    {
        return $this->withMeta(['indexLocale' => $locale]);
    }

    /**
     * @param array $options
     * @return $this
     */
    public function options(array $options)
    {
        return $this->withMeta(['options' => $options]);
    }

}
