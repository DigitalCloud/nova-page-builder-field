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
		$this->publishes([
			__DIR__.'/../resources/fonts' => public_path('/fonts'),
		], 'public');
	
        Nova::serving(function (ServingNova $event) {
            Nova::script('page-builder-field', __DIR__.'/../dist/js/field.js');
            Nova::style('page-builder-field', __DIR__.'/../dist/css/field.css');
        });

        $this->publishes([
            __DIR__ . '/../config/translatable-grapesjs.php' => config_path('nova/translatable-grapesjs.php'),
        ], 'config');
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
