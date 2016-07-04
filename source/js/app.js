function preloader() {
    var preloader_stat = $("#preloader-svg__percentage"),
        hasImageProperties = ["background", "backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"],
        hasImageAttributes = ["srcset"],
        match_url = /url\(\s*(['"]?)(.*?)\1\s*\)/g,
        all_images = [],
        total = 0,
        count = 0;

	var circle_o = $("#preloader-svg__svg .bar__outer"),
        circle_c = $("#preloader-svg__svg .bar__center"),
        circle_i = $("#preloader-svg__svg .bar__inner"),
        length_o = Math.PI*(circle_o.attr("r") * 2),
        length_c = Math.PI*(circle_c.attr("r") * 2),
        length_i = Math.PI*(circle_i.attr("r") * 2);

	function img_loaded(){
        var percentage = Math.ceil( ++count / total * 100 );

		percentage = percentage > 100 ? 100 : percentage;

        // Draw offsets
        // Start 1st line
        circle_o.css({strokeDashoffset: ((100-percentage)/100)*length_o });

        // When to start 2nd line
        if(percentage > 50) {
            circle_c.css({strokeDashoffset: ((100-percentage)/100)*length_c });
        }

        // When to start 3rd line
        if(percentage == 100) {
            circle_i.css({strokeDashoffset: ((100-percentage)/100)*length_i });
        }

		$('.bar__text').html(percentage);

		if(count === total) return done_loading();
    }

	function done_loading(){
        $("#preloader").delay(700).fadeOut(700, function(){
            $("#preloader__progress").remove();

			if($(".flip-card").length){
                $(".flip-card").addClass("loaded");
            }
        });
    }

	function images_loop () {
        setTimeout(function () {
            var test_image = new Image();

			test_image.onload = img_loaded;
            test_image.onerror = img_loaded;

			if (count != total) {
                if (all_images[count].srcset) {
                    test_image.srcset = all_images[count].srcset;
                }
                test_image.src = all_images[count].src;

				images_loop();
            }
        }, 50);
    }

    // Get all images
    $("*").each(function () {
        var element = $(this);

		if (element.is("img") && element.attr("src")) {
            all_images.push({
                src: element.attr("src"),
                element: element[0]
            });
        }

		$.each(hasImageProperties, function (i, property) {
            var propertyValue = element.css(property);
            var match;

			if (!propertyValue) {
                return true;
            }

			match = match_url.exec(propertyValue);

			if (match) {
                all_images.push({
                    src: match[2],
                    element: element[0]
                });
            }
        });

		$.each(hasImageAttributes, function (i, attribute) {
            var attributeValue = element.attr(attribute);

			if (!attributeValue) {
                return true;
            }

			all_images.push({
                src: element.attr("src"),
                srcset: element.attr("srcset"),
                element: element[0]
            });
        });
    });

	total = all_images.length;

    // Start preloader or exit
    if (total === 0) {
        done_loading();
    } else {
        preloader_stat.css({opacity: 1});
        images_loop();
    }

}

preloader();


$('#toggle').click(function() {
    $(this).toggleClass('active');
    $('#overlay').toggleClass('open');
});

$('.js-flip').on('click', function(e) {

    $('.flip-container').toggleClass('flip');
    $('.transparent-btn').toggle();

});

$(document).ready(function() {

    if ($('.js-slider').length) {

        slider();

    }

    if ($('.js-blog__link').length) {

        if (window.location.hash) {

            showSection(window.location.hash, false);

        }

        $('.js-blog__link').on('click', function (e) {

            e.preventDefault();
            showSection($(this).attr('href'), true);

        });
    }

    if($('.js-blog__link').length && $(window).width() < 768) {

        (function () {
            var
                body = $('body'),
                sidebar = $('#js-sidebar-container'),
                touchStartX = 0,
                touchEndX = 0,
                threshold = 100;

            body.on('touchstart', function (event) {
                if ($(window).width() >= 1200)
                    return;

                var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

                touchStartX = touch.pageX;
            });

            body.on('touchend', function (event) {
                if ($(window).width() >= 1200)
                    return;

                var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

                touchEndX = touch.pageX;

                if (touchEndX - touchStartX > threshold && !sidebar.hasClass('left__col--open'))
                    sidebar.addClass('left__col--open');
                else if (touchEndX - touchStartX < -threshold && sidebar.hasClass('left__col--open'))
                    sidebar.removeClass('left__col--open');
            });
        }())

    }


    if($('.parallax').length) {

        var layer = $('.parallax').find('.parallax__layer');
        var width = window.innerWidth + 100;

        layer.map(function (key, value) {
            $(value).css({
                'width' : width + 'px',
                'margin-left': -(width / 2) + 'px'
            })
        });
        parallax();
    }

    if($('.blur-bg').length) {

        setBlur();
    }

    if ($('.header__arrow').length) {

        $('.header__arrow').on('click', function (e) {
            e.preventDefault();

            var eHeight = $(window).height();

            $('body, html').animate({scrollTop: eHeight}, 1000);
        })

    }

    if ($('.contact__arrow').length) {
        $('.contact__arrow').on('click', function (e) {
            e.preventDefault();

            $('body, html').animate({scrollTop: 0}, 1000);
        })
    }

});

$(window).resize(function () {

    if($('.blur-bg').length) {

        setBlur();

    }

});

$(window).scroll(function() {

    var wScroll = $(window).scrollTop();

    (function(){

        var
            bg = $('.header__bg'),
            user = $('.header__wrap');

        slideIt(bg, -wScroll / 45);
        slideIt(user, wScroll / 5);

        function slideIt(block, strafeAmount) {
            var strafe = -strafeAmount + '%',
                transformString = 'translate3d(0, ' + strafe + ',0)';

            block.css({
                'transform' : transformString
            });
        }
    }());

    if($('.static').length && $(window).width() > 768) {

        var
            menu = $('.static .blog__tabs'),
            sidebar = $('.static .menu__wrapper '),
            stickyStart = sidebar.offset().top,
            menuClone = sidebar.clone(),
            fixedSidebar = $('.fixed .left__col');

        if (wScroll >= stickyStart) {

            if (!fixedSidebar.find('.menu__wrapper').length) {
                fixedSidebar.append(menuClone);
                menu.hide();
            }


        } else {
            fixedSidebar.find('.menu__wrapper').remove();
            menu.show();
        }

        checkSection();

    }

});

function checkSection() {
    $('.article').each(function () {
        var
            wScroll = $(window).scrollTop(),
            $this = $(this),
            topEdge = $this.offset().top - 200,
            bottomEdge = topEdge + $this.height();

        if (topEdge < wScroll && bottomEdge > wScroll) {

            var
                curredId = $this.data('section'),
                reqLink = $('.blog__subtitle').filter('[href="#' + curredId + '"]');

            reqLink.closest('.blog__item').addClass('blog__item--active')
                .siblings().removeClass('blog__item--active');

            window.location.hash = curredId;
        }
    })
}

function showSection(section, isAnimate) {
    var
        direction = section.replace(/#/, ''),
        reqSection = $('.article').filter('[data-section="' + direction + '"]'),
        reqSectionPos = reqSection.offset().top;

    if (isAnimate) {
        $('body, html').animate({scrollTop: reqSectionPos}, 500);
    } else {
        $('body, html').scrollTop(reqSectionPos);
    }
}

function setBlur() {
    var
        imgWidth = $('.blur-bg').width(),
        blur = $('.contact__form-blurred'),
        blurSection = $('.works-bottom'),
        posTop = blurSection.offset().top - blur.offset().top,
        posLeft = blurSection.offset().left - blur.offset().left;

    blur.css({
        'background-size' : imgWidth + 'px' + ' ' + 'auto',
        'background-position' : posLeft + 'px' + ' ' + posTop + 'px'
    })
}

function parallax() {

    var layer = $('.parallax').find('.parallax__layer');

    $(window).on('mousemove', function (e) {
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var w = (window.innerWidth / 2) - mouseX;
        var h = (window.innerHeight / 2) - mouseY;


        layer.map(function (key, value) {
            var bottomPosition = (window.innerHeight / 2) * (key / 100);
            var widthPosition = w * (key / 100);
            var heightPosition = h * (key / 100);
            $(value).css({
                'bottom' : '-' + bottomPosition + 'px',
                'transform' : 'translate3d(' + widthPosition + 'px, ' + heightPosition + 'px, 0)'
            });
        });

    });

}


// google map

if ($('#map').length) {

    google.maps.event.addDomListener(window, 'load', init);

    function init() {
        var mapOptions = {
            zoom: 15,

            center: new google.maps.LatLng(48.0043666, 37.80217409), // New York

            styles: [{
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"}, {"color": "#e0efef"}]
            }, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"}, {"hue": "#1900ff"}, {"color": "#c0e8e8"}]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"lightness": 100}, {"visibility": "simplified"}]
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{"visibility": "on"}, {"lightness": 700}]
            }, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#7dcdcd"}]}]
        };
        var mapElement = document.getElementById('map');

        var map = new google.maps.Map(mapElement, mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(40.6700, -73.9400),
            map: map,
            title: 'Snazzy!'
        });
    }
}

if ($('#map').length) {

    google.maps.event.addDomListener(window, 'load', init);

    function init() {
        var mapOptions = {
            zoom: 15,

            center: new google.maps.LatLng(48.0043666, 37.80217409), // New York

            styles: [{
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"}, {"color": "#e0efef"}]
            }, {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [{"visibility": "on"}, {"hue": "#1900ff"}, {"color": "#c0e8e8"}]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"lightness": 100}, {"visibility": "simplified"}]
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }, {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{"visibility": "on"}, {"lightness": 700}]
            }, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#7dcdcd"}]}]
        };
        var mapElement = document.getElementById('map');

        var map = new google.maps.Map(mapElement, mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(40.6700, -73.9400),
            map: map,
            title: 'Snazzy!'
        });
    }
}

