window.onload = function () {
    NProgress.done();
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
};
$(".navbar-fixed").headroom();
var _hmt = _hmt || [];
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?03ea8f3076b99ecf2b538efbb568c569";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
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
        "opacityDefault": 0.7,
        "opacityOnHover": 0.2
    }
});

$(function () {
    /*菜单切换*/
    $('.sidenav').sidenav();
    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100
    });

    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        $('.content').css('min-height', window.innerHeight - 165);
    };
    $(".trigger").click(function() {
        $(".menu").toggleClass("active");
        if ($('#open').is(':hidden')) {
            $('#open').show(500);
            $('#close').hide(500);
        }else {
            $('#close').show(500);
            $('#open').hide(500);
        }
    });
    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixFooterPosition();
    };
    fixStyles();
    /*文章内容详情的一些初始化特性*/
    let articleInit = function () {

        $('#articleContent img').each(function () {
            let imgPath = $(this).attr('src');
            $(this).wrap('<div class="img-item" data-src="' + imgPath + '" data-sub-html=".caption"></div>');
            // 图片添加阴影
            $(this).addClass("img-shadow img-margin");

        });
        // progress bar init
        const progressElement = window.document.querySelector('.progress-bar');
        if (progressElement) {
            new ScrollProgress((x, y) => {
                progressElement.style.width = y * 100 + '%';
            });
        }
    };
    articleInit();
    $('.modal').modal();
    $('#backTop').click(function () {
        $('body,html').animate({scrollTop: 0}, 600);
        return false;
    });
    $('#toComment').click(function () {
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

    function siteTime() {
        var seconds = 1000;
        var minutes = seconds * 60;
        var hours = minutes * 60;
        var days = hours * 24;
        var years = days * 365;
        var today = new Date();
        var startYear = "2020";
        var startMonth = "11";
        var startDate = "20";
        var startHour = "0";
        var startMinute = "0";
        var startSecond = "0";
        var todayYear = today.getFullYear();
        var todayMonth = today.getMonth() + 1;
        var todayDate = today.getDate();
        var todayHour = today.getHours();
        var todayMinute = today.getMinutes();
        var todaySecond = today.getSeconds();
        var t1 = Date.UTC(startYear, startMonth, startDate, startHour, startMinute, startSecond);
        var t2 = Date.UTC(todayYear, todayMonth, todayDate, todayHour, todayMinute, todaySecond);
        var diff = t2 - t1;
        var diffYears = Math.floor(diff / years);
        var diffDays = Math.floor((diff / days) - diffYears * 365);
        var diffHours = Math.floor((diff - (diffYears * 365 + diffDays) * days) / hours);
        var diffMinutes = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours) /
            minutes);
        var diffSeconds = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours -
            diffMinutes * minutes) / seconds);
        if (startYear == todayYear) {
            document.getElementById("year").innerHTML = todayYear;
            document.getElementById("sitetime").innerHTML = ":）本站已运行 " + diffDays + " 天 " + diffHours +
                " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒";
        } else {
            document.getElementById("year").innerHTML = startYear + " - " + todayYear;
            document.getElementById("sitetime").innerHTML = ":）本站已运行 " + diffYears + " 年 " + diffDays +
                " 天 " + diffHours + " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒";
        }
    }
    setInterval(siteTime, 1000);
});
