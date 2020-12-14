import { extend } from 'flarum/extend';
import app from 'flarum/app';
import PostStream from 'flarum/components/PostStream';

export default function() {
    extend(PostStream.prototype, 'view', function(component) {
        const advertisement = app.forum.attribute('flagrow.ads.between-posts');

        if (advertisement && component.children.length) {
            const start = Number(app.forum.attribute('flagrow.ads.start-from-post'));
            const between = Number(app.forum.attribute('flagrow.ads.between-n-posts'));
            // We need to copy all comments first, otherwise -there is no way to detect and jump the last comment
            const commentPosts = component.children.filter(post => post.attrs['data-type'] === 'comment');

            // Insert an inside every n comment
            commentPosts.forEach((post, i) => {
                const postNum = post.attrs['data-number'];
                if (postNum === start || ((postNum - start) % between) === 0) {
                    alert("push something")
                    alert(Object.getOwnPropertyNames(post))
                    alert(Object.getOwnPropertyNames(post.children))
                    post.children.push(
                        m('div.Flagrow-Ads-fake-poststream-item',
                            m('article.Post.EventPost',
                                m('div.Flagrow-Ads-between-posts.EventPost-info', m.trust(advertisement))
                            )
                        )
                    );
                }
            });
        }
    });
}
