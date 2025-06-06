import { afterNextRender, Component, viewChild } from '@angular/core';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { MatAccordion } from '@angular/material/expansion';
import { UserPreferences } from '../../core/models/user-preference';
import { ActivatedRoute } from '@angular/router';
import { UserPreferencesService } from '../../core/services/user-preference.service';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'app-edit-preparer',
  imports: [AngularMaterialModule, BasicDetailsComponent, ContactsComponent, LocationComponent],
  templateUrl: './edit-preparer.component.html',
  styleUrl: './edit-preparer.component.scss'
})
export class EditPreparerComponent {
  accordion = viewChild.required(MatAccordion);
  isEditMode = true;
  clientid = 0;
  clientName: string | null = null;
  userPreferences: UserPreferences;

  constructor(private route: ActivatedRoute, private userPrefenceService: UserPreferencesService) {
    this.userPreferences = userPrefenceService.getPreferences();
    afterNextRender(() => {
      // Open all panels
      this.accordion().openAll();
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.clientid = idParam ? parseInt(idParam, 10) : 0;
  }

  onClientNameUpdate(event: string): void {
    this.clientName = event;
  }
}
