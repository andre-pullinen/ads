<?php

namespace Flagrow\Ads;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Extend;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->css(__DIR__ . '/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js')
        ->content(Listeners\AddAdsenseJs::class),
    new Extend\Locales(__DIR__.'/resources/locale'),

    function (Dispatcher $events) {
        $events->subscribe(Listeners\LoadSettingsFromDatabase::class);
    },
];
