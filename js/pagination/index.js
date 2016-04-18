/**
 * Created by noonon on 4/15/16.
 */

module.exports = function (React) {
    let Item = require('./components/item')(React),
        modelItem = require('./models/item')(),
        Model = require('./models/main')(),
        Collection = require('./collections/items')(modelItem);


    return React.createClass({

        getItems: function (from, to, callback) {
            return this.Collection.filter(function (item) {
                var order = item.get("order");

                if (callback instanceof Function) {
                    callback(item);
                }

                if (from < order && to >= order) {
                    return true;
                }
            });
        },

        itemsOnPage: function (page) {
            var items = this.props.items,
                to = items * page,
                from = to - items;

            return {
                to: to,
                from: from
            }
        },

        getPage: function (page) {
            var items = this.props.items,
                objectItemsOnPage = this.itemsOnPage(page),
                to = objectItemsOnPage.to,
                from = objectItemsOnPage.from,
                count = this.Model.get('count'),
                flag = false,
                callback = function (item) {
                    flag = (count === item.get("order"));
                },
                itemsValid = this.getItems(from, to, callback);

            return {
                enable: (itemsValid.length === items || flag),
                from: from,
                to: to,
                items: itemsValid
            };
        },

        fetchPage: function (from, to) {

            this.Model.fetch({
                data: {
                    from: from,
                    to: to
                }
            })
        },

        setRouter: function (page) {
            var route = (Backbone.history.getFragment()).match(/\w+/);

            APP.Router.navigate(`#${route}/${page}`, false);
        },

        getPageClick: function (page) {

            var data = this.getPage(page);

            if (data.enable) {
                this.setState({
                    current: page,
                    from: data.from,
                    to: data.to,
                    items: data.items
                });
                this.setRouter(page);
            } else {
                this.setState({
                    current: page,
                    from: data.from,
                    to: data.to
                });
                this.fetchPage(data.from, data.to)
            }
        },

        calcPages: function(count, items){
            return Math.ceil(count / items)
        },

        modelChange: function (model) {
            var items = this.props.items,
                json = model.toJSON(),
                pages = this.calcPages(json.count, items),
                count = pages * 50 - 150;

            this.setState({
                pages: pages,
                items: this.getItems(this.state.from, this.state.to),
                right: this.state.transform < count
            })
        },

        initModule: function (url) {

            var model = APP.ModelStorage['pagination'],
                modelUrl;

            model = (model == undefined) ? {} : model;
            modelUrl = model[url];

            if (modelUrl) {
                this.Model = modelUrl.Model;
                this.Collection = modelUrl.Collection;

            } else {
                model[url] = {
                    Model: this.Model = new Model(),
                    Collection: this.Collection = new Collection()
                };

                this.Model.url = url;
                this.Model.subCollection = this.Collection;

                APP.ModelStorage['pagination'] = model
            }
        },

        getInitialState: function () {
            let page = this.props.current,
                url = this.props.url,
                objGetPage, to, from,
                count, pages, items;

            this.initModule(url);
            this.Model.bind('change', this.modelChange, this);

            page = (page == null) ? 1 : page;
            objGetPage = this.getPage(page);
            to = objGetPage.to;
            from = objGetPage.from;

            if (objGetPage.enable === false) {
                this.fetchPage(from, to);
                count = 0;
                pages = 0;
                items = [];
            }else{
                count = this.Model.get("count");
                pages = this.calcPages(count, this.props.items);
                items = this.getItems(from, to);
            }

            return {
                left: false,
                right: (3 < pages),
                pages: pages,
                transform: 0,
                to: to,
                from: from,
                current: page,
                count: count,
                items: items
            }
        },

        isEnable: function (classNameAttr, isEnable, prefix = '_enable') {
            let result = [classNameAttr];

            if (isEnable) {
                result.push(classNameAttr + prefix)
            }

            return result.join(' ');
        },

        arrowMove: function (direction, count) {
            var transform = this.state.transform,
                result = {};

            count = count * 50 - 150;

            if (direction === "left" && transform > 0) {
                result = {transform: transform -= 50};

            } else if (direction === "right" && transform < count) {
                result = {transform: transform += 50};
            }

            result.left = (transform > 0);
            result.right = (transform < count);

            this.setState(result)
        },


        pageRender: function (pages, current) {
            var result = [];

            for (; pages > 0; pages--) {
                result[pages] = <li key={pages}
                                    className={this.isEnable('pagination__pages-parent-block-page', current == pages, '_active')}
                                    onClick={this.getPageClick.bind(this, pages)}>{pages}</li>
            }

            return result
        },

        render: function () {
            var Decoration = this.props.decoration || Item;

            return (
                <div className="pagination">
                    <ul className="pagination__items">
                        {
                            this.state.items.map(function (item) {
                                return <li key={item.get("order")} className="pagination__items-item">
                                    <Decoration item={item}/>
                                </li>
                            })
                        }
                    </ul>
                    <div className="pagination__pages">
                        <div onClick={this.arrowMove.bind(this ,'left', this.state.pages)}
                             className={this.isEnable('pagination__pages-arrow-left', this.state.left)}></div>
                        <div className={this.isEnable('pagination__pages-other', this.state.left)}></div>
                        <div className="pagination__pages-parent">
                            <ul style={{left: `-${this.state.transform}px`}}
                                className="pagination__pages-parent-block">
                                {
                                    this.pageRender.call(this, this.state.pages, this.state.current)
                                }
                            </ul>
                        </div>
                        <div className={this.isEnable('pagination__pages-other', this.state.right)}></div>
                        <div onClick={this.arrowMove.bind(this, 'right', this.state.pages)}
                             className={this.isEnable('pagination__pages-arrow-right', this.state.right)}></div>
                    </div>
                </div>
            );
        }
    })
};