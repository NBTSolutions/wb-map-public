/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Root class for all NBT classes that don't extend back to OL directly.
 *
 * @requires NBT.js
 */

NBT.Class = OpenLayers.Class({

    /**
     * Lazy init storage for named text templates.
     */
    templates: {},

    initialize: function(config) {
      OpenLayers.Util.extend(this, config);
    },

    /**
     * Retrieve a template to use in populating some part of the website. This uses
     * simple caching to avoid reloading the template multiple times.
     * TODO: update with html5 local caching.
     */
    getTemplate: function(templateUrl)
    {
      // use as-is if url starts with 'http' or '/'
      if (templateUrl.indexOf('http') != 0 && templateUrl.slice(0,1) != '/')
      {
        var loc = NBT._getScriptLocation();
        loc = loc.substr(0, loc.length - 1);
        templateUrl = loc.substr(0, loc.lastIndexOf('/') + 1) + templateUrl;
      }

      if (typeof(this.templates[templateUrl]) == 'undefined' || this.templates[templateUrl] == null)
      {
        var infoReq = OpenLayers.Request.GET({url:templateUrl, async:false});
        this.templates[templateUrl] = infoReq.responseText;
      }

      return this.templates[templateUrl];
    },

    CLASS_NAME: 'NBT.Class'
});

