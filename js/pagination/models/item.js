/**
 * Created by noonon on 4/16/16.
 */

module.exports = function() {
    return Backbone.Model.extend({
        defaults: {
            item: '',
            order: ""
        }
    });
};