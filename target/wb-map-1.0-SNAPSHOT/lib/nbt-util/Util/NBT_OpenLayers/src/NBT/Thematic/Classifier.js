/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Reads a data structure to create a number of classes, then uses those classes
 * to build a set of Rules to apply to a layer to create a thematic map.
 *
 * @requires NBT.js
 */
NBT.Thematic.Classifier = OpenLayers.Class(NBT.Class, {

    /**
     * The default Classifier puts an equal number of attributes in each class
     * to divide up all the data rows in equal sets. Subclasses could (should)
     * provide other methods of classification.
     *
     * Take a look at an array of data (attributes), read the values of a
     * given attribute and sort them into classes. We don't care at this point
     * which class is assigned to each row of the data.
     *
     * Output will be an array of classes, each with a low/high value, looking
     * like this:
     * [{ low: 10, high: 15 },{ low: 15, high: 20 }]
     *
     * For now we'll consider the 'low' value inclusive and the 'high'
     * value exclusive. (TODO: Consider making that optional)
     */
    calculateClasses: function(data, propertyName, numberOfClasses)
    {
      // TODO: make sure propertyName exists in data.

      var classes = [];

      // sort the incoming data on propertyName:
      data.sort( function(a, b) {
          if (!a[propertyName] || !b[propertyName])
          {
            return 0;
          }
          if (a[propertyName] < b[propertyName])
          {
            return -1;
          }
          if (a[propertyName] > b[propertyName])
          {
            return 1;
          }
          return 0;
      });

      // divide count by numberOfClasses to get the number of values in
      // in each class.
      var countPerClass = Math.ceil(data.length / numberOfClasses);
      var current = 0;
      var currentClass = { high: Number.MAX_VALUE };
      for (var i in data)
      {
        current++;
        if (current > countPerClass)
        {
          classes.push(currentClass); // if we've filled this class, store it.
          currentClass = { high: Number.MAX_VALUE }; // then make a new class.
          current = 1; // reset current since this will be the first element in the new class.
        }
        if (!currentClass.low) // only be set on the current value.
        {
          currentClass.low = data[i][propertyName];
        }
        else
        {
          currentClass.high = data[i][propertyName];
        }
        currentClass.numberOfValues = current; // store number of records in this class.
      }

      // push the last class on:
      classes.push(currentClass);

      // TODO: Clean up the low/high numbers to make them more easily digestible
      // for humans. I'm thinking get the difference between [0].high and [1].low
      // and find a nice way to round it (like, if very small, don't worry about
      // it but if > 5, round to the nearest 5 or something).

      return classes;
    },

    /**
     * Create an array of Rules based on classes created by this object.
     * - propertyName: Name of the attribute to which the classes will apply.
     * - classes: Array of hashes for each class to be built as rules. Hash
     *   keys include:
     *   - low: low value
     *   - high: high value
     *   - style: style hash that will modify baseStyle for this class.
     * - baseStyle: basic Style hash options
     */
    buildRules: function(propertyName, classes, baseStyle)
    {
      var rules = [];
      for (var i = 0; i < classes.length; i++)
      {
        var rule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [
                  new OpenLayers.Filter.Comparison({
                      type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                      property: propertyName,
                      value: classes[i].low
                  }),
                  new OpenLayers.Filter.Comparison({
                      type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO, // TODO need to watch out for this down the road.
                      property: propertyName,
                      value: classes[i].high
                  })
                ]
            }),
            symbolizer: OpenLayers.Util.applyDefaults(classes[i].style, baseStyle)
        });

        rules.push(rule);
      }

      return rules;
    },

    CLASS_NAME: 'NBT.Thematic.Classifier'
});
