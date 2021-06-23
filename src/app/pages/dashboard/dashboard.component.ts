import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  image: any;

  onChange($event: Event): void {
    console.log($event.target);
    this.readLine($event.target);
  }

  readLine(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    myReader.onload = e => {
      this.image = myReader.result;
    }
    myReader.readAsDataURL(file);
    console.log(this.image);
  }
}
