import { patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals'
import { tapResponse } from '@ngrx/operators'
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { Flight } from '../model/flight';
import { computed, inject } from '@angular/core';
import { FlightFilter } from '../model/flight-filter';
import { FlightService } from '../data-access/flight.service';
import { pipe, switchMap } from 'rxjs';


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
  withComputed(store => ({
    delayedFlights: computed(
      () => store.flightEntities().filter(flight => flight.delayed)
    ),
  })),
  // Updaters
  withMethods(store => ({
    setFilter: (filter: FlightFilter) => patchState(store, { filter }),
    setFlights: (flights: Flight[]) => patchState(
      store, setAllEntities(flights, flightConfig)
    ),
  })),
  // Side-Effects
  withMethods((
    store,
    flightService = inject(FlightService)
  ) => ({
    loadFlights$: rxMethod<FlightFilter>(pipe(
      switchMap(({ from, to, urgent }) => flightService.find(from, to, urgent)),
      tapResponse({
        next: flights => store.setFlights(flights),
        error: err => console.log(err)
      })
    )),
  })),
  withHooks({
    onInit: store => store.loadFlights$(store.filter),
  }),
);

const bookings = [
  {
    flightId: 1,
    passengerId: 5
  },
  {
    flightId: 1,
    passengerId: 7
  }
]