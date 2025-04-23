import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-avatar-picker',
  standalone: true,
  templateUrl: './avatar-picker.component.html',
  styleUrls: ['./avatar-picker.component.css'],
  imports: [CommonModule],
})
export class AvatarPickerComponent {
  @Output() avatarSelected = new EventEmitter<string>();

  // Här är URL:erna som kommer från DiceBear API
  avatars = [
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar1',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar2',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar3',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar4',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar5',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar6',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar7',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar8',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar9',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar10',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar11',
    'https://api.dicebear.com/6.x/bottts/svg?seed=avatar12',
  ];

  selectAvatar(avatar: string) {
    this.avatarSelected.emit(avatar);
  }
}