// slider

function slider() {
    //noinspection JSDuplicatedDeclaration
    var
        slider = $('.js-slider'),
    // Инфа
        image = slider.find('.js-slider__slide-image'),
        name = slider.find('.js-slider__slide-name'),
        description = slider.find('.js-slider__slide-description'),
        link = slider.find('.js-slider__slide-link'),
    // Кнопки
        prevButton = slider.find('.js-slider__prev'),
        prevButtonImageCurrent = prevButton.find('.js-slider__control-image_current'),
        prevButtonImageNext = prevButton.find('.js-slider__control-image_next'),
        nextButton = slider.find('.js-slider__next'),
        nextButtonImageCurrent = nextButton.find('.js-slider__control-image_current'),
        nextButtonImageNext = nextButton.find('.js-slider__control-image_next'),
    // Слайды
        items = slider.find('.js-slider__item'),
        current = 0,
        currentSlideItem,
        prevSlideItem,
        nextSlideItem;

    function validate(num) {
        var result;

        if (num < 0)
            result = items.length - 1;
        else if (num > items.length - 1)
            result = 0;
        else
            result = num;

        return result;
    }

    function calcSlides() {
        var
            prev = validate(current - 1),
            next = validate(current + 1);

        currentSlideItem = items.eq(current);
        prevSlideItem = items.eq(prev);
        nextSlideItem = items.eq(next);
    }

    function init() {
        calcSlides();

        changeSlide();
    }

    function changeBackground(elem, background) {
        elem.css('background-image', 'url("' + background + '")');

        return elem;
    }

    function changeSlideControl(next, current, background, direction) {
        if (direction) {
            next.css('top', '100%')
        }

        changeBackground(next, background).animate({
            top: '0%'
        }, function () {
            $(this).css('top', direction ? '100%' : '-100%');
        });

        current.animate({
            top: direction ? '-100%' : '100%'
        }, function () {
            changeBackground($(this), background).css('top', '0');
        });
    }

    function textChange(elem, text, animationName) {
        var
            letters = text.split(''),
            str = '<span style="display: inline-block;">',
            animationDelay = 0;

        letters.forEach(function (letter, id) {
            animationDelay++;

            if (letter === ' ') {
                str += '&nbsp;</span><span style="display: inline-block;">';
            } else {
                str += '<span id="letter-' + id + '" class="' + animationName
                    + '" style="display: inline-block; animation-delay:'
                    + animationDelay / 20
                    + 's">'
                    + letter
                    + '</span>';
            }

        });
        str += '</span>';
        elem.html(str);
    }

    function changeSlide() {
        // Смена главного изображения
        image.fadeOut(300, function () {
            changeBackground($(this), currentSlideItem.data('img')).fadeIn();
        });

        // Смена текста
        textChange(name, currentSlideItem.data('name'), 'bounceIn');
        textChange(description, currentSlideItem.data('description'), 'bounceIn');
        link.attr('href', currentSlideItem.data('link'));

        // Смена слайдов в контролах
        changeSlideControl(prevButtonImageNext, prevButtonImageCurrent, prevSlideItem.data('img'));
        changeSlideControl(nextButtonImageNext, nextButtonImageCurrent, nextSlideItem.data('img'), true);
    }

    function nextSlide() {
        current = validate(++current);
        calcSlides();
        slider.trigger('changeSlide');
    }

    function prevSlide() {
        current = validate(--current);
        calcSlides();
        slider.trigger('changeSlide');
    }

    $(window).load(init);
    slider.on('changeSlide', changeSlide);
    nextButton.click(nextSlide);
    prevButton.click(prevSlide);
};
