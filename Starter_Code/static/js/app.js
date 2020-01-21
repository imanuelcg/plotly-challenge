d3.json("samples.json").then(function(data){
    samples = data.samples;
    metadata = data.metadata;
    names = data.names;
    // console.log(samples)
    // console.log(metadata)

    function init(){

        //Creating select statement
        names.forEach(t => {
            d3.select("#selDataset").append("option")
                                    .attr("value",t)
                                    .text(t)
        });

        // Creating bar chart on the initial function
        var top_10_labels = samples[0].otu_ids.slice(0,10);
        var top_10_values = samples[0].sample_values.slice(0,10);
        
        // console.log(top_10_labels)

        var bar_trace = {
            type: 'bar',
            x: top_10_values.reverse(),
            y: top_10_labels.reverse().map(t => `OTU ${t}`),            
            orientation: 'h'
        }

        var bar_data = [bar_trace]

        bar_layout = {
            yaxis: {'type':'category'},
            height: 500,
            width: 800
        };

        Plotly.newPlot("bar",bar_data,bar_layout);

        // Creating bubble chart
        var bubble_trace = {
            x: samples[0].otu_ids,
            y: samples[0].sample_values,
            mode: 'markers',
            marker: {
                size: samples[0].sample_values,
                color: samples[0].otu_ids,
                
            },
            text: samples[0].otu_labels
        };
    
        var bubble_data = [bubble_trace];
    
        bubble_layout = {
            xaxis: {
                title: "OTU ID"
            }
        };
        Plotly.newPlot("bubble-plot", bubble_data, bubble_layout);

        // Creating demographic for metadata
        
        Object.entries(metadata[0]).forEach(([key,value]) => {
           d3.select("#sample-metadata")
           .append("p")
           .text(`${key} : ${value}`)
        });
    };
    

    d3.selectAll("#selDataset").on("change",updatePlotly)

    function updatePlotly() {
        var data_set = d3.select("selDataset").property("value");

        // Creating variable to filtered the data
        var filtered_data = samples.filter(r => r.id === data_set)[0];
        
        // Re-styling bar chart
        var barValues = filtered_data.sample_values.slice(0,10).reverse();
        var barLabels = filtered_data.otu_ids.slice(0,10).reverse();

        Plotly.restyle("bar","x",[barValues]);
        Plotly.restyle("bar","y",[barLabels]);

        // Re-styling bubble chart
        var xBubbles = filtered_data.otu_ids;
        var yBubbles = filtered_data.sample_values;
        var updateBubbles = {
            size: filtered_data.sample_values,
            color: filtered_data.otu_ids
        }
        var textBubbles = filtered_data.otu_ids

        Plotly.restyle("bubble-plot","x",[xBubbles]);
        Plotly.restyle("bubble-plot","y",[yBubbles]);
        Plotly.restyle("bubble-plot","marker",[updateBubbles]);
        Plotly.restyle("bubble-plot","text",[textBubbles]);

        // Changing metadata information
        Object.entries(metadata.filter(i => i.id === data_set)).forEach(([key,value]) => {
            d3.select("#sample-metadata")
            .append("p")
            .text(`${key} : ${value}`)
         });
    };

    init();
});
