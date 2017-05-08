/**
 * Created by marius on 5/7/17.
 */

function addImages(imagesCount) {
    for (var i = 1; i <= imagesCount; i++) {
        $('#container').append(
            $('<div>')
                .addClass('box')
                .attr('id', 'slide-' + i)
                .append(
                    $('<img>')
                        .attr('src', 'img/' + i + '.jpg')
                        .attr('alt', 'Image ' + i)
                        .addClass('box-img')
                ));
    }
}

$(document).ready(function () {

    addImages(7);

    var currPosition = 0;
    var $slides = $('.box');

    var speed = 1000;

    var interval = setInterval(changePosition, speed);

    function changePosition() {
        moveSlide(currPosition % $slides.length);
        currPosition++;
    }


    /**
     * This function sets the left margin of the slidesHolder div to the width of the slide multiplied by
     * the slide number and then animates to that from the current left margin
     */
    function moveSlide(index) {

        $($slides[index]).animate({
                right: '-50%'
            },
            500
            , function () {
                $($slides[index]).css('right', '150%');
                $($slides[index]).appendTo('#container');
            }
        );

        $($slides[index]).next().animate({
                right: '50%'
            }, 500
        );
    }

    var $modal = $('#show-img-modal');

    $slides.click(function (e) {
        clearInterval(interval);

        var img = $('#' + this.id + ' > img');
        $('#modal-img').attr('src', $(img).attr('src'));
        $('#caption').html(
            $(img).attr('alt')
        );

        $modal.show();
    });

    $('.closeable').click(function () {
        $modal.hide();
        interval = setInterval(changePosition, speed);
    })
});