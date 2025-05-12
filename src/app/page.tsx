"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type AppRouter } from "~/server/api/root";
import {
  getWeatherBackground,
  getCountryFlag,
  isValidCountryCode,
} from "~/utils/weather";

export default function HomePage() {
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchCountryCode, setSearchCountryCode] = useState("");
  const [showCountryError, setShowCountryError] = useState(false);

  const {
    data: weather,
    isLoading,
    error,
    isError,
  } = api.weather.getWeather.useQuery(
    {
      city: searchCity,
      countryCode: searchCountryCode || undefined,
    },
    {
      enabled: searchCity !== "",
      retry: 1,
      refetchOnWindowFocus: false,
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      return;
    }
    if (countryCode && !isValidCountryCode(countryCode)) {
      setShowCountryError(true);
      return;
    }
    setShowCountryError(false);
    setSearchCity(city.trim());
    setSearchCountryCode(countryCode.trim());
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCountryCode(value);
    if (value.length === 2) {
      setShowCountryError(!isValidCountryCode(value));
    } else {
      setShowCountryError(false);
    }
  };

  const getErrorMessage = (error: TRPCClientErrorLike<AppRouter>) => {
    if (error.message.includes("City not found")) {
      return "City not found. Please check the spelling and try again.";
    }
    if (error.message.includes("API key")) {
      return "There's an issue with the weather service configuration.";
    }
    return "An error occurred while fetching weather data. Please try again later.";
  };

  const weatherBackground = getWeatherBackground(weather?.weather[0]?.main);

  const showCountryWarning =
    weather &&
    searchCountryCode &&
    weather.sys.country.toLowerCase() !== searchCountryCode.toLowerCase();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ${weatherBackground} text-white transition-colors duration-1000`}
    >
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Weather <span className="text-[hsl(280,100%,70%)]">App</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-4"
        >
          <div className="flex gap-4">
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50"
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type="text"
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  placeholder="CC"
                  maxLength={2}
                  className={`w-20 rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50 ${
                    showCountryError ? "border-2 border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                {countryCode.length === 2 && (
                  <span className="absolute top-1/2 right-2 -translate-y-1/2 text-lg">
                    {getCountryFlag(countryCode)}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !city.trim() || showCountryError}
              className="rounded-lg bg-[hsl(280,100%,70%)] px-4 py-2 font-semibold text-white transition hover:bg-[hsl(280,100%,60%)] disabled:opacity-50 disabled:hover:bg-[hsl(280,100%,70%)]"
            >
              Search
            </button>
          </div>
          {!city.trim() && (
            <p className="text-sm text-red-400">Please enter a city name</p>
          )}
          {showCountryError && (
            <p className="text-sm text-red-400">
              Please enter a valid country code (e.g., US, UK, CA)
            </p>
          )}
          <div className="space-y-1">
            <p className="text-sm text-white/70">
              Optional: Add a 2-letter country code (e.g., US, UK, CA) to
              specify the location
            </p>
            <p className="text-xs text-white/50">
              Note: Without a country code, we will return the most populous
              city with that name
            </p>
          </div>
        </form>

        {isLoading && (
          <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-white/10 p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="text-lg">Fetching weather data...</p>
          </div>
        )}

        {isError && error && (
          <div className="w-full max-w-md rounded-lg bg-red-500/10 p-6">
            <h3 className="mb-2 text-xl font-semibold text-red-400">Error</h3>
            <p className="text-red-300">{getErrorMessage(error)}</p>
          </div>
        )}

        {weather && !isLoading && !isError && (
          <div className="w-full max-w-md rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {weather.name} {getCountryFlag(weather.sys.country)}{" "}
                {weather.sys.country}
              </h2>
              {showCountryWarning && (
                <p className="mt-2 text-sm text-yellow-400">
                  ⚠️ Note: Weather data is for {weather.name}{" "}
                  {getCountryFlag(weather.sys.country)} instead of{" "}
                  {getCountryFlag(searchCountryCode)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg">
                  Temperature: {Math.round(weather.main.temp)}°C
                </p>
                <p className="text-sm text-white/70">
                  Feels like: {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
              <div>
                <p className="text-lg">{weather.weather[0]?.main}</p>
                <p className="text-sm text-white/70">
                  {weather.weather[0]?.description}
                </p>
              </div>
              <div>
                <p className="text-lg">Humidity: {weather.main.humidity}%</p>
                <p className="text-sm text-white/70">
                  Pressure: {weather.main.pressure} hPa
                </p>
              </div>
              <div>
                <p className="text-lg">Wind: {weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
