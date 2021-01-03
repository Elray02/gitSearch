import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardProfileComponent } from './cardProfile.component';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { userProfileMock } from 'src/app/mocks/mockUser';

describe('CardProfileComponent', () => {
  let component: CardProfileComponent;
  let fixture: ComponentFixture<CardProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardProfileComponent],
      imports: [TuiIslandModule, TuiButtonModule, TuiAvatarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProfileComponent);
    component = fixture.componentInstance;
    component.user = userProfileMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
