/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 *
 * we normalize the styles on initial load.
 */

(function() {
    var PricingTable = PlatformElement.extend({
        initialize: function() {
            // we normalize the styles after placeholders are replaced.
            this.normalizeAfterPlaceholders();
            /**
             * The script are not defined in the manifest 
             * so that 6mb of scripts are not loaded. This 
             * allows us to load only scripts needed for 
             * each language and theme.
             */
            var googleDeferreds = [];
            if (typeof google == 'undefined') {
                googleDeferreds.push($.getScript('https://maps.googleapis.com/maps/api/js'));
            }
            $.when.apply(this, googleDeferreds).done(function() {
                var scriptDeferreds = [];
                if (typeof Fluster2 == 'undefined') {
                    scriptDeferreds.push($.getScript(this.assets_path + 'js/Fluster2.packed.js'));
                }
                if (this.settings.get('data_url')) {
                    scriptDeferreds.push($.get(this.settings.get('data_url')).then(function(loadedData) {
                        this.mapData = loadedData;
                    }.bind(this)));
                } else if (typeof defaultData == 'undefined') {
                    scriptDeferreds.push($.getScript(this.assets_path + 'js/fake_data.js').then(function() {
                        this.mapData = data;
                    }.bind(this)));
                }
                $.when.apply(this, scriptDeferreds).done(function() {
                    /**
                     * After the scripts are loaded, we can
                     * then make the call to setup the editor.
                     */
                    // we normalize the styles after placeholders are replaced.
                    this.initMap();
                }.bind(this))
            }.bind(this));
        },

        normalizeAfterPlaceholders: function() {
            this.placeholderInterval = setInterval(function() {
                if (this.$('.platform-element-child-placeholder').length == 0) {
                    // first off, stop listening
                    clearInterval(this.placeholderInterval);
                    this.fixStyles();
                }
            }.bind(this), 100); 
        },

        // normalizes the styles of all element children.
        fixStyles: function() {
            this.$('li.wsite-text').each(function(index, value) {
                var $value = $(value);
                var defaultText = $value.data('default-text');
                var $el = $(value).find('.editable-text');
                if ($el.text() === defaultText) {
                    $el.attr('style', '');
                }
            });

            this.$('.element').each(function(index) {
                $(this).attr('style', '');
            });
        },
        initMap: function() {
            var mapElementId = this.user_id + '_' + this.site_id + '_' + this.element_id + '_map';
            this.map = new google.maps.Map(document.getElementById(mapElementId), {
                center: {lat: this.settings.get('lat'), lng: this.settings.get('long')},
                zoom: this.settings.get('zoom')
            });
            
            var fluster = new Fluster2(this.map);
            window.markers = {};

            for (var i = 0; i < this.mapData.nodes.length; ++i) {
                var latlng = new google.maps.LatLng(this.mapData.nodes[i].latitude, this.mapData.nodes[i].longitude);
                var marker = new google.maps.Marker({
                    position: latlng,
                    title: this.mapData.nodes[i].name,
                    master: this.mapData.nodes[i].master,
                    icon: this.mapData.nodes[i].master ? this.assets_path + 'green_marker.png' : this.assets_path + 'red_marker.png'
                });
                window.markers[this.mapData.nodes[i].name] = marker;
                fluster.addMarker(marker);
            }
            fluster.styles = {
                // This style will be used for clusters with more than 0 markers
                0: {
                    image: 'http://gmaps-utility-library.googlecode.com/svn/trunk/markerclusterer/1.0/images/m1.png',
                    textColor: '#FFFFFF',
                    width: 53,
                    height: 52
                },
                // This style will be used for clusters with more than 10 markers
                10: {
                    image: 'http://gmaps-utility-library.googlecode.com/svn/trunk/markerclusterer/1.0/images/m2.png',
                    textColor: '#FFFFFF',
                    width: 56,
                    height: 55
                },
                20: {
                    image: 'http://gmaps-utility-library.googlecode.com/svn/trunk/markerclusterer/1.0/images/m3.png',
                    textColor: '#FFFFFF',
                    width: 66,
                    height: 65
                }
            };
            fluster.initialize();
        }
    });

    return PricingTable;
})();