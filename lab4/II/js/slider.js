/**
 * Created by marius on 5/7/17.
 */

function addImages(imagesCount) {
    while (imagesCount >= 1) {
        $('#slideshowWindow').append(
            $('<div>')
                .addClass('slide')
                .append(
                    $('<img>')
                        .attr('src', 'img/' + imagesCount + '.jpg')
                        .addClass('slide-img')
                ));
        imagesCount--;
    }
}

$(document).ready(function () {

    addImages(7);

    /**
     * The first variable records which slide currently showing. The slideWidth variable is self explanatory.
     * Next we have a variable called slides which lets us refer to our slides in the jQuery code and the last
     * variable gives us the number of slides in our slideshow.
     */
    var currPosition = 0;
    var slideWidth = 600;
    var slideHeight = 400;
    var slides = $('.slide');
    var numberOfSlides = slides.length;

    var speed = 1000;

    /**
     * To get the slides to line up across the page, we need to add another div. We're going to do this with jQuery.
     * This div will hold all the slides and allow the float:left property to work.
     */
    setInterval(changePosition, speed);

    slides.wrapAll('<div id="slidesHolder"></div>')

    slides.css({'float': 'left'});

    $('#slidesHolder').css('width', slideWidth * numberOfSlides);


    /**
     * The first part of the if/else statement deals with when reach the end of the slide show.
     * When we come to the last slide we want to jump back to the beginning, otherwise the currentSlide
     * variable is simply incremented by 1 and then another function moveSlide is called.
     */
    function changePosition() {
        currPosition++;
        moveSlide(currPosition % numberOfSlides);
    }


    /**
     * This function sets the left margin of the slidesHolder div to the width of the slide multiplied by
     * the slide number and then animates to that from the current left margin
     */
    function moveSlide(index) {
        $('#slidesHolder')
            .animate({
                    marginLeft: slideWidth * (-index)
                },
                800,
                'swing',
                function () {
                }
            );

        // $(slides[index]).animate({
        //     left: '-50%'
        // }, 500, function() {
        //     // $(slides[index]).css('left', '150%');
        //     // $(slides[index]).appendTo('#slidesHolder');
        // });
        //
        // $(slides[index]).next().animate({
        //     left: '50%'
        // }, 500);
    }
});