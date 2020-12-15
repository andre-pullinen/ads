import { extend } from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';

export default function () {
    extend(HeaderPrimary.prototype, 'config', (isInitialized, context) => {

        alert(isInitialized)
        if (isInitialized) { return; }

        alert(document.getElementsByClassName('Flagrow-Ads-under-header').length)
        if (document.getElementsByClassName('Flagrow-Ads-under-header').length) {
            return;
        }

        const advertisement = app.forum.attribute('flagrow.ads.under-header');
        alert(advertisement)
        if (advertisement) {

            var appElement = document.getElementsByClassName('App-content')[0];

            var adsElement = document.createElement('div');

            adsElement.className = 'Flagrow-Ads-under-header';
            adsElement.innerHTML = advertisement;

            appElement.parentNode.insertBefore(adsElement, appElement);
        }
    });
}
