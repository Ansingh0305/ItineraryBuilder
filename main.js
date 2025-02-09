import { WeatherService } from './weather.js';
import { MapService } from './map.js';

class TravelItineraryBuilder {
    constructor() {
        this.weatherService = new WeatherService('5450d9439a806988f7cf5d08b2438677');
        this.mapService = new MapService();
        
        this.destination = null;
        this.startDate = null;
        this.endDate = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.loadItineraryNotes();
                this.applyDarkTheme();
            });
        } else {
            this.setupEventListeners();
            this.loadItineraryNotes();
            this.applyDarkTheme();
        }
    }

    setupEventListeners() {
        const destinationInput = document.getElementById('destination');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');

        if (destinationInput) {
            destinationInput.addEventListener('change', (e) => {
                this.destination = e.target.value;
            });
        }

        if (startDateInput) {
            startDateInput.addEventListener('change', (e) => {
                this.startDate = e.target.value;
                this.updateItineraryDays();
            });
        }

        if (endDateInput) {
            endDateInput.addEventListener('change', (e) => {
                this.endDate = e.target.value;
                this.updateItineraryDays();
            });
        }
    }

    updateItineraryDays() {
        if (!this.startDate || !this.endDate) return;

        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (days < 1) {
            alert('End date must be after start date');
            return;
        }

        const itineraryDays = document.getElementById('itinerary-days');
        if (!itineraryDays) return;

        itineraryDays.innerHTML = Array.from({ length: days }, (_, i) => {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            const dayKey = `itineraryNotes-${date.toISOString().split('T')[0]}`;
            const savedNotes = localStorage.getItem(dayKey) || '';
            return `
                <div class="itinerary-day">
                    <h4>Day ${i + 1} - ${date.toLocaleDateString()}</h4>
                    <textarea class="itinerary-textarea" data-day="${dayKey}" placeholder="Add your itinerary notes here...">${savedNotes}</textarea>
                </div>
            `;
        }).join('');

        this.setupTextareaEventListeners();
    }

    setupTextareaEventListeners() {
        const textareas = document.querySelectorAll('.itinerary-textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('blur', (e) => {
                const dayKey = e.target.dataset.day;
                this.saveItineraryNotes(dayKey, e.target.value);
            });
        });
    }

    saveItineraryNotes(dayKey, notes) {
        localStorage.setItem(dayKey, notes);
    }

    loadItineraryNotes() {
        const textareas = document.querySelectorAll('.itinerary-textarea');
        textareas.forEach(textarea => {
            const dayKey = textarea.dataset.day;
            const savedNotes = localStorage.getItem(dayKey);
            if (savedNotes) {
                textarea.value = savedNotes;
            }
        });
    }

    async searchDestination() {
        if (!this.destination) {
            alert('Please enter a destination');
            return;
        }

        if (this.isLoading) return;

        try {
            this.isLoading = true;
            document.body.style.cursor = 'wait';

            const weatherData = await this.weatherService.getWeather(this.destination);
            this.updateWeatherWidget(weatherData);

            const coordinates = await this.mapService.geocodeLocation(this.destination);
            this.mapService.updateMap(coordinates);
        } catch (error) {
            console.error('Error searching destination:', error);
            alert('Error searching destination. Please try again.');
        } finally {
            this.isLoading = false;
            document.body.style.cursor = 'default';
        }
    }

    updateWeatherWidget(weatherData) {
        const weatherInfo = document.getElementById('weather-info');
        if (!weatherInfo) return;

        weatherInfo.innerHTML = `
            <div class="weather-info">
                <img class="weather-icon" src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather icon">
                <div>
                    <h4>${typeof weatherData.main.temp === 'number' ? Math.round(weatherData.main.temp) : '--'}°C</h4>
                    <p>${weatherData.weather[0].description}</p>
                </div>
            </div>
        `;
    }

    applyDarkTheme() {
        document.body.classList.add('dark-mode');
    }
}

const app = new TravelItineraryBuilder();
window.searchDestination = () => app.searchDestination();

export { TravelItineraryBuilder };