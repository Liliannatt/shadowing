document.addEventListener("DOMContentLoaded", function () {
  d3.json("./csvjson.json")
    .then(function (data) {
      const margin = { top: 50, right: 50, bottom: 100, left: 100 },
        width = 700 - margin.left - margin.right,
        height = 800;

      // Setup SVG
      const svg = d3
        .select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Scales and axes
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(["2017", "2018", "2019", "2020", "2021", "2022", "2023"])
        .padding(0.05);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      const y = d3
        .scaleBand()
        .range([height, 0])
        .domain(
          data.map(function (d) {
            return d.city;
          })
        )
        .padding(0.05);
      svg.append("g").call(d3.axisLeft(y));

      const myColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateCool)
        .domain([1, 10]);

      // Preprocess data
      let processedData = preprocess(data);

      // Event listener for the dropdown
      d3.select("#threshold").on("change", function () {
        const threshold = +d3.select(this).property("value");
        updateVisualization(processedData, threshold);
      });

      // Initial drawing
      updateVisualization(processedData, 0); // Default threshold

      function updateVisualization(data, threshold) {
        const filteredData = data.filter((d) => d.value > threshold);

        // Clear existing rectangles
        svg.selectAll("rect").remove();

        // Draw heatmap with filtered data
        svg
          .selectAll()
          .data(filteredData, function (d) {
            return d.year + ":" + d.city;
          })
          .enter()
          .append("rect")
          .attr("x", function (d) {
            return x(d.year);
          })
          .attr("y", function (d) {
            return y(d.city);
          })
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .style("fill", function (d) {
            return myColor(d.value);
          })
          .on("mouseover", function (event, d) {
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(`City: ${d.city}<br>Year: ${d.year}<br>Value: ${d.value}`)
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px");
          })
          .on("mousemove", function (event) {
            d3.select("#tooltip")
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px");
          })
          .on("mouseout", function () {
            d3.select("#tooltip").style("visibility", "hidden");
          });
      }

      // Preprocess function remains unchanged
      function preprocess(data) {
        let processedData = [];
        data.forEach((d) => {
          Object.keys(d).forEach((year) => {
            if (!isNaN(year) && year !== "" && d[year] !== "") {
              processedData.push({
                city: d.city,
                year: year,
                value: +d[year],
              });
            }
          });
        });
        return processedData;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
