import React,{Component} from 'react';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart } from "reaviz";
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {Form, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col} from 'reactstrap'
import { Map, TileLayer, Marker, Popup,GeoJSON,Circle,Tooltip } from 'react-leaflet'
import './App.css';
//import data from './data/diplomacy.json'
//import travel from './data/travel_advisory.json'
//import worldmap from './data/world_map.json'

//import virus_apr_data from './data/virus_data.json'

//import virus_jun_data from './data/virus_data.json'

//import virus_aug_data from './data/virus_data.json'
/*
import virus_data from './data/virus_data.json'
import virus_mar_data from './data/virus_mar_data.json'
import virus_may_data from './data/virus_may_data.json'
import virus_jul_data from './data/virus_jul_data.json'
import virus_sep_data from './data/virus_sep_data.json'
import virus_oct_data from './data/virus_data.json'
import virus_nov_data from './data/virus_nov_data.json'
import testing_data from './data/testing_data.json'
import hospital_list from './data/hospital_list.json'
import nursing_bronx from './data/nursing_bronx.json'
import COVID_19_Manhattan from './data/COVID_19_Manhattan.json' */

import virus_data from './data/virus_data.json'
import virus_mar_data from './data/virus_mar_data.json'
import virus_may_data from './data/virus_data.json'
import virus_jul_data from './data/virus_aug_data.json'
import virus_sep_data from './data/virus_data.json'
import virus_oct_data from './data/virus_data.json'
import virus_nov_data from './data/virus_nov_data.json'
import testing_data from './data/testing_data.json'
import hospital_list from './data/hospital_list.json'
import nursing_bronx from './data/nursing_bronx.json'
import COVID_19_Manhattan from './data/COVID_19_Manhattan.json'
import ReactPlayer from 'react-player/youtube'
import { TwitterTimelineEmbed} from 'react-twitter-embed';
import Footer from './components/Footer';
import Header from './components/Header';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import worldGeoJSON from 'geojson-world-map';

const googleMapsClient = require('@google/maps').createClient({
  key: 'add key here',
  Promise: Promise
});

var myGoogleIcon = L.icon({
  iconUrl: '/images/google_icon.png',
  iconSize: [25,41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
  });

var myIcon = L.icon({
iconUrl: '/images/building_icon.png',
iconSize: [25,41],
iconAnchor: [12.5, 41],
popupAnchor: [0, -41]
});


var mySecondIcon = L.icon({
  iconUrl: './images/star.png',
  iconSize: [25,41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41]
  });

var circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50
});

class App extends Component {



  getNursingAidCircle = (value) => 
  {
    if(isNaN(value) == true || value == null)
    {
      return 'white';
    }
    var color = 'white';
  
  value = parseInt(value);
  
  if(value < 1)
  {
    color = 'green'
  }

  else 
  {
    color = 'red';
  }
  
  return color
  
  }

  getHospitalAidRadius = (value) => {

    var radius = 500;
    if(isNaN(value) == true || value == null)
    {
      return 0;
    }
   
    return radius;
  }


  getHospitalAidCircle = (value) => 
  {
    if(isNaN(value) == true || value == null)
    {
      return 'black';
    }
    var color = 'black';
  
  value = parseInt(value);
  
  if(value < 1)
  {
    color = 'brown'
  }

  else 
  {
    color = 'blue';
  }
  
  return color
  
  }

  getNursingAidRadius = (value) => {

    var radius = 500;
    if(isNaN(value) == true || value == null)
    {
      return 0;
    }
   
    return radius;
  }

  getAidCircle = (value) => 
  {
    if(isNaN(value) == true || value == null)
    {
      return 'white';
    }
    var color = 'white';
  
  value = parseInt(value);
  
  if(value < 10)
  {
    color = 'green'
  }
  else if(value >= 10 && value < 1000)
  {
    color = 'blue';
  }
  else 
  {
    color = 'red';
  }
  
  return color
  
  }

  getAidRadius = (value) => {

    if(isNaN(value) == true || value == null)
    {
      return 100;
    }
    var radius = 1000;

    value = parseInt(value);
    if(value >= 0 && value < 10)
    {
      radius = 10 * value;
    }
    else if(value >= 10 && value < 1000)
    {
      radius = 5 * value;
    }
    else
    {
      radius = 1 * value/2;
    }
    return radius;
  }

  onClickedUp = () =>
  {
    if(parseInt(this.state.value) === 11)
    return;
    console.log(this.state.value);
    this.setState({value: parseInt(this.state.value) + 4});
    this.onValueChangedButton(parseInt(this.state.value) + 4);
    console.log(this.state.value);
  }

 
  onClickedDown =() =>
  {
    if(parseInt(this.state.value) === 3)
    return;
    console.log(this.state.value);
    this.setState({value: parseInt(this.state.value) - 4 });
    this.onValueChangedButton(parseInt(this.state.value) - 4);
    console.log(this.state.value);
  }

