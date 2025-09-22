package com.truckshare.shipment_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.truckshare.shipment_service.entity.Shipment;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
}
