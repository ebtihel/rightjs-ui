/**
 * Roadtrips support module for the lightbox
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Lightbox.include((function() {
  var old_show  = Lightbox.prototype.show;
  var old_build = Lightbox.prototype.build;
  var old_event = Lightbox.prototype.connectEvents;
  
  return {
    // highjacking a roadtrip content
    show: function(content) {
      this.roadLink = (content && content.roadtrip) ? content : null;
      return old_show.apply(this, arguments);
    },
    
    // the building process overlaping
    build: function() {
      var res = old_build.apply(this, arguments);
      
      this.prevLink = this.E('lightbox-prev-link', this.dialog).onClick(this.showPrev.bind(this))
        .update('&lsaquo;&lsaquo;&lsaquo;').set('title', 'Previous').hide();
      this.nextLink = this.E('lightbox-next-link', this.dialog).onClick(this.showNext.bind(this))
        .update('&rsaquo;&rsaquo;&rsaquo;').set('title', 'Next').hide();
      
      return res;
    },
    
    // connecting the left/right arrow buttons
    connectEvents: function() {
      var res = old_event.apply(this, arguments);
      
      document.onKeydown(function(event) {
        if (event.keyCode == 37) { event.stop(); this.showPrev(); }
        if (event.keyCode == 39) { event.stop(); this.showNext(); }
      }.bind(this));
      
      return res;
    },
    
    // tries to show the previous item on the roadtrip
    showPrev: function() {
      if (this.hasPrev()) {
        this.show(this.roadLink.roadtrip[this.roadLink.roadtrip.indexOf(this.roadLink) - 1]);
      }
      return this;
    },

    // tries to show the next item on the roadtrip
    showNext: function() {
      if (this.hasNext()) {
        this.show(this.roadLink.roadtrip[this.roadLink.roadtrip.indexOf(this.roadLink) + 1]);
      }
      return this;
    },
    
    // checks the roadtrip state and shows/hides the next/prev links
    checkRoadtrip: function() {
      this.prevLink[this.hasPrev() ? 'show' : 'hide']();
      this.nextLink[this.hasNext() ? 'show' : 'hide']();
      return this;
    },

    // checks if there is a previous image link
    hasPrev: function() {
      return this.roadLink && this.roadLink.roadtrip && this.roadLink.roadtrip.first() != this.roadLink;
    },

    // checks if there is a next image link
    hasNext: function() {
      return this.roadLink && this.roadLink.roadtrip && this.roadLink.roadtrip.last() != this.roadLink;
    }
  };
})());