  onSelectionChanged = (event) => {
    var value = event.target.value;

      var filter_history = testing_data.filter(function (pilot) {
      return (pilot.County) == value;
    });
   
    var rows = [];
      for (var i = 0; i < filter_history.length; i++) {
        rows.push({"key": filter_history[i].Test_Date,
          "data" : parseInt(filter_history[i].Total_Number_of_Tests_Performed)});
      };
 
      this.setState({all_testing_data: rows});

  }

  onValueChangedButton = (value) => {
    
  
    if(value == 3)
    {
      var filter_data= virus_mar_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });

      this.setState({virus_data: filter_data});
    }
     else if(value== 4)
    {
      /*
      var filter_data= virus_apr_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
         else if(value == 5)
    {
      var filter_data= virus_may_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }
            else if(value == 6)
    {
     /* var filter_data= virus_jun_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
    else if(value== 7)
    {
      var filter_data= virus_jul_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }
      else if(value == 8)
    {
     /* var filter_data= virus_aug_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
        else if(value == 9)
    {
      var filter_data= virus_sep_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }
    else if(value == 10)
    {
      /*var filter_data= virus_oct_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
    else
    {
      var filter_data= virus_nov_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }

  }

  onValueChanged = (event) => {
    
    this.setState({value: event.target.value});
    if(event.target.value == 3)
    {
      var filter_data= virus_mar_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });

      this.setState({virus_data: filter_data});
    }
     else if(event.target.value == 4)
    {
     /* var filter_data= virus_apr_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
         else if(event.target.value == 5)
    {
      var filter_data= virus_may_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }
            else if(event.target.value == 6)
    {
     /* var filter_data= virus_jun_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
    else if(event.target.value == 7)
    {
      var filter_data= virus_jul_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }
      else if(event.target.value == 8)
    {
    /*  var filter_data= virus_aug_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
        else if(event.target.value == 9)
    {
      var filter_data= virus_sep_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }
    else if(event.target.value == 10)
    {
     /* var filter_data= virus_oct_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});*/
    }
    else
    {
      var filter_data= virus_nov_data.filter(function (pilot) {
        return pilot.province_state == "New York";
      });
      this.setState({virus_data: filter_data});
    }

  }

  state={
    location: {
      lat: 40.766505,
      lng: -73.877285,
      },
    zoom: 10,
    all_testing_data:[
      
    ],
    value:3,
    virus_data: virus_data,
    virus_mar_data: virus_mar_data,
    //virus_apr_data: virus_apr_data,
    virus_may_data: virus_may_data,
    //virus_jun_data: virus_jun_data,
    virus_jul_data: virus_jul_data,
    virus_sep_data: virus_sep_data,
    virus_oct_data: virus_oct_data,
    virus_nov_data: virus_nov_data,
    testing_data: testing_data,
    hospital_list: hospital_list,
    nursing_bronx: nursing_bronx,
    COVID_19_Manhattan: COVID_19_Manhattan,
    show_wildlife: true,
    show_bronx: false,
    show_manhattan: false
  }

  getHospitalIcon = (score) =>
  {
 
    if(score == null)
    score = 0;
 
   var greenIcon = L.divIcon({
     className : 'div-green-icon',
     html: '<span style="color: white; background-color: green; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/building_icon.png"/></span>'
   })
 
   var yellowIcon = L.divIcon({
     className : 'div-yellow-icon',
     html: '<span style="color: black; background-color: yellow; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
   })
 
   var orangeIcon = L.divIcon({
     className : 'div-orange-icon',
     html: '<span style="color: black; background-color: orange; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
   })
 
   var redIcon = L.divIcon({
     className : 'div-red-icon',
     html: '<span style="color: white; background-color: red; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
   })
 
   var emptyIcon = L.divIcon({
     className : 'div-red-icon',
     html: '<span></span>'
   })
 
   if(parseInt(score) > 0)
   return redIcon;
 
   return greenIcon;
 
  }


  getBuildingIcon = (score) =>
  {
 
    if(score == null)
    score = 0;
 
   var greenIcon = L.divIcon({
     className : 'div-green-icon',
     html: '<span style="color: white; background-color: green; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
   })
 
   var yellowIcon = L.divIcon({
     className : 'div-yellow-icon',
     html: '<span style="color: black; background-color: yellow; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
   })
 
   var orangeIcon = L.divIcon({
     className : 'div-orange-icon',
     html: '<span style="color: black; background-color: orange; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
   })
 
   var redIcon = L.divIcon({
     className : 'div-red-icon',
     html: '<span style="color: white; background-color: red; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
   })
 
   var emptyIcon = L.divIcon({
     className : 'div-red-icon',
     html: '<span></span>'
   })
 
   if(parseInt(score) > 0)
   return redIcon;
 
   return greenIcon;
 
  }

  onBrooklynChanged= (event) => {
   
    this.setState({show_bronx: event.target.checked});
  }

  onManhattanChanged= (event) => {
   
    this.setState({show_manhattan: event.target.checked});
  }


  getEmptyIcon = () =>
  {
    var emptyIcon = L.divIcon({
      className : 'div-red-icon',
      html: '<span></span>'
    })

    return emptyIcon;
  }

  getDivIcon = (score) =>
 {

  score = parseInt(score);

  var greenIcon = L.divIcon({
    className : 'div-green-icon',
    html: '<span style="color: white; background-color: green; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
  })

  var yellowIcon = L.divIcon({
    className : 'div-yellow-icon',
    html: '<span style="color: black; background-color: yellow; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
  })

  var orangeIcon = L.divIcon({
    className : 'div-orange-icon',
    html: '<span style="color: black; background-color: orange; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
  })

  var redIcon = L.divIcon({
    className : 'div-red-icon',
    html: '<span style="color: white; background-color: red; font-size: 14px;">' + score + '<img width="16px" src="/vaxzones/images/google_icon.png"/></span>'
  })

  var emptyIcon = L.divIcon({
    className : 'div-red-icon',
    html: '<span></span>'
  })


  return greenIcon;

 }

  componentDidMount(){

    var filter_history = testing_data.filter(function (pilot) {
      return (pilot.County) == "New York";
    });
   
    var rows = [];
      for (var i = 0; i < filter_history.length; i++) {
        rows.push({"key": filter_history[i].Test_Date,
          "data" : parseInt(filter_history[i].Total_Number_of_Tests_Performed)});
      };
      //console.log(rows);
      this.setState({all_testing_data: rows});
    /*
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"username":"testapi1","password":"coronavirus19"});
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://covid19.cloudeya.org/token", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
      */

     var filter_data= virus_mar_data.filter(function (pilot) {
      return pilot.province_state == "New York";
    });

    this.setState({virus_data: filter_data});
/*
     var filter_data= virus_data.filter(function (pilot) {
      return pilot.province_state == "New York";
    });

    var filter_may_data= virus_may_data.filter(function (pilot) {
      return pilot.province_state == "New York";
    });
    var filter_sep_data= virus_sep_data.filter(function (pilot) {
      return pilot.province_state == "New York";
    });
    var filter_oct_data= virus_oct_data.filter(function (pilot) {
      return pilot.province_state == "New York";
    });

    var filter_nov_data= virus_nov_data.filter(function (pilot) {
      return pilot.province_state == "New York";
    });

    this.setState({virus_data: virus_oct_data});
*/
/*
    var key =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RhcGkxIiwiaWF0IjoxNjA0ODk2NTAzLCJleHAiOjE2MDUwOTY1MDN9.X0JT6_eWG-gvLEEikOqyrBrPdnvAZcBEYSgG4fSECOI"

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + key);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
     redirect: 'follow'
    };

fetch("https://covid19.cloudeya.org/MAR2020", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
    */

  }



  render(){

    const position=[this.state.location.lat, this.state.location.lng]
  return (
    <div className="App">
     <br/>
     <h3>Covid-19 Health Care Worker tracking for VAD program</h3>
     <button style={{backgroundColor: 'red'}}  onClick={this.onClickedUp}>Up</button> <button style={{backgroundColor: 'red'}} onClick={this.onClickedDown}>Down</button>
   <RangeSlider min={3} max={11}
   value={this.state.value} step={4}
   onChange={this.onValueChanged} />
<br/>
<div style={{padding:'20px'}}>
<span><b>Health Care Data</b></span>
<br/>
<span style={{padding:'10px'}}><Input style={{backgroundColor: 'red'}}  onChange={this.onManhattanChanged} id="manhattan" value="Manhattan" checked={this.state.show_manhattan} type="checkbox" />
<label htmlFor="manhattan">Manhattan</label> </span>
<span style={{padding:'10px'}}><Input style={{backgroundColor: 'green'}} onChange={this.onBrooklynChanged} id="bronx" value="Bronx" checked={this.state.show_bronx} type="checkbox" />
<label htmlFor="bronx">Bronx</label> </span>
</div>
      <Map id="map" className="map" center={position} zoom={this.state.zoom}>
        <TileLayer noWrap="true"
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {
this.state.show_wildlife ? 

this.state.virus_data.map((each, index) => {
          if (isNaN(each.longitude) === false && isNaN(each.latitude) === false && each.latitude != null && each.longitude != null) {
  
        var position=[each.latitude, each.longitude]
        return <Marker key={index} position={position} icon={this.getDivIcon(each.deaths)}>
         <Popup><br /> 
          {each.combined_key}<br />  
          </Popup>
      </Marker>
      }})
: ''
        }


        {
this.state.show_bronx ? 

this.state.nursing_bronx.map((each, index) => {
     
          if (isNaN(each.longitude) === false && isNaN(each.latitude) === false && each.latitude != null && each.longitude != null) {
  
        var position=[each.latitude, each.longitude]
        return <Marker key={index} position={position} icon={this.getBuildingIcon(each.Total_Staff_Confirmed)}>
          <Circle 
                  center={{lat:each.latitude, lng: each.longitude}}
                  fillColor={this.getNursingAidCircle(each.Staff_Total_COVID_19_Deaths)} 
                  fillOpacity = {1}
                  radius={this.getNursingAidRadius(5)}><Tooltip>{"Confirmed: " + each.Total_Staff_Confirmed +  " Deaths: " + each.Staff_Total_COVID_19_Deaths +  " Address: " + each.Provider_Address}</Tooltip></Circle> 
      </Marker>
      }})
: ''
        }


        {
this.state.show_manhattan ? 

this.state.COVID_19_Manhattan.map((each, index) => {
      
          if (isNaN(each.longitude) === false && isNaN(each.latitude) === false && each.latitude != null && each.longitude != null) {
  
        var position=[each.latitude, each.longitude]
        return <Marker key={index} position={position} icon={this.getBuildingIcon(each.Total_Staff_Confirmed)}>
          <Circle 
                  center={{lat:each.latitude, lng: each.longitude}}
                  fillColor={this.getNursingAidCircle(each.Staff_Total_COVID_19_Deaths)} 
                  fillOpacity = {1}
                  radius={this.getNursingAidRadius(5)}><Tooltip>{"Confirmed: " + each.Total_Staff_Confirmed +  " Deaths: " + each.Staff_Total_COVID_19_Deaths +  " Address: " + each.Provider_Address}</Tooltip></Circle> 
      </Marker>
      }})
: ''
        } 

        {
this.state.show_manhattan_hospitals ? 

this.state.hospital_list.map((each, index) => {
     
          if (isNaN(each.location_1.longitude) === false && isNaN(each.location_1.latitude) === false && each.location_1.latitude != null && each.location_1.longitude != null) {
  
        var position=[each.location_1.latitude, each.location_1.longitude]
        return <Marker key={index} position={position} icon={this.getHospitalIcon(each.death)}>
        <Circle 
                  center={{lat:each.location_1.latitude, lng: each.location_1.longitude}}
                  fillColor={this.getHospitalAidCircle(each.death)} 
                  fillOpacity = {1}
                  radius={this.getNursingAidRadius(5)}><Tooltip>{"Deaths: " + each.death +  " Deaths: " + each.borough +  " Address: " + each.facility_name}</Tooltip></Circle> 
      </Marker>
      }})
: ''
        }
      
        {
          this.state.show_wildlife ? 

this.state.virus_data.map((each, index) => {
          if (isNaN(each.longitude) === false && isNaN(each.latitude) === false && each.latitude != null && each.longitude != null) {

        var position=[each.latitude, each.longitude]
        return <Marker key={index} position={position} icon={this.getEmptyIcon()}>
        <Circle 
                  center={{lat:each.latitude, lng: each.longitude}}
                  fillColor={this.getAidCircle(each.deaths)} 
                  fillOpacity = {1}
                  radius={this.getAidRadius(each.deaths)}><Tooltip>{"Confirmed:" + each.confirmed}</Tooltip></Circle> 
      </Marker>
      }})
: ''

        }
        </Map>
        <h3>Covid Testing Data by Burrough</h3>
        <select onChange={this.onSelectionChanged} name="counties" id="counties">
      <option value="New York">Manhattan</option>
      <option value="Bronx">Bronx</option>
      <option value="Queens">Queens</option>
     <option value="Kings">Kings</option>
      </select>
      <hr/>
      <Row>
      <Col sm={{ size: 5}}>
<BarChart width={1000} height={250} data={this.state.all_testing_data} />
    </Col>
    </Row>
    <Row>
    <hr/>
    <br/>
    <Col sm={{ size: 11, offset: 1 }}>
    <img alt="chart" src="/vaxzones/images/population.png" height="200px" />
    </Col>
    </Row>
     <Row>
     <Col sm={{ size: 11, offset: 1 }}>
      <div  style={{padding:'20px'}}>
        <b>Data sources:</b><br/>
        <a href="https://data.cms.gov/widgets/s2uc-8wxp">Health Care Tracking data</a> <br/>
        <a href="https://covid19.cloudeya.org"> Covid data by Time</a>
      </div></Col></Row>
        </div>)

}
}
export default App;
