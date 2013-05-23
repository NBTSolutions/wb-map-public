/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Sends a collection of URLs back to a processor that runs them in parallel
 * and returns the results in a single package. This is based on HTTP and its
 * use by GetFeature, so I'm not trying to make it all-inclusive.
 *
 * @requires NBT.js
 */

NBT.Protocol.MultiRequester = OpenLayers.Class(OpenLayers.Protocol, {

    /**
     * Where the requester will send all the requests.
     */
    processUrl: null,

    urls: null,

    params: null,

    /**
     * Map object. Used on a read to decide which URLs to use in the request.
     * The 'name' of each URL added will be checked for layers on the map and
     * only be included on the request if the layer is visible.
     */
    map: null,

    initialize: function(options)
    {
      options = options || {};
      this.params = {};
      this.headers = {};
      this.urls = [];

      OpenLayers.Protocol.prototype.initialize.apply(this, arguments);
    },

    /**
     * Add a url to the collection.
     */
    addUrl: function(layerName, requestUrl, options)
    {
      var formatter = options.format || this.format;
      options.format = '';
      // not sure wtf I was trying to do here.
      // if (typeof(options) == 'string')
      // {
        // url = options;
        // options = {};
      // }
      // else
      // {
        // url = options.url;
        // options.url = '';
      // }

      this.urls.push({ layerName: layerName, url: requestUrl, formatter: formatter, params: options });
    },

    /**
     * Disregard multiple selection and just request a single one. This is used
     * for cases like clicking on a feature in a list and having it pop up on
     * the screen.
     */
    setSingleLayer: function(layerName)
    {
      this.singleLayer = layerName;
    },

    /**
     * Perform the read - called by GetFeature for instance.
     */
    read: function(options)
    {
        // top bit just copied from HTTP
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        options = options || {};
        options.params = OpenLayers.Util.applyDefaults(
            options.params, this.options.params);
        options = OpenLayers.Util.applyDefaults(options, this.options);
        if (options.filter && this.filterToParams) {
            options.params = this.filterToParams(
                options.filter, options.params
            );
        }

        var urlHash = {};
        for (var u in this.urls)
        {
          if (this.singleLayer == null || this.singleLayer == this.urls[u].layerName)
          {
            var layers = this.map.getLayersByName(this.urls[u].layerName);
            for (var l in layers)
            {
              var layer = layers[l];
              if (layer.getVisibility())
              {
                var p = OpenLayers.Util.extend(this.urls[u].params, options.params);
                var url = this.urls[u].url;
                var lastChar = url.substr(url.length-1);
                if (lastChar != '?' && lastChar != '&')
                {
                  url += (url.indexOf('?') > -1) ? '&' : '?';
                }
                url +=  OpenLayers.Util.getParameterString(p);
                urlHash[layer.name] = url; // name here is used to reference results.
                this.urls[u].key = layer.nbtId || layer.params.LAYERS.replace('icf:', '');
                break; // in case > 1 layer has same name.
              }
            }
          }
        }

        // can't use 'this' in the .post() but I can use a local variable:
        var urlFormatters = this.urls;

        // send it along, using jquery ajax()
        $.post(this.processUrl, encodeURIComponent(JSON.stringify(urlHash)), function(data) {
            var results = {};
            var features = [];
            for (var i in urlFormatters)
            {
              var name = urlFormatters[i].layerName;
              if (typeof(data[name]) != 'undefined')
              {
                // with results, send each url's associated formatter the data,
                // to retrieve feature objects:
                results[name] = urlFormatters[i].formatter.read(data[name]);
                for (var f in results[name])
                {
                  var feature = results[name][f];
                  feature.layer = urlFormatters[i].key;
                  features.push(feature);
                }
              }
            }

            var resp = new OpenLayers.Protocol.Response({requestType: "read"});
            resp.code = OpenLayers.Protocol.Response.SUCCESS;
            resp.features = features;

            options.callback.call(options.scope, resp);
        }, 'json');
    },

    /**
     * Run when the results are in. Results will be passed to this in a hash
     * by URL => json data. This should be overridden to actually do something.
     */
    resultsCallback: function(hash)
    {
    },

    CLASS_NAME: 'NBT.Protocol.MultiRequester'
});
