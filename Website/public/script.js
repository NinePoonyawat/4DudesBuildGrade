// JavaScript code to fetch data from NodeMCU and update the HTML elements

client = new Paho.MQTT.Client("mqtt.netpie.io", 443, "6b87334d-15e1-4b11-a2de-dc1da933282a");
var options = {
    useSSL: true,
    userName: "fA7rZWfcWMxYqa4UdKMwJbcePnJY9wYg",
    password: "dGYsdxZZIk~I8g1arTp~0tkceUPzhqMv",
    onSuccess:onConnect,
    onFailure:doFail
}

var webData = {
    environmentTemberature : null,
    humanTemperature : null,
    hearthRate : null
}

client.connect(options);

function onConnect() {
    client.subscribe("@msg/feedback",{ qos:0 });
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

//client.onConnectionLost = function(responseObject) {
//    if (responseObject.errorCode !== 0) console.log("onConnectionLost : " + responseObject.errorCode);
//}

client.onMessageArrived = function(message) {
    console.log("message arrived: " + message.payloadString);
    data = message.payloadString;
    webData.environmentTemberature = parseFloat(data.environmentTemberature);
    webData.humanTemperature = parseFloat(data.humanTemperature);
    webData.hearthRate = parseFloat(data.hearthRate);

    document.getElementById('environmentTemperature').textContent = webData.environmentTemberature;
    document.getElementById('humanTemperature').textContent = webData.humanTemperature;
    document.getElementById('heartRate').textContent = webData.hearthRate;

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