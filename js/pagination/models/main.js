/**
 * Created by noonon on 4/16/16.
 */
module.exports = function() {
    return Backbone.Model.extend({
        defaults: {
            count: ''
        },

        parse: function(data){
            this.subCollection.set(data.data);

            return {
                count: data.count
            };
        }
    });
};