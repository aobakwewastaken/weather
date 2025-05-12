# Weather App

A modern weather application built with Next.js, TypeScript, and the T3 Stack. This application allows users to search for weather information by city name and country code, featuring a dynamic UI that changes based on weather conditions.

## Features

- 🌤️ Real-time weather data from OpenWeatherMap API
- 🎨 Dynamic background colors based on weather conditions
- 🏳️ Country flag emojis for better location identification
- 📱 Responsive design with modern UI
- 🔍 City search with country code support
- ⚡ Built with Next.js App Router
- 🎯 Type-safe API calls with tRPC
- 💅 Styled with Tailwind CSS

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- OpenWeatherMap API key

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:

```env
OPENWEATHER_API_KEY=your-api-key-here
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Searching for Weather**:

   - Enter a city name in the search box
   - Optionally, add a 2-letter country code (e.g., US, UK, CA)
   - Click the search button or press Enter

2. **Understanding the Results**:

   - The background color changes based on the current weather
   - Country flags are displayed for better location identification
   - Temperature is shown in Celsius
   - Additional weather details include:
     - Feels like temperature
     - Weather condition
     - Humidity
     - Pressure
     - Wind speed

3. **Country Code Usage**:
   - Country codes are optional but recommended for cities with the same name
   - Valid country codes follow the ISO 3166-1 alpha-2 format
   - Invalid country codes will show an error message
   - Without a country code, the API returns the most populous city with that name

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [OpenWeatherMap API](https://openweathermap.org/api) - Weather data

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── server/           # Backend API routes
│   └── api/         # tRPC API definitions
├── utils/           # Utility functions
└── styles/          # Global styles
```

## Error Handling

The application includes comprehensive error handling for:

- Invalid city names
- Invalid country codes
- API errors
- Network issues
- Missing API keys

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [T3 Stack](https://create.t3.gg/) for the project template
- [Next.js](https://nextjs.org/) for the amazing framework
