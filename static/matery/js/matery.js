//检查当前主题模式和图标是否对应
function checkNightMode() {
    if (localStorage.getItem('isDark') === '1') {
        $("body").addClass("DarkMode");
        $('#changeMode-top').removeClass("fa-moon").addClass("fa-sun");
        $('#modeicon').attr("xlink:href", "#icon-sun");
    } else if(localStorage.getItem('isDark') === '0'){
        $('#modeicon').attr("xlink:href", "#icon-moon");
    } else if (new Date().getHours() >= 20 || new Date().getHours() < 7)
    {
        $("body").addClass("DarkMode");
        $('#changeMode-top').removeClass("fa-moon").addClass("fa-sun");
        $('#modeicon').attr("xlink:href", "#icon-sun");
    } else if (matchMedia('(prefers-color-scheme: dark)').matches) {
        $("body").addClass("DarkMode");
        $('#changeMode-top').removeClass("fa-moon").addClass("fa-sun");
        $('#modeicon').attr("xlink:href", "#icon-sun");
    }else{
        $('#modeicon').attr("xlink:href", "#icon-moon");
    }
}
checkNightMode();
$(function () {
    /*菜单切换*/
    $('.sidenav').sidenav();
    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100
    });
    var _hmt = _hmt || [];
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?03ea8f3076b99ecf2b538efbb568c569";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
    setTimeout(function(){
        var OriginTitile = document.title;
        var titleTime;
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                $('[rel="shortcut icon"]').attr('href', "https://cdn.vino.run/Vino.ico");
                document.title = '(●—●)喔哟，崩溃啦！';
                clearTimeout(titleTime);
            }
            else {
                $('[rel="shortcut icon"]').attr('href', "https://cdn.vino.run/Vino.ico");
                document.title = '(/≧▽≦/)咦！又好了！' + OriginTitile;
                titleTime = setTimeout(function () {
                    document.title = OriginTitile;
                }, 2000);
            }
        });
        var starTime = '2020-11-20';
        var endTime = (new Date()).Format("yyyy-MM-dd");
        function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
            var dateSpan,
                tempDate,
                iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays
        };
        var Days = datedifference(starTime,endTime);
        document.getElementById("runningTime").innerHTML = Days + " days";
    },100);

    setTimeout(function(){
        var starTime = '2020-11-20';
        var endTime = (new Date()).Format("yyyy-MM-dd");
        function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
            var dateSpan,
                tempDate,
                iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays
        };
        var Days = datedifference(starTime,endTime);
        document.getElementById("runningTime").innerHTML = Days + " days";
    },100);
    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        $('.content').css('min-height', window.innerHeight - 165);
    };
    $('#sliderV').click(function(){
        if($('#commentArea1').is(':hidden')){
            $('#commentArea1').fadeIn(400);
        } else{
            $('#commentArea1').fadeOut(400);
        }
        if($('#commentArea2').is(':hidden')){
            $('#commentArea2').slideDown(400);
        } else{
            $('#commentArea2').slideUp(400);
        }
    });
    $(".menu-V .toggle").on("click", (function() {
        $(".menu-V").toggleClass("expanded"),
        $(".menu-V a").toggleClass("hidden"),
        $(".menu-V .container-M , .toggle").toggleClass("close")
    }));
    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixFooterPosition();
    };
    fixStyles();
    /*文章内容详情的一些初始化特性*/
    $('.modal').modal();
    $('#backTop').click(function () {
        $('body,html').animate({scrollTop: 0}, 600);
        return false;
    });
    $('#backTop-V').click(function () {
        $('body,html').animate({scrollTop: 0}, 600);
        return false;
    });
    $('#toComment').click(function () {
        let valOfScroll =$('#comment').offset().top-190;
        //让滚轴从当前位置的scroll在600毫秒内偏移到位置为valOfScroll。
        $("html,body").animate({scrollTop: valOfScroll}, 600)
    });
    $('#toComment-m').click(function () {
        let valOfScroll =$('#comment').offset().top-190;
        //让滚轴从当前位置的scroll在600毫秒内偏移到位置为valOfScroll。
        $("html,body").animate({scrollTop: valOfScroll}, 600)
    });



    //监听滚动条位置
    let $nav = $('#headNav');
    let $backTop = $('.top-scroll');
    // 当页面处于文章中部的时候刷新页面，因为此时无滚动，所以需要判断位置,给导航加上绿色。
    showOrHideNavBg($(window).scrollTop());
    $(window).scroll(function () {
        /* 回到顶部按钮根据滚动条的位置的显示和隐藏.*/
        let scroll = $(window).scrollTop();
        showOrHideNavBg(scroll);
    });


    function showOrHideNavBg(position) {
        let showPosition = 100;
        if (position < showPosition) {
            $nav.addClass('nav-transparent');
            $backTop.slideUp(300);
        } else {
            $nav.removeClass('nav-transparent');
            $backTop.slideDown(300);
        }
    }
	$(".nav-menu>li").hover(function(){
		$(this).children('ul').stop(true,true).show();
		 $(this).addClass('nav-show').siblings('li').removeClass('nav-show');
		
	},function(){
		$(this).children('ul').stop(true,true).hide();
		$('.nav-item.nav-show').removeClass('nav-show');
	})
	
    $('.m-nav-item>a').on('click',function(){
            if ($(this).next('ul').css('display') == "none") {
                $('.m-nav-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(100);
                $(this).parent('li').addClass('m-nav-show').siblings('li').removeClass('m-nav-show');
            }else{
                $(this).next('ul').slideUp(100);
                $('.m-nav-item.m-nav-show').removeClass('m-nav-show');
            }
    });

    // 初始化加载 tooltipped.
    $('.tooltipped').tooltip();


    Date.prototype.Format = function(fmt)
    { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
});
L2Dwidget.init({
    "model": {
        jsonPath: "https://cdn.jsdelivr.net/gh/xiazeyu/live2d-widget-models/packages/live2d-widget-model-tororo/assets/tororo.model.json",
        "scale": 1
    },
    "display": {
        "position": "left",
        "width": 150,
        "height": 300,
        "hOffset": 0,
        "vOffset": -20
    },
    "mobile": {
        "show": false,
        "scale": 0.5
    },
    "react": {
        "opacityDefault": 0.85,
        "opacityOnHover": 0.2
    }
});
function switchNightMode() {
    $('<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"></div></div>').appendTo($("body")), setTimeout(
        function () {
            (!$("body").hasClass("DarkMode")) ? ($("body").addClass("DarkMode"), localStorage.setItem('isDark','1'), $('#changeMode-top').removeClass("fa-moon").addClass("fa-sun"),$('#modeicon').attr("xlink:href", "#icon-sun")) : ($("body").removeClass(
                "DarkMode"), localStorage.setItem('isDark','0'), $('#changeMode-top').removeClass("fa-sun").addClass("fa-moon"),$('#modeicon').attr("xlink:href", "#icon-moon")), setTimeout(function () {
                $(".Cuteen_DarkSky").fadeOut(1e3, function () {
                    $(this).remove()
                })
            }, 2e3)
        }), 50
}
function switchNightModeTop() {
    if ($("body").hasClass("DarkMode")){
        $("body").removeClass("DarkMode");
        localStorage.setItem('isDark','0');
        $('#changeMode-top').removeClass("fa-sun").addClass("fa-moon");
        $('#modeicon').attr("xlink:href", "#icon-moon");
    }else {
        $("body").addClass("DarkMode");
        localStorage.setItem('isDark','1');
        $('#changeMode-top').removeClass("fa-moon").addClass("fa-sun");
        $('#modeicon').attr("xlink:href", "#icon-sun");
    }
}
