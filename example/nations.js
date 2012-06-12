$(function() {
    function x(d) { return d.income; }
    function y(d) { return d.lifeExpectancy; }
    function radius(d) { return d.population; }
    function color(d) { return d.region; }
    function key(d) { return d.name; }

    // Chart dimensions.
    var margin = { top: 19.5, right: 19.5, bottom: 19.5, left: 39.5 },
        width = 960 - margin.right,
        height = 540 - margin.top - margin.bottom;

    // Various scales. These domains make assumptions of data, naturally.
    var x_scale = d3.scale.log().domain([300, 1e5]).range([0, width]),
        y_scale = d3.scale.linear().domain([10, 85]).range([height, 0]),
        radius_scale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]),
        color_scale = d3.scale.category10();

    // The x & y axes.
    var x_axis = d3.svg.axis().orient('bottom').scale(x_scale).ticks(12, d3.format(',d')),
        y_axis = d3.svg.axis().scale(y_scale).orient('left');

    // Create the SVG container and set the origin.
    var svg = d3.select('#nations').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Add the x-axis.
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x_axis);

    // Add the y-axis.
    svg.append('g')
        .attr('class', 'y axis')
        .call(y_axis);

    // Add an x-axis label.
    svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', height - 6)
        .text('income per capita, inflation-adjusted (dollars)');

    // Add a y-axis label.
    svg.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text('life expectancy (years)');

    // Add the year label; the value is set on transition.
    var label = svg.append('text')
        .attr('class', 'year label')
        .attr('text-anchor', 'end')
        .attr('y', height - 24)
        .attr('x', width)
        .text('1800');

    // Load the data.
    d3.json('nations.json', function(nations) {
        // A bisector since many nation's data is sparsely-defined.
        var bisect = d3.bisector(function(d) { return d[0]; });

        // Add a dot per nation. Initialize the data at 1800, and set the colors.
        var dot = svg.append('g')
            .attr('class', 'dots')
            .selectAll('.dot')
                .data(interpolateData(1800))
            .enter().append('circle')
                .attr('class', 'dot')
                .style('fill', function(d) { return color_scale(color(d)); })
                .call(position)
                .sort(order);

        // Positions the dots based on data.
        function position(dot) {
            dot.attr('cx', function(d) { return x_scale(x(d)); })
               .attr('cy', function(d) { return y_scale(y(d)); })
               .attr('r', function(d) { return radius_scale(radius(d)); });
        }

        // Defines a sort order so that the smallest dots are drawn on top.
        function order(a, b) {
            return radius(b) - radius(a);
        }

        // Interpolates the dataset for the given (fractional) year.
        function interpolateData(year) {
            return nations.map(function(d) {
                return {
                  name: d.name,
                  region: d.region,
                  income: interpolateValues(d.income, year),
                  population: interpolateValues(d.population, year),
                  lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
                };
            });
        }

        // Finds (and possibly interpolates) the value for the specified year.
        function interpolateValues(values, year) {
            var i = bisect.left(values, year, 0, values.length - 1),
                a = values[i];
            if (i > 0) {
                var b = values[i - 1],
                    t = (year - a[0]) / (b[0] - a[0]);
                return a[1] * (1 - t) + b[1] * t;
            }
            return a[1];
        }
    });
});
