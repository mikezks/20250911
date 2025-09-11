import { Component, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { validatePassengerStatus } from '../../util-validation';
import { initialPassenger } from '../../logic-passenger';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  private passengerService = inject(PassengerService);
  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: [''],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      validatePassengerStatus(['A', 'B', 'C'])
    ]]
  });

  id = input(0, { transform: numberAttribute });
  private id$ = toObservable(this.id);
  private passenger$ = this.id$.pipe(
    switchMap(id => this.passengerService.findById(id))
  );
  private passenger = toSignal(this.passenger$, {
    // requireSync: true,
    initialValue: initialPassenger
  });
  // private passenger = signal(initialPassenger);

  constructor() {
    effect(() => console.log(this.id()));
    effect(() => this.editForm.patchValue(this.passenger()));

    /* setTimeout(() => this.passenger.set({
      ...initialPassenger,
      firstName: 'Mary'
    }), 3_000); */
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
