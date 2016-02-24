/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 *
 * we normalize the styles on initial load.
 */

(function() {
    var NetAppConsole = PlatformElement.extend({
        initialize: function() {
            this.fixStyles();
            var that = this;
            /**
             * The script are not defined in the manifest 
             * so that 6mb of scripts are not loaded. This 
             * allows us to load only scripts needed for 
             * each language and theme.
             */
            // var libDeferreds = [];
            // if (typeof d3 == 'undefined') {
            //     libDeferreds.push($.getScript(this.assets_path + 'js/d3.v3.min.js'));
            // }
            // $.when.apply(this, libDeferreds).done(function() {
            //     this.initList();
            // }.bind(this));

            // this.westButton = $('.west-master');
            // this.eastButton = $('.east-master');
            // $('.edit-overlay') = $('.edit-overlay');

            var appendOutput = function(text) {
                $('.output').val(function(_, val){return val + text; }); 
            };
            appendOutput.bind(this);

            var updateStatus = function() {
                $('.edit-overlay').removeClass('hidden');
                $.get('https://developerweek2016.herokuapp.com/status').then(function(data) {
                    console.log(data.output);
                    appendOutput(data.output);
                    var eastNode = data.nodes[0];
                    var westNode = data.nodes[1];
                    debugger;
                    if (eastNode.master) {
                        $('.west-master').removeAttr('disabled');
                        $('.east-master').attr('disabled', 'disabled');
                        if (window.markers) {
                            window.markers['US-East'].setIcon({
    url: that.assets_path + 'green_marker2.png'
  });
                            window.markers['US-West'].setIcon({
    url: that.assets_path + 'red_marker2.png'
  });
                        }
                    } else {
                        $('.east-master').removeAttr('disabled');
                        $('.west-master').attr('disabled', 'disabled');
                        if (window.markers) {
                            window.markers['US-East'].setIcon({
    url: that.assets_path + 'red_marker2.png'
  });
                            window.markers['US-West'].setIcon({
    url: that.assets_path + 'green_marker2.png'
  });
                        }
                    }
                    if (data.health_check.toLowerCase() == 'true') {
                        $('.health h4').html('YES');
                        $('.health h4').addClass('yes');
                        $('.health h4').removeClass('no');
                    } else {
                        $('.health h4').html('NO');
                        $('.health h4').addClass('no');
                        $('.health h4').removeClass('yes');
                    }
                    $('.source h4').html(data.source_path);
                    $('.dest h4').html(data.destination_path);
                    $('.mirror h4').html(data.mirror_state);
                    $('.relate h4').html(data.relationship_status);
                    $('.edit-overlay').addClass('hidden');
                }.bind(this));
            };
            updateStatus.bind(this);

            var changeToWestMaster = function() {
                $('.edit-overlay').removeClass('hidden');
                $.get('https://developerweek2016.herokuapp.com/westmaster').then(function(data) {
                    console.log(data.output);
                    appendOutput(data.output);
                    updateStatus();
                }.bind(this));
            };
            changeToWestMaster.bind(this);

            var changeToEastMaster = function() {
                $('.edit-overlay').removeClass('hidden');
                $.get('https://developerweek2016.herokuapp.com/eastmaster').then(function(data) {
                    console.log(data.output);
                    appendOutput(data.output);
                    updateStatus();
                }.bind(this));
            };
            changeToEastMaster.bind(this);

            $('.west-master').on('click', changeToWestMaster);
            $('.east-master').on('click', changeToEastMaster);

            var googleDeferreds = [];
            if (typeof google == 'undefined') {
                googleDeferreds.push($.getScript('https://maps.googleapis.com/maps/api/js'));
            }
            $.when.apply(this, googleDeferreds).done(function() {
                updateStatus();
            }.bind(this));
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
        }
    });

    return NetAppConsole;
})();