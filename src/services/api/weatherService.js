import weatherData from "@/services/mockData/weather.json";

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

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