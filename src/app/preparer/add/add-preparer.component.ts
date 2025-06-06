import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { CommonModule } from '@angular/common';
import { UserPreferences } from '../../core/models/user-preference';
import { UserPreferencesService } from '../../core/services/user-preference.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'app-add-preparer',
  imports: [AngularMaterialModule, CommonModule, BasicDetailsComponent, ContactsComponent, LocationComponent],
  templateUrl: './add-preparer.component.html',
  styleUrl: './add-preparer.component.scss'
})
export class AddPreparerComponent {
  isEditMode = false;
  clientid: number | null = null;
  currentStep: number = 0;
  isLoading: boolean = false;
  userPreferences: UserPreferences;

  basicDetailsCompleted: boolean = false;
  contactsCompleted: boolean = false;
  locationCompleted: boolean = false;

  constructor(userPrefenceService: UserPreferencesService) {
    this.userPreferences = userPrefenceService.getPreferences();
  }

  onBasicDetailsSaved(event: string): void {
    this.clientid = +event;
    this.basicDetailsCompleted = true;
  }

  onContactsSaved(event: boolean): void {
    this.contactsCompleted = event;
  }

  onLocationSaved(event: boolean): void {
    this.locationCompleted = event;
  }

  onStepChange(event: StepperSelectionEvent): void {
    this.currentStep = event.selectedIndex;
  }
}
