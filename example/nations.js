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
});
