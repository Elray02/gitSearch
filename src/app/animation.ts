import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';



export const cardAnimation = trigger('fadeSlideInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('500ms', style({ opacity: 1, transform: 'translateY(0px)' })),
  ]),
  transition(':leave', [
    animate('200ms', style({ opacity: 0, transform: 'translateY(10px)' })),
  ]),
]);
