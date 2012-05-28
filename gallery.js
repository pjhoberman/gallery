/* Todo:
 * preload images -- all the images? some of them?
 * Check out scroll bars in various browsers
 * style it up
 * flickr api
 * wordpress gallery
 * don't use index - use something else to signify hashes, in case of api change
*/


// assume we have a list of images, from either manual input, class-targeted selection, or an api
// attributes: full (required), thumb, title, link
var images = [
    {full: 'test_images/DSC_3786.jpg', 'thumb': 'test_images/DSC_3786.jpg','title': 'abc', 'link': 'http://google.com'},
    {full: 'test_images/DSC_3789.jpg', 'thumb': 'test_images/DSC_3789.jpg','title': 'abc', 'link': 'http://google.com'},
    {full: 'test_images/DSC_3791.jpg', 'thumb': 'test_images/DSC_3791.jpg'},
    {full: 'test_images/DSC_3795.jpg', 'thumb': 'test_images/DSC_3795.jpg'},
    {full: 'test_images/DSC_3801.jpg', 'thumb': 'test_images/DSC_3801.jpg'},
    {full: 'test_images/DSC_3805.jpg', 'thumb': 'test_images/DSC_3805.jpg'},
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
        $('body').append('<div id="gallery"><div class="slideshow">Start Slideshow</div><div class="big-pic"></div><div class="slider"></div></div>');
        
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
                
            el.attr('data-index', i);

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

        // slider craziness
        $('#gallery .slider').bind('mousemove mouseover', function(e){    
        
            var position = getMousePosition(e),
                slider = $('#gallery .slider'),
                speed = 20;
            
            if(position[0] < (slider.width() * .25)){
                slider.scrollLeft(slider.scrollLeft() - speed);
                $(this).css({cursor:'w-resize'});
            } else if( position[0] > (slider.width() * .75)) {
                slider.scrollLeft(slider.scrollLeft() + speed);
                $(this).css({cursor:'e-resize'});
            } else {
                $(this).css({cursor:'pointer'});
            }
        });
        
        // bind slideshow
        bindSlideshow();
    };

    this.changeBigPic = function (img) {
        // center vertically
        $('#gallery .big-pic img').fadeOut(function(){
            $(this).attr('src', img.attr('src')).one('load', centerBigPic).fadeIn();
        });

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
    
    var bindSlideshow = function () {
        $('#gallery .slideshow').one('click', function(){
            _this.startSlideshow();
            
            $('#gallery .slideshow').one('click', function(){
                _this.stopSlideshow();
            });
        });
        
    }; // bindSlideshow
    
    this.startSlideshow = function () {
        $('#gallery .slideshow').text('Stop Slideshow');
        
        // start at 0
        $('#gallery .slider').scrollLeft(0);
        $('#gallery .slider img:first').click();
        
        _this.slideshow = setInterval(function(){
            var next = $('#gallery .slider .selected-image').next();
            console.log(next);
            if( next.length ){
                next.click();
                $('#gallery .slider').scrollLeft(next.offset()['left']);
            } else {
                $('#gallery .slider img:first').click();
                $('#gallery .slider').scrollLeft(0);
            }
        }, 3000); // make this a global var for settings
    }; // startSlideshow
    
    this.stopSlideshow = function () {
        $('#gallery .slideshow').text('Start Slideshow');
        clearInterval(this.slideshow);
        bindSlideshow();
        
    };
    
    // init functions
    this.createGallery();
};

$(function(){
    "use strict";

    var gallery = new Gallery();

}); // doc ready
