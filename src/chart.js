const data = [
  { year: "2017", value: 4.4 },
  { year: "2018", value: 6.6 },
  { year: "2019", value: 6.1 },
  { year: "2020", value: 5.1 },
  { year: "2021", value: 6 },
  { year: "2022", value: 6.8 },
  { year: "2023", value: 6.8 },
];

const margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const x = d3.scaleBand().range([0, width]).padding(0.1),
  y = d3.scaleLinear().range([height, 0]);

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(data.map((d) => d.year));
y.domain([0, d3.max(data, (d) => d.value)]);

svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

svg.append("g").call(d3.axisLeft(y));

const line = d3
  .line()
  .x((d) => x(d.year) + x.bandwidth() / 2)
  .y((d) => y(d.value));

svg.append("path").data([data]).attr("class", "line").attr("d", line);

const tooltip = d3.select("body").append("div").attr("class", "tooltip");

svg
  .selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
  .attr("cy", (d) => y(d.value))
  .attr("r", 5)
  .on("mouseover", function (event, d) {
    tooltip.transition().duration(200).style("display", "block");
    tooltip
      .html("Year: " + d.year + "<br/>Value: " + d.value)
      .style("left", event.pageX + 5 + "px")
      .style("top", event.pageY - 28 + "px");
  })
  .on("mouseout", function () {
    tooltip.transition().duration(500).style("display", "none");
  });
