import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Departments } from 'src/app/shared/departments.model';
import { Routine } from 'src/app/shared/routine.model';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {

  Depts : Departments[];
  Sections : string[];
  TUES2D
  dept : string;
  Semesters : number[] = [1,2,3,4,5,6,7,8];
  constructor(private service : EmployeeService, private firestore: AngularFirestore, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.service.getDepts().subscribe(actionArray =>{
      this.Depts = actionArray.map(item =>{
        return {
          id : item.payload.doc.id,
          ...item.payload.doc.data() as Departments
        } as Departments;
      })
    });

    this.service.getRoutines().subscribe(actionArray3 => {
      this.service.blocks = actionArray3.map(item3 => {
        return {
          id: item3.payload.doc.id,
          ...item3.payload.doc.data() as Routine
        } as Routine;
      });
    });
  }

  setDept(Dept){
    this.dept = Dept;
    this.service.s_Dept = Dept;
    for(var sec of this.Depts){
      if(sec.Name == Dept){
        this.Sections=sec.Sections;
      }
    }
  }

  setSec(Sec)
  {
    this.service.s_Sec = Sec;
  }

  setSem(Sem)
  {
    this.service.s_Sem = Sem;
  }

  onSubmit()
  {
    this.service.getSlots();
    this.service.ButtonValue = true;  //Routine showing
    
    for(var value of this.service.blocks){
      if(value.DAY == 'MON'){
        this.service.MONList.push(value);
      }
      else if(value.DAY == 'TUE'){
        this.service.TUEList.push(value);
      }
      else if(value.DAY == 'WED'){
        this.service.WEDList.push(value);
      }
      else if(value.DAY == 'THU'){
        this.service.THUList.push(value);
      }
      else if(value.DAY == 'FRI'){
        this.service.FRIList.push(value);
      }
    }
    this.service.SlotsofMON = this.SlotProducer(this.service.MONList);
    this.service.SlotsofTUE = this.SlotProducer(this.service.TUEList);
    this.service.SlotsofWED = this.SlotProducer(this.service.WEDList);
    this.service.SlotsofTHU = this.SlotProducer(this.service.THUList);
    this.service.SlotsofFRI = this.SlotProducer(this.service.FRIList);
  }


  SlotProducer(ArrayOfSlots  : Routine[]){
    var tempList : Routine[] = [];
    var SlotsofDAY : Routine[][] = [];

    if(ArrayOfSlots.length == 0){
      var HourGap : number = 17 - 8;
      var MinGap : number = 0;
      var GenGapSpan : number = (HourGap*60 + MinGap)/25;

      tempList.push(this.GenBlankItem(GenGapSpan));
      SlotsofDAY.push(tempList);
      tempList = [];
    }


    else{
      if(ArrayOfSlots[0].START_HOUR != 8){
        var HourGap : number = ArrayOfSlots[0].START_HOUR - 8;
        var MinGap : number = ArrayOfSlots[0].START_MIN;
        var GenGapSpan : number = (HourGap*60 + MinGap)/25;
        //console.log("Initial : "+GenGapSpan);
  
        tempList.push(this.GenBlankItem(GenGapSpan));
        SlotsofDAY.push(tempList);
        tempList = [];
      }
  
      for(let i =0 ; i< ArrayOfSlots.length ; i++){
        var tempForJ = i;
        for(let j = i ; j< ArrayOfSlots.length ; j++){
          if(ArrayOfSlots[i].START_HOUR == ArrayOfSlots[j].START_HOUR && ArrayOfSlots[i].START_MIN == ArrayOfSlots[j].START_MIN){
            tempList.push(ArrayOfSlots[j]);
            tempForJ = j;
  
          }       
        }
  
        i = tempForJ;
        console.log(i);
        SlotsofDAY.push(tempList);
        tempList = [];
        
        if(i < ArrayOfSlots.length-1){
          var HourGap : number = ArrayOfSlots[i+1].START_HOUR - ArrayOfSlots[i].START_HOUR;
          var MinGap : number = ArrayOfSlots[i+1].START_MIN - ArrayOfSlots[i].START_MIN;
          var GenGapSpan : number = (HourGap*60 + MinGap)/25;
          //console.log("Before Minus : "+GenGapSpan)
          GenGapSpan = GenGapSpan-ArrayOfSlots[i].SPAN;
  
          //console.log(GenGapSpan);
          
          if(GenGapSpan > 0){
            tempList.push(this.GenBlankItem(GenGapSpan));
            SlotsofDAY.push(tempList);
            tempList = [];
          }
        }
      }
  
      var HourGap : number = 17 - ArrayOfSlots[ArrayOfSlots.length-1].START_HOUR;
      var MinGap : number = 0 - ArrayOfSlots[ArrayOfSlots.length-1].START_MIN;
      var GenGapSpan : number = (HourGap*60 + MinGap)/25; 
      GenGapSpan = GenGapSpan-ArrayOfSlots[ArrayOfSlots.length-1].SPAN;
      //console.log("Ending : "+GenGapSpan);
      if(GenGapSpan > 0){
        tempList.push(this.GenBlankItem(GenGapSpan));
        SlotsofDAY.push(tempList);
        tempList = [];
      }
    }

    return SlotsofDAY;
  }
  
  GenBlankItem(GenGapSpan: number) {
    var tempRoutine : Routine ={
      id : null,
      ACBUIL : null,
      COURSE : '',
      DAY : '',
      DEPT : '',
      FACULTY : '',
      ROOM : null,
      SECTION :'',
      SEM : null,
      SPAN : GenGapSpan,
      START_HOUR : null,
      START_MIN : null
    }
    return tempRoutine;
  }

}
