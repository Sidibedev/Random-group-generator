import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import * as XLSX from 'xlsx';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
@Component({
  selector: 'app-oldgroup',
  templateUrl: './oldgroup.component.html',
  styleUrls: ['./oldgroup.component.scss']
})
export class OldgroupComponent implements OnInit {
  file:File;
  arrayBuffer:any;
  groups:any;
  groupes:any = []
  sousgroup:any = []
  formGroup = this.fb.group({
    file: [null, Validators.required],
    numgroup:[null , Validators.required]
  });
  constructor(private electron:ElectronService , private fb:FormBuilder) { }

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
        this.groups = XLSX.utils.sheet_to_json(worksheet,{raw:true});

         var groupe1 = this.groups.filter(function (group) {
          return group.groupe == "1";
        });

        var gro  = []

        var nbgroupes = this.groups.length / groupe1.length

          if (this.groups.length % groupe1.length  !=0 ) {
            for (let index = 1; index <= nbgroupes+1; index++) {

              gro.push(this.groups.filter(function (group) {
               return group.groupe == index ;
             }));

           }

          }else {
            for (let index = 1; index <= nbgroupes; index++) {

              gro.push(this.groups.filter(function (group) {
               return group.groupe == index ;
             }));

           }
          }

        this.groupes= gro





    }
    fileReader.readAsArrayBuffer(this.file);



    }




}
