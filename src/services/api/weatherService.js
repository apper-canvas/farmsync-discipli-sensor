const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// Weather data as this is typically from external APIs, not database
const weatherData = [
  {
    date: "2024-06-14",
    temperature: 78,
    condition: "sunny",
    precipitation: 10,
    humidity: 45
  },
  {
    date: "2024-06-15",
    temperature: 82,
    condition: "partly-cloudy",
    precipitation: 20,
    humidity: 52
  },
  {
    date: "2024-06-16",
    temperature: 75,
    condition: "cloudy",
    precipitation: 60,
    humidity: 68
  },
  {
    date: "2024-06-17",
    temperature: 71,
    condition: "rainy",
    precipitation: 85,
    humidity: 78
  },
  {
    date: "2024-06-18",
    temperature: 76,
    condition: "partly-cloudy",
    precipitation: 30,
    humidity: 58
  },
  {
    date: "2024-06-19",
    temperature: 80,
    condition: "sunny",
    precipitation: 15,
    humidity: 48
  }
];

export const weatherService = {
  async getForecast() {
    await delay();
    return [...weatherData];
  },

  async getCurrentWeather() {
    await delay();
    return weatherData[0] || null;
  }
};