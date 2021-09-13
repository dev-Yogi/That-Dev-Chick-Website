$(function () {

    /* =========================================
     * tooltip
     *  =======================================*/

    $('.customer img').tooltip();

    //progress bar

    
var stringRandom = (function() {

    var data = {
        isScrolling : false,
        repeat : 0,
        target : [],
        letters : '*+-/@_$[%£!XO1&>',
        originalStrings : '',
        singleLetters : []
    }

    Array.prototype.shuffle = function() {
        var input = this;
         
        for (var i = input.length-1; i >=0; i--) {
         
            var randomIndex = Math.floor(Math.random()*(i+1)); 
            var itemAtIndex = input[randomIndex]; 
             
            input[randomIndex] = input[i]; 
            input[i] = itemAtIndex;
        }
        return input;
    }

    function checkLength(x) {
        return Array.from(document.querySelectorAll(x)).length > 0;
    }

    function addListener(evt, fx) {
        window.addEventListener(evt, fx);    
    }

    function changeLetter(letter) {
        if(letter.textContent != ' ') {
            letter.classList.add('is-changing');
            letter.style.animationDuration = Math.random().toFixed(2) + 's';
            
            var newChar = data.letters.substr( Math.random() * data.letters.length, 1);

            letter.textContent = newChar;
            letter.setAttribute('data-txt', newChar);
        }
    }

    function resetLetter(letter, value) {
            letter.classList.remove('is-changing');
            letter.textContent = value;
            letter.setAttribute('data-txt', value);
    }


    // divide le singole lettere delle stringhe e le wrappa in span
    function divideLetters() {

        data.target.forEach( (element, index) => {
            
            var text = element.textContent;
            var textDivided = '';

            data.originalStrings = text;

            for(var i = 0; i < text.length; i++) {
                textDivided += `<span class="el-sp el-st-${index}-span-${i}" data-txt="${text.substr(i, 1)}">${text.substr(i, 1)}</span>`;
            }

            element.innerHTML = textDivided;
        }); 
        data.singleLetters = document.querySelectorAll('.el-sp');
    }

    // changes letters
    function changeLetters() {
        if(data.isScrolling) {
            data.singleLetters.forEach(function(el, index){
                changeLetter(el);
            });
        }

        setTimeout(changeLetters, 10);
    }

    // reset to initial letters
    function resetLetters() {

        var randomArray = [];  
        for(var i = 0; i < data.singleLetters.length;i++) {
            randomArray.push(i);
        }

        randomArray.shuffle();

        randomArray.forEach(function(el, index){

            setTimeout(function(){
                resetLetter(data.singleLetters[el], data.originalStrings.substring(el, el + 1));
            }, (index * 20 * (Math.random() * 5))).toFixed(2);
                
        });
    }

    // event listener sullo scroll
    function updateScrollState() {
        clearTimeout(delay);
        data.isScrolling = true;
        
        var delay = setTimeout(function() {
            data.isScrolling = false;
            resetLetters();
        }, 300);
    };

    return {
        init: function(selector){

            // controllo che ci siano stringhe su cui agire
            if(checkLength(selector)) {

                // salvo le stringhe
                data.target = Array.from(document.querySelectorAll(selector));
                
                // divido le singole stringhe in lettere
                divideLetters();

                // lancio la funzione che si ripete
                changeLetters();

                // aggiungo il listener allo scroll
                addListener('scroll', updateScrollState);

            }
        }
    }

})();

stringRandom.init('.el-st');


    /* =========================================
     * counters
     *  =======================================*/

    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    /* =================================================
     * Preventing URL update on navigation link click
     *  ==============================================*/

    $('.link-scroll').on('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 1000);
        e.preventDefault();
    });


    /* =========================================
     *  Scroll Spy
     *  =======================================*/

    $('body').scrollspy({
        target: '#navbarcollapse',
        offset: 80
    });


    /* =========================================
     * testimonial slider
     *  =======================================*/

    $(".testimonials").owlCarousel({
        nav: false,
        dots: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    /* =========================================
     * Leflet map
     *  =======================================*/
    map();


    /* =========================================
     * parallax
     *  =======================================*/
    $(window).scroll(function () {

        var scroll = $(this).scrollTop();

        if ($(window).width() > 1250) {
            $('.parallax').css({
                'background-position': 'left -' + scroll / 8 + 'px'
            });
        } else {
            $('.parallax').css({
                'background-position': 'center center'
            });
        }
    });


    

    /* =========================================
     * filter
     *  =======================================*/

    $('#filter a').click(function (e) {
        e.preventDefault();

        $('#filter li').removeClass('active');
        $(this).parent('li').addClass('active');

        var categoryToFilter = $(this).attr('data-filter');

        $('.reference-item').each(function () {

            if ($(this).data('category') === categoryToFilter || categoryToFilter === 'all') {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

    });


    /* =========================================
     * reference functionality
     *  =======================================*/
    $('.reference a').on('click', function (e) {

        e.preventDefault();

        var title = $(this).find('.reference-title').text(),
            description = $(this).siblings('.reference-description').html();

        $('#detail-title').text(title);
        $('#detail-content').html(description);

        var images = $(this).siblings('.reference-description').data('images').split(',');
        if (images.length > 0) {
            sliderContent = '';
            for (var i = 0; i < images.length; ++i) {
                sliderContent = sliderContent + '<div class="item"><img src=' + images[i] + ' alt="" class="img-fluid"></div>';
            }
        } else {
            sliderContent = '';
        }

        openReference(sliderContent);

    });

    function openReference(sliderContent) {
        $('#detail').slideDown();
        $('#references-masonry').slideUp();


        if (sliderContent !== '') {

            var slider = $('#detail-slider');

            if (slider.hasClass('owl-loaded')) {
                slider.trigger('replace.owl.carousel', sliderContent);
            } else {
                slider.html(sliderContent);
                slider.owlCarousel({
                    nav: false,
                    dots: true,
                    items: 1
                });

            }
        }
    }


    function closeReference() {
        $('#references-masonry').slideDown();
        $('#detail').slideUp();
    }

    $('#filter button, #detail .close').on('click', function () {
        closeReference();
    });


    /* =========================================
     *  animations
     *  =======================================*/

    delayTime = 0;

    $('[data-animate]').waypoint(function (direction) {
        delayTime += 250;

        var element = $(this.element);

        $(this.element).delay(delayTime).queue(function (next) {
            element.toggleClass('animated');
            element.toggleClass(element.data('animate'));
            delayTime = 0;
            next();
        });

        this.destroy();

    }, {
        offset: '90%'
    });
    
    $('[data-animate-hover]').hover(function () {
        $(this).css({
            opacity: 1
        });
        $(this).addClass('animated');
        $(this).removeClass($(this).data('animate'));
        $(this).addClass($(this).data('animate-hover'));
    }, function () {
        $(this).removeClass('animated');
        $(this).removeClass($(this).data('animate-hover'));
    });

    /* =========================================
     * for demo purpose
     *  =======================================*/

    var stylesheet = $('link#theme-stylesheet');
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, {
                expires: 365,
                path: document.URL.substr(0, document.URL.lastIndexOf('/'))
            });

        }

        return false;
    });

});



