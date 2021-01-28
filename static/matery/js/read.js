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

    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixFooterPosition();
    };
    fixStyles();
    $(window).scroll(function () {
        let scroll = $(window).scrollTop();
        if (scroll > 1250)
            $('#categoryandsearch').addClass('fixed');
        else
            $('#categoryandsearch').removeClass('fixed');
    });


    /*文章内容详情的一些初始化特性*/
    let articleInit = function () {
        $('#articleContent a').attr('target', '_blank');

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


/*    $(window).scroll(function () {
        let scroll = $(window).scrollTop();
        if (scroll > 100){
            $('.navbar-fixed').addClass('headerHide')

        }
        else {
            $('.navbar-fixed').addClass('headerShow')
            $('.navbar-fixed').removeClass('headerHide');
        }
    });*/

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
            $nav.addClass('headerShow');
            $nav.removeClass('headerHide');
            $backTop.slideUp(300);
        } else {
            $nav.addClass('headerHide');
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
            document.getElementById("sitetime").innerHTML = "本站已安全运行 " + diffDays + " 天 " + diffHours +
                " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒";
        } else {
            document.getElementById("year").innerHTML = startYear + " - " + todayYear;
            document.getElementById("sitetime").innerHTML = "本站已安全运行 " + diffYears + " 年 " + diffDays +
                " 天 " + diffHours + " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒";
        }
    }
    setInterval(siteTime, 1000);
});
