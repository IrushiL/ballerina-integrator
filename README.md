# Parallel Service Orchestration

Parallel service orchestration is the process of integrating two or more services together to automate a particular task or business process where the service orchestrator consumes the resources available in services in a parallel manner. 

> This guide walks you through the process of implementing a parallel service orchestration using Ballerina language. 

The following are the sections available in this guide.

- [What you'll build](#what-you-build)
- [Prerequisites](#pre-req)
- [Developing the service](#developing-service)
- [Testing](#testing)
- [Deployment](#deploying-the-scenario)
- [Observability](#observability)

## <a name="what-you-build"></a>  What you’ll build
To understand how you can build a parallel service orchestration using Ballerina, let's consider a real-world use case of a travel agency that arranges complete tours for users. A tour package includes airline ticket reservation, hotel room reservation and car rental. Therefore, the travel agency service requires communicating with other necessary back-ends. 

This scenario is similar to the scenario used in the [service-composition guide](https://github.com/ballerina-guides/service-composition) except, all three external services (airline reservation, hotel reservation and car rental) contain multiple resources. The travel agency service checks these resources in parallel to select the best-suited resource for each requirement. For example, the travel agency service checks three different airways in parallel and selects the airway with the lowest cost. Similarly, it checks several hotels in parallel and selects the closest one to the client's preferred location. The following diagram illustrates this use case.

![alt text](/images/parallel_service_orchestration.png)

Travel agency is the service that acts as the service orchestration initiator. The other three services are external services that the travel agency service calls to do airline ticket booking, hotel reservation and car rental. These are not necessarily Ballerina services and can theoretically be third-party services that the travel agency service calls to get things done. However, for the purposes of setting up this scenario and illustrating it in this guide, these third-party services are also written in Ballerina.

## <a name="pre-req"></a> Prerequisites
 
- JDK 1.8 or later
- [Ballerina Distribution](https://github.com/ballerina-lang/ballerina/blob/master/docs/quick-tour.md)
- A Text Editor or an IDE 

### Optional Requirements
- Ballerina IDE plugins ([IntelliJ IDEA](https://plugins.jetbrains.com/plugin/9520-ballerina), [VSCode](https://marketplace.visualstudio.com/items?itemName=WSO2.Ballerina), [Atom](https://atom.io/packages/language-ballerina))
- [Docker](https://docs.docker.com/engine/installation/)

## <a name="developing-service"></a> Developing the service

### <a name="before-begin"></a> Before you begin
##### Understand the package structure
Ballerina is a complete programming language that can have any custom project structure that you wish. Although the language allows you to have any package structure, use the following package structure for this project to follow this guide.

```
parallel-service-orchestration
├── TravelAgency
│   ├── AirlineReservation
│   │   ├── airline_reservation_service.bal
│   │   └── airline_reservation_service_test.bal
│   ├── CarRental
│   │   ├── car_rental_service.bal
│   │   └── car_rental_service_test.bal
│   ├── HotelReservation
│   │   ├── hotel_reservation_service.bal
│   │   └── hotel_reservation_service_test.bal
│   ├── travel_agency_service_parallel.bal
│   └── travel_agency_service_parallel_test.bal
└── README.md

```

Package `AirlineReservation` contains the service that provides airline ticket reservation functionality.

Package `CarRental` contains the service that provides car rental functionality.

Package `HotelReservation` contains the service that provides hotel room reservation functionality.

The `travel_agency_service_parallel.bal` file consists of the travel agency service, which communicates with the other three services, and arranges a complete tour for the client.


### <a name="Implementation"></a> Implementation

Let's look at the implementation of the travel agency service, which acts as the service orchestration initiator.

To arrange a complete tour travel agency service requires communicating with three other services: airline reservation, hotel reservation, and car rental. These external services consist of multiple resources, which can be consumed by the callers. The airline reservation service has three different resources each depicting an airline service provider. Similarly, the hotel reservation service has three resources to check different hotels and the car rental service has three resources to check different rental providing companies. All these services accept POST requests with appropriate JSON payloads and send responses back with JSON payloads. 

Sample request payload for the airline reservation service:

```bash
{"ArrivalDate":"12-03-2018", "DepartureDate":"13-04-2018", "From":"Colombo", "To":"Changi"} 
```

Sample response payload from the airline reservation service:

```bash
{"Airline":"Emirates", "ArrivalDate":"12-03-2018", "ReturnDate":"13-04-2018", "From":"Colombo", "To":"Changi", "Price":273}
```

Sample request payload for the hotel reservation service:

```bash
{"ArrivalDate":"12-03-2018", "DepartureDate":"13-04-2018", "Location":"Changi"}
```

Sample response payload from the hotel reservation service:

```bash
{"HotelName":"Miramar", "FromDate":"12-03-2018", "ToDate":"13-04-2018", "DistanceToLocation":6}
```

Sample request payload for the car rental service:

```bash
{"ArrivalDate":"12-03-2018", "DepartureDate":"13-04-2018", "VehicleType":"Car"}
```

Sample response payload from the car rental service:

```bash
{"Company":"DriveSG", "VehicleType":"Car", "FromDate":"12-03-2018", "ToDate":"13-04-2018", "PricePerDay":5}
```

When a client initiates a request to arrange a tour, the travel agency service first needs to communicate with the airline reservation service to arrange an airline. The airline reservation service allows the client to check about three different airlines by providing a separate resource for each airline. To check the implementation of airline reservation service, see the [airline_reservation_service.bal](https://github.com/ballerina-guides/service-composition/blob/master/TravelAgency/AirlineReservation/airline_reservation_service.bal) file.

Once the airline ticket reservation is successful, the travel agency service needs to communicate with the hotel reservation service to reserve hotel rooms. The hotel reservation service allows the client to check about three different hotels by providing a separate resource for each hotel. To check the implementation of hotel reservation service, see the [hotel_reservation_service.bal](https://github.com/ballerina-guides/service-composition/blob/master/TravelAgency/HotelReservation/hotel_reservation_service.bal) file.

Finally, the travel agency service needs to connect with the car rental service to arrange internal transports. The car rental service also provides three different resources for three car rental providing companies. To check the implementation of car rental service, see the [car_rental_service.bal](https://github.com/ballerina-guides/service-composition/blob/master/TravelAgency/CarRental/car_rental_service.bal) file.

When communicating with an external service, the travel agency service sends separate requests for all the available resources in parallel.

The travel agency service checks all three airlines available in parallel and waits for all of them to respond. Once it receives the responses, it selects the airline that has the lowest cost. Refer to the below code segment attached, which is responsible for the integration with the airline reservation service.

```ballerina
// Airline reservation
// Call the airline reservation service and consume different resources in parallel to check about different airlines
// Fork - Join to run parallel workers and join the results
fork {
    // Worker to communicate with airline 'Qatar Airways'
    worker qatarWorker {
        http:OutRequest req = {};
        http:InResponse respWorkerQatar = {};
        // Out request payload
        req.setJsonPayload(flightPayload);
        // Send a POST request to 'Qatar Airways' and get the results
        respWorkerQatar, _ = airlineReservationEP.post("/qatarAirways", req);
        // Reply to the join block from this worker 
        // Send the response from 'Qatar Airways'
        respWorkerQatar -> fork;
    }

    // Worker to communicate with airline 'Asiana'
    worker asianaWorker {
        http:OutRequest req = {};
        http:InResponse respWorkerAsiana = {};
        // Out request payload
        req.setJsonPayload(flightPayload);
        // Send a POST request to 'Asiana' and get the results
        respWorkerAsiana, _ = airlineReservationEP.post("/asiana", req);
        // Reply to the join block from this worker 
        // Send the response from 'Asiana'
        respWorkerAsiana -> fork;
    }

    // Worker to communicate with airline 'Emirates'
    worker emiratesWorker {
        http:OutRequest req = {};
        http:InResponse respWorkerEmirates = {};
        // Out request payload
        req.setJsonPayload(flightPayload);
        // Send a POST request to 'Emirates' and get the results
        respWorkerEmirates, _ = airlineReservationEP.post("/emirates", req);
        // Reply to the join block from this worker 
        // Send the response from 'Emirates'
        respWorkerEmirates -> fork;
    }
} join (all) (map airlineResponses) {
    // Wait until the responses are received from all the workers running in parallel

    int qatarPrice;
    int asianaPrice;
    int emiratesPrice;

    // Get the response and price for airline 'Qatar Airways'
    if (airlineResponses["qatarWorker"] != null) {
        var resQatarWorker, _ = (any[])airlineResponses["qatarWorker"];
        var responseQatar, _ = (http:InResponse)(resQatarWorker[0]);
        jsonFlightResponseQatar = responseQatar.getJsonPayload();
        qatarPrice, _ = (int)jsonFlightResponseQatar.Price;
    }

    // Get the response and price for airline 'Asiana'
    if (airlineResponses["asianaWorker"] != null) {
        var resAsianaWorker, _ = (any[])airlineResponses["asianaWorker"];
        var responseAsiana, _ = (http:InResponse)(resAsianaWorker[0]);
        jsonFlightResponseAsiana = responseAsiana.getJsonPayload();
        asianaPrice, _ = (int)jsonFlightResponseAsiana.Price;
    }

    // Get the response and price for airline 'Emirates'
    if (airlineResponses["emiratesWorker"] != null) {
        var resEmiratesWorker, _ = (any[])airlineResponses["emiratesWorker"];
        var responseEmirates, _ = ((http:InResponse)(resEmiratesWorker[0]));
        jsonFlightResponseEmirates = responseEmirates.getJsonPayload();
        emiratesPrice, _ = (int)jsonFlightResponseEmirates.Price;

    }

    // Select the airline with the least price
    if (qatarPrice < asianaPrice) {
        if (qatarPrice < emiratesPrice) {
            jsonFlightResponse = jsonFlightResponseQatar;
        }
    } else {
        if (qatarPrice < emiratesPrice) {
            jsonFlightResponse = jsonFlightResponseAsiana;
        }
        else {
            jsonFlightResponse = jsonFlightResponseEmirates;
        }
    }
}
```

As shown in the above code, we used `fork-join` to run parallel workers and join their responses. The fork-join allows developers to spawn (fork) multiple workers within a Ballerina program and join the results from those workers. Here we used "all" as the join condition, which means the program waits for all the workers to respond.

Let's now look at how the Travel agency service integrates with the Hotel reservation service. Similar to the above scenario, Travel agency service sends requests to all three available resources in Parallel and wait for all of them to respond. Once it receives the responses, it selects the hotel that is closest to the client's preferred location. Refer to the below code segment attached.

```ballerina
// Hotel reservation
// Call Hotel reservation service and consume different resources in parallel to check about different hotels
// Fork - Join to run parallel workers and join the results
fork {
    // Worker to communicate with hotel 'Miramar'
    worker miramar {
        http:OutRequest req = {};
        http:InResponse respWorkerMiramar = {};
        // Out request payload
        req.setJsonPayload(hotelPayload);
        // Send a POST request to 'Asiana' and get the results
        respWorkerMiramar, _ = hotelReservationEP.post("/miramar", req);
        // Reply to the join block from this worker - Send the response from 'Asiana'
        respWorkerMiramar -> fork;
    }

    // Worker to communicate with hotel 'Aqueen'
    worker aqueen {
        http:OutRequest req = {};
        http:InResponse respWorkerAqueen = {};
        // Out request payload
        req.setJsonPayload(hotelPayload);
        // Send a POST request to 'Aqueen' and get the results
        respWorkerAqueen, _ = hotelReservationEP.post("/aqueen", req);
        // Reply to the join block from this worker - Send the response from 'Aqueen'
        respWorkerAqueen -> fork;
    }

    // Worker to communicate with hotel 'Elizabeth'
    worker elizabeth {
        http:OutRequest req = {};
        http:InResponse respWorkerElizabeth = {};
        // Out request payload
        req.setJsonPayload(hotelPayload);
        // Send a POST request to 'Elizabeth' and get the results
        respWorkerElizabeth, _ = hotelReservationEP.post("/elizabeth", req);
        // Reply to the join block from this worker - Send the response from 'Elizabeth'
        respWorkerElizabeth -> fork;
    }
} join (all) (map hotelResponses) {
    // Wait until the responses received from all the workers running in parallel

    int miramarDistance;
    int aqueenDistance;
    int elizabethDistance;

    // Get the response and distance to the preferred location from the hotel 'Miramar'
    if (hotelResponses["miramar"] != null) {
        var resMiramarWorker, _ = (any[])hotelResponses["miramar"];
        var responseMiramar, _ = (http:InResponse)(resMiramarWorker[0]);
        miramarJsonResponse = responseMiramar.getJsonPayload();
        miramarDistance, _ = (int)miramarJsonResponse.DistanceToLocation;
    }

    // Get the response and distance to the preferred location from the hotel 'Aqueen'
    if (hotelResponses["aqueen"] != null) {
        var resAqueenWorker, _ = (any[])hotelResponses["aqueen"];
        var responseAqueen, _ = (http:InResponse)(resAqueenWorker[0]);
        aqueenJsonResponse = responseAqueen.getJsonPayload();
        aqueenDistance, _ = (int)aqueenJsonResponse.DistanceToLocation;
    }

    // Get the response and distance to the preferred location from the hotel 'Elizabeth'
    if (hotelResponses["elizabeth"] != null) {
        var resElizabethWorker, _ = (any[])hotelResponses["elizabeth"];
        var responseElizabeth, _ = ((http:InResponse)(resElizabethWorker[0]));
        elizabethJsonResponse = responseElizabeth.getJsonPayload();
        elizabethDistance, _ = (int)elizabethJsonResponse.DistanceToLocation;
    }

    // Select the hotel with the lowest distance
    if (miramarDistance < aqueenDistance) {
        if (miramarDistance < elizabethDistance) {
            jsonHotelResponse = miramarJsonResponse;
        }
    } else {
        if (aqueenDistance < elizabethDistance) {
            jsonHotelResponse = aqueenJsonResponse;
        }
        else {
            jsonHotelResponse = elizabethJsonResponse;
        }
    }
}

```

Let's next look at how the Travel agency service integrates with the Car rental service. Travel agency service sends requests to all three car rental providers in Parallel and gets only the first one to respond. Refer to the below code segment attached.

```ballerina
// Car rental
// Call Car rental service and consume different resources in parallel to check about different companies
// Fork - Join to run parallel workers and join the results
fork {
    // Worker to communicate with Company 'DriveSg'
    worker driveSg {
        http:OutRequest req = {};
        http:InResponse respWorkerDriveSg = {};
        // Out request payload
        req.setJsonPayload(vehiclePayload);
        // Send a POST request to 'DriveSg' and get the results
        respWorkerDriveSg, _ = carRentalEP.post("/driveSg", req);
        // Reply to the join block from this worker - Send the response from 'DriveSg'
        respWorkerDriveSg -> fork;
    }

    // Worker to communicate with Company 'DreamCar'
    worker dreamCar {
        http:OutRequest req = {};
        http:InResponse respWorkerDreamCar = {};
        // Out request payload
        req.setJsonPayload(vehiclePayload);
        // Send a POST request to 'DreamCar' and get the results
        respWorkerDreamCar, _ = carRentalEP.post("/dreamCar", req);
        // Reply to the join block from this worker - Send the response from 'DreamCar'
        respWorkerDreamCar -> fork;
    }

    // Worker to communicate with Company 'Sixt'
    worker sixt {
        http:OutRequest req = {};
        http:InResponse respWorkerSixt = {};
        // Out request payload
        req.setJsonPayload(vehiclePayload);
        // Send a POST request to 'Sixt' and get the results
        respWorkerSixt, _ = carRentalEP.post("/sixt", req);
        // Reply to the join block from this worker - Send the response from 'Sixt'
        respWorkerSixt -> fork;
    }
} join (some 1) (map vehicleResponses) {
    // Get the first responding worker

    // Get the response from company 'DriveSg' if not null
    if (vehicleResponses["driveSg"] != null) {
        var resDriveSgWorker, _ = (any[])vehicleResponses["driveSg"];
        var responseDriveSg, _ = (http:InResponse)(resDriveSgWorker[0]);
        jsonVehicleResponse = responseDriveSg.getJsonPayload();
    } else if (vehicleResponses["dreamCar"] != null) {
        // Get the response from company 'DreamCar' if not null
        var resDreamCarWorker, _ = (any[])vehicleResponses["dreamCar"];
        var responseDreamCar, _ = (http:InResponse)(resDreamCarWorker[0]);
        jsonVehicleResponse = responseDreamCar.getJsonPayload();
    } else if (vehicleResponses["sixt"] != null) {
        // Get the response from company 'Sixt' if not null
        var resSixtWorker, _ = (any[])vehicleResponses["sixt"];
        var responseSixt, _ = ((http:InResponse)(resSixtWorker[0]));
        jsonVehicleResponse = responseSixt.getJsonPayload();
    }
}

```

Here we used "some 1" as the join condition, which means the program gets results from only one worker, which responds first. Therefore, the Travel agency service will get the car rental provider that responds first.

Finally, let's look at the skeleton of the `travel_agency_service_parallel.bal` file that is responsible for the Travel agency service.

##### travel_agency_service_parallel.bal

```ballerina
package TravelAgency;

import ballerina.net.http;

// Travel agency service to arrange a complete tour for a user
@http:configuration {basePath:"/travel", port:9090}
service<http> travelAgencyService {

    // Endpoint to communicate with the airline reservation service
    endpoint<http:HttpClient> airlineReservationEP {
        create http:HttpClient("http://localhost:9091/airline", {});
    }

    // Endpoint to communicate with the hotel reservation service
    endpoint<http:HttpClient> hotelReservationEP {
        create http:HttpClient("http://localhost:9092/hotel", {});
    }

    // Endpoint to communicate with the car rental service
    endpoint<http:HttpClient> carRentalEP {
        create http:HttpClient("http://localhost:9093/car", {});
    }

    // Resource to arrange a tour
    @http:resourceConfig {methods:["POST"], consumes:["application/json"], produces:["application/json"]}
    resource arrangeTour (http:Connection connection, http:InRequest inRequest) {
      
        // Try parsing the JSON payload from the user request

        // Integration with Airline reservation service to reserve airway

        // Integration with Hotel reservation service to reserve hotel

        // Integration with Car rental service to rent vehicle
        
        // Respond back to the client
    }
}

```

In the above code, `airlineReservationEP` is the endpoint defined through which the Ballerina service communicates with the external airline reservation service. The endpoint defined to communicate with the external Hotel reservation service is `hotelReservationEP`. Similarly, `carRentalEP` is the endpoint defined to communicate with the external car rental service.

To see the complete implementation of the above file, refer to the [travel_agency_service_parallel.bal](https://github.com/ballerina-guides/service-composition/blob/master/TravelAgency/travel_agency_service_parallel.bal).


## <a name="testing"></a> Testing 

### <a name="try-it"></a> Try it out

1. Start all four HTTP services by entering the following command in a separate terminal for each service. This command will start the `Airline Reservation`, `Hotel Reservation`, `Car Rental` and `Travel Agency` services in ports 9091, 9092, 9093 and 9090 respectively.  Here `<Package_Name>` is the corresponding package name in which each service file located.

   ```bash
    <SAMPLE_ROOT_DIRECTORY>$ ballerina run TravelAgency/<Package_Name>
   ```
   
2. Invoke the `travelAgencyService` by sending a POST request to arrange a tour.

   ```bash
    curl -v -X POST -d \
    '{"ArrivalDate":"12-03-2018", "DepartureDate":"13-04-2018", "From":"Colombo", "To":"Changi", "VehicleType":"Car", "Location":"Changi"}' \
    "http://localhost:9090/travel/arrangeTour" -H "Content-Type:application/json"
   ```

   The `travelAgencyService` sends a response similar to the following:
    
   ```bash
    < HTTP/1.1 200 OK
    {
      "Flight":{"Airline":"Emirates","ArrivalDate":"12-03-2018","ReturnDate":"13-04-2018","From":"Colombo","To":"Changi","Price":273},
      "Hotel":{"HotelName":"Elizabeth","FromDate":"12-03-2018","ToDate":"13-04-2018","DistanceToLocation":2},
      "Vehicle":{"Company":"DriveSG","VehicleType":"Car","FromDate":"12-03-2018","ToDate":"13-04-2018","PricePerDay":5}
    }
   ``` 
   
   
### <a name="unit-testing"></a> Writing unit tests 

In Ballerina, the unit test cases should be in the same package and the naming convention should be as follows.
* Test files should contain _test.bal suffix.
* Test functions should contain test prefix.
  * e.g., testTravelAgencyService()

This guide contains unit test cases for each service implemented above. 

Test files are in the same packages in which the service files are located.

To run the unit tests, go to the sample root directory and run the following command. Here `<Package_Name>` is the corresponding package name in which each test file located.
   ```bash
   <SAMPLE_ROOT_DIRECTORY>$ ballerina test TravelAgency/<Package_Name>
   ```

To check the implementations of these test files, refer to the [airline_reservation_service_test.bal](https://github.com/ballerina-guides/parallel-service-orchestration/blob/master/TravelAgency/AirlineReservation/airline_reservation_service_test.bal), [hotel_reservation_service_test.bal](https://github.com/ballerina-guides/parallel-service-orchestration/blob/master/TravelAgency/HotelReservation/hotel_reservation_service_test.bal), [car_rental_service_test.bal](https://github.com/ballerina-guides/parallel-service-orchestration/blob/master/TravelAgency/CarRental/car_rental_service_test.bal) and [travel_agency_service_parallel_test.bal](https://github.com/ballerina-guides/parallel-service-orchestration/blob/master/TravelAgency/travel_agency_service_parallel_test.bal).


## <a name="deploying-the-scenario"></a> Deployment

Once you are done with the development, you can deploy the services using any of the methods that are listed below. 

### <a name="deploying-on-locally"></a> Deploying locally
You can deploy the services that you developed above in your local environment. You can create the Ballerina executable archives (.balx) first and then run them in your local environment as follows,

Building 
   ```bash
    <SAMPLE_ROOT_DIRECTORY>$ ballerina build TravelAgency/<Package_Name>
   ```

Running
   ```bash
    <SAMPLE_ROOT_DIRECTORY>$ ballerina run <Exec_Archive_File_Name>
   ```

### <a name="deploying-on-docker"></a> Deploying on Docker

You can use the Ballerina executable archives (.balx) that you created above and create docker images for the services using the following commands.

  ```bash
  <SAMPLE_ROOT_DIRECTORY>$ ballerina docker <Exec_Archive_File_Name>  
  ```

Once you have created the docker images, you can run them using `docker run` as follows, 

  ```bash
  docker run -p <host_port>:<service_port> --name <container_instance_name> -d <image_name>:<tag_name>
  ```

For example, to run the Travel agency service, use the following command.

  ```bash
  docker run -p <host_port>:9090 --name ballerina_TravelAgency -d TravelAgency:latest
  ```

### <a name="deploying-on-k8s"></a> Deploying on Kubernetes
(Work in progress) 


## <a name="observability"></a> Observability 

### <a name="logging"></a> Logging
(Work in progress) 

### <a name="metrics"></a> Metrics
(Work in progress) 


### <a name="tracing"></a> Tracing 
(Work in progress) 
