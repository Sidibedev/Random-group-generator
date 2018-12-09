import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {ElectronService} from '../../providers/electron.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  arrayBuffer:any;

  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  exporter:boolean = false;
  students:any
  groups:any[]= []
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
     shuffle(o){ // melange les etudiants
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
   }; 

    submit() {
      if (this.numgroup.valid) {
        
        this.groups  =[]
        this.students = this.shuffle(this.students);
        
        
        var numPeople = this.students.length;
         
       
         
         var numGroups = (numPeople / this.numgroup.value);
         var numeroGroupe= 1;
         var personIndex = 0;
         while (numGroups > 0.0) {
           var newGroup = [];
           var i;
           if ( numGroups < 1.0 ) {
             while( personIndex < numPeople ) {
                newGroup[newGroup.length] = this.students[personIndex];
                
                this.students[personIndex].groupe =numeroGroupe;
              personIndex++;
             }
           }
           else {
            for ( i = this.numgroup.value ; i > 0 ; i-- ) {
              newGroup[newGroup.length] = this.students[personIndex];
              
              this.students[personIndex].groupe = numeroGroupe;
              personIndex++;
              
            }
           }
           
           this.groups[this.groups.length] = newGroup;
           numeroGroupe++
           this.exporter = true
           
           numGroups--;
        
      }
      }
     
    
  

}

export() {
  
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.students);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, "groupe");
  
}

 saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], {type: this.EXCEL_TYPE});
  FileSaver.saveAs(data, fileName  + new  Date().getTime() + this.EXCEL_EXTENSION);
}

imprimer() {

  var doc = new jsPDF();
  var col = ["Prenom", "Nom" , "Classe" , "Groupe"];
  var rows = [];

/* The following array of object as response from the API req  */



this.students.forEach(element => {      
  var temp = [element.prenom,element.nom,element.classe,element.groupe];
  rows.push(temp);

});        

  doc.autoTable(col, rows);
  doc.save('Test.pdf');



}

}
