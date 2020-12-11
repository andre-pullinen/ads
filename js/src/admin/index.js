import app from "flarum/app";
import addAdsPage from "./addAdsPage";

app.initializers.add('flagrow-ads', () => {
    // add the admin pane
    addAdsPage();
});
