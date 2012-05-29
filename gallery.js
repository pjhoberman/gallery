/* Todo:
 * Check out scroll bars in various browsers
 * style it up
 * wordpress gallery
 * don't use index - use something else to signify hashes, in case of api change
 * Check the comments for things to fix
 * add a link to the big pic
*/

var gallery; // make this anon?

// attributes for images: full (required), thumb, title, link

var Gallery = function (api_key, set_id) {
    "use strict";
    var _this = this;
    this.set_id = set_id; // need this, not sure what to do without it yet.
    this.api_key = api_key;
    this.images = [];
    
    var flickr_api_url = "http://api.flickr.com/services/rest/?callback=?",
        images_to_load = 0;
    
    this.flickrAPI = function () {
        var qs = {
                method: 'flickr.photosets.getPhotos',
                api_key: this.api_key,
                photoset_id: this.set_id,
                format: 'json',
                jsoncallback: 'gallery.setImages'
                };     
        
        $.getJSON(flickr_api_url, qs);
    }; // flickrAPI
    
    // allow for more than just flickr?
    this.setImages = function (data) {
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
                    jsoncallback: 'gallery.addImage'
                    };
                this.images.push({id: imgs[i].id, title: imgs[i].title});
                $.getJSON(flickr_api_url, qs);
                
            } // for
        } else {
            // ruh roh
        }
    }; // setImages    
    
    this.addImage = function(data){

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
    };
    
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
        $('body').append('<div id="gallery"><div class="slideshow">Start Slideshow</div><div class="big-pic"></div><div class="slider"></div></div>');
        
        // which image should we use
        var index = 0,
            hash;

        // hashed. load something
        if (window.location.hash !== '') {
            hash = window.location.hash.match(/#(\d*)-?/);
            index = hash.length > 1 ? hash[1] : hash[0];
        }

        $('#gallery .big-pic').append('<img src="' + this.images[index].full + '" />');
        $('#gallery .big-pic img').one('load', centerBigPic); // look into delay on hashed images


        // grab the images
        // assumption: we have images
        for (var i=0; i<this.images.length; i++) {
            // check for thumb, otherwise downsize original
            var img = this.images[i],
                thumb = img.thumb ? img.thumb : img.full,
                el = $('<img src="' + thumb + '" />');

            if (img.title)
                el.attr('title', i + '-' + img.title);

            else
                el.attr('title', i); // for now, assign it its own index -- note, should check for this or a title

            if (img.link)
                el.attr('data-link', img.link);
                
            el.attr('data-index', i).attr('data-full', img.full);

            $('#gallery .slider').append(el);

        } // for

        $('#gallery .slider img:eq(' + index + ')').addClass('selected-image');
        
        // better way?
        setTimeout(function(){
                $('#gallery .slider').scrollLeft($('#gallery .slider .selected-image').offset()['left']);
            }, 400);

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
    
    // this might be too slow... and mean for mobile 
    var preloadImages = function (){
        for( var i=0; i<_this.images.length; i++){
            $('<img/>').src = _this.images[i].full;
        } // for
    }; // preloadImages
    
    this.changeBigPic = function (img) {
        // center vertically
        $('#gallery .big-pic img').fadeOut(function(){
            $(this).attr('src', img.attr('data-full')).one('load', centerBigPic).fadeIn();
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
        
        // preload the second image
        $('<img/>').src = $('#gallery .slider img:eq(1)').attr('data-full');
        
        // start at 0 -- why?
        // $('#gallery .slider').scrollLeft(0);
        // $('#gallery .slider img:first').click();
        
        _this.slideshow = setInterval(function(){
            var next = $('#gallery .slider .selected-image').next();

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
    this.flickrAPI();
    //this.createGallery();
};

$(function(){
    "use strict";

    gallery = new Gallery('eb318894c92e5eccef25f8595ea38abe', '72157629928830926');

}); // doc ready
