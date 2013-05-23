/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Class to handle generic listing of resources. Configure the class and then
 * pass in some set of features to listFeatures() and it should show up.
 *
 * @requires NBT.js
 */

NBT.Control.ResourceList = OpenLayers.Class(NBT.Control, {

    /**
     * jQuery selector to find the location where the resource listing will live.
     */
    listSelector: '#RL_List',

    listTemplate: 'list_template.html',

    listItemTemplate: 'list_item_template.html',

    /**
     * Set as callback to run when 0 features are given to be listed.
     */
    onNoneFound: null,

    /**
     * Set a list to look for only those attributes to replace in the template.
     * Otherwise listFeatures will look through all attributes on each feature.
     not implemented yet.
     */
    //templateAttributes: null,

    /**
     * Function to process individual values.
     */
    processValue: null,

    /**
     * Function to use when each resource is clicked, receives the feature object.
     */
    resourceClick: null,

    /**
     * Used to provide a header/footer count of number of features found.
     * Template will replace #resource_name_count# with the count + this, and then
     * will remove either #singular#(text)#singular# or #plural#(text)#plural#
     * depending on features count. It'll use #max# in the same way if you
     * hand listFeatures more than this.maxCount. So, template could look like:
     *
     * #RL_1#<h3>#resource_name_count# found</h3>#RL_1#
     * #RL_N#<h3>#resource_name_count# found</h3>#RL_N#
     * #RL_Max#<h3>#resource_name_count# found, showing #RL_MaxCount#</h3>#RL_Max#
     *
     */
    resourceName: {
      singular: 'resource',
      plural: 'resources',
    },

    /**
     * Maximum number of features to show in the listing. If < 1, all will show.
     */
    maxCount: 0,

    regExps: {
      RL_COUNT: new RegExp('#RL_Count#', 'g'),
      RL_MAXCOUNT: new RegExp('#RL_MaxCount#', 'g'),
      RL_S: new RegExp('#RL_S#', 'g'),
      RL_NUM: new RegExp('#RL_Num#', 'g'),
      RL_MAX: new RegExp('#RL_Max#', 'g'),
      RL_NUM_Line: new RegExp('#RL_Num#(.)+#RL_Num#'),
      RL_MAX_Line: new RegExp('#RL_Max#(.)+#RL_Max#'),
      RL_DISTANCE: new RegExp('#RL_Distance#', 'g')
    },

    /**
     * After any preparation (like distance calculation / ordering / removing
     * outside certain extent), list features in a results pane.
     */
    listFeatures: function(features) {

      if (features.count == 0 && typeof(this.onNoneFound) == 'function')
      {
        this.onNoneFound(location);
        return;
      }

      // get the encompassing template text:
      var listText = this.getTemplate(this.listTemplate);

      var listItemsText = '';

      // lazy load item template:
      var listItemText = this.getTemplate(this.listItemTemplate);

      // replace count vars in the list template
      var RL_Count = features.length;
      if (this.maxCount > 0 && RL_Count > this.maxCount)
      {
        listText = listText.replace(this.regExps.RL_NUM_Line, ''); // wipe that line.
        listText = listText.replace(this.regExps.RL_MAX, ''); // remove those hints.
        listText = listText.replace(this.regExps.RL_MAXCOUNT, this.maxCount);
        listText = listText.replace(this.regExps.RL_S, 's');
      }
      else
      {
        var RL_S = 's';
        if (RL_Count == 1)
        {
          RL_S = '';
        }

        listText = listText.replace(this.regExps.RL_MAX_Line, ''); // wipe that line.
        listText = listText.replace(this.regExps.RL_NUM, ''); // remove those hints.
        listText = listText.replace(this.regExps.RL_COUNT, RL_Count);
        listText = listText.replace(this.regExps.RL_S, RL_S);
      }

      $(this.listSelector).replaceWith(listText);
      var newList = $(this.listSelector);

      // now on to the actual list!
      for (var i = 0; i < features.length; i++)
      {
        if (this.maxCount > 0 && i > this.maxCount) // limit total listing...
        {
          break;
        }

        var feature = features[i];

        var item = listItemText; // copy of template

        for (var key in feature.attributes)
        {
          var regex = new RegExp('#' + key + '#', 'g');
          var value = feature.attributes[key];

          // optionally, do client-specific rule processing on the value:
          if (typeof(this.processValue) == 'function')
          {
            value = this.processValue(key, value);
          }
          else if (value == null)
          {
            value = '';
          }

          item = item.replace(regex, value);
        }

        // replace distance if called for:
        var distance = '';
        if (feature.attributes.RL_DISTANCE)
        {
          var distance = feature.attributes.RL_DISTANCE; // calculated before you got here.
          if (typeof(this.distanceCleanup) == 'function')
          {
            distance = this.distanceCleanup(distance); // convert to miles or whatever.
          }
        }
        item = item.replace(this.regExps.RL_DISTANCE, distance);

        // add the feature to the item as data for later use and append it to the list:
        var jItem = $(item).appendTo(newList);
        jItem.data('feature', feature);
        // add a defined function to the resource, passing in the feature to it.
        if (typeof(this.resourceClick) == 'function')
        {
          jItem.data('resourceClick', this.resourceClick);
          jItem.click( function() {
              var func = $(this).data('resourceClick');
              func($(this).data('feature'));
          });
        }
      }
    },

    orderFeaturesByDistance: function(features)
    {
      return features.sort(function(a, b) {
          return a.attributes.RL_DISTANCE - b.attributes.RL_DISTANCE;
      });
    },

    listFeaturesWithinDistance: function(features, location, distance)
    {
      // todo: get bbox extent to limit features' distance calcs.
      this.calculateDistance(features, location, distance);
      var featuresToShow = [];
      for (var i = 0; i < features.length; i++)
      {
        if (features[i].attributes.RL_DISTANCE <= distance)
        {
          featuresToShow.push(features[i]);
        }
      }

      if (featuresToShow.length > 0)
      {
        featuresToShow = this.orderFeaturesByDistance(featuresToShow);
      }

      this.listFeatures(featuresToShow);
    },

    /**
     *
     */
    listFeaturesThatMatch: function(features, testFunction)
    {
      var featuresToShow = [];
      for (var i = 0; i < features.length; i++)
      {
        if (testFunction(features[i]))
        {
          featuresToShow.push(features[i]);
        }
      }

      this.listFeatures(featuresToShow);
    },

    /**
     * One of the first things to do: calculate distance up to a maximum for
     * features relative to a given location.
     */
    calculateDistance: function(features, location)
    {
      // first, set all the distances:
      for (var i = 0; i < features.length; i++)
      {
        features[i].attributes.RL_DISTANCE = (typeof(location) != 'undefined' && location != null) ? location.distanceTo(features[i].geometry) : null;
      }
    },

    CLASS_NAME: 'NBT.Control.ResourceList'

});
