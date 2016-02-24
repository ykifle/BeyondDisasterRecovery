/**
 * This is required for element rendering to be possible
 * @type {PlatformElement}
 *
 * we normalize the styles on initial load.
 */

(function() {
    var PricingTable = PlatformElement.extend({
        initialize: function() {
          this.fixStyles();
            /**
             * The script are not defined in the manifest 
             * so that 6mb of scripts are not loaded. This 
             * allows us to load only scripts needed for 
             * each language and theme.
             */
            var libDeferreds = [];
            if (typeof d3 == 'undefined') {
                libDeferreds.push($.getScript(this.assets_path + 'js/d3.v3.min.js'));
            }
            $.when.apply(this, libDeferreds).done(function() {
                this.initList();
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
        },
        initList: function() {
            var data = [
                {
                    'event': 'Master Change',
                    'timestamp': 1455343200,
                    'data': 'US-West'
                },
                {
                    'event': 'Master Change',
                    'timestamp': 1455415556,
                    'data': 'US-East'
                }
            ];

            var x = d3.scale.linear()
                .domain([0, d3.max(data)])
                .range([0, 420]);

            d3.select(".smartlist")
              .selectAll("li")
                .data(data)
              .enter().append("li")
                .text(function(d) {
              var date = new Date(d.timestamp * 1000);
              return date + ' ' + d.event + ': ' + d.data; });
        }
    });


    return PricingTable;
})();