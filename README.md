# Travel Itinerary Builder

## Overview

The Travel Itinerary Builder is a web application that helps users plan their trips by providing weather forecasts and a customizable itinerary. Users can enter their destination and travel dates to get relevant information and build their itinerary.

## Features

- **Weather Forecast**: Get the current weather forecast for the selected destination.
- **Customizable Itinerary**: Add notes for each day of the trip to create a personalized itinerary.

## APIs Used

1. **OpenWeatherMap API**: Provides weather data for the selected destination.
   - **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`

2. **Google Maps API**: Used for displaying the map and geocoding locations.
   - **Endpoint**: `https://maps.googleapis.com/maps/api/js`

## How to Use

1. **Enter Destination**: Type the name of the destination city in the input field.
2. **Select Travel Dates**: Choose the start and end dates for your trip.
3. **Search**: Click the "Search" button to fetch weather data.
4. **View Results**: The weather forecast will be displayed in the sidebar.
5. **Build Itinerary**: Add notes for each day of your trip in the itinerary section.

## Project Structure

- `index.html`: The main HTML file for the application.
- `style.css`: The CSS file for styling the application.
- `main.js`: The main JavaScript file for handling user interactions and API calls.
- `src/services/weather.js`: The JavaScript file for interacting with the OpenWeatherMap API.
- `src/services/map.js`: The JavaScript file for interacting with the Google Maps API.

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/travel-itinerary-builder.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd travel-itinerary-builder
   ```

3. **Open `index.html` in your web browser** to start using the application.

## License

This project is licensed under the MIT License.
