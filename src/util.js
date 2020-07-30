import React from 'react';
import numeral from "numeral";
import {Circle,Popup} from 'react-leaflet';


const casesTypeColors = {
    cases: {
      hex: "#a820df",
      rgb: "rgb(169, 32, 223)",
      half_op: "rgb(169, 32, 223,0.5)",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgba(125,215,29)",
      half_op: "rgba(125,215,29,0.5)",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgba(251,68,67)",
      half_op: "rgba(251,68,67,0.5)",
      multiplier: 2000,
    }
};
export const prettyPrintStat = (stat) =>
  stat ? `${numeral(stat).format("0.0a")}` : "+0";
  
export const sortData = (data)=>{
    const sortedData=[...data];
    sortedData.sort((a,b)=>{
        if(a.cases>b.cases){
            return -1;
        }
        else{
            return 1;
        }
    })
    return sortedData;
}

export const showDataOnMap=(data,casesType='cases')=>(
data.map(country=>(
<Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >

<Popup>
        <div className='info-container'>
          <div
            className='info-flag'
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className='info-name'>{country.country}</div>
          <div className='info-confirmed'>
            Cases:{numeral(country.cases).format("0,0")}
          </div>
          <div className='info-recovered'>
            Recovered:{numeral(country.recovered).format("0,0")}{" "}
          </div>
          <div className='info-deaths'>
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>


    </Circle>
))
);
