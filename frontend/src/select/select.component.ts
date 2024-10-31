import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-select',
  standalone: true,
    imports: [
        NgForOf
    ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  @Input() label: string = '';
  @Input() options: { id: number; name: string }[] = [];
  @Input() selectedValue?: number;
  @Input() selectedOption: boolean = false;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  onSelectionChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(Number(selectedId));
  }
}
