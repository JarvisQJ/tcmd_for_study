var table;//当前表格对象
$(document).ready(function () {
    //初始化表格，采用本地模式（数据一次性加载，本地检索，针对少量数据）
    table = $('#dataTables').DataTable({
        dom: dtConfig.dom,
        language: dtConfig.language,
        order: [2, "desc"],//默认排序
        columns: [
            { data: "realName" },
            { data: "phoneNo" },
            {
                data: "createTime",
                render: function (data, type, row, meta) {
                    return data.toString().ToDate().ToString("yyyy-MM-dd HH:mm:ss");
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    // console.log('data:',data)
                    var _html = [];
                    // _html.push("<a href=\"tcmtViewPage?id={0}\" class=\"btn btn-link btn-xs\">查看</a>".Format(data));
                    // _html.push("<a href=\"tcmtEditPage?id={0}\" class=\"btn btn-link btn-xs\">修改</a>".Format(data));
                    // _html.push("<button class=\"btn btn-link btn-xs\" onclick=\"roleDelete({0})\">删除</button>".Format(data));
                    return _html.join("");
                }
            }
        ],
        ajax: {
            url: "",
            dataSrc: "data"
        }
    });

    //搜索
    $("#btnSearch").click(function () {
        table.search($("#txtSearch").val()).draw();
    });
});
