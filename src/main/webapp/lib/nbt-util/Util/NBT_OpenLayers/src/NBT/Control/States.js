/*
 * Copyright (c) 2012 NBT Solutions.
 */

/**
 * Class to handle state/county select boxes.
 *
 * @requires NBT/Control.js
 */

NBT.Control.States = OpenLayers.Class(NBT.Control, {

    onStateSelect: null,

    onCountySelect: null,

  states: ['Alabama','Alaska','Arizona','Arkansas','California',
  'Colorado','Connecticut','Delaware','District of Columbia','Florida',
  'Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
  'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia',
  'Washington','West Virginia','Wisconsin','Wyoming'],

  territories: ['American Samoa','Guam','Northern Mariana Islands',
  'Puerto Rico','Virgin Islands'],

  two_letter: {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN',
    'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA',
    'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI',
    'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT',
    'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
    'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR',
    'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
    'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
    'Puerto Rico': 'PR'
  },

  // will be loaded on demand:
  counties: {},

  // on-demand:
  countyUls: {},

  stateBboxes: {
    "Alabama": [-88.473228,30.220857,-84.888247,35.008029],
    "Alaska": [-178.225676,51.590107,-130.007704,71.381432],
    "Arizona": [-114.816591,31.332178,-109.045223,37.004261],
    "Arkansas": [-94.617919,33.004106,-89.644838,36.49962],
    "California": [-124.409604,32.534157,-114.131212,42.009519],
    "Colorado": [-109.060257,36.992427,-102.041486,41.003445],
    "Connecticut": [-73.727776,40.986703,-71.786994,42.050588],
    "Delaware": [-75.788758,38.451016,-75.04829,39.839007],
    "District of Columbia": [-77.119901,38.791514,-76.909393,38.99511],
    "Florida": [-87.634938,24.54398,-80.031356,31.000969],
    "Georgia": [-85.605166,30.355644,-80.840569,35.000771],
    "Hawaii": [-160.24713,18.910797,-154.806581,22.23288],
    "Idaho": [-117.243028,41.988006,-111.043496,49.001147],
    "Illinois": [-91.51308,36.970298,-87.495199,42.508303],
    "Indiana": [-88.097892,37.771743,-84.78458,41.760689],
    "Iowa": [-96.639706,40.375437,-90.140061,43.501196],
    "Kansas": [-102.051769,36.993083,-94.588081,40.003166],
    "Kentucky": [-89.57151,36.497129,-81.964971,39.147459],
    "Louisiana": [-94.043257,28.926466,-88.816516,33.019544],
    "Maine": [-71.084335,43.064991,-66.949827,47.459687],
    "Maryland": [-79.487651,37.923944,-75.04894,39.723043],
    "Massachusetts": [-73.508143,41.237964,-69.926789,42.887549],
    "Michigan": [-90.418136,41.69609,-82.418604,48.190975],
    "Minnesota": [-97.239209,43.499357,-89.491638,49.384359],
    "Mississippi": [-91.655009,30.173943,-88.097889,34.99611],
    "Missouri": [-95.774704,35.995683,-89.098843,40.613641],
    "Montana": [-116.050004,44.35821,-104.039563,49.00139],
    "Nebraska": [-104.053515,39.999999,-95.30829,43.001708],
    "Nevada": [-120.005746,35.002086,-114.039649,42.002208],
    "New Hampshire": [-72.557247,42.696986,-70.708433,45.305476],
    "New Jersey": [-75.55979,38.92852,-73.89398,41.357424],
    "New Mexico": [-109.050173,31.332172,-103.001965,37.000294],
    "New York": [-79.762153,40.495906,-71.856086,45.015851],
    "North Carolina": [-84.32187,33.839883,-75.459872,36.588118],
    "North Dakota": [-104.048915,45.935021,-96.554508,49.000693],
    "Ohio": [-84.820204,38.403186,-80.518693,41.977524],
    "Oklahoma": [-103.002648,33.615773,-94.431215,37.002328],
    "Oregon": [-124.566705,41.991795,-116.463262,46.237317],
    "Pennsylvania": [-80.519791,39.719801,-74.689514,42.269861],
    "Rhode Island": [-71.886536,41.146141,-71.120555,42.018799],
    "South Carolina": [-83.353955,32.047044,-78.549197,35.21554],
    "South Dakota": [-104.05774,42.479636,-96.43659,45.945455],
    "Tennessee": [-90.310298,34.982924,-81.646901,36.678119],
    "Texas": [-106.645566,25.837434,-93.508055,36.500684],
    "Utah": [-114.052999,36.997905,-109.041059,42.001618],
    "Vermont": [-73.437741,42.726853,-71.464556,45.01666],
    "Virginia": [-83.675413,36.540739,-75.242266,39.466012],
    "Washington": [-124.733173,45.543542,-116.91558,49.002495],
    "West Virginia": [-82.644739,37.201483,-77.718935,40.638802],
    "Wisconsin": [-92.889433,42.491984,-86.805188,47.003379],
    "Wyoming": [-111.056888,40.994746,-104.052056,45.005904],
    "American Samoa": [-170.8469,-14.385,-168.95178,-13.93875],
    "Guam": [144.619263,13.240590,144.953995,13.652320],
    "Northern Mariana Islands": [139.093,13.706,149.31079,20.0935],
    "Puerto Rico": [-67.9427,17.8830,-65.2200,18.5202],
    "Virgin Islands": [-65.110,17.585,-64.494,18.427]
  },

  // loaded on-demand:
  countyBboxes: {},

  no_counties: ['District of Columbia', 'American Samoa', 'Guam',
    'Northern Mariana Islands', 'Virgin Islands'],

  initialize: function(options) {
    OpenLayers.Util.extend(this, options);
  },

  getStatesUl: function(includeTerritories) {
    var ul = $(document.createElement('ul'));
    ul.addClass('states');

    for (var i in this.states)
    {
      var li  = this._createStateLi(this.states[i]);
      ul.append(li);
    }

    if (includeTerritories)
    {
      var li = $(document.createElement('li'));
      li.addClass('territories');
      li.append('Territories');
      ul.append(li);

      for (var i in this.territories)
      {
        var li  = this._createStateLi(this.territories[i]);
        ul.append(li);
      }
    }

    return ul;
  },

  _createStateLi: function(name) {
    var li = $(document.createElement('li'));

    // make state name a <span> for selecting it:
    var span1 = $(document.createElement('span'));
    span1.addClass('state');
    span1.data('state', name);
    span1.data('has_counties', ($.inArray(name, this.no_counties) == -1));
    var st = this;
    // span1.click(function() {
        // st.selectState(this);
    // });
    span1.append(name);

    li.append(span1);
    return li;
  },

  getCountiesUl: function(state) {
    var abbr = this.two_letter[state].toLowerCase();

    // lazy load the county file into this class.
    // TODO: auto discover location.
    if (typeof(this.counties[abbr]) == 'undefined')
    {
      var req = OpenLayers.Request.GET({url:'js/counties/' + abbr + '.js',async:false});
      this.counties[abbr] = eval(req.responseText);
    }

    if (typeof(this.countyUls[abbr]) == 'undefined')
    {
      //create the ul container.
      var ul = $(document.createElement('ul'));
      ul.addClass('counties');

      // add the counties to it:
      var counties = this.counties[abbr];
      for (var i = 0; i < counties.length; i++)
      {
        var li = $(document.createElement('li'));
        li.append(counties[i]);
        li.data('state', abbr.toUpperCase());
        li.data('county', counties[i]);
        var st = this;
        li.click(function() { st.selectCounty(this); });

        ul.append(li);
      }

      ul.mouseleave(function() { $(this).hide(); });

      this.countyUls[abbr] = ul;
    }

    return this.countyUls[abbr];
  },

  selectCounty: function(which) {
    var li = $(which);

    var text = li.data('county') + ', ' + li.data('state');

    $('#state_select').val(text);
    $('#state_select').click();

    if (typeof(this.onCountySelect) == 'function')
    {
      this.onCountySelect(li.data('state'), li.data('county'));
    }
  },

  selectState: function(which) {
    var state = $(which).data('state');

    $('#state_select').val(state);
    $('#state_select').click();

    // turn on state highlight for the selected state. Requires a states WFS
    if (typeof(this.onStateSelect) == 'function')
    {
      this.onStateSelect(state);
    }
  },

  /**
   * Reverse lookup to get the full name from an abbreviation.
   */
   getStateName: function(abbr) {
     abbr = abbr.toUpperCase();
     for (var name in this.two_letter)
     {
       if (this.two_letter[name] == abbr)
       {
         return name;
       }
     }

     return null;
  },

  /**
   * Returned as an OpenLayers.Bounds.
   */
  getStateBbox: function(state) {
    return OpenLayers.Bounds.fromArray(this.stateBboxes[state]);
  },

  /**
   * Returned as an OpenLayers.Bounds.
   */
  getCountyBbox: function(state, county) {
    var abbr = state;
    if (abbr.length != 2)
    {
      abbr = this.two_letter[state];
    }
    abbr = abbr.toLowerCase();

    // lazy load the county file into this class.
    if (typeof(this.countyBboxes[abbr]) == 'undefined')
    {
      var req = OpenLayers.Request.GET({url:'js/bbox/' + abbr + '_bbox.json?2',async:false});
      this.countyBboxes[abbr] = JSON.parse(req.responseText);
    }

    return OpenLayers.Bounds.fromArray(this.countyBboxes[abbr][county]);
  },

  CLASS_NAME: 'NBT.Control.States'
});
