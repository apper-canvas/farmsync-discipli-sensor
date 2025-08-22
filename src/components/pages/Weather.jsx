import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";
import { format, addDays } from "date-fns";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const weatherData = await weatherService.getForecast();
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
      console.error("Weather loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  if (loading) return (
    <Layout title="Weather" subtitle="Extended forecast for your farm">
      <Loading type="cards" />
    </Layout>
  );

  if (error) return (
    <Layout title="Weather" subtitle="Extended forecast for your farm">
      <Error message={error} onRetry={loadWeatherData} />
    </Layout>
  );

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: "Sun",
      "partly-cloudy": "CloudSun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      windy: "Wind",
      clear: "Sun"
    };
    return icons[condition?.toLowerCase()] || "Cloud";
  };

  const getWeatherAdvice = (weatherData) => {
    const currentWeather = weatherData[0];
    if (!currentWeather) return null;

    const upcomingRain = weatherData.slice(1, 4).some(day => day.precipitation > 60);
    const highTemp = currentWeather.temperature > 85;
    const lowHumidity = currentWeather.humidity < 40;
    const heavyRain = currentWeather.precipitation > 80;

    if (heavyRain) {
      return {
        type: "warning",
        title: "Heavy Rain Expected",
        message: "Consider postponing outdoor activities. Ensure proper drainage in low-lying areas.",
        icon: "CloudRain"
      };
    }

    if (upcomingRain) {
      return {
        type: "info",
        title: "Rain in Forecast",
        message: "Rain expected in the next few days. Good time to reduce irrigation and prepare equipment.",
        icon: "Droplets"
      };
    }

    if (highTemp && lowHumidity) {
      return {
        type: "warning",
        title: "Hot & Dry Conditions",
        message: "High temperatures and low humidity. Increase irrigation and monitor crops for heat stress.",
        icon: "Sun"
      };
    }

    if (highTemp) {
      return {
        type: "info",
        title: "Hot Weather",
        message: "High temperatures expected. Consider early morning or evening work schedules.",
        icon: "Thermometer"
      };
    }

    return {
      type: "success",
      title: "Good Conditions",
      message: "Favorable weather conditions for most farming activities.",
      icon: "CheckCircle"
    };
  };

  const currentWeather = weather[0];
  const extendedForecast = weather.slice(1);
  const weatherAdvice = getWeatherAdvice(weather);

  return (
    <Layout title="Weather" subtitle="Extended forecast for your farm">
      <div className="space-y-6">
        {/* Current Weather & 6-Day Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherWidget 
            weatherData={weather}
            loading={false}
            compact={false}
          />

          {/* Weather Advice Card */}
          {weatherAdvice && (
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  weatherAdvice.type === "warning" 
                    ? "bg-gradient-to-r from-warning to-yellow-600"
                    : weatherAdvice.type === "info"
                    ? "bg-gradient-to-r from-info to-blue-600"
                    : "bg-gradient-to-r from-success to-green-600"
                }`}>
                  <ApperIcon name={weatherAdvice.icon} className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 font-display mb-2">
                    {weatherAdvice.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {weatherAdvice.message}
                  </p>

                  {/* Quick Stats */}
                  {currentWeather && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {currentWeather.temperature}°F
                        </p>
                        <p className="text-sm text-gray-600">Temperature</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {currentWeather.humidity}%
                        </p>
                        <p className="text-sm text-gray-600">Humidity</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Extended Forecast Cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
            Extended Forecast
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extendedForecast.map((day, index) => (
              <Card key={index} className="p-6 hover:scale-[1.02] transition-all duration-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon 
                      name={getWeatherIcon(day.condition)} 
                      className="w-8 h-8 text-white" 
                    />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {format(new Date(day.date), "EEEE")}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {format(new Date(day.date), "MMM dd, yyyy")}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Temperature</span>
                      <span className="font-semibold text-gray-900">
                        {day.temperature}°F
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Condition</span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {day.condition}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rain Chance</span>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Droplets" className="w-3 h-3 text-blue-500" />
                        <span className="font-semibold text-gray-900">
                          {day.precipitation}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Humidity</span>
                      <span className="font-semibold text-gray-900">
                        {day.humidity}%
                      </span>
                    </div>
                  </div>

                  {/* Weather advice for specific days */}
                  {day.precipitation > 70 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 font-medium">
                        High chance of rain - plan indoor activities
                      </p>
                    </div>
                  )}
                  
                  {day.temperature > 85 && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-700 font-medium">
                        Hot day - ensure adequate irrigation
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Agricultural Weather Tips */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Lightbulb" className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-display">
              Agricultural Weather Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-green-50 to-secondary-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Droplets" className="w-4 h-4 text-secondary-600" />
                <h3 className="font-semibold text-gray-900">Irrigation Planning</h3>
              </div>
              <p className="text-sm text-gray-700">
                Monitor upcoming rainfall to optimize irrigation schedules and reduce water waste.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-50 to-warning/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Sun" className="w-4 h-4 text-warning" />
                <h3 className="font-semibold text-gray-900">Heat Management</h3>
              </div>
              <p className="text-sm text-gray-700">
                During hot weather, schedule activities for early morning or evening to avoid heat stress.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-info/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Calendar" className="w-4 h-4 text-info" />
                <h3 className="font-semibold text-gray-900">Task Scheduling</h3>
              </div>
              <p className="text-sm text-gray-700">
                Plan field work around weather patterns to maximize efficiency and crop health.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Weather;