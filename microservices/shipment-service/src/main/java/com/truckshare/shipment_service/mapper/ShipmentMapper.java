package com.truckshare.shipment_service.mapper;

import com.truckshare.shipment_service.dto.ShipmentDto;

import com.truckshare.shipment_service.entity.Shipment;
import lombok.Data;

@Data
public class ShipmentMapper {
   public static Shipment toEntity(ShipmentDto dto) {
        if(dto == null) {
            return null;
        }
        return Shipment.builder()
                .id(dto.getId())
                .businessUserId(dto.getBusinessUserId())
                .fromLocation(dto.getFromLocation())
                .toLocation(dto.getToLocation())
                .requiredWeight(dto.getRequiredWeight())
                .requiredVolume(dto.getRequiredVolume())
                .isSplit(dto.getIsSplit())
                .status(dto.getStatus())
                .build();
   }

    public static ShipmentDto toDto(Shipment shipment) {
        if(shipment == null) {
            return null;
        }
        return ShipmentDto.builder()
                .id(shipment.getId())
                .businessUserId(shipment.getBusinessUserId())
                .fromLocation(shipment.getFromLocation())
                .toLocation(shipment.getToLocation())
                .requiredWeight(shipment.getRequiredWeight())
                .requiredVolume(shipment.getRequiredVolume())
                .isSplit(shipment.getIsSplit())
                .status(shipment.getStatus())
                .build();
    }
    
}
