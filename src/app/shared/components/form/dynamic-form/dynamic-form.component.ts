import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MomentModule } from 'angular2-moment';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit {
  @Input() form: FormGroup;

  constructor() { }

  ngOnInit() { }
}
