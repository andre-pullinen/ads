import Page from 'flarum/components/Page';
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Stream from 'flarum/utils/Stream';
import Switch from 'flarum/components/Switch';
import withAttr from 'flarum/utils/withAttr';

export default class UploadPage extends Page {
    oninit(vnode) {
        super.oninit(vnode);
        // get the saved settings from the database
        const settings = app.data.settings;

        this.values = {};

        // our package prefix (to be added to every field and checkbox in the setting table)
        this.settingsPrefix = 'flagrow.ads';

        this.positions = [
            'under-header',
            'between-posts',
            'under-nav-items',
        ];

        this.properties = [
            'adsense-client-id',
        ];

        this.settings = [
    	    'adsense-enabled',
    	    'start-from-post',
            'between-n-posts'
        ];

        // bind the values of the fields and checkboxes to the getter/setter functions
        this.positions.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)])));

        this.properties.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)])));

        this.settings.forEach((key) => (this.values[key] = Stream(Number(settings[this.addPrefix(key)]))));
    }

    /**
     * Show the actual ImageUploadPage.
     *
     * @returns {*}
     */
    view() {
        return [
            m('div', {className: 'AdsPage'}, [
                m('div', { className: 'container' }, [
                    m('form', {onsubmit: this.onsubmit.bind(this)},
                        m('h3', app.translator.trans('flagrow-ads.admin.settings.title')),

                        m('fieldset', {className: 'AdsPage-settings'}, [
                            Switch.component(
                                {
                                    state: this.values['adsense-enabled']() || false,
                                    onchange: this.values['adsense-enabled'],
                                },
                                app.translator.trans('flagrow-ads.admin.settings.adsense-enable')
                            ),
                        ]),

                        (this.values['adsense-enabled']() > 0 ? [
                            m('fieldset', [
                                m('label', app.translator.trans('flagrow-ads.admin.settings.adsense-client-id')),
                                m('input.FormControl', {
                                    placeholder: 'ca-pub-XXXXXXXXXXXXXXXX',
                                    value: this.values['adsense-client-id']() || '',
                                    oninput: withAttr('value', this.values['adsense-client-id']),
                                }),
                            ]),
                        ] : null),

                        m('fieldset', {className: 'AdsPage-settings'}, [
                            m('legend', {}, app.translator.trans('flagrow-ads.admin.settings.start-from-post')),
                            m('input.FormControl', {
                                type: 'number',
                                value: this.values['start-from-post']() || 1,
                                oninput: withAttr('value', this.values['start-from-post'])
                            })
                        ]),

                        m('fieldset', {className: 'AdsPage-settings'}, [
                            m('legend', {}, app.translator.trans('flagrow-ads.admin.settings.between-n-posts')),
                            m('input.FormControl', {
                                type: 'number',
                                value: this.values['between-n-posts']() || 5,
                                oninput: withAttr('value', this.values['between-n-posts'])
                            })
                        ]),

                        this.positions.map(position => {
                            return m('fieldset', {className: 'AdsPage-' + position}, [
                                m('legend', {}, app.translator.trans('flagrow-ads.admin.positions.' + position + '.title')),
                                m('textarea.FormControl', {
                                    value: this.values[position]() || null,
                                    placeholder: app.translator.trans('flagrow-ads.admin.positions.' + position + '.placeholder'),
                                    oninput: withAttr('value', this.values[position])
                                })
                            ])
                        }),

                        Button.component({
                            type: 'submit',
                            className: 'Button Button--primary',
                            loading: this.loading,
                            disabled: !this.changed()
                        }, app.translator.trans('flagrow-ads.admin.buttons.save')),
                    ),
                ]),
            ])
        ];
    }

    /**
     * Checks if the values of the fields and checkboxes are different from
     * the ones stored in the database
     *
     * @returns boolean
     */
    changed() {
        const positionsChecked = this.positions.some(key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
        const propertiesChecked = this.properties.some(key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
        const settingsChecked = this.settings.some(key => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
        return positionsChecked || settingsChecked || propertiesChecked;
    }

    /**
     * Saves the settings to the database and redraw the page
     *
     * @param e
     */
    onsubmit(e) {
        // prevent the usual form submit behaviour
        e.preventDefault();


        // if the page is already saving, do nothing
        if (this.loading) return;

        // prevents multiple savings
        this.loading = true;

        // remove previous success popup
        app.alerts.dismiss(this.successAlert);

        const settings = {};

        // gets all the values from the form
        this.positions.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
        this.properties.forEach(key => settings[this.addPrefix(key)] = this.values[key]());
        this.settings.forEach(key => settings[this.addPrefix(key)] = this.values[key]());

        // actually saves everything in the database
        saveSettings(settings)
            .then(() => {
                // on success, show popup
                app.alerts.show({ type: 'success' }, app.translator.trans('core.admin.basics.saved_message'));
            })
            .catch(() => {
            })
            .then(() => {
                // return to the initial state and redraw the page
                this.loading = false;
                window.location.reload();
            });
    }

    addPrefix(key) {
        return this.settingsPrefix + '.' + key;
    }
}
