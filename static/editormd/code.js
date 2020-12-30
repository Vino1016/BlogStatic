var testEditor;
$(function () {
    testEditor = editormd.markdownToHTML("doc-content", {//注意：这里是上面DIV的id
        htmlDecode: "style,script,iframe",
        //saveHTMLToTextarea : true,
        //markdownSourceCode :true,
        emoji: true,
        taskList: true,
        toc : true,
        //tocm : true,
        tocDropdown : false,
        tocContainer : "#toc-content",
        tex: true, // 默认不解析
        flowChart: true, // 默认不解析
        sequenceDiagram: true, // 默认不解析
        codeFold: true,
    });});
// 代码块功能依赖
$(function () {
    $('pre').wrap('<div class="code-area" style="position: relative"></div>');
    var $highlight_lang = $('<div class="code_lang" title="代码语言"></div>');

    $('code').before($highlight_lang);
    $('code').each(function () {
        var code_language = $(this).attr('class');

        if (!code_language) {
            return true;
        };
        var lang_name = code_language.replace("line-numbers", "").trim().replace("lang-", "").trim();

        // 首字母大写
        lang_name = lang_name.toUpperCase();

        $(this).siblings(".code_lang").text(lang_name);
    });

    var $code_expand = $('<i class="fa fa-angle-up code-expand" aria-hidden="true"></i>');

    $('.code-area').prepend($code_expand);
    $('.code-expand').on('click', function () {
        if ($(this).parent().hasClass('code-closed')) {
            $(this).siblings('pre').find('code').show();
            $(this).parent().removeClass('code-closed');
        } else {
            $(this).siblings('pre').find('code').hide();
            $(this).parent().addClass('code-closed');
        }
    });
});
