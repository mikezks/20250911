import { computed, inject } from '@angular/core';
import { mapResponse } from '@ngrx/operators';
import { signalStore, type, withComputed, withProps, withState } from '@ngrx/signals';
import { entityConfig, removeAllEntities, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { switchMap } from 'rxjs';
import { FlightService } from '../data-access/flight.service';
import { Flight } from '../model/flight';
import { FlightFilter } from '../model/flight-filter';
import { flightEvents } from './flight.events';


export interface BookingState {
  filter: FlightFilter;
  basket: Record<number, boolean>;
}

export const initialBookingState: BookingState = {
  filter: {
    from: 'Hamburg',
    to: 'Graz',
    urgent: false
  },
  basket: {
    3: true,
    5: true,
  },
};

export const flightConfig = entityConfig({
  entity: type<Flight>(),
  collection: 'flight',
  // selectId: flight => flight.id
});


export const BookingStore = signalStore(
  { providedIn: 'root' },
  // State
  withState(initialBookingState),
  withEntities(flightConfig),
  withProps(() => ({
    _events: inject(Events),
    _flightService: inject(FlightService)
  })),
  withComputed(store => ({
    delayedFlights: computed(
      () => store.flightEntities().filter(flight => flight.delayed)
    ),
  })),
  // Updaters
  withReducer(
    on(flightEvents.flightFilterChanged, ({ payload: filter }) => ({ filter })),
    on(flightEvents.flightsLoaded, ({ payload: flights }) =>
      setAllEntities(flights, flightConfig)),
    on(flightEvents.flightsResetTriggered, () => removeAllEntities(flightConfig)),
  ),
  // Side-Effects
  withEffects(({ _events, _flightService }) => ({
    loadFlights$: _events
      .on(flightEvents.flightFilterChanged).pipe(
        switchMap(({ payload: { from, to, urgent }}) => _flightService.find(from, to, urgent)),
        mapResponse({
          next: flights => flightEvents.flightsLoaded(flights),
          error: err => flightEvents.flightsLoadedError({ error: err })
        })
      ),
  })),
);
