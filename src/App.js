import './App.css'
import {useEffect, useState} from 'react';
import {Chart as ChartJS} from 'chart.js/auto';
import {Bar} from 'react-chartjs-2';

class FoodEvent {
  constructor (name, amountg, time, date){
    this.name = name;
    this.amountg = amountg;
    let timestamp = new Date();
    if(time != ''){
      timestamp = new Date(time);
    }
    this.timestamp = timestamp;
  }
}

function App() {
  
  const [petsState, setPetsState] = useState([]);

  useEffect(() => {
    let pets = localStorage.getItem("mypet");
    if(pets == null){
      let pets = [];
      let pet = {};
      //TODO setup
      //TODO add pets
      pet.type = 'Dog';
      pet.name = 'Molly';
      pet.feed = [{name: 'Snack', amountg: 125}, {name: 'Half', amountg: 250}, {name: 'Full', amountg: 500}];
      pet.history = [];
      pets.push(pet);

      let pet2 = {};
      //TODO setup
      //TODO add pets
      pet2.type = 'Shrimp';
      pet2.name = 'Salad';
      pet2.feed = [{name: 'Snack', amountg: 5}];
      pet2.history = [];
      pets.push(pet2);
      setPetsState(pets);
    }
  }, []);

  
  //Multiple pets, so we need a pet level element with state?
  let petElements = petsState.map((pet) => {
    return (
      <Pet key={pet.name} pet={pet}/>
    );
  });
  
  return (
    <div className="App">
      {petElements}
    </div>
  );
}

function Pet(props){
  const [timeState, setTimeState] = useState('');

  function handleTimeChange(e){
    setTimeState(e.target.value);
  }

  function handleClearTime(e){
    setTimeState('');
  }

  function handleFeeding(e){
    props.pet.history.push(new FoodEvent(e.target.getAttribute('foodname'), e.target.getAttribute('amountg'), timeState, null));
    setTimeState('');
  }

  let feeds = props.pet.feed.map((food) => {
    return (
      <button key={food.name} foodname={food.name} pet={props.pet.name} amountg={food.amountg} onClick={handleFeeding}>Fed {props.pet.name} {food.name} ({food.amountg}g)</button>
    );
  });

  const d = new Date();
  let hour = d.getHours();
  let labels = [];
  for(let i = 1; i > -23; i--){
    let newVal = hour + i - 1;
    if(newVal < 0){
      newVal += 24;
    }
    labels.unshift(newVal);
  }
  let data = [];
  let now = new Date();
  let nowHours = now.getHours();
  for(let j = 0; j < 24; j++){
    let nowDate = new Date();
    let next = new Date();
    nowDate.setHours(nowHours  - j);
    nowDate.setMinutes(0);
    next.setHours(nowHours - j + 1);
    next.setMinutes(0);
    let totalAmountg = props.pet.history.map((event) => {
      if(event.timestamp > nowDate && event.timestamp < next){
        return event.amountg;
      } else {
        return 0;
      }
    });
    
    let sum = 0;
    for (let i = 0; i < totalAmountg.length; i++){
      sum += parseInt(totalAmountg[i]);
    }

    data.unshift(sum);
  }

  return(
    <div key={props.pet.name}>
      <h1>{props.pet.type} {props.pet.name}</h1>
      {feeds}
      <input type='datetime-local' id='feedTime' onChange={handleTimeChange} value={timeState}/>
      <button onClick={handleClearTime}>Clear Time</button>
      
        <Bar 
        data={{
          labels: labels,
          datasets: [
            {
              label: "Feeds Amount",
              data: data,
            }
          ]
        }}
        />
      
    </div>
  );
}

export default App;
