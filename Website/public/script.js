// JavaScript code to fetch data from NodeMCU and update the HTML elements

var notificationBox = document.getElementById('notification-box');
var notificationText = document.getElementById('notification-text');
var isBoxActive = false;

var notificationText = "Oh! You see me?";

client = new Paho.MQTT.Client("mqtt.netpie.io", 443, "6b87334d-15e1-4b11-a2de-dc1da933282a");

var options = {
    useSSL: true,
    userName: "fA7rZWfcWMxYqa4UdKMwJbcePnJY9wYg",
    password: "Secret",
    onSuccess:onConnect,
    onFailure:doFail
}

var webData = {
    environmentTemperature : null,
    humanTemperature : null,
    hearthRate : null,
    humidity : null
}

client.connect(options);

function onConnect() {
    client.subscribe("@msg/feedback",{ qos:0 });
    //client.subscribe("@msg/fan");
    console.log("connected");
    // const data = {
    //     "data":{
    //         "WeatherTemp" : 10
    //     }
    // };
    // const msg = JSON.stringify(data);
    // console.log(msg); // Print the message to the console
    // client.publish("@shadow/data/update", data); 
}

function doFail(e){
    console.log("failed : " + e);
}

client.onMessageArrived = function(message) {
    console.log("message arrived: " + message.payloadString);
    data = JSON.parse(message.payloadString);
    webData.environmentTemperature = parseFloat(data.data.WeatherTemp);
    webData.humanTemperature = parseFloat(data.data.HumanTemp);
    webData.hearthRate = parseFloat(data.data.HeartRate);
    webData.humidity = parseFloat(data.data.Humidity);

    document.getElementById('environmentTemperature').textContent = webData.environmentTemperature;
    document.getElementById('humanTemperature').textContent = webData.humanTemperature;
    document.getElementById('heartRate').textContent = webData.hearthRate;
    document.getElementById('environmentHumidity').textContent = webData.humidity;

    UpdateNotificationBox();

    console.log("data arrived: " + data);
}
// // Fetch and display human temperature
// fetch('http://your_nodeMCU_IP_address/human_temperature')
//   .then(response => response.json())
//   .then(data => {
//     document.getElementById('humanTemperature').textContent = data.temperature;
//   });

// // Fetch and display environment temperature
// fetch('http://your_nodeMCU_IP_address/environment_temperature')
//   .then(response => response.json())
//   .then(data => {
//     document.getElementById('environmentTemperature').textContent = data.temperature;
//   });

// // Fetch and display heart rate
// fetch('http://your_nodeMCU_IP_address/heart_rate')
//   .then(response => response.json())
//   .then(data => {
//     document.getElementById('heartRate').textContent = data.heartRate;
//   });

 // Function to toggle the fan

 function UpdateNotificationBox() {
   var x = checkHeatStroke();
   if (x < 3)
   {
      document.getElementById('notification-text').textContent = "Low chance of heat stroke observed. Stay hydrated, avoid prolonged exposure to direct sunlight, and be mindful of your body's temperature.";
      document.getElementById('notification-box').style.backgroundColor = 'rgb(75, 181, 67)';
    }
   else if (x < 5)
   {
      document.getElementById('notification-text').textContent = "Moderate chance of heat stroke detected. To prevent heat exhaustion, limit outdoor activities, find shaded areas, and stay hydrated.";
      document.getElementById('notification-box').style.backgroundColor = 'rgb(255, 191, 0)';
    }
   else
   {
      document.getElementById('notification-text').textContent = "High chance of heat stroke! Take immediate action: seek shade or cool shelter and hydrate yourself adequately to prevent overheating.";
      document.getElementById('notification-box').style.backgroundColor = 'rgb(255, 68, 68)';
    }
 }

 function showNotification() {
    // Set the text of the notification
    document.getElementById('notification-text').textContent = 'oh you see me';
    // Show the notification box
    document.getElementById('notification-box').classList.remove('hidden');
 }
    // Function to hide the notification box
 function hideNotification() {
    // Hide the notification box
    document.getElementById('notification-text').textContent = '';
    document.getElementById('notification-box').classList.add('hidden');
 }

 function calculateHeatIndex(temperature, humidity) {
    // Calculate the heat index
    var c1 = -8.78469475556;
    var c2 = 1.61139411;
    var c3 = 2.33854883889;
    var c4 = -0.14611605;
    var c5 = -0.012308094;
    var c6 = -0.0164248277778;
    var c7 = 0.002211732;
    var c8 = 0.00072546;
    var c9 = -0.000003582;
  
    var heatIndex = c1 + (c2 * temperature) + (c3 * humidity) + (c4 * temperature * humidity)
                  + (c5 * temperature * temperature) + (c6 * humidity * humidity)
                  + (c7 * temperature * temperature * humidity) + (c8 * temperature * humidity * humidity)
                  + (c9 * temperature * temperature * humidity * humidity);
  
    return heatIndex;
  }
  
  function checkHeatStroke() {
    var risk = 0;
  
    var heatIndex = calculateHeatIndex(webData.WeatherTemp, webData.humidity);
    if (heatIndex < 90.0) {
  
    } else if (heatIndex < 103.0) {
      risk += 1;
    } else if (heatIndex < 125.0) {
      risk += 2;
    } else {
      risk += 3;
    }
  
    if (webData.heartRate > 200) {
      risk += 2;
    } else if (webData.heartRate > 150) {
      risk += 1;
    }
  
    if (webData.humanTemperature > 40) {
      risk += 2;
    } else if (webData.humanTemperature > 37) {
      risk += 1;
    }
  
    console.log(risk);
    return risk;
  }

 function toggleFan() {
    if (client.isConnected()) {
    var message = new Paho.MQTT.Message("Hello");
    message.destinationName = "@msg/fan";
    client.send(message);
    console.log("Button clicked");
  } else {
    console.log("MQTT client is not connected");
  }
}

function callFunction() {
  // Get the values from the input boxes
  var value1 = document.getElementById("input1").value;
  var value2 = document.getElementById("input2").value;
  var value3 = document.getElementById("input3").value;
  var value4 = document.getElementById("input4").value;

  // Call your function with the values as parameters
  webData.environmentTemperature = value1;
  webData.humanTemperature = value2;
  webData.hearthRate = value3;
  webData.humidity = value4;

  document.getElementById('environmentTemperature').textContent = webData.environmentTemperature;
  document.getElementById('humanTemperature').textContent = webData.humanTemperature;
  document.getElementById('heartRate').textContent = webData.hearthRate;
  document.getElementById('environmentHumidity').textContent = webData.humidity;

  UpdateNotificationBox();
  
}

document.getElementById('fanButton').addEventListener('click', toggleFan);