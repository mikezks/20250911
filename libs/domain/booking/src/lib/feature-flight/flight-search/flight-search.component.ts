import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, injectTicketsFacade } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';


@Component({
  selector: 'app-flight-search',
  imports: [
    JsonPipe,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent {
  private ticketsFacade = injectTicketsFacade();

  protected filter = signal({
    from: 'Paris',
    to: 'New York',
    urgent: false
  });
  protected route = computed(
    () => 'From ' + this.filter().from + ' to ' + this.filter().to + '.'
  );
  protected basket: Record<number, boolean> = {
    3: true,
    5: true
  };
  protected flights = this.ticketsFacade.flights;
  protected firstname = 'Peter';

  constructor() {
    effect(() => console.log(this.route()));
    effect(() => {
      this.filter();
      untracked(() => this.search());
    });

    setTimeout(() => {
      this.firstname = 'Mary';
      console.log('Firstname should render ' + this.firstname);
    }, 3_000);
  }

  protected search(): void {
    if (!this.filter().from || !this.filter().to) {
      return;
    }

    this.ticketsFacade.search(this.filter());
  }

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.ticketsFacade.update(newFlight);
  }

  protected reset(): void {
    this.ticketsFacade.reset();
  }
}
