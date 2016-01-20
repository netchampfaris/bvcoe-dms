"use strict";angular.module("bvcoeDmsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","cgBusy","ngStorage","xeditable","ui.bootstrap","angular-confirm"]).run(["$rootScope","FirebaseRef","FirebaseAuth","$location","$localStorage","editableOptions","$route",function(a,b,c,d,e,f,g){a.$storage=e,a.$storage.authData=b.getAuth(),b.onAuth(function(c){c?(console.log("Logged in as:",c.uid),d.path("/attendances")):console.log("Logged out"),a.$storage.authData=b.getAuth()}),a.logout=function(){b.unauth(),delete a.$storage.authData,delete a.$storage.userData,d.path("/")},f.theme="bs3"}]).config(["$routeProvider","$httpProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main",resolve:{currentAuth:["FirebaseAuth",function(a){return a.$waitForAuth()}]}}).when("/dashboard",{templateUrl:"views/dashboard.html",controller:"DashboardCtrl",controllerAs:"dashboard",resolve:{currentAuth:["FirebaseAuth",function(a){return a.$requireAuth()}]}}).when("/defaulters",{templateUrl:"views/defaulters.html",controller:"DefaultersCtrl",controllerAs:"defaulters"}).when("/dataentry",{templateUrl:"views/dataentry.html",controller:"DataentryCtrl",controllerAs:"dataentry",resolve:{currentAuth:["FirebaseAuth",function(a){return a.$requireAuth()}]}}).when("/attendances",{templateUrl:"views/attendances.html",controller:"AttendancesCtrl",controllerAs:"attendances",resolve:{currentAuth:["FirebaseAuth",function(a){return a.$requireAuth()}]}}).when("/genDefaulter",{templateUrl:"views/gendefaulter.html",controller:"GendefaulterCtrl",controllerAs:"genDefaulter",resolve:{currentAuth:["FirebaseAuth",function(a){return a.$requireAuth()}]}}).when("/takeAttendance",{templateUrl:"views/takeAttendance.html",controller:"TakeAttendanceCtrl",controllerAs:"takeAttendance",resolve:{currentAuth:["FirebaseAuth",function(a){return a.$requireAuth()}]}}).when("/extras",{templateUrl:"views/extras.html",controller:"ExtrasCtrl",controllerAs:"extras",resolve:{currentAuth:["FirebaseAuth",function(a){return a.$requireAuth()}]}}).otherwise({redirectTo:"/attendances"})}]),angular.module("bvcoeDmsApp").controller("MainCtrl",["FirebaseRef","$scope","$location","$rootScope","$q","isNewUser",function(a,b,c,d,e,f){d.$storage.authData=a.getAuth(),b.depts=[],a.onAuth(function(e){e?f(e).then(function(f){console.log("new user: "+f),f?a.child("teachers/"+e.uid).set({dept:b.reg.dept,name:b.reg.name,role:b.reg.teacherrole},function(){h&&a.child("tokens/"+h).remove(function(){console.log("token removed "+h)})}):a.child("teachers/"+e.uid).once("value",function(a){d.$storage.userData=a.val(),d.$apply()}),console.log("Logged in as:",e.uid),c.path("/attendances")},function(){}):console.log("Logged out")}),b.login={},b.login.message="",b.login.success=!0,b.login=function(c){var d=e.defer();a.authWithPassword({email:c.email,password:c.pass},function(a,c){if(a){switch(a.code){case"INVALID_PASSWORD":b.login.message="The password is incorrect.";break;case"INVALID_EMAIL":b.login.message="The specified email is not a valid email.";break;default:b.login.message=a}b.login.success=!1,d.reject()}else b.login.success=!0,b.login.message="",d.resolve()},{remember:"sessionOnly"}),b.promise=d.promise},b.message={regSuccess:null,text:""};var g=a.child("departments");g.on("value",function(a){for(var c in a.val()){var d=a.val();b.depts.push({id:c,name:d[c].name})}console.log("departments loaded")},function(a){console.log(a)});var h;b.register=function(c){var d=e.defer();g=a.child("tokens"),g.once("value",function(a){a=a.val();var e,g,i=!1;for(var j in a)if(e=a[j].token,g=a[j].used,c.token==e&&!g){console.log("token match"),i=!0,h=j,f(c);break}i||(console.log("token invalid"),b.message.text="Token Invalid",b.message.regSuccess=!1,d.reject())},function(a){console.log(a),d.reject()});var f=function(c){a.createUser({email:c.email,password:c.pass},function(a,e){if(a){switch(a.code){case"EMAIL_TAKEN":b.message.text="The new user account cannot be created because the email is already in use.";break;case"INVALID_EMAIL":b.message.text="The specified email is not a valid email.";break;default:b.message.text=a}b.message.regSuccess=!1,d.reject()}else console.log("Successfully created user account with uid:",e.uid),b.message.regSuccess=!0,b.message.text="Registration completed successfully!",b.login(c),d.resolve()})};b.regpromise=d.promise}}]),angular.module("bvcoeDmsApp").controller("DashboardCtrl",["$scope","FirebaseAuth","$location","$rootScope","$http",function(a,b,c,d,e){a.push=function(a){var b="40862591aa0d0abdcaa450c53fd513ab31369a39c56de17d",c="1bb897af",d=a.tokens.split(",");console.log(d);var f=btoa(b+":"),g={method:"POST",url:"https://push.ionic.io/api/v1/push",headers:{"Content-Type":"application/json","X-Ionic-Application-Id":c,Authorization:"basic "+f},data:{tokens:d,notification:{alert:a.body,title:a.title}}};e(g).success(function(a){console.log("Ionic Push: Push success!")}).error(function(a){console.log("Ionic Push: Push error...")})}}]),angular.module("bvcoeDmsApp").factory("FirebaseAuth",["$firebaseAuth","firebaseurl",function(a,b){var c=new Firebase(b);return a(c)}]),angular.module("bvcoeDmsApp").constant("firebaseurl","https://hazri.firebaseio.com"),angular.module("bvcoeDmsApp").directive("compareTo",function(){return{require:"ngModel",scope:{otherModelValue:"=compareTo"},link:function(a,b,c,d){d.$validators.compareTo=function(b){return b==a.otherModelValue},a.$watch("otherModelValue",function(){d.$validate()})}}}),angular.module("bvcoeDmsApp").factory("FirebaseRef",["firebaseurl",function(a){var b=new Firebase(a);return b}]),angular.module("bvcoeDmsApp").controller("DefaultersCtrl",["$scope","FirebaseRef","$q",function(a,b,c){a.depts=[],a.years=[{id:1,name:"First Year"},{id:2,name:"Second Year"},{id:3,name:"Third Year"},{id:4,name:"Final Year"}],a.form={};var d=c.defer();b.child("departments").once("value",function(b){for(var c in b.val()){var e=b.val();a.depts.push({id:c,name:e[c].name})}d.resolve()},function(a){console.log(a),d.reject()}),a.deptpromise=d.promise,a.defaulters=[],a.loadDefaulters=function(d){var e,f=d.dept,g=d.sem;switch(console.log(d),d.year){case"1":e="fe";break;case"2":e="se";break;case"3":e="te";break;case"4":e="be"}var h=c.defer();b.child("defaulters/"+f).once("value",function(b){var c=[];for(var d in b.val()){var i=d.split("-");f==i[1]&&e==i[2]&&g==i[3].substr(3)&&c.push({dept:i[1].toUpperCase(),year:i[2].toUpperCase(),sem:i[3].substr(3),date:i[4]+"-"+i[5]+"-"+i[6],base64:b.val()[d].excel})}a.defaulters=c,h.resolve(),a.$apply()},function(a){console.log(a),h.reject()}),a.promise=h.promise},a.download=function(a){window.open(a,"_blank")}}]),angular.module("bvcoeDmsApp").factory("isNewUser",["FirebaseRef","$q",function(a,b){var c=function(c){var d=b.defer(),e=!0;return a.child("teachers").once("value",function(a){for(var b in a.val())for(var f in a.val())c.uid==f&&(e=!1);d.resolve(e)},function(a){console.log(a),d.reject()}),d.promise};return c}]),angular.module("bvcoeDmsApp").controller("DataentryCtrl",["$scope","XLSXReaderService","FirebaseRef","$q","$timeout",function(a,b,c,d,e){a.json_string="",a.isProcessing=!0;var f=[];a.fileChanged=function(c){a.excelFile=c[0],b.readFile(a.excelFile,!1,!0).then(function(b){f=b.sheets,a.isProcessing=!1,console.log(f)})},a.download=function(a){var a;c.child("defaulters/excelformat").once("value",function(b){a=b.val(),console.log(a),window.open(a,"","width=600,height=300,resizable=1")})},a.upload=function(){for(var b=d.defer(),g=f.info[0].dept,h=f.info[0].year,i=f.info[0].semester,j=f.info[0]["total students"],k=g+"-"+h,l={},m=1;6>m&&void 0!==f.info[0]["batch "+m+" starts with roll"];)l[m]=f.info[0]["batch "+m+" starts with roll"],m++;c.child("studentCount/"+g+"/"+k).update({batchno:l,count:j,dept:g,year:h},function(d){if(d)console.log(d);else for(var k=0;j>k;k++){var l=f.students[k].name,m=f.students[k].rollno,n=f.students[k].phone,o=f.students[k]["parents phone"],p=f.students[k].gender,q=f.students[k]["unique id"];c.child("students/"+g+"/"+q).update({name:l,phone:n,parents_phone:o,rollno:m,year:h,gender:p,uid:q},function(a){if(a)console.log(a);else for(var b=0;b<f.subjects.length;b++){for(var d=f.subjects[b].fullname,e=f.subjects[b]["short name"],j="yes"==f.subjects[b].theory,k="yes"==f.subjects[b].practical,l=f.subjects[b]["theory teacher"]||null,m=f.subjects[b]["subject code"],n={},o=1;5>o&&void 0!==f.subjects[b]["batch "+o+" teacher"];)n[o]=f.subjects[b]["batch "+o+" teacher"],o++;console.log(n),c.child("subjects/"+g+"/"+m).update({fullname:d,name:e,theory:j,practical:k,teacher:l,pteacher:n,dept_id:g,year:h,sem:i},function(a){if(a)console.log(a);else{var b=f.info[0]["dept name"],d=null;-1!=g.indexOf("-")&&(d=g.substr(g.length-1)),c.child("departments/"+g).update({name:b,div:d},function(a){a?console.log(a):console.log("success")})}})}})}e(function(){console.log("data upload successfull"),a.success="Data upload successfull",a.form.$setPristine(),b.resolve()},5e3)}),a.loading=b.promise}}]),function(a){if("undefined"==typeof XLSX)return void console.log("xlsx.js is required. Get it from https://github.com/SheetJS/js-xlsx");if("undefined"==typeof _)return void console.log("Lodash.js is required. Get it from http://lodash.com/");var b=this,c=(b.XLSXReader,function(a,b,d,e){var f={};return c.utils.intializeFromFile(f,a,b,d,e),f});"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=c),exports.XLSXReader=c):b.XLSXReader=c,c.VERSION="0.0.1",c.utils={intializeFromFile:function(a,b,d,e,f){var g=new FileReader;g.onload=function(b){var g=b.target.result,h=XLSX.read(g,{type:"binary"});a.sheets=c.utils.parseWorkbook(h,d,e),f(a)},g.readAsBinaryString(b)},parseWorkbook:function(a,b,d){if(d===!0)return c.utils.to_json(a);var e={};return _.forEachRight(a.SheetNames,function(d){var f=a.Sheets[d];e[d]=c.utils.parseSheet(f,b)}),e},parseSheet:function(b,c){var d=XLSX.utils.decode_range(b["!ref"]),e=[];return c===!0&&_.forEachRight(_.range(d.s.r,d.e.r+1),function(c){var f=[];_.forEachRight(_.range(d.s.c,d.e.c+1),function(d){var e=XLSX.utils.encode_cell({c:d,r:c}),g=b[e];f[d]=g?g.v:a}),e[c]=f}),{data:e,name:b.name,col_size:d.e.c+1,row_size:d.e.r+1}},to_json:function(a){var b={};return a.SheetNames.forEach(function(c){var d=XLSX.utils.sheet_to_row_object_array(a.Sheets[c]);d.length>0&&(b[c]=d)}),b}}}.call(this),angular.module("bvcoeDmsApp").factory("XLSXReaderService",["$q","$rootScope",function(a,b){var c=function(a){angular.extec(this,a)};return c.readFile=function(c,d,e){var f=a.defer();return XLSXReader(c,d,e,function(a){b.$apply(function(){f.resolve(a)})}),f.promise},c}]),angular.module("bvcoeDmsApp").controller("AttendancesCtrl",["$rootScope","$scope","FirebaseRef","$q","$filter","$localStorage",function(a,b,c,d,e,f){function g(a,b){var c=parseInt(a),d=parseInt(b);return d>c?-1:c>d?1:0}var h={},i=function(){b.attendances=[];var e=d.defer();return c.child("attendances/"+a.$storage.userData.dept).orderByChild("teacher").equalTo(a.$storage.authData.uid).once("value",function(a){b.attendances=a.val(),b.$apply(),e.resolve()},function(a){console.log(a),e.reject()}),e.promise},j=function(){var b=d.defer();return c.child("students/"+a.$storage.userData.dept).once("value",function(a){h=a.val(),b.resolve()},function(a){b.reject()}),b.promise},k=function(){var a=d.defer();return c.child("departments").once("value",function(c){b.depts=c.val(),a.resolve()},function(b){a.reject()}),a.promise},l=function(){var e=d.defer();return c.child("subjects/"+a.$storage.userData.dept).once("value",function(a){b.subjects=a.val(),e.resolve()},function(a){e.reject()}),e.promise};b.loadAttendanceData=function(){var a=d.defer();i().then(function(){j().then(function(){k().then(function(){l().then(function(){a.resolve()})})})}),b.promise=a.promise},b.years=[{id:"fe",name:"First Year"},{id:"se",name:"Second Year"},{id:"te",name:"Third Year"},{id:"be",name:"Final Year"}],b.types={th:"Theory",pr:"Practical"},b.showDept=function(a){for(var c in b.depts)if(a==c)return b.depts[c].name},b.showYear=function(a){var c=[];return a&&(c=e("filter")(b.years,{id:a})),c.length?c[0].name:"Not set"},b.showSem=function(a){return"Semester "+a},b.showSub=function(a){for(var c in b.subjects)if(a==c)return b.subjects[c].name},b.showType=function(a){return"th"==a.type?"Theory":"pr"==a.type?"Practical:  Batch "+a.batchno:void 0},b.showAbsent=function(a){var b=[];return"undefined"!=typeof a?(b=_.filter(h,function(b){return _.includes(a,b.uid)}),_.map(b,"rollno").sort(g).join(", ")):"No absentees"},b.checkRoll=function(a,b){var c=_.chain(h).filter(function(b){return b.year==a.year}).map("rollno").sort(g).value(),d=b.split(/[ ,]+/);if(console.log(d.length),_.every(d,function(a){return _.includes(c,a)}));else if(""!=d[0])return"Some roll numbers are invalid"},b.saveAtt=function(a,e,g){console.log(a),console.log(e),console.log(g);var i=g.absentno.split(/[ ,]+/),j=_.chain(h).filter(function(a){return a.year==e.year}).map("uid").value(),k=_.chain(h).filter(function(a){return a.year==e.year&&_.includes(i,a.rollno)}).map("uid").value();""==i[0]&&(k=[]);var l=_.difference(j,k),m=d.defer();return c.child("attendances/"+f.userData.dept+"/"+a).update({absentno:k,date:g.date,dept:e.dept,noofhours:e.noofhours,presentno:l,semester:e.semester,subid:e.subid,teacher:e.teacher,timestamp:Firebase.ServerValue.TIMESTAMP,topic:e.topic,type:e.type,year:e.year},function(c){c?(console.log(c),m.reject()):(b.attendances[a].absentno=k,b.attendances[a].presentno=l,m.resolve())}),m.promise},b.deleteAtt=function(a){console.log("del"),console.log(a),c.child("attendances/"+f.userData.dept+"/"+a).remove(),delete b.attendances[a]},b.cancel=function(a){a.$cancel()}}]),angular.module("bvcoeDmsApp").controller("GendefaulterCtrl",["$scope","$http","$q","restapiurl","$uibModal",function(a,b,c,d,e){a.generate=function(e,f,g){var h=c.defer();b({method:"GET",url:d+"/defaulters/generate_defaulter_api.php/"+e+"/"+f+"/"+g}).then(function(b){console.log(b),a.defaulters=b.data.data,h.resolve()},function(a){h.reject()}),a.promise=h.promise},a.viewDefaulters=function(){var b=e.open({animation:!0,templateUrl:"views/modals/mymodal.html",controller:"ModalCtrl",size:"lg",resolve:{defaulters:function(){return a.defaulters}}});b.result.then(function(a){},function(){console.log("Modal dismissed at: "+new Date)})}}]),angular.module("bvcoeDmsApp").constant("restapiurl","http://bvcoeportal.orgfree.com"),angular.module("bvcoeDmsApp").controller("ExtrasCtrl",["$scope","FirebaseRef","$q","$rootScope",function(a,b,c,d){var e=d.$storage.userData.dept,f=c.defer();b.child("students/"+e).orderByChild("year").equalTo(d.$storage.userData.year).once("value",function(c){a.students=c.val(),b.child("extras/"+e).orderByChild("year").equalTo(d.$storage.userData.year).once("value",function(b){var c=b.val();for(var d in c)a.students[d].extra=c[d].extra;a.$apply(),f.resolve()})}),a.stuPromise=f.promise,a.updateExtra=function(a,d){var f=c.defer();return b.child("extras/"+e+"/"+a.uid).update({extra:d,year:a.year},function(a){a?f.reject():f.resolve()}),f.promise}}]),angular.module("bvcoeDmsApp").filter("orderObjectBy",function(){return function(a,b,c){var d=[];return angular.forEach(a,function(a){d.push(a)}),d.sort(function(a,c){var d=a[b],e=c[b];return isNaN(d)||isNaN(e)||(d=parseInt(d),e=parseInt(e)),d>e?1:-1}),c&&d.reverse(),d}}),angular.module("bvcoeDmsApp").directive("toggle",function(){return{restrict:"A",link:function(a,b,c){"tooltip"==c.toggle&&$(b).tooltip(),"popover"==c.toggle&&$(b).popover()}}}),angular.module("bvcoeDmsApp").controller("ModalCtrl",["defaulters","$scope",function(a,b){console.log(a),b.students=a,b.checkDefaulter=function(a){return console.log(a),"75">a?!0:!1}}]),angular.module("bvcoeDmsApp").run(["$templateCache",function(a){a.put("views/attendances.html",'<div cg-busy="{promise:promise, message:\'Loading..\', backdrop:true}"></div> <button class="btn btn-default" ng-click="loadAttendanceData()">Load Attendances</button> <table class="table table-striped"> <tr> <th style="width:5%">Sr. No</th> <th style="width:10%">Class</th> <th>Subject</th> <th>Type</th> <th>Absent Numbers</th> <th>Date</th> <th>Edit</th> </tr> <tr ng-repeat="(key, item) in attendances track by $index"> <td>{{$index + 1}}</td> <td> <span>{{showDept(item.dept)}}</span> <span>{{(item.year).toUpperCase()}}</span> <span>{{showSem(item.semester)}}</span> </td> <td> <span>{{showSub(item.subid)}}</span> </td> <td> <span>{{showType(item)}}</span> </td> <td> <span> <a href="" title="" data-toggle="popover" data-content="{{showAbsent(item.absentno)}}" data-trigger="hover">Absentees</a> </span> <span editable-text="item.absentnostring" onshow="item.absentnostring = showAbsent(item.absentno)" e-name="absentno" e-form="rowform" onbeforesave="checkRoll(item, $data)"> </span> </td> <td> <a editable-text="item.date" e-form="rowform" e-name="date"> {{item.date | date:dd/MM/yyyy}} </a> </td> <td style="white-space: nowrap"> <form editable-form name="rowform" onbeforesave="saveAtt(key, item, $data)" ng-show="rowform.$visible" class="form-buttons form-inline"> <button type="submit" ng-disabled="rowform.$waiting" class="btn btn-primary"> save </button> <button class="btn btn-danger" confirm="Are you sure?" ng-disabled="rowform.$waiting" ng-click="deleteAtt(key)">del</button> <button type="button" ng-disabled="rowform.$waiting" ng-click="cancel(rowform)" class="btn btn-default"> cancel </button> </form> <div class="buttons" ng-show="!rowform.$visible"> <button class="btn btn-primary" ng-click="rowform.$show()">edit</button> </div> </td> </tr> </table>'),a.put("views/dashboard.html",'<p>This is the dashboard view.</p> <div class="panel panel-default" ng-if="false"> <div class="panel-heading"> <h3 class="panel-title">Push Notifications</h3> </div> <div class="panel-body"> <form class="form-signin"> <div class="input-group"> <label for="title" class="sr-only">Title</label> <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span> <input type="text" id="title" class="form-control" placeholder="Title" ng-model="notif.title" required autofocus> </div> <div class="input-group"> <label for="body" class="sr-only">Password</label> <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span> <input type="textarea" id="body" class="form-control" placeholder="Notification body" ng-model="notif.body" required> </div> <div class="input-group"> <label for="tokens" class="sr-only">Password</label> <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span> <input type="textarea" id="tokens" class="form-control" placeholder="tokens" ng-model="notif.tokens" required> </div> <button class="btn btn-primary btn-block" ng-click="push(notif)">Push</button> </form> </div> </div>'),a.put("views/dataentry.html",'<h4>Data Entry Form</h4> <form name="form" enctype="multipart/form-data" class="col-md-6"> <div class="form-group"> <div class="input-group"> <button class="btn btn-default" ng-click="download()">Please download excel format</button> </div> </div> <div class="form-group"> <div class="input-group"> <span class="input-group-addon" id="basic-addon3">Choose your excel file</span> <input class="form-control" type="file" id="excel_file" accept=".xlsx, .xls" onchange="angular.element(this).scope().fileChanged(this.files)"> </div> </div> <div class="alert alert-success" ng-show="!isProcessing"> Sheet Loaded </div> <div class="alert alert-success" ng-if="success">{{success}}</div> <button class="btn btn-info" ng-disabled="isProcessing" ng-click="upload()">Upload to database</button> <div cg-busy="{promise:loading, message:\'Uploading..\', backdrop:true}"></div> </form>'),a.put("views/defaulters.html",'<div class="row"> <div class="col-md-6"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">View Defaulters</h3> </div> <div class="panel-body"> <form class="form-signin"> <div class="input-group"> <label for="inputDept" class="sr-only">Department</label> <span class="input-group-addon"><span class="glyphicon glyphicon-briefcase"></span></span> <select id="inputDept" class="form-control" ng-model="form.dept"> <option ng-repeat="dept in depts" value="{{dept.id}}">{{dept.name}}</option> </select> <div cg-busy="deptpromise"></div> </div> <div class="input-group"> <label for="inputYear" class="sr-only">Year</label> <span class="input-group-addon"><span class="glyphicon glyphicon-signal"></span></span> <select id="inputYear" class="form-control" ng-model="form.year"> <option ng-repeat="year in years" value="{{year.id}}">{{year.name}}</option> </select> </div> <div class="input-group"> <label for="inputSem" class="sr-only">Year</label> <span class="input-group-addon"><span class="glyphicon glyphicon-signal"></span></span> <select id="inputSem" class="form-control" ng-model="form.sem"> <option value="{{2 * form.year - 1}}">Semester {{2 * form.year - 1}}</option> <option value="{{2 * form.year}}">Semester {{2 * form.year}}</option> </select> </div> <button class="btn btn-primary btn-block" ng-click="loadDefaulters(form)">Go</button> <div cg-busy="{promise:promise, message:\'Loading in..\', backdrop:true}"></div> </form> </div> </div> </div> <div class="col-md-6" ng-show="defaulters.length>0"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Defaulters</h3> </div> <div class="panel-body"> <table class="table table-condensed"> <tr> <th>Name</th> <th>Date</th> <th>Link</th> </tr> <tr ng-repeat="item in defaulters"> <td>{{item.dept}} {{item.year}} Sem {{item.sem}}</td> <td>{{item.date | date:\'dd MMMM, yyyy\'}}</td> <td><a ng-click="download(item.base64)">Download</a></td> </tr> </table> </div> </div> </div> </div>'),a.put("views/extras.html",'<h3>{{$storage.userData.dept}} {{$storage.userData.year}} sem{{$storage.userData.sem}}</h3> <div cg-busy="{promise:stuPromise}"></div> <table class="table table-striped"> <tr> <th>Rollno</th> <th>Name</th> <th>Extra Curricular Attendance</th> </tr> <tr ng-repeat="student in students | orderObjectBy:\'rollno\':false"> <td>{{student.rollno}}</td> <td>{{student.name}}</td> <td><a href="#" editable-text="student.extra" onbeforesave="updateExtra(student, $data)">{{ student.extra || "0" }}</a></td> </tr> </table>'),a.put("views/gendefaulter.html",'<div class="row" ng-if="$storage.userData.role == \'admin\'"> <div class="col-md-6"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Generate Defaulters for {{$storage.userData.dept}} {{$storage.userData.year}} {{$storage.userData.sem}}</h3> </div> <div class="panel-body"> <form class="form-signin"> <button class="btn btn-primary btn-block" ng-click="generate($storage.userData.dept,$storage.userData.year,$storage.userData.sem)">Go</button> <div cg-busy="{promise:promise, message:\'Loading ..\', backdrop:true}"></div> <button ng-if="defaulters" class="btn btn-primary btn-block" ng-click="viewDefaulters()">View Defaulters</button> </form> </div> </div> </div> </div>'),a.put("views/main.html",'<div class="row"> <div class="col-md-6"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Teacher\'s Login</h3> </div> <div class="panel-body"> <form class="form-signin"> <div class="input-group"> <label for="inputEmail" class="sr-only">Email address</label> <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span> <input type="email" id="inputEmail" class="form-control" placeholder="Email address" ng-model="user.email" required autofocus> </div> <div class="input-group"> <label for="inputPassword" class="sr-only">Password</label> <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span> <input type="password" id="inputPassword" class="form-control" placeholder="Password" ng-model="user.pass" required> </div> <button class="btn btn-primary btn-block" ng-click="login(user)">Sign in</button> <div cg-busy="{promise:promise, message:\'Signing in..\', backdrop:true}"></div> <div class="alert" ng-class="{\'alert-success\':login.success, \'alert-danger\':!login.success}" ng-show="login.message.length" style="margin-top: 1em" role="alert">{{login.message}}</div> </form> </div> </div> </div> <div class="col-md-6"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Teacher\'s Registration</h3> </div> <div class="panel-body"> <form class="form-signin" name="regform" ng-submit="register(reg)"> <div class="input-group" ng-class="{ \'has-error\' : regform.name.$invalid && !regform.name.$pristine }"> <label for="inputName" class="sr-only">Full Name</label> <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span> <input type="text" id="inputName" name="name" class="form-control" placeholder="Full name" ng-model="reg.name" required> </div> <p ng-show="regform.name.$invalid && !regform.name.$pristine" class="help-block">Your name is required.</p> <div class="input-group"> <label for="inputDept" class="sr-only">Department</label> <span class="input-group-addon"><span class="glyphicon glyphicon-briefcase"></span></span> <select id="inputDept" class="form-control" ng-model="reg.dept"> <option ng-repeat="dept in depts" value="{{dept.id}}">{{dept.name}}</option> </select> </div> <div class="input-group" ng-class="{ \'has-error\' : regform.email.$invalid && !regform.email.$pristine }"> <label for="inputEmail" class="sr-only">Email address</label> <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span> <input type="email" id="inputEmail" name="email" class="form-control" placeholder="Email address" ng-model="reg.email" required> </div> <p ng-show="regform.email.$invalid && !regform.email.$pristine" class="help-block">Email is invalid.</p> <div class="input-group" ng-class="{ \'has-error\' : regform.pass.$invalid && !regform.pass.$pristine }"> <label for="inputPassword" class="sr-only">Password</label> <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span> <input type="password" id="inputPassword" name="pass" class="form-control" placeholder="Password" minlength="6" ng-model="reg.pass" required> </div> <p ng-show="regform.pass.$invalid && !regform.pass.$pristine" class="help-block">Passwords min length should be 6</p> <div class="input-group" ng-class="{ \'has-error\' : regform.pass2.$invalid && !regform.pass2.$pristine }"> <label for="inputPassword2" class="sr-only">Confirm Password</label> <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span> <input type="password" id="inputPassword2" name="pass2" class="form-control" placeholder="Confirm password" minlength="6" ng-model="reg.pass2" required compare-to="reg.pass"> </div> <p ng-show="regform.pass2.$invalid && !regform.pass2.$pristine" class="help-block">Passwords must match</p> <div class="input-group"> <label for="inputToken" class="sr-only">Token</label> <span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span> <input type="text" id="inputToken" class="form-control" placeholder="Token" ng-model="reg.token" required> </div> <div class="input-group"> <label>Teacher Type:</label> <div class="radio"> <label> <input type="radio" name="teacherRole" value="admin" ng-model="reg.teacherrole">HOD/ClassAdvisor</label> <label> <input type="radio" name="teacherRole" value="" ng-model="reg.teacherrole">Normal</label> </div> </div> <button type="submit" class="btn btn-primary btn-block" ng-disabled="regform.$invalid">Register</button> <div cg-busy="regpromise"></div> <div class="alert" ng-class="{\'alert-success\':message.regSuccess, \'alert-danger\':!message.regSuccess}" ng-show="message.text !== \'\'" style="margin-top: 1em" role="alert">{{message.text}}</div> </form> </div> </div> </div> </div>'),a.put("views/modals/confirmodal.html",'<div class="modal-header"> <h3>{{modalOptions.headerText}}</h3> </div> <div class="modal-body"> <p>{{modalOptions.bodyText}}</p> </div> <div class="modal-footer"> <button type="button" class="btn" data-ng-click="modalOptions.close()">{{modalOptions.closeButtonText}}</button> <button class="btn btn-primary" data-ng-click="modalOptions.ok();">{{modalOptions.actionButtonText}}</button> </div>'),a.put("views/modals/mymodal.html",'<div class="modal-header"> <h3 class="modal-title">I\'m a modal!</h3> </div> <div class="modal-body"> <table class="table table-bordered"> <tr> <th>Rollno</th> <th>Name</th> <th>Attendance</th> <th>Parents Phone</th> </tr> <tr ng-repeat="(uid, student) in students track by uid" ng-if="checkDefaulter(student.percent)"> <td>{{student.rollno}}</td> <td>{{student.name}}</td> <td>{{student.percent}}</td> <td>{{student.pphone}}</td> </tr> </table> </div> <div class="modal-footer"> <button class="btn btn-primary" type="button" ng-click="">Send SMS</button> <button class="btn btn-warning" type="button" ng-click="">Cancel</button> </div>'),a.put("views/takeAttendance.html",'<div> <style>#over {\n      background-image: url("images/android.5754a37f.jpg");\n      background-repeat: no-repeat;\n      height: 700px;\n      width: 408px;\n      position: relative;\n      left: 50%;\n      margin-left: -204px;\n    }\n    iframe {\n      position: relative;\n      left: 46px;\n      top: 56px;\n      height: 560px;\n      width: 316px;\n    }</style> <div id="over"> <iframe src="web/index.html" frameborder="0"></iframe> </div> </div>')}]);