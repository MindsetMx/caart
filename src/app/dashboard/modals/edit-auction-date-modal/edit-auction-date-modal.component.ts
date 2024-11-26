import { ChangeDetectionStrategy, Component, effect, inject, model, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from '@app/app.service';
import { AuctionArtInfoData, AuctionCarInfoData } from '@dashboard/interfaces';
import { UpdateAuctionArtDetailsService } from '@dashboard/services/update-auction-art-details.service';
import { UpdateAuctionCarDetailsDataService } from '@dashboard/services/update-auction-car-details-data.service';

import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'edit-auction-date-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    InputErrorComponent,
    InputDirective
  ],
  templateUrl: './edit-auction-date-modal.component.html',
  styleUrl: './edit-auction-date-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAuctionDateModalComponent {
  isOpen = model.required<boolean>();
  auctionDateUpdateChange = output<void>();
  auction = model.required<AuctionCarInfoData | AuctionArtInfoData>();

  isButtonSubmitDisabled = signal<boolean>(false);

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #updateAuctionCarDetailsDataService = inject(UpdateAuctionCarDetailsDataService);
  #updateAuctionArtDetailsService = inject(UpdateAuctionArtDetailsService);
  #appService = inject(AppService);

  editAuctionDateForm: FormGroup;

  constructor() {
    this.editAuctionDateForm = this.#formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  isOpenEffect = effect(() => {
    if (!this.isOpen()) {
      this.auction.set({} as AuctionCarInfoData);
    }
  }, { allowSignalWrites: true });

  auctionEffect = effect(() => {
    if (this.auction() && this.auction().startDate && this.auction().endDate) {
      const startDate = new Date(this.auction().startDate).toLocaleString('sv-SE', { timeZoneName: 'short' }).slice(0, 16);
      const endDate = new Date(this.auction().endDate).toLocaleString('sv-SE', { timeZoneName: 'short' }).slice(0, 16);

      this.editAuctionDateForm.patchValue({
        startDate: startDate,
        endDate: endDate
      });

      console.log(this.editAuctionDateForm.value);
    }
  });

  // isGetBidsBid(bid: any): bid is GetBidsBid {
  //   return (bid as GetBidsBid).bidTime !== undefined;
  // }

  isAuctionCarInfoData(auction: any): auction is AuctionCarInfoData {
    return (auction as AuctionCarInfoData).auctionCarId !== undefined;
  }

  isAuctionArtInfoData(auction: any): auction is AuctionArtInfoData {
    return (auction as AuctionArtInfoData).auctionArtId !== undefined;
  }

  updateAuctionDate(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.editAuctionDateForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    if (this.isAuctionCarInfoData(this.auction())) {
      this.#updateAuctionCarDetailsDataService.updateAuctionDates$((this.auction() as AuctionCarInfoData).auctionCarId, this.editAuctionDateForm.value.startDate, this.editAuctionDateForm.value.endDate).subscribe({
        next: () => {
          this.isOpen.set(false);
          this.isButtonSubmitDisabled.set(false);
          this.toastSuccess('Se ha actualizado la fecha de la subasta');
          this.auctionDateUpdateChange.emit();
        },
        error: (error) => {
          console.error(error);
        }
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
    } else if (this.isAuctionArtInfoData(this.auction())) {
      this.#updateAuctionArtDetailsService.updateAuctionDates$((this.auction() as AuctionArtInfoData).auctionArtId, this.editAuctionDateForm.value.startDate, this.editAuctionDateForm.value.endDate).subscribe({
        next: () => {
          this.isOpen.set(false);
          this.isButtonSubmitDisabled.set(false);
          this.toastSuccess('Se ha actualizado la fecha de la subasta');
          this.auctionDateUpdateChange.emit();
        },
        error: (error) => {
          console.error(error);
        }
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
    }

    // this.auctionDateUpdateChange.emit({
    //   startDate: this.editAuctionDateForm.value.startDate,
    //   endDate: this.editAuctionDateForm.value.endDate
    // });
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  hasError(field: string, form: FormGroup = this.editAuctionDateForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.editAuctionDateForm): string | undefined {
    return this.#validatorsService.getError(form, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
