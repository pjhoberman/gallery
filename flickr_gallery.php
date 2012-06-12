<?php
/*
Plugin Name: Flickr Gallery
Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
Description: A brief description of the Plugin.
Version: 0.1
Author: PJ Hoberman
Author URI: http://URI_Of_The_Plugin_Author
License: A "Slug" license name e.g. GPL2
*/

/*  Copyright 2012  PJ Hoberman  (email : pj.hoberman@gmail.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

function flickr_gallery( $atts ){
    extract( shortcode_atts( array(
        'foo' => 'something',
        'bar' => 'something else',
    ), $atts ) );
    
    return 'test';
}

add_shortcode('flickr_gallery', 'flickr_gallery');
