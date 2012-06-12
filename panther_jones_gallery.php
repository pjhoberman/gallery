<?php

/*
    Plugin Name: Panther Jones Photo Gallery
    Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
    Description: A brief description of the Plugin.
    Version: 0.5
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

//Todo - better name

function panther_jones_gallery_dependencies(){
    wp_enqueue_script('panther_jones_gallery_script', plugins_url('gallery.js', __FILE__));
    wp_enqueue_style('panther_jones_gallery_style', plugins_url('gallery.css', __FILE__));
}

add_action('wp_enqueue_scripts', 'panther_jones_gallery_dependencies');

function panther_jones_gallery( $atts ){

    extract( shortcode_atts( array(
        'gallery_id' => 'panther_jones_gallery',
        'classes' => '',
        'source' => 'flickr',
        'api_key' => '',
        'set_id' => '',
        'slideshow_speed' => '3000',
    ), $atts ) );

    $html = "<div 
        id='$gallery_id'
        class='$classes'
        data-source='$source' 
        data-api-key='$api_key'
        data-set-id='$set_id'
        data-slideshow-speed='$slideshow_speed'
        ></div>";

    return $html;
}

add_shortcode('panther_jones_gallery', 'panther_jones_gallery');
