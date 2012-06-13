/* Todo:
 * Check out scroll bars in various browsers
 * style it up
 * don't use index - use something else to signify hashes, in case of api change
 * Check the comments for things to fix
 * add a link to the big pic

 * changing direction on slider doesn't work well in wordpress yet
 * big arrow to move big picture?
 * turn api_key into a plugin option, rather than a shortcode option
*/

var gallery; // make this anon?

// attributes for images: full (required), thumb, title, link

var Gallery = function (gallery_id) {
    "use strict";

    console.log('Gallery initiated');

    // options that were arguments before: api_key, set_id
    var _this = this,
        images_to_load = 0;

    this.gallery_id = gallery_id || 'panther_jones_gallery';
    this.gallery_id_jq = jQuery('#' + this.gallery_id);
    this.source = this.gallery_id_jq.attr('data-source');
    this.api_key = this.gallery_id_jq.attr('data-api-key');
    this.set_id = this.gallery_id_jq.attr('data-set-id');
    this.slideshow_speed = this.gallery_id_jq.attr('data-slideshow-speed');

    this.images = [];

    var flickr_api_url = "http://api.flickr.com/services/rest/?callback=?";

    this.loadImages = function(){
        if(this.source === "flickr"){ // todo: planning on doing any other sources?

            // this.flickrAPI = function () {
                var qs = {
                        method: 'flickr.photosets.getPhotos',
                        api_key: this.api_key,
                        photoset_id: this.set_id,
                        format: 'json',
                        jsoncallback: 'gallery.ajaxFlickrImages' // todo: this is an issue.
                        };

                jQuery.getJSON(flickr_api_url, qs);
            // }; // flickrAPI
        }

        else if(this.source === "wordpress"){
            // do stuff
        }
    }; // loadImages

    // allow for more than just flickr?
    this.ajaxFlickrImages = function (data) {


        if( data.stat === "ok" ){
            var imgs = data.photoset.photo,
                i = 0;
            images_to_load = imgs.length;
            for( i; i<imgs.length; i++){
                var qs = {
                    method: 'flickr.photos.getSizes',
                    api_key: this.api_key,
                    photo_id: imgs[i].id,
                    format: 'json',
                    jsoncallback: 'gallery.addFlickrImage'
                    };
                this.images.push({id: imgs[i].id, title: imgs[i].title});
                jQuery.getJSON(flickr_api_url, qs);

            } // for
        } else {
            // ruh roh
            console.log("There was an oopsie!");
            console.log(data);
        }
    }; // ajaxFlickrImages

    this.addFlickrImage = function(data){

        if(data.stat === "ok"){
            var i = 0,
                j = 0,
                id = data.sizes.size[0].url.match(/\d{1,}/)[0],
                index, d;

            // gotta be a better way to do this..
            for(i; i<this.images.length;i++){
                if(this.images[i].id === id)
                    index = i;
            } // for

            d = this.images[index];

            for(j; j<data.sizes.size.length; j++){
                if(data.sizes.size[j].label === "Thumbnail"){
                    d.thumb = data.sizes.size[j].source;
                }

                else if(data.sizes.size[j].label === "Large") { // catch this if there isn't one and go bigger
                    d.full = data.sizes.size[j].source;
                }
            } // for

        } // if

        this.checkForDoneLoading();
    }; // addFlickrImage

    this.checkForDoneLoading = function () {
        // gotta be a better way
        // this assumes every image loads... gotta be a better way!
        var i = 0,
            c = 0;
        for(i; i<this.images.length; i++){
            if(this.images[i].full){
                c++;
            } // if
        } // for
        if( images_to_load === c )
            this.createGallery();
            preloadImages();
    }; // checkForDoneLoading

    this.createGallery = function () {
        // create the general dom
        // todo - #gallery => abstract?
        this.gallery_id_jq.append('<div id="gallery"><div class="slideshow">Start Slideshow</div><div class="big-pic"></div>div class="go go-left"></div><div class="go go-right"></div><div class="slider"><</div></div>');

        // which image should we use
        var index = 0,
            hash;

        // hashed. load something
        if (window.location.hash !== '') {
            hash = window.location.hash.match(/#(\d*)-?/);
            index = hash.length > 1 ? hash[1] : hash[0];
        }

        jQuery('#gallery .big-pic').append('<img src="' + this.images[index].full + '" />');
        jQuery('#gallery .big-pic img').one('load', centerBigPic); // look into delay on hashed images


        // grab the images
        // assumption: we have images
        for (var i=0; i<this.images.length; i++) {
            // check for thumb, otherwise downsize original
            var img = this.images[i],
                thumb = img.thumb ? img.thumb : img.full,
                el = jQuery('<img src="' + thumb + '" />');

            if (img.title)
                el.attr('title', i + '-' + img.title);

            else
                el.attr('title', i); // for now, assign it its own index -- note, should check for this or a title

            if (img.link)
                el.attr('data-link', img.link);

            el.attr('data-index', i).attr('data-full', img.full);

            jQuery('#gallery .slider').append(el);

        } // for

        jQuery('#gallery .slider img:eq(' + index + ')').addClass('selected-image');

        // better way?
        setTimeout(function(){
                jQuery('#gallery .slider').scrollLeft(jQuery('#gallery .slider .selected-image').offset()['left']);
            }, 400);

        // bind the click
        jQuery('#gallery .slider img').click(function(){
            jQuery('.selected-image').removeClass('selected-image');
            jQuery(this).addClass('selected-image');
            _this.changeBigPic(jQuery(this));
        });



        // slider craziness
        var slider = jQuery('#gallery .slider'),
            speed = 20;


        jQuery('#gallery .slider .go-left').bind('mousemove mouseover', function(e){
            slider.scrollLeft(slider.scrollLeft() - speed);
        });

        jQuery('#gallery .slider .go-right').bind('mousemove mouseover', function(e){
            slider.scrollLeft(slider.scrollLeft() + speed);
        });

        // jQuery('#gallery .slider').bind('mousemove mouseover', function(e){

        //     var position = getMousePosition(e),
        //         slider = jQuery('#gallery .slider'),
        //         slider_offset_left = slider.offset()['left'],
        //         speed = 20;

        //     if(position[0] < slider_offset_left + (slider.width() * .25)){
        //         slider.scrollLeft(slider.scrollLeft() - speed);
        //         jQuery(this).css({cursor:'w-resize'});
        //     }

        //     else if( position[0] > slider_offset_left + (slider.width() * .75)) {
        //         slider.scrollLeft(slider.scrollLeft() + speed);
        //         jQuery(this).css({cursor:'e-resize'});
        //     }

        //     else {
        //         jQuery(this).css({cursor:'pointer'});
        //     }
        // });

        // bind slideshow
        bindSlideshow();
    };

    // this might be too slow... and mean for mobile
    var preloadImages = function (){
        for( var i=0; i<_this.images.length; i++){
            jQuery('<img/>').src = _this.images[i].full;
        } // for
    }; // preloadImages

    this.changeBigPic = function (img) {
        // center vertically
        jQuery('#gallery .big-pic img').fadeOut(function(){
            jQuery(this).attr('src', img.attr('data-full')).one('load', centerBigPic).fadeIn();
        });

        // update the hash
        window.location.hash = img.attr('title');
    };

    // private function because.. no reason to ever use this outside the obj?
    var centerBigPic = function () {
        var image_height = jQuery(jQuery('#gallery .big-pic img')[0]).height(),
            max_height = jQuery('#gallery .big-pic').height(),
            margin = Math.max(0, (max_height - image_height)/2);

        jQuery('#gallery .big-pic img').css({marginTop:margin});
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
        jQuery('#gallery .slideshow').one('click', function(){
            _this.startSlideshow();

            jQuery('#gallery .slideshow').one('click', function(){
                _this.stopSlideshow();
            });
        });

    }; // bindSlideshow

    this.startSlideshow = function () {
        jQuery('#gallery .slideshow').text('Stop Slideshow');

        // preload the second image
        jQuery('<img/>').src = jQuery('#gallery .slider img:eq(1)').attr('data-full');

        // start at 0 -- why?
        // jQuery('#gallery .slider').scrollLeft(0);
        // jQuery('#gallery .slider img:first').click();

        _this.slideshow = setInterval(function(){
            var next = jQuery('#gallery .slider .selected-image').next();

            if( next.length ){
                next.click();
                jQuery('#gallery .slider').scrollLeft(next.offset()['left']);

            } else {
                jQuery('#gallery .slider img:first').click();
                jQuery('#gallery .slider').scrollLeft(0);
            }
        }, _this.slideshow_speed); // make this a global var for settings
    }; // startSlideshow

    this.stopSlideshow = function () {
        jQuery('#gallery .slideshow').text('Start Slideshow');
        clearInterval(this.slideshow);
        bindSlideshow();

    };

    // init functions
    this.loadImages();
    //this.createGallery();
};

jQuery(function(){
    "use strict";

    gallery = new Gallery('panther_jones_gallery'); // call this from the plug

}); // doc ready
