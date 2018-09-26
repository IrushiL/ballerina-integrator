import ballerina/http;
import ballerina/io;
import ballerina/runtime;

# Attributes associated with the service endpoint are defined here.
endpoint http:Listener listener {
    port:9095
};

# By default Ballerina assumes that the service is to be exposed via HTTP/1.1.
@http:ServiceConfig {basePath:"/nasdaq/quote"}
service<http:Service> StockDataService bind listener {

    # Resource to handle GET requests for GOOG stock quote.
    #
    # + caller - Represents the remote client's endpoint
    # + request - Represents the client request
    @http:ResourceConfig {
        path:"/GOOG", methods:["GET"]
    }
    googleStockQuote(endpoint caller, http:Request request) {
        http:Response response = new;
        string googQuote = "GOOG, Alphabet Inc., 1013.41";
        response.setTextPayload(googQuote);
        _ = caller -> respond(response);
    }

    # Resource to handle GET requests for APPL stock quote.
    #
    # + caller - Represents the remote client's endpoint
    # + request - Represents the client request
    @http:ResourceConfig {
        path:"/APPL", methods:["GET"]
    }
    appleStockQuote(endpoint caller, http:Request request) {
        http:Response response = new;
        string applQuote = "APPL, Apple Inc., 165.22";
        response.setTextPayload(applQuote);
        _ = caller -> respond(response);
    }

    # Resource to handle GET requests for MSFT stock quote.
    #
    # + caller - Represents the remote client's endpoint
    # + request - Represents the client request
    @http:ResourceConfig {
        path:"/MSFT", methods:["GET"]
    }
    msftStockQuote(endpoint caller, http:Request request) {
        http:Response response = new;
        string msftQuote = "MSFT, Microsoft Corporation, 95.35";
        response.setTextPayload(msftQuote);
        _ = caller -> respond(response);
    }
}
