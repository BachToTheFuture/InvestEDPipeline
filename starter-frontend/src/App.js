import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  //put all your data collecting code here
  const query = "[out:json];node[amenity=cafe](42.370532, -71.121389, 42.480323, -71.109754);out;"
  const overpassUrl = "https://overpass-api.de/api/interpreter";
  const [elements, setElements] = useState([]);

  useEffect(() => {
    fetch(overpassUrl + "?data=" + query)
      .then(response => response.json())
      .then(data => {
        console.log(data.elements)
        setElements(data.elements)
    })
  }, [])

  return (
    <div className="App">
      <h1>Data Visualizations</h1>
      {elements.length > 0 ? (
        elements.map((item) => (
          <li>{item.tags.name}</li>
        ))
      ) : (
        <h1>Loading data...</h1>
      )}
    </div>
  );
}
  

//   return (
//     //if you run `npm start` without changing this file,
//     //you should get a blank page :)
//     <div className="App">
//       <h1>Data Visualizations</h1>
//     </div>
//   );
// }

export default App;
