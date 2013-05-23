/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Contains loader for all other NBT tests.
 *
 */
(function() {

    var singleFile = false; // TODO: figure this out someday.

    var jsFiles = window.NBTtest;

    window.NBTtest = {

      baseDir: '',

      _getScriptLocation: (function() {
          var s = document.getElementsByTagName('script');
          var thisEl = s[s.length-1];
          var path = thisEl.src;
          var folder = path.substr(0, path.lastIndexOf('/')+1);
          return (function() { return folder; });
      })()
    };

    if(!singleFile) {
      if (!jsFiles) {
          jsFiles = [
            'NBT/Index/QuadTree.js'
            // 'NBT/Provider/ArcGIS.js',
            // 'NBT/Format/ArcGIS.js',
            // 'NBT/Protocol/MultiRequester.js'
/*               'NBT/Class.js',
              'NBT/App.js',
              'NBT/Provider.js',
              'NBT/Provider/Bing.js',
              'NBT/Provider/Geoserver.js',
              'NBT/Provider/ArcGIS.js',
              'NBT/Control.js',
              'NBT/Control/ZoomBar.js',
              'NBT/Control/InfoWindow.js',
              'NBT/Control/ResourceList.js',
              'NBT/Control/States.js',
              'NBT/Control/Geolocator.js',
              'NBT/Control/ClearSelection.js'
 */
          ];
      }

      // use "parser-inserted scripts" for guaranteed execution order
      // http://hsivonen.iki.fi/script-execution/
      var scriptTags = new Array(jsFiles.length);
      //var host = NBT._getScriptLocation();
      var host = '';
      for (var i=0, len=jsFiles.length; i<len; i++)
      {
        scriptTags[i] = '<script type="text/javascript" src="' + host + jsFiles[i] + '"></script>';
      }
      if (scriptTags.length > 0) {
          document.write(scriptTags.join(""));
      }
    }

})();
