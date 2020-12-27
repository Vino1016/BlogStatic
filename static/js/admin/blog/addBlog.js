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
		toc : true,
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
layui.use('upload', function(){
	var upload = layui.upload
		, $ = layui.jquery;
	var uploadInst = upload.render({
		elem: '#upload1' //绑定元素
		,url: '/upload/img' //上传接口
		,before: function(obj){
			//预读本地文件示例，不支持ie8
			obj.preview(function(index, file, result){
				$('#demo1').attr('src', result); //图片链接（base64）
			});
		}
		,done: function(res){
			//如果上传失败
			if(res.code > 0){
				return layer.msg('上传失败');
			}
			//上传成功
			layer.msg("成功上传至七牛云："+res.url);
			document.getElementById("imgUrl").value = res.url;
		}
		,error: function(){
			//演示失败状态，并实现重传
			var demoText = $('#demoText');
			demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
			demoText.find('.demo-reload').on('click', function(){
				uploadInst.upload();
			});
		}
	});
});

