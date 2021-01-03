import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/model/userProfile.model';

@Component({
  selector: 'app-card-profile',
  templateUrl: './cardProfile.component.html',
  styleUrls: ['./cardProfile.component.less'],
})
export class CardProfileComponent implements OnInit {
  @Input() user: UserProfile;
  @Input() showScheleton: boolean;

  constructor() {}

  ngOnInit() {}
}
