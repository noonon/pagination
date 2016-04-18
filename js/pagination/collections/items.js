/**
 * Created by noonon on 4/16/16.
 */

module.exports = function(model){
  return Backbone.Collection.extend({
      model: model
  })
};