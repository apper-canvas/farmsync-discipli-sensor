import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const WeatherWidget = ({ weatherData, loading = false, compact = false }) => {
  if (loading) {
    return (
      <Card className={`${compact ? "p-4" : "p-6"} animate-pulse`}>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

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

  const currentWeather = weatherData?.[0];
  const forecast = weatherData?.slice(1, compact ? 4 : 6) || [];

  if (!currentWeather) {
    return (
      <Card className={`${compact ? "p-4" : "p-6"} text-center`}>
        <ApperIcon name="CloudOff" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Weather data unavailable</p>
      </Card>
    );
  }

  return (
    <Card className={compact ? "p-4" : "p-6"}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-gray-900 font-display ${compact ? "text-lg" : "text-xl"}`}>
          Weather Forecast
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="MapPin" className="w-4 h-4" />
          Current Location
        </div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={getWeatherIcon(currentWeather.condition)} 
            className="w-8 h-8 text-white" 
          />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {currentWeather.temperature}°F
            </span>
            <span className="text-lg text-gray-600 capitalize">
              {currentWeather.condition}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Droplets" className="w-4 h-4" />
              {currentWeather.humidity}% humidity
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="CloudRain" className="w-4 h-4" />
              {currentWeather.precipitation}% rain
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {compact ? "3-Day" : "5-Day"} Forecast
        </h4>
        <div className="grid gap-3">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <ApperIcon 
                    name={getWeatherIcon(day.condition)} 
                    className="w-4 h-4 text-gray-600" 
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {format(new Date(day.date), "EEE, MMM dd")}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {day.condition}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {day.temperature}°F
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{day.precipitation}%</span>
                  <ApperIcon name="Droplets" className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!compact && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-secondary-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Lightbulb" className="w-4 h-4 text-secondary-600" />
            <p className="text-sm font-semibold text-secondary-700">Farm Tip</p>
          </div>
          <p className="text-sm text-gray-700">
            {currentWeather.precipitation > 70 
              ? "High chance of rain - consider delaying outdoor activities."
              : currentWeather.temperature > 85
              ? "Hot weather ahead - ensure adequate irrigation for crops."
              : "Good conditions for most farming activities."
            }
          </p>
        </div>
      )}
    </Card>
  );
};

export default WeatherWidget;