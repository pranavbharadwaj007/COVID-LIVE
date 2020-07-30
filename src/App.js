import React,{useState, useEffect} from 'react';
import{
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";
import { sortData, prettyPrintStat } from "./util";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table'
import LineGraph from './LineGraph'
import Twitter from './Twitter';
import Footer from './Footer';
import './App.css';
import "leaflet/dist/leaflet.css";


//https://disease.sh/v3/covid-19/countries

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("worldWide");
  const [countryInfo,setCountryInfo]=useState({
  });
  const [tableData,setTableData] =useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(()=>{
  fetch("https://disease.sh/v3/covid-19/all")
  .then(response=>response.json())
  .then(data=>{
    setCountryInfo(data);
  })
  },[])

useEffect(()=>{
const getCountriesData=async()=>{
await fetch ("https://disease.sh/v3/covid-19/countries")
.then((response)=>response.json())
.then((data)=>{
  const countries=data.map((country)=>(
    {
      name:country.country,
      value:country.countryInfo.iso2
    }
  ));

  const sortedData=sortData(data)
  setTableData(sortedData);
  setMapCountries(data);
  setCountries(countries);
})
}
getCountriesData();
},[]);

const onCountryChange =async (event) => {
  const countryCode=event.target.value;
 
const url=
countryCode ==="worldWide" ? 
'https://disease.sh/v3/covid-19/all' 
:`https://disease.sh/v3/covid-19/countries/${countryCode}`

await fetch(url)
.then(response=>response.json())
.then(data=>{
  setCountry(countryCode);
  setCountryInfo(data)

  setMapCenter([data.countryInfo.lat,data.countryInfo.long])
})

};

console.log(countryInfo);
  return (
    <div className="app">
      <div className="app_left">

      <div className="app_header">
      <h1 style={{color:"#a820df",textShadow:"2px 1px lavender"}}>COVID-19 LIVE</h1>
      <FormControl className="app__dropdown">
    <Select variant="outlined"
    onChange={onCountryChange}
    value={country}
    >
      <MenuItem value="worldWide">WorldWide</MenuItem>
{
  countries.map((country)=>(
  <MenuItem value={country.value}>{country.name}</MenuItem>
  ))

}

    {/* <MenuItem value="worldWide">WorldWide</MenuItem>
    <MenuItem value="worldWide">option 2</MenuItem>
    <MenuItem value="worldWide">option 3</MenuItem>
  <MenuItem value="worldWide">yo id no</MenuItem> */}
    </Select>
      </FormControl>
    </div>

<div className="app__stats">
<InfoBox
isRed
active={casesType === "cases"}
onClick={(e) => setCasesType("cases")}
title="Cases"
cases={prettyPrintStat(countryInfo.todayCases)}
total={prettyPrintStat(countryInfo.cases)}


/>
<InfoBox
title="Recovered"
active={casesType === "recovered"}
onClick={(e) => setCasesType("recovered")}
cases={prettyPrintStat(countryInfo.todayRecovered)}
total={prettyPrintStat(countryInfo.recovered)}

/>
<InfoBox
isRed
 active={casesType === "deaths"}
onClick={(e) => setCasesType("deaths")}
title="Deaths"
cases={prettyPrintStat(countryInfo.todayDeaths)}
total={prettyPrintStat(countryInfo.deaths)}

/>
  </div>
<Map
casesType={casesType}
countries={mapCountries}
center={mapCenter}
zoom={mapZoom}
/>

</div>



<div className="app__right">

<Card >
<CardContent>
  <h3>Live cases by Country</h3>
<Table
countries={tableData}

/>
{/* <h3>Worldwide new {casesType}</h3>
<LineGraph */}
 <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />

</CardContent>
</Card>

<Footer/>
</div>

    </div>
  
  );
  
}

export default App;
