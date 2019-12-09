import { load as load_template } from './templates';
import Mustache from 'mustache';

import { mediaplayer } from 'agl-js-api';

var template;
var root;
var page = {
    metadata: {},
    getPosition: function() {
        if ( this.metadata && this.metadata.position ) {
            return formatTime(this.metadata.position);
        } else {
            return '--:--';
        }
    },
    getDuration: function(){
        if ( this.metadata && this.metadata.track && this.metadata.track.duration ) {
            return formatTime(this.metadata.track.duration);
        } else {
            return '--:--';
        }
    },
    getPercentage: function() {
        if ( this.metadata && this.metadata.position && this.metadata.track && this.metadata.track.duration) {
            return Math.floor((this.metadata.position/this.metadata.track.duration)*100);
        }
    },
    isPlaying: function() {
        return this.metadata && this.metadata.status === 'playing';
    }
};

function twoDigit(number) {
    if( number < 10 ) {
        return '0'+number;
    } else {
        return number;
    }
}

function formatTime(time) {
    return twoDigit(Math.floor(time/60000))+':'+twoDigit(Math.floor((time/1000)%60));
}

export function show() {
    root.innerHTML = Mustache.render(template, page);
}

export function init(node) {

    mediaplayer.on_metadata_changes(function(metadata){
        console.log(metadata);
        page.metadata = metadata;
        show();
    });
    load_template('player.template.html').then(function(result) {
        template = result;
        root = node;
        Mustache.parse(template);
        show();
    }, function(error) {
        console.error('ERRROR loading main template', error);
    });
}

export function play() {
    mediaplayer.play();
}

export function pause() {
    mediaplayer.pause();
}

export function previous() {
    mediaplayer.previous();
}

export function next() {
    mediaplayer.next();
}