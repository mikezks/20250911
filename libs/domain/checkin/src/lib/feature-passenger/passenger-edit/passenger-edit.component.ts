import { httpResource } from '@angular/common/http';
import { Component, input, numberAttribute } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Control, FieldValidationResult, form, required, schema, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger';


// (3) Form Logic: Schema w/ validators, disabled, readonly, hidden, etc.
const passengerSchema = schema<Passenger>(passengerPath => {
  required(passengerPath.passengerStatus);
  validate(passengerPath.passengerStatus, ({ value, field }) =>
    ['A', 'C'].includes(value())
      ? undefined 
      : {
        kind: 'passengerStatus',
        field: field()
      } as FieldValidationResult
  );
});


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

  // (1) Data Model: Writable Signal
  protected passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: {
      id: this.id()
    }
  }), { defaultValue: initialPassenger });
  
  // (2) Form State: valid, dirty, touched, value
  editForm = form(this.passengerResource.value, passengerSchema);

  protected save(): void {
    console.log(this.editForm().value());
  }
}
