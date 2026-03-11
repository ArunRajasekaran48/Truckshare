package com.truckshare.shipment_service.service;

import org.springframework.stereotype.Service;

@Service
public class PricingService {

    // Rate Card (can be moved to application.properties later)
    private static final double BASE_FARE = 500.0;
    private static final double PER_KM_RATE = 15.0;
    private static final double PER_KG_RATE = 2.0;
    private static final double PER_VOL_RATE = 5.0;

    /**
     * Total Shipment Price = BaseFare + (Distance * KmRate) + (Weight * KgRate) +
     * (Volume * VolRate)
     */
    public Double calculateEstimatedPrice(Double distanceKm, Double weight, Double volume) {
        if (distanceKm == null || weight == null || volume == null) {
            return 0.0;
        }

        double price = BASE_FARE;
        price += (distanceKm * PER_KM_RATE);
        price += (weight * PER_KG_RATE);
        price += (volume * PER_VOL_RATE);

        return Math.round(price * 100.0) / 100.0; // Round to 2 decimal places
    }
}
