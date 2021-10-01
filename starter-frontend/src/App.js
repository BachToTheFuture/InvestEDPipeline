import './App.css';
import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

function App() {
  //put all your data collecting code here
  const query = '[out:json];node[amenity=cafe](42.370532, -71.121389, 42.480323, -71.109754);out;'
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const [elements, setElements] = useState([]);

  // retrieve data from Overpass
  useEffect(() => {
    fetch(overpassUrl + '?data=' + query)
      .then(response => response.json())
      .then(data => {
        setElements(data.elements)
    })
  }, [])

  // cafe name data
  var cafe_names = [];
  var cafe_count = [];
  for (let i = 0; i < elements.length; i++) {
    var name = elements[i].tags.name;
    if (!cafe_names.includes(name)) {
      cafe_names.push(name);
      cafe_count.push(1);
    }
    else {
      cafe_count[cafe_names.indexOf(name)] += 1;
    }
  }

  // cuisine data
  var cuisine_types = [];
  var cuisine_count = [];
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].tags.cuisine) {
      var cuisine = elements[i].tags.cuisine;
      if (!cuisine_types.includes(cuisine)) {
        cuisine_types.push(cuisine);
        cuisine_count.push(1);
      }
      else {
        cuisine_count[cuisine_types.indexOf(cuisine)] += 1;
      }
    }
  }

  return (
    <div className='App'>
      <div className='grid-container'>
        <h1>Data Visualizations</h1>
        <div className='grid-item'>
          <h2>Data:</h2>
          {elements.length > 0 ? (
            elements.map((item) => (
              <li>{item.tags.name}</li>
            ))
          ) : (
            <h1>Loading data...</h1>
          )}
        </div>
        <div className='grid-item'>
          <Bar 
            data={{
              labels: cafe_names,
              datasets: [
                {
                  label: 'Number of Locations',
                  data: cafe_count,
                  backgroundColor: 'rgba(255, 138, 113)'
                },
              ],
            }}
            height={400}
            width={600}
            options={{
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              }
            }}
          />
        </div>
        <div className='grid-item'>
          <Doughnut 
            data={{
              labels: cuisine_types,
              datasets: [{
                label: 'cuisine',
                data: cuisine_count,
                backgroundColor: [
                  'rgb(255, 195, 0)',
                  'rgb(255, 87, 51)',
                  'rgb(64, 176, 207)',
                  'rgb(64, 207, 83)'
                ],
                hoverOffset: 4
              }]
            }}
            height={400}
            width={600}
            options={{
              maintainAspectRatio: false,
              legend: {
                labels: {
                  fontColor: 'black',
                  fontSize: 48
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
