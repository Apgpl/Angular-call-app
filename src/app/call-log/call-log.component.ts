import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Calllog } from '../model/Calllog';
import { CalllogService } from '../calllog.service';


@Component({
  selector: 'app-call-log',
  templateUrl: './call-log.component.html',
  styleUrls: ['./call-log.component.css']
})
export class CallLogComponent implements OnInit {

  calllogs!: Calllog[];
  processValidation = false;
  calllog = new Calllog();
  calllogIdToUpdate = "-1";

 // selectedOption!: string;

  calllogForm = new FormGroup({

    calllogNumbers : new FormControl(''),
    callId : new FormControl(''),
    phoneNumber : new FormControl('', Validators.required),
    callDate : new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate :  new FormControl('', Validators.required),
    purpose :  new FormControl('', Validators.required),
    comments: new FormControl('', Validators.required),

  
  })

  constructor(public calllogService: CalllogService) {

  }

  ngOnInit() {
    this.calllogService.getAllRecords().subscribe(res => this.calllogs = res);
  }



  selectedPhoneNumber(selectedOption: string) {

    console.log(selectedOption + " to edit in Call Log component")
    this.calllogIdToUpdate = selectedOption

     this.calllogService.getCalllog(selectedOption).subscribe(calllogVa => {
       this.calllogForm.setValue({
        calllogNumbers:"",
        callId: calllogVa.callId,
        phoneNumber: calllogVa.phoneNumber,
        callDate: calllogVa.callDate,
        startDate: calllogVa.startDate,
        endDate: calllogVa.endDate,
        purpose: calllogVa.purpose,
        comments: calllogVa.comments
       })
     });
    
  }

 // getSelectedOptionText(event: Event ){
//  console.log(selectedOptionText); 

  //user defined validators
  hasSpecialChar(input: FormControl) {
    const hasSpecial =
      input.value.indexOf('P') >= 0;
    return hasSpecial ? null : { needSpecial: true };
  }



onCalllogFormSubmit() {
  console.log("onCalllogFormSubmit called")
    if (this.calllogForm.invalid) {
      this.processValidation = true
      console.log("Invalid form")
      return;
    }
    else {
      console.log(this.calllogForm.value);
      this.calllog = this.makeCalllog();

      //save product
      if(this.calllogIdToUpdate== "-1" )
      {
        this.calllogService.saveCalllog(this.calllog).subscribe({
          next: n => this.refreshProduct()
        });
        this.resetForm();
      }
            //update product
      else
      {
        this.calllogService.updateCalllog(this.calllog).subscribe({
          next: n => this.refreshProduct()
        });
        this.calllogIdToUpdate = "-1"
        this.resetForm();
      }

    }
  }

  resetForm(){
    this.calllogForm.reset();
  }

  makeCalllog() {

    console.log(this.calllogForm.value)
    let ccallId: number = this.calllogForm.get('callId')!.value;
    let cphoneNumber: string = this.calllogForm.get('phoneNumber')!.value.trim();
    let ccallDate: string = this.calllogForm.get('callDate')!.value.trim();
    let cstartDate: string = this.calllogForm.get('startDate')!.value.trim();
    let cendDate: string = this.calllogForm.get('endDate')!.value.trim();
    let cpurpose: string = this.calllogForm.get('purpose')!.value.trim();
    let ccomments: string = this.calllogForm.get('comments')!.value.trim();


    let calllog: Calllog = {
      callId: ccallId,
      phoneNumber: cphoneNumber,
      callDate: ccallDate,
      startDate: cstartDate,
      endDate: cendDate,
      purpose: cpurpose,
      comments: ccomments,
    }
    
    return calllog;
  } 

  refreshProduct() {
    this.calllogService.getAllRecords().subscribe(res => this.calllogs = res);
  }


}
