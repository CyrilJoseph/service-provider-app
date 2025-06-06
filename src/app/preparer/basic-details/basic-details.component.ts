import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil, zip } from 'rxjs';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { CommonModule } from '@angular/common';
import { Country } from '../../core/models/country';
import { Region } from '../../core/models/region';
import { State } from '../../core/models/state';
import { CommonService } from '../../core/services/common/common.service';
import { NotificationService } from '../../core/services/common/notification.service';
import { ApiErrorHandlerService } from '../../core/services/common/api-error-handler.service';
import { BasicDetailService } from '../../core/services/preparer/basic-detail.service';
import { BasicDetail } from '../../core/models/preparer/basic-detail';
import { ZipCodeValidator } from '../../shared/validators/zipcode-validator';

@Component({
  selector: 'app-basic-details',
  imports: [AngularMaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './basic-details.component.html',
  styleUrl: './basic-details.component.scss'
})
export class BasicDetailsComponent implements OnInit, OnDestroy {
  @Input() isEditMode = false;
  @Input() clientid: number = 0;
  @Output() clientidCreated = new EventEmitter<string>();
  @Output() clientName = new EventEmitter<string>();

  basicDetailsForm: FormGroup;
  countries: Country[] = [];
  regions: Region[] = [];
  states: State[] = [];

  isLoading = true;
  countriesHasStates = ['US', 'CA', 'MX'];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private basicDetailService: BasicDetailService,
    private notificationService: NotificationService,
    private errorHandler: ApiErrorHandlerService) {
    this.basicDetailsForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadLookupData();
    // this.spidCreated.emit(this.spid?.toString());
    // Patch edit form data
    if (this.clientid > 0) {
      this.basicDetailService.getBasicDetailsById(this.clientid).subscribe({
        next: (basicDetail: BasicDetail) => {
          if (basicDetail?.clientid > 0) {
            this.patchFormData(basicDetail);
            this.clientName.emit(basicDetail.name);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          let errorMessage = this.errorHandler.handleApiError(error, 'Failed to load basic details');
          this.notificationService.showError(errorMessage);
          this.isLoading = false;
          console.error('Error loading basic details:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      lookupCode: ['', Validators.required, Validators.maxLength(20)],
      address1: ['', Validators.required, Validators.maxLength(100)],
      address2: ['', [Validators.maxLength(100)]],
      city: ['', Validators.required, Validators.maxLength(50)],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', [Validators.required, ZipCodeValidator('country')]],
      carnetIssuingRegion: ['', Validators.required],
      revenueLocation: ['', Validators.required]
    });
  }

  loadLookupData(): void {
    this.commonService.getCountries(this.clientid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries) => {
          this.countries = countries;
        },
        error: (error) => {
          console.error('Failed to load countries', error);
          this.isLoading = false;
        }
      });

    this.loadRegions();
  }

  loadRegions(): void {
    this.commonService.getRegions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (regions) => {
          this.regions = regions;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load regions', error);
          this.isLoading = false;
        }
      });
  }

  loadStates(country: string): void {
    this.isLoading = true;
    country = this.countriesHasStates.includes(country) ? country : 'FN';
    this.commonService.getStates(country, this.clientid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (states) => {
          this.states = states;
          const stateControl = this.basicDetailsForm.get('state');
          if (this.countriesHasStates.includes(country)) {
            stateControl?.enable();
          } else {
            stateControl?.disable();
            stateControl?.setValue('FN');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load states', error);
          this.isLoading = false;
        }
      });
  }

  patchFormData(data: BasicDetail): void {
    this.basicDetailsForm.patchValue({
      name: data.name,
      lookupCode: data.lookupCode,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      country: data.country,
      state: data.state,
      zip: data.zip,
      carnetIssuingRegion: data.carnetIssuingRegion,
      revenueLocation: data.revenueLocation
    });

    if (data.country) {
      this.loadStates(data.country);
    }

    if (this.isEditMode) {
      this.basicDetailsForm.get('carnetIssuingRegion')?.disable();
    }
  }

  onCountryChange(country: string): void {
    this.basicDetailsForm.get('state')?.reset();

    if (country) {
      this.loadStates(country);
    }

    this.basicDetailsForm.get('zip')?.updateValueAndValidity();
  }

  saveBasicDetails(): void {
    if (this.basicDetailsForm.invalid) {
      this.basicDetailsForm.markAllAsTouched();
      return;
    }

    const basicDetailData: BasicDetail = this.basicDetailsForm.value;

    // states
    basicDetailData.state = this.basicDetailsForm.get('state')?.value;

    // non editable fields values
    if (this.isEditMode) {
      basicDetailData.carnetIssuingRegion = this.basicDetailsForm.get('carnetIssuingRegion')?.value;
    }

    const saveObservable = this.isEditMode && this.clientid > 0
      ? this.basicDetailService.updateBasicDetails(this.clientid, basicDetailData)
      : this.basicDetailService.createBasicDetails(basicDetailData);

    saveObservable.subscribe({
      next: (basicData: any) => {
        this.notificationService.showSuccess(`Basic details ${this.isEditMode ? 'updated' : 'added'} successfully`);

        if (!this.isEditMode) {
          this.clientidCreated.emit(basicData.clientId);
        }
      },
      error: (error: any) => {
        let errorMessage = this.errorHandler.handleApiError(error, `Failed to ${this.isEditMode ? 'update' : 'add'} basic details`);
        this.notificationService.showError(errorMessage);
        console.error('Error saving basic details:', error);
      }
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.basicDetailsForm.controls;
  }
}
