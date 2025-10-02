# TruckShare

Share extra truck space — book a whole truck or split your shipment across several trucks.

## Overview
TruckShare links truck owners who have spare space with businesses that need to ship goods. Businesses can book space by weight or volume. If needed, one shipment can be split across multiple trucks.

## Goal
Lower shipping cost and waste by matching available truck space with shipment needs. This makes shipping smaller loads cheaper and more flexible.

## Architecture

- **Microservices**: Spring Boot applications with service discovery
- **Database**: PostgreSQL
- **Communication**: OpenFeign for inter-service communication
- **Gateway**: API Gateway for routing requests and Centralized Auth

## Services

- `api-gateway` - Routes requests to appropriate services
- `service-registry` - Eureka service discovery
- `user-service` - User management and authentication
- `truck-service` - Truck registration and capacity management
- `shipment-service` - Shipment creation and tracking
- `matching-service` - Matches shipments with available trucks
- `booking-service` - Booking management and payment processing
- `tracking-service` - Tracking information for shipments

## Who it helps
- **Truck owners** — earn from empty or partly empty trips.
- **Businesses** — ship small loads without paying for a full truck.
- **Logistics coordinators** — manage flexible, cost-effective shipments.

## Key features
- Truck owners list trucks with route, capacity, and price per unit.
- Businesses create shipment requests with pickup, drop-off, weight and volume.
- Supports **non-split** (single truck) and **split** (multiple trucks) shipments.
- Booking flow: find trucks, propose booking, confirm after payment or agreement.
- Shipment status updates: **Pending → Partially Booked → Booked**.
- Track booking progress until delivery.

## How to use

### For businesses
1. Create a shipment: enter pickup, drop-off, weight/volume, and choose if splitting is allowed.  
2. Browse trucks that match your route and space needs.  
3. Select one or more trucks and send booking proposals.  
4. Complete advance payment or confirm by your agreed method.  
5. After the truck owner confirms, the booked capacity updates and you can track the shipment.

### For truck owners
1. Register your truck and list its route, available capacity, and price (for example, price per ton).  
2. Receive booking proposals from businesses that match your route.  
3. Confirm bookings after you accept payment or agree with the business.  
4. Update remaining capacity after confirming a booking.  
5. Share tracking updates while the load is in transit.

## Simple example flow

1. Business creates a shipment (splitting allowed):
```
POST /shipments
{
  "fromLocation": "City A",
  "toLocation": "City B",
  "requiredWeight": 1000.0,
  "requiredVolume": 500.0,
  "isSplit": true
}
```

2. Book Truck A for part of the load:
```
POST /bookings
{
  "shipmentId": "shipment-uuid",
  "truckId": "truck-A-uuid",
  "allocatedWeight": 400.0,
  "allocatedVolume": 200.0
}
```
Status: **PARTIALLY_BOOKED**

3. Book Truck B for the remaining load:
```
POST /bookings
{
  "shipmentId": "shipment-uuid",
  "truckId": "truck-B-uuid",
  "allocatedWeight": 600.0,
  "allocatedVolume": 300.0
}
```
Status becomes **BOOKED**

## What to expect as a user
- Clear shipment statuses: **Pending**, **Partially Booked**, **Booked**.  
- Option to split shipments when you enable it.  
- Truck owners confirm bookings and update remaining capacity.  
- Delivery is complete once the full requested weight/volume has been allocated and the delivery is marked finished.

## FAQ
**Q: Can I split a shipment?**  
A: Yes, if you enable splitting when creating the shipment.

**Q: Who confirms a booking?**  
A: The truck owner confirms the booking after payment or agreement.

**Q: How do I know a shipment is complete?**  
A: When the total allocated weight/volume equals what you requested and the delivery is marked finished.

<!-- ## Support
For help, contact your platform administrator or support channel (provide contact details here). -->
