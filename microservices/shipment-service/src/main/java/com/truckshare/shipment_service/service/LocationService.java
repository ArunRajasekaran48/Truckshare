package com.truckshare.shipment_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Get coordinates (lat, lon) for a city name using Photon API.
     * Returns double[] {lat, lon}
     */
    public double[] getCoordinates(String city) {
        String url = "https://photon.komoot.io/api/?q=" + city + "&limit=1";
        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode features = root.path("features");
            if (features.isArray() && !features.isEmpty()) {
                JsonNode coordinates = features.get(0).path("geometry").path("coordinates");
                // Photon returns [lon, lat]
                double lon = coordinates.get(0).asDouble();
                double lat = coordinates.get(1).asDouble();
                return new double[] { lat, lon };
            }
        } catch (Exception e) {
            log.error("Failed to get coordinates for city: {}", city, e);
        }
        return null;
    }

    /**
     * Get road distance in kilometers between two points using OSRM API.
     */
    public Double getDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        // OSRM uses {lon1},{lat1};{lon2},{lat2}
        String url = String.format("http://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=false",
                lon1, lat1, lon2, lat2);
        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode routes = root.path("routes");
            if (routes.isArray() && !routes.isEmpty()) {
                double distanceMeters = routes.get(0).path("distance").asDouble();
                return distanceMeters / 1000.0;
            }
        } catch (Exception e) {
            log.error("Failed to get distance from OSRM", e);
        }
        return null;
    }
}
