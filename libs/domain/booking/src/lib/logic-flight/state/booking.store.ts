import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'
import { Flight } from '../model/flight';
import { computed, inject } from '@angular/core';
import { FlightFilter } from '../model/flight-filter';
import { FlightService } from '../data-access/flight.service';


export const BookingStore = signalStore(
  { providedIn: 'root' },
  // State
  withState({
    filter: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false
    },
    basket: {
      3: true,
      5: true,
    } as Record<number, boolean>,
    flights: [] as Flight[],
  }),
  withComputed(store => ({
    delayedFlights: computed(
      () => store.flights().filter(flight => flight.delayed)
    ),
  })),
  // Updaters
  withMethods(store => ({
    setFilter: (filter: FlightFilter) => patchState(store, { filter }),
    setFlights: (flights: Flight[]) => patchState(store, { flights }),
  })),
  // Side-Effects
  withMethods((
    store,
    flightService = inject(FlightService)
  ) => ({
    loadFlights: () => {
      flightService.find(
        store.filter.from(),
        store.filter.to(),
        store.filter.urgent(),
      ).subscribe({
        next: flights => store.setFlights(flights),
        error: err => console.log(err)
      })
    },
  })),
);