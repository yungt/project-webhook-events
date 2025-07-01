Portions of this challenge require that you clone the project to your local machine. Specifically areas that require building or running containers. If you foresee any issues relating to using your own machine please let us know.

## This challenge involves three distinct components:
1. A webhook service. This service emits webhook events in the form of HTTP requests. This service is fully functional and provided to you within the project, under the `webhook_service` directory.  
2. A "receiver" service. This service shall be capable of responding to HTTP requests sent by the `webhook_service`. You will be tasked with building this receiver service.  
3. A web based UI application, capable of displaying event data received by the receiver service. You will be tasked with building this web based UI application.  

Below you will find a list of requirements for each of the three distinct components as well as a couple system requirements that help tie all three components together. The challenge will be graded based on these requirements being met. 

**NOTE: Automatic scoring will not occur upon submission.**

### Webhook Service Requirements:
1. Modify the provided webhook_service code as needed to support setting the webhook url via runtime configuration as opposed to a hard coded value. This webhook url is the url where the HTTP events will be posted to. Allowing this to be set as runtime configuration will help prepare for the following step. 

### Receiver Service Requirements:
1. Using TypeScript and the framework(s)/libraries of your choice, build a second service that contains an endpoint capable of responding to the HTTP requests emitted by the `webhook_service`.  

### Web UI Application Requirements:
1. Using TypeScript and the framework(s)/libraries of your choice, build a web-based UI that displays the data received by the receiver service.  
2. The UI should update each time the receiver service receives an event.  
3. Only display received events that match the follow criteria:  
    1. The `event_type` property is equal to “woof”.  
    2. The payload's `actor` property is equal to “platform_engineer”.  
    3. The data should be displayed in tabular format.  
        1. The table columns shall be sortable.  
        2. The table should be paginated every 10 rows.  
        3. You may use third party libraries.  
4. Data does not need to be persisted. E.g. Webhook events do not need to be persisted across server sessions. If the web application is restarted it can be expected that no data is displayed until the next webhook event is received.  

### System Requirements:
1. Produce a docker compose file (or equivalent) capable of building and running all the services and provide instructions on how to run it.  
2. Provide a document that includes a system diagram that illustrates communication between each service/application and that would additionally satisfy the following specifications (these requirements do not need to be implemented, just diagramed):  
    1. Assuming all components are deployed to the cloud, depict which cloud services you would choose for each component as well as any other cloud specific components that may be required to make this system cloud-native. You may use services offered by any cloud provider.
    2. Alongside the system diagram, provide written feedback on the durability of the system from a system design perspective, and if applicable some architectural changes you would make to increase durability. (E.g. Is communication between each of the services efficient, reliable, re-playable, etc. What happens if the receiver service is down?)
    3. Webhook event data is persisted by the service that receives the webhook events, such that the web UI shall be capable of displaying historical events.

### TIPS:
1. Build and run the provided `webhook_service`. Examine the format of the payloads emitted from the `webhook_service`.  
2. Webhook events are emitted every 1-5 seconds after the `webhook_service` is started.  
3. Events received from the receiver service do not need to be persisted across server restarts.  

**NOTE: Automatic scoring will not occur upon submission.**
