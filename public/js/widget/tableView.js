/**
 * 列表控件
 */
define([
	'base/klass',
	'base/element',
    'util/template/jst',
    'ui/item/list',
    'base/event',
	'base/util',
	'{pro}base/util.js',
	],function(k,e,jst,ui,v,u,du,p) {
	var pro;	
	p._$$listItem = k._$klass();

	pro= p._$$listItem._$extend(ui._$$ListItem);

	pro.__init = function() {
        this.__super();
    };
	pro.__reset = function(options) {
        this.__super(options);
    };
    pro.__destroy = function() {
        this.__super();
    };
	pro.__doRefresh = function(data) {
		var node = jst._$get('jst-list', data, {
		    transTime: function(time, format) {
		        return u._$format(time, format || 'yyyy-MM-dd');
		    },
		    transType:function(type){
		    	return du.transType(type);
		    }
		});
		this.__body.innerHTML= node;
		var deleteBtn = du.get('del',this.__body);
		if(!!deleteBtn){
			v._$addEvent(deleteBtn, 'click', this.__onClickDelete._$bind(this));

		}
	};
	/**
	 * 点击删除的消息响应函数
	 * @param  {Object} event 事件对象
	 * @return {Void}
	 */
    pro.__onClickDelete = function(event) {
        if (window.confirm("确定删除此消息？")) {
            this.__onDelete();
        }
	};
    return p;

})