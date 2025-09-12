import { Component, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Control, form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';
import { validatePassengerStatus } from '../../util-validation';
import { httpResource } from '@angular/common/http';
import { initialPassenger, Passenger } from '../../logic-passenger';


// (3) Form Logic: Schema w/ validators, disabled, readonly, hidden, etc.


@Component({
  selector: 'app-passenger-edit',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    // (4) UI Control: Template Binding
    Control
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  id = input(0, { transform: numberAttribute });
  protected passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: {
      id: this.id()
    }
  }), { defaultValue: initialPassenger });
  // (1) Data Model: Writable Signal
  // passengerState = signal(initialPassenger);

  // (2) Form State: valid, dirty, touched, value
  editForm = form(this.passengerResource.value);

  constructor() {
    effect(() => {
      if (this.passengerResource.hasValue()) {
        // this.editForm.patchValue(this.passengerResource.value());
      }
    });
  }

  protected save(): void {
    console.log(this.editForm().value());
    // this.passengerResource.set(this.editForm.getRawValue());
  }
}
