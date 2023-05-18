// JavaScript code to fetch data from NodeMCU and update the HTML elements

// Fetch and display human temperature
fetch('http://your_nodeMCU_IP_address/human_temperature')
  .then(response => response.json())
  .then(data => {
    document.getElementById('humanTemperature').textContent = data.temperature;
  });

// Fetch and display environment temperature
fetch('http://your_nodeMCU_IP_address/environment_temperature')
  .then(response => response.json())
  .then(data => {
    document.getElementById('environmentTemperature').textContent = data.temperature;
  });

// Fetch and display heart rate
fetch('http://your_nodeMCU_IP_address/heart_rate')
  .then(response => response.json())
  .then(data => {
    document.getElementById('heartRate').textContent = data.heartRate;
  });

// Function to toggle the fan
function toggleFan() {
  fetch('http://your_nodeMCU_IP_address/toggle_fan', { method: 'POST' })
    .then(response => {
      if (response.ok) {
        console.log('Fan toggled successfully.');
      } else {
        console.log('Failed to toggle the fan.');
      }
    })
    .catch(error => {
      console.error('An error occurred while toggling the fan:', error);
    });
}

document.getElementById('fanButton').addEventListener('click', toggleFan);