/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Creating a base class for NBT OL-based webapps. These classes will build off
 * OpenLayers but will live in the NBT namespace.
 *
 * @requires OpenLayers.js
 */
(function() {

    var singleFile = false; // TODO: figure this out someday.

    var jsFiles = window.NBT;

    window.NBT = {

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
              'NBT/Class.js',
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
              'NBT/Control/ClearSelection.js',
              'NBT/Protocol.js',
              'NBT/Protocol/MultiRequester.js',
              'NBT/Format.js',
              'NBT/Format/ArcGIS.js',
              'NBT/Rule.js',
              'NBT/Index.js',
              'NBT/Index/QuadTree.js',
              'NBT/Strategy.js',
              'NBT/Strategy/FixedFilter.js',
              'NBT/Thematic.js',
              'NBT/Thematic/Classifier.js',
              'NBT/Thematic/LayerUpdater.js'
          ];
      }

      // use "parser-inserted scripts" for guaranteed execution order
      // http://hsivonen.iki.fi/script-execution/
      var scriptTags = new Array(jsFiles.length);
      var host = NBT._getScriptLocation();
      for (var i=0, len=jsFiles.length; i<len; i++)
      {
        scriptTags[i] = '<script type="text/javascript" src="' + host + jsFiles[i] + '"></script>';
      }
      if (scriptTags.length > 0) {
          document.write(scriptTags.join(""));
      }
    }

})();
