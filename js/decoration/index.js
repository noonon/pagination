/**
 * Created by noonon on 4/16/16.
 */
module.exports = function(React){
    return React.createClass({
        render: function(){
            return (
                <div className="different-decoration">{this.props.item.get("item")}</div>
            )
        }
    })
};