<?php

namespace DigitalCloud\PageBuilderField;

use Laravel\Nova\Nova;
use Laravel\Nova\Events\ServingNova;
use Illuminate\Support\ServiceProvider;

class FieldServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
		
        Nova::serving(function (ServingNova $event) {
            Nova::script('translatable-builder', __DIR__.'/../dist/js/field.js');
            Nova::style('translatable-builder', __DIR__.'/../dist/css/field.css');
        });

        $this->publishes([
            __DIR__ . '/../resources/fonts' => public_path('/fonts'),
        ], 'public');

        $this->publishes([
            __DIR__ . '/../config/translatable-grapesjs.php' => config_path('nova/translatable-grapesjs.php'),
        ], 'config');
        $this->publishes([
            __DIR__ . '/../resources/css/components.css' => public_path('/vendor/nova/t-grapesjs/css/components.css'),
        ], 'styles');
    }
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

}