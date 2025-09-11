import { Flight } from "@flight-demo/domain/booking-api-boarding";
import { Basket } from "../../model/basket";
import { FlightTicket } from "../../model/flight-ticket";


export type TicketState = {
  flights: Flight[];
  basket: Basket;
  tickets: FlightTicket[];
  hide: number[];
};

export const initialTicketState: TicketState = {
  flights: [],
  basket: {},
  tickets: [],
  hide: [3, 5]
};
