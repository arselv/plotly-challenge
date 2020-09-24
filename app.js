// Build a function that pull all metadata for each sample 
// Function 1 = Bring the metadata of each sample aka id, you will carry its demographic
// Function 2 = Create the graphs (bar and bubble) for each sample selected 
// Function 3 = it will initialize the entire graphs (dashboard)
// function 4 = Objectchange function to change to clear dashboard and change with new data
// Call function 3 (the one that initialize the dashboard)


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
    console.log(data)
    //console.log("yay")
    myData = data.metadata;

    // filter your metadata in accordance to the selected id
    let metadataList = myData.filter(sampleObject => sampleObject.id == sample);
    let result = metadataList[0];

    // Use d3 to put in the index.html
    let demoLoc = d3.select("#sample-metadata");

    demoLoc.html(""); // clearing section where the demo data will be placed

        // Use object entries to loop through each key and value for the specific id sample, 
        // in this initial case it will be sample 0 or 941
    Object.entries(result).forEach(([key, value])=> {
        demoLoc.append("h5").text(`${key.toUpperCase()} : ${value}`);
        });
    });
};

function Charts(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data);
        console.log("yay");
        mySamples= data.samples;
    
        // filter your metadata in accordance to the selected id
        let SampleList = mySamples.filter(sampleObject => sampleObject.id == sample);
        let result = SampleList[0];

        let sv = result.sample_values;
        let label = result.otu_ids;
        let hovertext = result.otu_labels;

        let trace1 = {
            x: sv.slice(0, 10).reverse(),
            y: label.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            type: "bar",
            text: hovertext.slice(0, 10).reverse(),
            orientation: "h"
        };

        let dataBar = [trace1];

        let layoutBar = {
            title: "Top Ten Sample Results",
            xaxis: {
                title: "Sample Value"
            },
            yaxis: {
                title: "OTU ID"
            },
            margin: {t: 30, l:150}
        };
        Plotly.newPlot("bar", dataBar, layoutBar);

        let trace2 = {
            x: label,
            y: sv,
            text: hovertext,
            mode: "markers",
            marker: {
                color: label,
                size: sv,
                colorscale: "Jet"
            }
        };

        let dataBubbles = [trace2];

        let layoutBubbles = {
            title: "OTU Samples",
            showlegend: false,
            height: 600,
            width: 1000
        };

        Plotly.newPlot("bubble", dataBubbles, layoutBubbles);
    });
};

function init(){

    let selector = d3.select("#selDataset");

    // let bring the list Names from the sample.json
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;

        sampleNames.forEach((sample)=>{
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        })

        // call the first sample and the build charts and create the demo table
        let firstID = sampleNames[0];

        Charts(firstID);
        buildMetadata(firstID);
    })

}


function optionChanged(secondValue) {
    Charts(secondValue);
    buildMetadata(secondValue);
};


init();

