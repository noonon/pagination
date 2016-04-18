/**
 * Created by noonon on 4/15/16.
 */


var React = require("react"),
    ReactDom = require("react-dom"),
    Pagination = require("./pagination")(React),
    Decoration = require("./decoration")(React),
    Router = Backbone.Router.extend({

        routes: {
            "news(/:page)": "news",
            "main(/:page)": "main"
        },

        news: function (page) {
            var element = document.querySelector('main');

            ReactDom.unmountComponentAtNode(element);
            ReactDom.render(
                <section>
                    <h1 className="title">News</h1>
                    <Pagination
                        url="/news"
                        items='3'
                        current={page}
                        decoration={Decoration}
                        >
                    </Pagination>
                </section>,
                element
            );
        },

        main: function (page) {
            var element = document.querySelector('main');

            ReactDom.unmountComponentAtNode(element);
            ReactDom.render(
                <section>
                    <h1 className="title">Main</h1>
                    <Pagination
                        url="/items"
                        items='9'
                        current={page}
                        />
                </section>,
                element
            );
        }

    });

window.APP = {
    ModelStorage: {},
    Router: new Router()
};

Backbone.history.start();


