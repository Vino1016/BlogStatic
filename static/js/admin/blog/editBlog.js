var testEditor;
$(function() {
    testEditor = editormd("blog-content", {
        width : "100%",
        height : 500,
        syncScrolling : "single",
        path : "/editormd/lib/",
        saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
        // [TOCM]  [TOC] 自动生成目录
        tocm : true,
        tocContainer : "",
        tocDropdown   : false,
        tocStartLevel : 1,     // Parse beginning of H2, Default value 1
        emoji: true,
        tex : true,                   // 开启科学公式TeX语言支持，默认关闭
        flowChart : true,             // 开启流程图支持，默认关闭
        sequenceDiagram : true,
        toolbarModes: 'full',
        // 开启时序/序列图支持，默认关闭,
        //图片上传
        imageUpload : true,
        imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL : "/admin/addblog/file/upload",
        onload : function() {
            console.log('onload', this);
        },
    });
});

$('.ui.checkbox')
    .checkbox()
;
$('select.dropdown')
    .dropdown()
;

