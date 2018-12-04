import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import {ElectronService} from '../../providers/electron.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  arrayBuffer:any;
  students:any
  groups:any[] = []
  numgroup : FormControl = new FormControl(
    [
      Validators.required,
      Validators.pattern('[a-zA-Z-e]*')
      
    ]
  );
  file:File;
  formGroup = this.fb.group({
    file: [null, Validators.required],
    numgroup:[null , Validators.required]
  });
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef , private electron:ElectronService) { }

  ngOnInit() {
  }

  minimize() {
    this.electron.window.minimize()
  }
  close() {
    this.electron.window.close()
  }
  onFileChange(event) {

    this.file= event.target.files[0]; 
   
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.students = XLSX.utils.sheet_to_json(worksheet,{raw:true});
    }
    fileReader.readAsArrayBuffer(this.file);


  
    }
     shuffle(o){ //v1.0
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
   }; 

    submit() {
      if (this.numgroup.valid) {

        this.groups  =[]
        this.students = this.shuffle(this.students);
        
        
        var numPeople = this.students.length;
         
       
         
         var numGroups = (numPeople / this.numgroup.value);
         
         var personIndex = 0;
         while (numGroups > 0.0) {
           var newGroup = [];
           var i;
           if ( numGroups < 1.0 ) {
             while( personIndex < numPeople ) {
                newGroup[newGroup.length] = this.students[personIndex];
              personIndex++;
             }
           }
           else {
            for ( i = this.numgroup.value ; i > 0 ; i-- ) {
              newGroup[newGroup.length] = this.students[personIndex];
              personIndex++;
            }
           }
           this.groups[this.groups.length] = newGroup;
           
           numGroups--;
        
      }
      }
     
    
  

}
}
