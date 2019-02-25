function page(pageNumber){
    $.fn.createPage = function(options){
        var ops =  $.extend({
            current: 1, //当前页面
            prev: "上一页",
            next: "下一页",
            pageSize: 3,	//每页显示多少条数据
            count:20, 	//数据总量
            callbacks: function(num){  //回调函数
                //alert("123");
            }
        },options || {});
        ms.createHtml(this,ops);
        ms.addEvent(this,ops);
    }

    var ms = {
        createHtml: function(obj,ops){
            obj.empty(); //清空当前对象
            //生成HTML代码补全

            //获取最大页码
            var pageCount = Math.ceil(ops.count/ops.pageSize); //Math.ceil() 向上取整

            //输出上一页
            if (ops.current > 1) {
                obj.append('<a href="javascript:;" class="prev">' +ops.prev+ '</a>');
            } else {
                obj.append('<span class="currentPrev">' +ops.prev+ '</span>');
            }

            //输出第一页
            //输出第一页的条件
            /*如果当前页不是第一页而且当前页大于等于4，而且总页数不等于4*/
            if (ops.current != 1 && ops.current >= 4 && pageCount != 4) {
                obj.append('<a href="javascript:;" class="number">' + 1 + '</a>');
            }

            //输出第一个省略号...
            /*如果当前页大于等于4而且当前页小于等于总页数，而且总页数大于5*/
            if (ops.current >4 && ops.current <= pageCount && pageCount > 5) {
                obj.append('<span>...</span>');
            }

            //输出数字
            /*声明开始与结束*/
            var start = ops.current - 2, //开始等于当前页减去2
                end = ops.current + 2; //结束等于当前页加上2

            //判断第一页默认显示4个页码
            /*（如果start大于1而且当前页小于4），或者当前页等于1*/
            if ((start > 1 && ops.current < 4) || ops.current == 1) {
                end++;
            }

            //
            /*如果当前页大于总页数减去4，而且当前页大于等于总页数*/
            if (ops.current > pageCount - 4 && ops.current >= pageCount) {
                start--;
            }
            /*不定义变量，判断start与end的大小*/
            for (; start <= end; start++) {
                if (start <= pageCount && start >= 1) {
                    if (start != ops.current) {
                        obj.append('<a href="javascript:;" class="number">' + start + '</a>');
                    } else {
                        obj.append('<span class="current">' + start + '</span>');
                    }
                }
            }

            //输出第二个省略号
            /*如果当前页不等于总页数，而且当前页小于等于总页数减去4，而且总页数大于5*/
            if (ops.current != pageCount && ops.current <= pageCount - 4 && pageCount > 5) {
                obj.append('<span>...</span>');
            }

            //输出最后一页
            //输出最后一页的条件
            /*如果当前页不等于页面总页数，而且当前页小于总页数减去2，而且总页数大于4*/
            if (ops.current != pageCount && ops.current < pageCount - 2 && pageCount > 4) {
                obj.append('<a href="javascript:;" class="number">' + pageCount + '</a>');
            }

            /*输出下一页，当前页小于总页数*/
            if (ops.current < pageCount) {
                obj.append('<a href="javascript:;" class="next">' +ops.next+ '</a>');
            } else {
                obj.append('<span class="currentNext">' +ops.next+ '</span>');
            }


        },


        /*绑定事件*/
        addEvent:function(obj,ops){
            obj.unbind("click");
            obj.on("click", "a.number",function() {
                    //alert(1);
                    var curNum = parseInt($(this).text());
                    ops.current = curNum;
                    ms.createHtml(obj, ops);
                    ops.callbacks(ops.current);
                    pageNumber(parseInt(ops.current));
                })
                .on("click", "a.prev",
                    function() {
                        var curNum = parseInt(obj.children("span.current").text());
                        ops.current = curNum-1;
                        ms.createHtml(obj, ops);
                        ops.callbacks(ops.current);
                        pageNumber(parseInt(ops.current));
                    })
                .on("click", "a.next",
                    function() {
                        var curNum = parseInt(obj.children("span.current").text());
                        ops.current = curNum+1;
                        ms.createHtml(obj, ops);
                        ops.callbacks(ops.current);
                        pageNumber(parseInt(ops.current));
                    });
        },

    }
}