/* =========================================
 * styled Leaflet Map
 *  =======================================*/
// ------------------------------------------------------ //
// styled Leaflet  Map
// ------------------------------------------------------ //

function map() {

    var mapId = 'map',
        mapCenter = [53.14, 8.22],
        mapMarker = true;

    if ($('#' + mapId).length > 0) {

        var icon = L.icon({
            iconUrl: 'img/marker.png',
            iconSize: [25, 37.5],
            popupAnchor: [0, -18],
            tooltipAnchor: [0, 19]
        });

        var dragging = false,
            tap = false;

        if ($(window).width() > 700) {
            dragging = true;
            tap = true;
        }

        var map = L.map(mapId, {
            center: mapCenter,
            zoom: 13,
            dragging: dragging,
            tap: tap,
            scrollWheelZoom: false
        });

        var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });

        Stamen_TonerLite.addTo(map);

        map.once('focus', function () {
            map.scrollWheelZoom.enable();
        });

        if (mapMarker) {
            var marker = L.marker(mapCenter, {
                icon: icon
            }).addTo(map);

            marker.bindPopup("<div class='p-4'><h5>Info Window Content</h5><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p></div>", {
                minwidth: 200,
                maxWidth: 600,
                className: 'map-custom-popup'
            })

        }
    }

}