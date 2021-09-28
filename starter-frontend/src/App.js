import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import './App.css';

function App() {
  const baseUrl = "https://www.overpass-api.de/api/interpreter"
  const query = "[out:json]; node(42.370793, -71.125436, 42.378866, -71.109531)['amenity']; out;"

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(baseUrl + "?data=" + query)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(data => {
      // Find count of each type of amenity in Harvard Square
      const counts = {};
      data.elements
        .map(x => x.tags.amenity)
        .forEach(element => {
        counts[element] = counts[element] ? counts[element] + 1 : 1;
        });

      // Filter to only amenities with more than 5 occurrences
      const result = Object.fromEntries(
        Object.entries(counts).filter(([k, v]) => v > 5)
      )

      // Use the same data for both bar and pie charts
      setData({
        labels: Object.keys(result),
        datasets: [{
          label: "# of each amenity",
          data: Object.values(result),
          backgroundColor: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
          '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'],
          borderColor: '#808080',
          borderWidth: 1
        }]
      });
    })
    .catch(e => console.log(e));
  }, []);

  return (
    <div className="App">
      { data ?
        <div>
          <div className="chart">
            <Bar 
              data={data}
              height={400}
              width={600}
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                    }
                  }]
                }
              }}
            />
          </div>
          <div className="chart">
            <Pie 
              data={data}
              height={400}
              width={600}
              options={{ 
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      : null }
    </div>
  );
}

export default App;
