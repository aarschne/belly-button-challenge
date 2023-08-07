// Get the Roadster endpoint
const bellyButtonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// define global variables
let data;
let selected;

// function that runs when the dropdown is changed
function optionChanged(sel){
    selected = sel;

    //rerun the chart and demographic info with new value
    makeBarChart(selected);
    makeBubbleChart(selected);
    makeDemographicInfo(selected);
}

function populateDropDown(){
    let dropDownList = d3.select("#selDataset");

    // make drop down options
    dropDownList.selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .text(n => n)
        .attr("value", v => v)
}

function makeBarChart(subjectID){

    // filter data down to the subject in question
    let subjectData = data.samples.filter(s => s.id == subjectID);

    // initialize arrays
    let xData = [];
    let yData = [];
    let labels = [];

    // find the maximum amount of data points we have
    let min = Math.min(10, subjectData[0]["sample_values"].length)

    // populate arrays with the values from the json
    for(let i= 0; i < min; i++){
        xData.push("OTU" + subjectData[0]["otu_ids"][i]);
        yData.push(subjectData[0]["sample_values"][i]);
        labels.push(subjectData[0]["otu_labels"][i])
    }

    // reverse the arrays so they are in descending order
    xData.reverse();
    yData.reverse();
    labels.reverse();

    // make trace for the charts
    let trace = {
        x: yData,
        y: xData,
        text: labels,
        orientation: 'h',
        type: 'bar'
    };

    let dataTrace = [trace];

    let layout = {
        title: `Bar chart for Subject ${subjectID}`
    }

    Plotly.newPlot("bar", dataTrace, layout);
}

function makeBubbleChart(subjectID){

    // filter down data to only the subject in question
    let subjectData = data.samples.filter(s => s.id == subjectID);

    // initialize the arrays
    let xData = [];
    let yData = [];
    let labels = [];

    // find the maximum allowed length of the arrays
    let min = Math.min(10, subjectData[0]["sample_values"].length)

    // get the data to plot
    for(let i= 0; i < min; i++){
        xData.push(subjectData[0]["otu_ids"][i]);
        yData.push(subjectData[0]["sample_values"][i]);
        labels.push(subjectData[0]["otu_labels"][i])
    }

    // reverse the arrays so they are in descending order
    xData.reverse();
    yData.reverse();
    labels.reverse();

    // make the trace with the data
    let trace = {
        x: xData,
        y: yData,
        text: labels,
        mode: 'markers',
        marker: {
            size: yData,
            color: xData
        }
    };

    let dataTrace = [trace];

    let layout = {
        title: `Bubble chart for Subject ${subjectID}`
    }

    Plotly.newPlot("bubble", dataTrace, layout);
}

function makeDemographicInfo(subjectID){

    let subjectMetaData = data.metadata.filter(s => s.id == subjectID);
    let subjectKeys = Object.keys(subjectMetaData[0]);
    let subjectValues = Object.values(subjectMetaData[0]);

    let sampleMetadata = document.getElementById("sample-metadata");
    sampleMetadata.innerHTML = "";

    for(let i=0; i < subjectKeys.length; i++){
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(`${subjectKeys[i]}: ${subjectValues[i]}`));
        sampleMetadata.appendChild(div);
    };
    
}
function init(){

    // Fetch the JSON data
    d3.json(bellyButtonURL).then(d => {
        data = d;

        // initialize names and find first name
        let names = data.names;
        selected = names[0];

        // run the functions that make dropdown and charts
        populateDropDown();
        makeBarChart(selected);
        makeBubbleChart(selected);
        makeDemographicInfo(selected);
    });

   
}

init();