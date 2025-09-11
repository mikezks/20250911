import { Directive, effect, inject, input } from "@angular/core";
import { provideNavigationService, NavigationService } from "../../logic-navigation";
import { NavigationConfig } from "../../model-navigation";


@Directive({
  selector: '[navConfig]',
  standalone: true,
  providers: [
    provideNavigationService([])
  ]
})
export class NavigationProviderDirective {
  navService = inject(NavigationService);
  navConfig = input.required<NavigationConfig>();

  constructor() {
    effect(() =>
      this.navService.state.set(this.navConfig())
    );
  }
}
