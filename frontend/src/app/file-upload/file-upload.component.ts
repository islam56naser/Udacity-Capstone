import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() accept: string;
  @Input() required = true;
  @Input() buttonText = 'Choose file';
  @Input() noFileLabel = 'no file selected';
  @Output() fileChanged: EventEmitter<any> = new EventEmitter();
  file: File;
  ngOnInit() {
  }

  onFileChanged(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileChanged.emit(this.file);
    }
  }

}
