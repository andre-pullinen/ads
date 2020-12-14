<?php

namespace Flagrow\Ads\Listeners;

use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;

class AddAdsenseJs
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Document $document, ServerRequestInterface $request)
    {
        $this->analytics($document);
    }

    private function analytics(Document $document)
    {
        $statusGoogle = (bool) $this->settings->get('flagrow.ads.adsense-enabled');
        $adsenseClientId = $this->settings->get('flagrow.ads.adsense-client-id');

        if($statusGoogle) {
            // Add google analytics if tracking UA only has been configured.
            $js = file_get_contents(dirname(__DIR__, 2) . '/resources/js/google-adsense.html');
            $js = str_replace("%%CLIENT_ID%%", $adsenseClientId, $js);

            $document->payload['adsenseClientId'] = $adsenseClientId;
            $document->head[] = $js;
        }
    }
}
