import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Output() close = new EventEmitter<void>();
  
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;
  @ViewChild('firstFocusable', { static: false }) firstFocusable!: ElementRef;
  @ViewChild('lastFocusable', { static: false }) lastFocusable!: ElementRef;

  private focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  ngOnInit() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.trapFocus(), 100);
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    if (event.key === 'Escape') {
      this.closeModal();
    }

    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  }

  closeModal() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  private trapFocus() {
    if (!this.modalContent) return;

    const focusableElements = this.modalContent.nativeElement.querySelectorAll(this.focusableElements);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    this.modalContent.nativeElement.addEventListener('keydown', handleTabKey);
  }

  private handleTabKey(event: KeyboardEvent) {
    if (!this.modalContent) return;

    const focusableElements = Array.from(
      this.modalContent.nativeElement.querySelectorAll(this.focusableElements)
    ) as HTMLElement[];

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

