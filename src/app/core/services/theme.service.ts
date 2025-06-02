import { Injectable } from '@angular/core';
import { StyleManagerService } from './stylemanager.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private styleManager: StyleManagerService) {
  }

  setTheme(themeToSet: string) {

    this.styleManager.setStyle(
      "theme",
      `themes/${themeToSet}.css`
    );
  }
}
