let
base = 'https://api.weatherbit.io/v2.0/current?',
param = ['daily?','hourly?'],
key = 'key=409dcb88ca3d48eea104a2cd8f5e11b3',
place='';
param_base = 'https://api.weatherbit.io/v2.0/forecast/';

//settings button
// document.getElementsByClassName('settings_icon')[0].onclick = function(){
//    console.log('gh');
// }

let main = function(){
/////weatherbit for weather, openweathermap for time(sunrise/sunset)
   let hourly_link = param_base + param[1] + place + key,
   current_link = base + place + key,
   openweather_link = 'https://api.openweathermap.org/data/2.5/weather?' + place + 'appid=4a545f0f40030111bd48108d303fb9ad',
   daily_link = param_base + param[0] + place + key;

   let current = new Promise((resolve, reject)=>{
      fetch(current_link)
         .then(function(resp){resolve( resp.json())})
      });
   let hourly = new Promise((resolve,reject)=>{
      fetch(hourly_link)
         .then(function(resp){resolve(resp.json())
            })
      });
   let sunstands = new Promise((resolve, reject)=>{
      fetch(openweather_link)
         .then(function(resp){resolve(resp.json())
            })
   });
   let daily = new Promise((resolve,reject)=>{
      fetch(daily_link)
         .then(function(resp){resolve(resp.json())
            })
      });
   //ответы от weatherbit в value
   Promise.all([current, hourly, sunstands, daily]).then(value=>{
      //current(on display)
      let icon = document.createElement('img');
      icon.className = 'icon';
      icon.setAttribute('src',`img/icons/${value[0].data[0].weather.icon}.png` )
       document.querySelector('.temp_val').innerHTML = Math.round(value[0].data[0].temp) +'°C' ;
       
       document.querySelector('.app_temp').innerHTML = 'Feels like: ' + Math.round(value[0].data[0].app_temp) +'°C' ;
       document.querySelector('.condition').innerHTML = value[0].data[0].weather.description;
       document.querySelector('.condition').prepend(icon);
       document.querySelector('.wind_speed').innerHTML =value[0].data[0].wind_spd.toFixed(1) + 'm/s';
       document.querySelector('.wind_dir').style.transform = `rotate(${value[0].data[0].wind_dir + 45}deg)`;
       
       document.querySelector('#sunr').innerHTML ='Sunrise: ' + toTimeString(value[2].sys.sunrise + value[2].timezone);
       document.querySelector('#suns').innerHTML ='Sunset: ' + toTimeString(value[2].sys.sunset + value[2].timezone);
       document.querySelector('#pres').innerHTML ='Pressure: ' + value[0].data[0].pres + ' mb';
       document.querySelector('#hum').innerHTML ='Humidity: ' + value[0].data[0].rh + '%';  

      
      console.log(value[0]);
      console.log(value[1]);
      console.log(value[3]);
      // //hourly
      for(let i =0;i<24;i++){
         document.querySelectorAll('.hour > .temp' )[i].innerHTML = Math.round(value[1].data[i+1].temp) +'°C';
         document.querySelectorAll('.hour > .sky' )[i].src = `img/icons/${value[1].data[i+1].weather.icon}.png`;
         let hour = new Date(value[1].data[i+1].timestamp_local).getHours();
         document.querySelectorAll('.hour > .time' )[i].innerHTML = `${hour}:00`;
      }

      function toTimeString(seconds) {
         return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
       }; 

       //daily
      for(let i = 0;i<10;i++){
         console.log(document.querySelectorAll('.day > .sky')[i]);
         document.querySelectorAll('.day > .sky')[i].src = `img/icons/${value[3].data[i+1].weather.icon}.png`;
         document.querySelectorAll('.day > .temp')[i].innerHTML = Math.round(value[3].data[i+1].temp) +'°C';

         let date = moment(value[3].data[i+1].datetime);
         document.querySelectorAll('.day > .date')[i].innerHTML = date.format('DD.MM');
      }

   });
} 
function geo(callback){

   let promise = new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition(coord);
      function coord(data){
         console.log(data.coords.latitude, data.coords.longitude);
         place = 'lat=' + data.coords.latitude + '&' + 'lon=' + data.coords.longitude + '&';
         
         //смещение часового пояса
         timeOffset = new Date().getTimezoneOffset()/-60;
          resolve(callback.call(main));
      }

   });
}
geo(main);

document.getElementById('location').onclick = geo;

//slider
// if rflag = false , then you can move right, else you cannot; 
let left = 0;
let rflag = false;
let lflag = true;
document.getElementsByClassName('right')[0].onclick = rightOffset;
function rightOffset(){
   if(rflag == false){
      left = left - 100;

      if(left < -1500){
      rflag = true;
      lflag = false;
      }
      lflag = false;
      document.getElementById('hours').style.left = left + 'px';
   }
}
document.getElementsByClassName('left')[0].onclick = leftOffset;
function leftOffset(){
   if(lflag == false){
      left = left + 100;

      if(left == 0){
         lflag = true; 
         rflag = false;
      }
      document.getElementById('hours').style.left = left + 'px';
      rflag = false;

   }
}

//up-down slider
let uflag = true,
dflag = false,
up = 0;
window.onload = media;
window.onresize = media;
function media(){
   if((window.matchMedia("(max-width: 1100px)").matches)){
      let up = 0, uflag = false,
      dflag = true;
      document.getElementById('days').style.top = 0;
      document.getElementsByClassName('up')[0].onclick = leftOffset2;
   //down = right, up = left;!!!!!!!
      function leftOffset2(){
         if(dflag == false){
            up = up + 100;
      
            if(up == 0){
            dflag = true;
            uflag = false;
            }
            uflag = false;
            document.getElementById('days').style.left = up + 'px';
            console.log(up);
         }
      }
      
      document.getElementsByClassName('down')[0].onclick = rightOffset2;

      function rightOffset2(){
         if(uflag == false){
            up = up - 100;

            if(up < -200){
            dflag = false;
            uflag = true;
            }
            dflag = false;
            document.getElementById('days').style.left = up + 'px';
            console.log(up);
         }
      }
      
   }
   else{
      document.getElementById('days').style.left = 0;
      document.getElementsByClassName('down')[0].onclick = downOffset;
      function downOffset(){
         if(dflag == false){
            up = up - 120;

            if(up < -480){
            dflag = true;
            uflag = false;
            }
            uflag = false;
            document.getElementById('days').style.top = up + 'px';
            console.log(up);
         }
      }
      document.getElementsByClassName('up')[0].onclick = upOffset;
      function upOffset(){
         if(uflag == false){
            up = up + 120;

            if(up == 0){
            dflag = false;
            uflag = true;
            }
            dflag = false;
            document.getElementById('days').style.top = up + 'px';
            console.log(up);
         }
      }
   }
}




