import { eventGroup } from '@ngrx/signals/events';
import { Flight } from '../model/flight';
import { type } from '@ngrx/signals';
import { FlightFilter } from '../model/flight-filter';


export const flightEvents = eventGroup({
  source: 'Flight',
  events: {
    flightFilterChanged: type<FlightFilter>(),
    flightSelectionChanged: type<{ id: number; selected: boolean; }>(),
    flightDelayTriggered: type<{ id: number; min?: number; }>(),
    flightsLoaded: type<Flight[]>(),
    flightsLoadedError: type<{ error: unknown }>(),
    flightsResetTriggered: type<void>(),
  }
});
