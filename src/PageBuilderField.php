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
    public $component = 'page-builder-field';


    public function __construct($name, $attribute = null, $resolveCallback = null)
    {
        parent::__construct($name, $attribute, $resolveCallback);
        $this->hideFromIndex();
    }

}
