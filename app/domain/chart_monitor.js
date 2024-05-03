import {Chart} from "chart.js/auto";

// Initialize the chart with daily data
const initialData = generateData('daily');

let currentRange = 'daily';

const myChart = new Chart(
    document.getElementById('myChart'),
    {
        type: 'line',
        data: {
            labels: initialData.labels,
            datasets: [{
                label: 'Waste Weight',
                data: initialData.data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }],
        },
    }
);


function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('real-time').textContent = hours + ':' + minutes + ':' + seconds;
}

// Function to update date
function updateDate() {
    const now = new Date();
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
}

// Update time and date every second
setInterval(updateTime, 1000);
updateDate(); // Update date immediately

// Function to update chart based on selected time range
function updateChart(range) {
    currentRange = range;
    // Perform backend API call here to fetch data based on selected range
    // Replace the sample data with the fetched data
    const newData = generateData(range); // Call a function to generate data based on range
    myChart.data.labels = newData.labels;
    myChart.data.datasets[0].data = newData.data;
    myChart.update(newData);
}

// Function to generate sample data based on time range
function generateData(range) {
    switch (range) {
        case 'daily':
            return {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                data: [12, 19, 3, 5, 2, 3, 11]
            };
        case 'weekly':
            return {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [30, 50, 70, 45]
            };
        case 'monthly':
            return {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                data: [150, 200, 250, 300, 200, 180, 220, 250, 300, 200, 180, 220]
            };
        case 'yearly':
            return {
                labels: ['2021', '2022', '2023', '2024', '2025'],
                data: [1000, 1500, 2000, 1800, 2500]
            };
    }
}
