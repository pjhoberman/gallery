/* Todo:
 * preload images -- all the images? some of them?
 * make slider slide
 * Check out scroll bars in various browsers
 * slideshow
 * make it possible to scroll left and right with a hover
 * style it up
 * flickr api
*/


// assume we have a list of images, from either manual input, class-targeted selection, or an api
// attributes: full (required), thumb, title, link
var images = [
    {full: 'test_images/DSC_3786.jpg', 'thumb': 'test_images/DSC_3786.jpg','title': 'abc', 'link': 'http://google.com'},
    {full: 'test_images/DSC_3789.jpg', 'thumb': 'test_images/DSC_3789.jpg','title': 'abc', 'link': 'http://google.com'},
    {full: 'test_images/DSC_3791.jpg', 'thumb': 'test_images/DSC_3791.jpg'},
    {full: 'test_images/DSC_3795.jpg', 'thumb': 'test_images/DSC_3795.jpg'},
    {full: 'test_images/DSC_3801.jpg', 'thumb': 'test_images/DSC_3801.jpg'},
    {full: 'test_images/DSC_3805.jpg', 'thumb': 'test_images/DSC_3805.jpg'}
];


var Gallery = function () {
    "use strict";
    var _this = this;
    this.createGallery = function () {
        // create the general dom
        $('body').append('<div id="gallery"><div class="big-pic"></div><div class="slider"></div></div>');

        // which image should we use
        var index = 0,
            hash;

        // hashed. load something
        if (window.location.hash !== '') {
            hash = window.location.hash.match(/#(\d*)-?/);
            index = hash.length > 1 ? hash[1] : hash[0];
        }

        $('#gallery .big-pic').append('<img src="' + images[index].full + '" />');
        $('#gallery .big-pic img').one('load', centerBigPic); // look into delay on hashed images


        // grab the images
        // assumption: we have images
        for (var i=0; i<images.length; i++) {
            // check for thumb, otherwise downsize original
            var img = images[i],
                thumb = img.thumb ? img.thumb : img.full,
                el = $('<img src="' + thumb + '" />');

            if (img.title)
                el.attr('title', i + '-' + img.title);

            else
                el.attr('title', i); // for now, assign it its own index -- note, should check for this or a title

            if (img.link)
                el.attr('data-link', img.link);

            $('#gallery .slider').append(el);

        } // for

        $('#gallery .slider img:eq(' + index + ')').addClass('selected-image');
        
        setTimeout(function(){
                $('#gallery .slider').scrollLeft($('#gallery .slider .selected-image').offset()['left']);
            }, 100);

        // bind the click
        $('#gallery .slider img').click(function(){
            $('.selected-image').removeClass('selected-image');
            $(this).addClass('selected-image');
            _this.changeBigPic($(this));
        });

        // slider craziness - not working right now, hovering on right isn't a consistent e.offsetX
        $('#gallery .slider').mousemove(function(e){    
        
            var position = getMousePosition(e),
                slider = $('#gallery .slider');
            
            if(position[0] < (slider.width() * .25))
                slider.scrollLeft(slider.scrollLeft() - 10);
            else if( position[0] > (slider.width() * .75))
                slider.scrollLeft(slider.scrollLeft() + 10);
        });
    };

    this.changeBigPic = function (img) {
        // center vertically
        $('#gallery .big-pic img').attr('src', img.attr('src')).one('load', centerBigPic);

        // update the hash
        window.location.hash = img.attr('title');
    };

    // private function because.. no reason to ever use this outside the obj?
    var centerBigPic = function () {
        var image_height = $($('#gallery .big-pic img')[0]).height(),
            max_height = $('#gallery .big-pic').height(),
            margin = Math.max(0, (max_height - image_height)/2);

        $('#gallery .big-pic img').css({marginTop:margin});
    };
    
    var getMousePosition = function (e){
        var posx = 0;
    	var posy = 0;
    	if (!e) var e = window.event;
    	if (e.pageX || e.pageY) 	{
    		posx = e.pageX;
    		posy = e.pageY;
    	}
    	else if (e.clientX || e.clientY) 	{
    		posx = e.clientX + document.body.scrollLeft
    			+ document.documentElement.scrollLeft;
    		posy = e.clientY + document.body.scrollTop
    			+ document.documentElement.scrollTop;
    	}
    	// posx and posy contain the mouse position relative to the document
    	// Do something with this information
        return [posx, posy];
    };


    // init functions
    this.createGallery();
};

$(function(){
    "use strict";

    var gallery = new Gallery();

}); // doc ready
