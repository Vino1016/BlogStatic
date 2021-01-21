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

    var $code_expand = $('<i class="fas fa-angle-double-up code-expand" title="代码折叠" aria-hidden="true"></i>');

    $('.code-area').prepend($code_expand);
    $('.code-expand').on('click', function () {
        if ($(this).parent().hasClass('code-closed')) {
            $(this).siblings('pre').find('code').show(500);
            $(this).parent().removeClass('code-closed');
        } else {
            $(this).siblings('pre').find('code').hide(500);
            $(this).parent().addClass('code-closed');
        }
    });
});

$(function () {
    var $copyIcon = $('<i class="fas fa-copy code_copy" title="复制代码" aria-hidden="true"></i>')
    var $notice = $('<div class="codecopy_notice"></div>')
    $('.code-area').prepend($copyIcon)
    $('.code-area').prepend($notice)
    // “复制成功”字出现
    function copy(text, ctx) {
        if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            try {
                document.execCommand('copy') // Security exception may be thrown by some browsers.
                $(ctx).prev('.codecopy_notice')
                    .text("复制成功")
                    .animate({
                        opacity: 1,
                        top: 30
                    }, 450, function () {
                        setTimeout(function () {
                            $(ctx).prev('.codecopy_notice').animate({
                                opacity: 0,
                                top: 0
                            }, 650)
                        }, 400)
                    })
            } catch (ex) {
                $(ctx).prev('.codecopy_notice')
                    .text("复制失败")
                    .animate({
                        opacity: 1,
                        top: 30
                    }, 650, function () {
                        setTimeout(function () {
                            $(ctx).prev('.codecopy_notice').animate({
                                opacity: 0,
                                top: 0
                            }, 650)
                        }, 400)
                    })
                return false
            }
        } else {
            $(ctx).prev('.codecopy_notice').text("浏览器不支持复制")
        }
    }
    // 复制
    $('.code-area .fa-copy').on('click', function () {
        var selection = window.getSelection()
        var range = document.createRange()
        range.selectNodeContents($(this).siblings('pre').find('ol')[0])
        selection.removeAllRanges()
        selection.addRange(range)
        var text = selection.toString()
        copy(text, this)
        selection.removeAllRanges()
    })
});
