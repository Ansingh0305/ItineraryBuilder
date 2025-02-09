export class MapService {
    constructor() {
        this.map = null;
        this.markers = [];
        this.places = [];
        this.initMap();
    }

    initMap() {
        // Check if Google Maps is loaded
        if (typeof google === 'undefined' || !google.maps) {
            console.error('Google Maps not loaded');
            return;
        }

        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        this.map = new google.maps.Map(mapElement, {
            zoom: 13,
            center: { lat: 0, lng: 0 },
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true
        });
    }

    async geocodeLocation(location) {
        if (!this.map || !google.maps) {
            throw new Error('Map not initialized');
        }

        const geocoder = new google.maps.Geocoder();
        try {
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: location }, (results, status) => {
                    if (status === 'OK' && results && results.length > 0) {
                        resolve(results[0].geometry.location);
                    } else {
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                });
            });
            return result;
        } catch (error) {
            console.error('Geocoding error:', error);
            // Return a default location (e.g., New York City)
            return new google.maps.LatLng(40.7128, -74.0060);
        }
    }

    updateMap(center) {
        if (!this.map) return;
        this.map.setCenter(center);
        this.clearMarkers();
        this.addMarker(center);
    }

    async getNearbyPlaces(location) {
        if (!this.map) return [];

        const service = new google.maps.places.PlacesService(this.map);
        try {
            const results = await new Promise((resolve, reject) => {
                service.nearbySearch({
                    location: location,
                    radius: 5000,
                    type: ['tourist_attraction']
                }, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        resolve(results);
                    } else {
                        reject(new Error(`Places search failed: ${status}`));
                    }
                });
            });
            this.places = results;
            this.addPlaceMarkers(results);
            return results;
        } catch (error) {
            console.error('Error getting nearby places:', error);
            return [];
        }
    }

    async filterPlaces(type) {
        const coordinates = this.map.getCenter();
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat()},${coordinates.lng()}&radius=1500&type=${type}&key=YOUR_API_KEY`);
        const data = await response.json();
        return data.results;
    }

    addMarker(location) {
        if (!this.map) return;
        
        const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            animation: google.maps.Animation.DROP
        });
        this.markers.push(marker);

        // Add click listener for marker info
        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow({
                content: 'Selected Location'
            });
            infoWindow.open(this.map, marker);
        });
    }

    addPlaceMarkers(places) {
        if (!this.map) return;

        places.forEach(place => {
            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: this.map,
                title: place.name,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: place.icon,
                    scaledSize: new google.maps.Size(32, 32)
                }
            });
            this.markers.push(marker);

            // Add click listener for place info
            marker.addListener('click', () => {
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div>
                            <h3>${place.name}</h3>
                            <p>${place.vicinity}</p>
                            <p>Rating: ${place.rating} ⭐</p>
                        </div>
                    `
                });
                infoWindow.open(this.map, marker);
            });
        });
    }

    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }

    filterPlaces(type) {
        if (!this.map) return;

        this.clearMarkers();
        const service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch({
            location: this.map.getCenter(),
            radius: 5000,
            type: [type]
        }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                this.places = results;
                this.addPlaceMarkers(results);
                this.updateAttractionsList(results);
            }
        });
    }

    updateAttractionsList(places) {
        const attractionsList = document.getElementById('attractions-list');
        if (!attractionsList) return;

        attractionsList.innerHTML = places.map((place, index) => `
            <div class="attraction-card" draggable="true" id="attraction-${index}">
                <h4>${place.name}</h4>
                <p>${place.vicinity}</p>
                <p>Rating: ${place.rating ? `${place.rating} ⭐` : 'No rating'}</p>
            </div>
        `).join('');
    }

    updateMarkersFromItinerary() {
        if (!this.map || this.markers.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        this.markers.forEach(marker => bounds.extend(marker.getPosition()));
        this.map.fitBounds(bounds);
        
        // If only one marker, zoom out a bit
        if (this.markers.length === 1) {
            this.map.setZoom(13);
        }
    }
}