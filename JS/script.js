let url = "https://raw.githubusercontent.com/AvsarYagiz/json/main/tuik.json"
let req = new XMLHttpRequest()

let data
let values

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 1400
let height = 850    
let padding = 50

let svg = d3.select("svg")

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
}

let generateScales = () => {

    // Create a linear scale for the height of the bars
    heightScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => {
            return item[1]
        })])
        .range([0, height - (2 * padding)])

    // Create a linear scale for the x-coordinate of the bars
    xScale = d3.scaleLinear()
        .domain([0, values.length -1])
        .range([padding, width - padding])

    // Create a time scale for the x-axis
    let datesArray = values.map((item) => {
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding])

    // Create a linear scale for the y-coordinate of the bars
    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, (item) => {
            return item[1]
        })])
        .range([height - padding, padding])

}

let drawBars = () => {

    // Create a tooltip element
    let tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        

    // Draw the bars based on the data values
    svg.selectAll("rect")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("id", "bar")
        .attr("width", (width - (2 * padding)) / values.length)
        .attr("data-date", (item) => {
            return item[0]
        })
        .attr("data-gdp", (item) => {
            return item[1]
        })
        .attr("height", (item) => {
            return heightScale(item[1])
        })
        .attr("x", (item, index) => {
            return xScale(index)
        })
        .attr("y", (item, index) => {
            return (height - padding) - heightScale(item[1])
        })

       
            
        .on("mouseover", (item) => {
            // Show the tooltip on mouseover
            tooltip.transition()
                .style("visibility", "visible")

            tooltip.text(item[0]+" | $"+item[1])

            document.querySelector("#tooltip").setAttribute("data-date", item[0])
            document.querySelector("#tooltip").setAttribute("data-gdp", item[1])
        })
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-20)+"px").style("left",(d3.event.pageX+50)+"px");})
        .on("mouseout", (item) => {
            // Hide the tooltip on mouseout
            tooltip.transition()
                .style("visibility", "hidden")
        })

}

let generateAxes = () => {

    // Create the x-axis and y-axis with ticks
    let xAxis = d3.axisBottom(xAxisScale).ticks(d3.timeYear.every(1))
    let yAxis = d3.axisLeft(yAxisScale)

    // Append the x-axis to the svg
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")")

    // Append the y-axis to the svg
    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)")

}

// Make a GET request to fetch the JSON data
req.open("GET", url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()
