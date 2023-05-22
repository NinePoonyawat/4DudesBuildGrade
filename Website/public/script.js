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
   if (isBoxActive && !checkHeatStroke())
   {
     hideNotification();
     isBoxActive = false;
   } 
   else if (!isBoxActive && checkHeatStroke())
   {
     showNotification();
     isBoxActive = true;
   }
 }

 function showNotification() {
    // Set the text of the notification
    notificationText.textContent = notificationText;
    // Show the notification box
    notificationBox.classList.remove('hidden');
 }
    // Function to hide the notification box
 function hideNotification() {
    // Hide the notification box
    notificationBox.classList.add('hidden');
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
  
    var heatIndex = calculateHeatIndex(WeatherTemp, Humidity);
    if (heatIndex < 90.0) {
  
    } else if (heatIndex < 103.0) {
      risk += 1;
    } else if (heatIndex < 125.0) {
      risk += 2;
    } else {
      risk += 3;
    }
  
    if (HeartRate > 200) {
      risk += 2;
    } else if (HeartRate > 150) {
      risk += 1;
    }
  
    if (HumanTemp > 40) {
      risk += 2;
    } else if (HumanTemp > 37) {
      risk += 1;
    }
  
    return risk < 5;
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

document.getElementById('fanButton').addEventListener('click', toggleFan);