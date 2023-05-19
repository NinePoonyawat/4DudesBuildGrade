// JavaScript code to fetch data from NodeMCU and update the HTML elements

client = new Paho.MQTT.Client("mqtt.netpie.io", 443, "68487dfa-0cc5-479a-bb8b-bce72c2f4fc3");
var options = {
    useSSL: true,
    userName: "sSKrp69Gh7PitmL2RLSJcqQYu6ZGibiF",
    password: "Secret",
    onSuccess:onConnect,
    onFailure:doFail
}
client.connect(options);

function onConnect() {
    console.log("connected");
    // const data = {
    //     "data":{
    //         "WeatherTemp" : 10
    //     }
    // };
    // const msg = JSON.stringify(data);
    // console.log(msg); // Print the message to the console
    // client.publish("@shadow/data/update", data); 
    client.subscribe("@msg/feedback");
}

function doFail(e){
    console.log("failed : " + e);
}

client.onMessageArrived = function(message) {
    console.log("message arrived: " + message.payloadString);
    data = message.payloadString;
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

// // Function to toggle the fan
// function toggleFan() {
//   fetch('http://your_nodeMCU_IP_address/toggle_fan', { method: 'POST' })
//     .then(response => {
//       if (response.ok) {
//         console.log('Fan toggled successfully.');
//       } else {
//         console.log('Failed to toggle the fan.');
//       }
//     })
//     .catch(error => {
//       console.error('An error occurred while toggling the fan:', error);
//     });
// }

// document.getElementById('fanButton').addEventListener('click', toggleFan);