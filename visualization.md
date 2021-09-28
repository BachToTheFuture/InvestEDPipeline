# Luke Sorensen's Data Visualization
## Overview
I implemented a bar chart and a custom pie chart to represent the different amenities that are available near campus. 

## Implementation 
I fetched all instances of amenities in the surrounding area (resulting in over 300 data points), aggregated the data, and filtered to only include amenities with more than 5 instances. This doesn't exactly fit the spec of "end up with an array of 20 Javascript objects", but I concluded that this would lead to a more interesting visualization. The bar chart and the pie chart both display the same data, using the same colors, so the data object is reused between the two of them.

## Custom Pie Chart
There isn't much to be said about the pie chart, but it more clearly illustrates that there are significantly more bicycle parking spots, restaurants, and benches than the other amenities in the area. 