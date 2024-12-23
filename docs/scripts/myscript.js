// add your JavaScript/D3 to this file
      var margin = {top: 50, right: 30, bottom: 100, left: 60},
          width = 800 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

      var svg = d3.select("div#plot")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Pick Rate vs Win Rate by Brawler");
      const rowConverter = function(d) {
        return {
          star_player_brawler_name: d.star_player_brawler_name,
          pick_rate: +d.pick_rate,
          win_rate: +d.win_rate,
          role: d.role
        };
      };

      const roleColors = {
        "Damage Dealers": "#FF0000", // Red
        "Tanks": "#0000FF",         // Blue
        "Marksmen": "#FFD700",      // Gold
        "Assassins": "#00FF00",     // Green
        "Supports": "#FF00FF",      // Magenta
        "Controllers": "#00FFFF",   // Cyan
        "Artillery": "#FFA500"      // Orange
      };

      d3.csv("https://raw.githubusercontent.com/Rohan3921/brawlstarsanalysis/refs/heads/main/pick_win_rates_rolls.csv", rowConverter)
        .then(function(data) {
          var x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.pick_rate) * 1.1])
            .range([0, width]);

          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(10))
            .append("text")
            .attr("x", width / 2)
            .attr("y", 50)
            .attr("text-anchor", "middle")
            .text("Pick Rate")
            .style("fill", "black");

          var y = d3.scaleLinear()
            .domain([0.4, 0.8])
            .range([height, 0]);

          svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("text-anchor", "middle")
            .text("Win Rate")
            .style("fill", "black");

          var tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "#f9f9f9")
            .style("padding", "5px 10px")
            .style("border", "1px solid #d3d3d3")
            .style("border-radius", "5px")
            .style("opacity", 0);

          var dots = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", d => x(d.pick_rate))
              .attr("cy", d => y(d.win_rate))
              .attr("r", 7)
              .style("fill", d => roleColors[d.role] || "#000000")
              .style("opacity", 0.7)
              .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html("<b>" + d.star_player_brawler_name + "</b><br>Pick Rate: " + d.pick_rate.toFixed(4) + "<br>Win Rate: " + d.win_rate.toFixed(4) + "<br>Role: " + d.role)
                  .style("left", (event.pageX + 5) + "px")
                  .style("top", (event.pageY - 28) + "px");
              })
              .on("mouseout", function() {
                tooltip.transition().duration(500).style("opacity", 0);
              });

          function filterRegions(region) {
            dots.style("opacity", function(d) {
              if (region === 1) return d.win_rate < 0.59 && d.pick_rate > 0.021 ? 0.7 : 0;
              if (region === 2) return d.win_rate >= 0.59 && d.pick_rate > 0.021 ? 0.7 : 0;
              if (region === 3) return d.win_rate < 0.59 && d.pick_rate <= 0.021 ? 0.7 : 0;
              if (region === 4) return d.win_rate >= 0.59 && d.pick_rate <= 0.021 ? 0.7 : 0;
              return 0.7;
            });
          }

          d3.select("#filterButton").on("click", function() {
            dots.style("opacity", d => d.win_rate > 0.6 ? 0.7 : 0);
          });

          d3.select("#resetButton").on("click", function() {
            dots.style("opacity", 0.7);
          });

          d3.select("#region1").on("click", function() {
            // dots.style("opacity", d => d.pick_rate < 0.59 && d.win_rate > 0.021 ? 0.7 : 0);
            filterRegions(1);
          });

          d3.select("#region2").on("click", function() {
            // dots.style("opacity", d => d.win_rate > 0.6 ? 0.7 : 0);
            filterRegions(2);
          });

          d3.select("#region3").on("click", function() {
            // dots.style("opacity", d => d.win_rate > 0.6 ? 0.7 : 0);
            filterRegions(3);
          });

          d3.select("#region4").on("click", function() {
            // dots.style("opacity", d => d.win_rate > 0.6 ? 0.7 : 0);
            filterRegions(4);
          });
        })
        .catch(function(error) {
          console.error("Error loading the data: ", error);
        });
