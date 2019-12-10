import { load as load_template } from './templates';
import Mustache from 'mustache';

import { mediaplayer } from 'agl-js-api';

var template;
var root;
var currentTrackIndex;
var page = {
    playlist: {},
    isPlaying: function() {
        return this.selected;
    }
};

function load() {
    mediaplayer.playlist().then(function(playlist){
        page.playlist = playlist.list;
        show();
    });
}

export function show() {
    root.innerHTML = Mustache.render(template, page);
}


export function init(node) {

    mediaplayer.on_playlist_changes(function(playlist){
        page.playlist = playlist.list;
        show();
    });

    mediaplayer.on_metadata_changes(function(metadata){
        if( metadata && metadata.track && metadata.track.index !== currentTrackIndex ) {
            currentTrackIndex = metadata.track.index;
            load();
        } 
    });
    load_template('playlist.template.html').then(function(result) {
        template = result;
        root = node;
        Mustache.parse(template);
        show();
    }, function(error) {
        console.error('ERRROR loading main template', error);
    });
}