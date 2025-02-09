export class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async getWeather(location) {
        try {
            // Use encodeURIComponent to handle spaces and special characters in location names
            const encodedLocation = encodeURIComponent(location);
            const response = await fetch(
                `${this.baseUrl}/weather?q=${encodedLocation}&units=metric&appid=${this.apiKey}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Weather data not available');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather:', error);
            // Return a default weather object to prevent UI breaks
            return {
                weather: [{
                    description: 'Weather data unavailable',
                    icon: '01d'
                }],
                main: {
                    temp: '--'
                }
            };
        }
    }
}