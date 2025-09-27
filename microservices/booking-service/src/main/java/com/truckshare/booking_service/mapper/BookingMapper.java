package com.truckshare.booking_service.mapper;

import com.truckshare.booking_service.dto.CreateBookingRequest;
import com.truckshare.booking_service.dto.ShipmentTruckResponse;
import com.truckshare.booking_service.entity.ShipmentTruck;

public class BookingMapper {
    public static ShipmentTruckResponse toResponse(ShipmentTruck entity) {
        return ShipmentTruckResponse.builder()
                .id(entity.getId())
                .shipmentId(entity.getShipmentId())
                .truckId(entity.getTruckId())
                .allocatedWeight(entity.getAllocatedWeight())
                .allocatedVolume(entity.getAllocatedVolume())
                .paymentConfirmed(entity.getPaymentConfirmed())
                .paymentReference(entity.getPaymentReference())
                .paymentConfirmedAt(entity.getPaymentConfirmedAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static ShipmentTruck toEntity(CreateBookingRequest request) {
        return ShipmentTruck.builder()
                .shipmentId(request.getShipmentId())
                .truckId(request.getTruckId())
                .allocatedWeight(request.getAllocatedWeight())
                .allocatedVolume(request.getAllocatedVolume())
                .build();
    }
}
