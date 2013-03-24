
(function() {
  var highest_temp = 0;
  var lowest_temp = Number.MAX_VALUE;

  asterank3d = new Asterank3D({
    container: document.getElementById('webgl_container'),
    camera_position: [0, -55, 25],
    camera_fly_around: false,
    jed_step_interval: .1,
    custom_object_fn: function(obj) {
      var heatcolor;
      if (obj['p_temp'] < 323.16 && obj['p_temp'] > 273.16 && obj['p_radius'] < 100) {
        // goldilocks green
        heatcolor = new THREE.Color(0x00ff00);
      }
      else {
        var pct_temp = obj['p_temp'] / (highest_temp - lowest_temp) * 100;

        // red hottest, blue coolest (colloquial interpretation)
        heatcolor = new THREE.Color(getColorFromPercent(pct_temp, 0xff0000, 0x0000ff));
      }

      // size
      var size = obj['p_radius'] / 2;

      return {
        color: 0xcccccc,
        display_color: heatcolor,
        width: 2,
        object_size: size
      };

    },
    object_texture_path: "/static/img/cloud_defined.png"
  });

  asterank3d.clearRankings();

  $.getJSON('/api/exoplanets?query={"a":{"$ne":""}}&limit=800', function(data) {

    $.each(data, function() {
      highest_temp = Math.max(highest_temp, this['p_temp']);
      lowest_temp = Math.min(lowest_temp, this['p_temp']);
    });


    asterank3d.processAsteroidRankings(data);
  });
})();
