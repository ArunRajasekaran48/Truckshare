package com.truckshare.booking_service.service;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.entity.ShipmentTruck;
import com.truckshare.booking_service.mapper.BookingMapper;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShipmentClient shipmentClient;

    @Transactional
    public ShipmentTruckResponse createBooking(CreateBookingRequest request) {
        // Save booking
        ShipmentTruck booking = ShipmentTruck.builder()
                .shipmentId(request.getShipmentId())
                .truckId(request.getTruckId())
                .allocatedWeight(request.getAllocatedWeight())
                .allocatedVolume(request.getAllocatedVolume())
                .build();

        ShipmentTruck saved = bookingRepository.save(booking);

        // Call Shipment Service to update allocation & status
        shipmentClient.updateAllocation(
                request.getShipmentId(),
                request.getAllocatedWeight(),
                request.getAllocatedVolume()
        );

        return BookingMapper.toResponse(saved);
    }
}
