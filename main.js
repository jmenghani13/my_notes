var noteNumber;  //helps give unique id
var notes= [];  //array to store infoormation about each of the notes to place in locall storage.

      //Creates required button for the note and gives it respective attributes
function buttonCreate(element, text, number, fn){
  element = document.createElement("BUTTON");
  element.id=text+number.toString();
  element.className=text + "Button";
  element.onclick=function(){fn(event)};
  return element;
}

//Assigns class for a guven priority which helps give corresponding color
function setColor(a, priorityValue){
  if(priorityValue==1)
    a.className="pri1";
  else if(priorityValue==2)
    a.className="pri2";
  else if(priorityValue==3)
    a.className="pri3";
}
//Tells you which priority your not currently has.
function setPriText(priButton, priorityValue){
  if(priorityValue==1)
    priButton.innerHTML="H";
  else if(priorityValue==2)
    priButton.innerHTML="M";
  else if(priorityValue==3)
    priButton.innerHTML="L";
}

//Deletes respective note from the unordered list and also from the local storage
function deleteFn(e){
  var alink = e.target.parentNode;
  var li = alink.parentNode;
  var id = li.id;
  li.parentNode.removeChild(li);

  for (var i = 0; i < notes.length; i++) {
    if(notes[i].newNoteId==id){
      notes.splice(i,1);
      break;
    }

  };

  if(notes.length)
    localStorage.setItem("noteList" ,JSON.stringify(notes));
  else
    localStorage.clear();


}
//Lets you edit the text within the note when you click edit button. Changes are made within local Storage too.
function editFn(e){
  var listText = e.target.parentNode.childNodes[0];
  if(listText.contentEditable=="false"){
    listText.contentEditable = "true";
    listText.focus();
    e.target.className="editingButton";
  }
  else{
    var alink = e.target.parentNode;
    var li = alink.parentNode;
    listText.contentEditable="false";
    e.target.className="editButton";

    var id = li.id;

    for (var i = 0; i < notes.length; i++) {
      if(notes[i].newNoteId==id){
        notes[i].text = listText.innerHTML;
        break;
      }
    };
    localStorage.setItem("noteList" ,JSON.stringify(notes));
  }
}
//Priority of note is changed. Changes saved in local storage.
function priFn(e){
  var alink = e.target.parentNode;
  var priorityValue;
  if(e.target.innerHTML=="H"){
    e.target.innerHTML="M";
    alink.className="pri2";
    priorityValue=2;
  }
  else if(e.target.innerHTML=="M"){
    e.target.innerHTML="L";
    alink.className="pri3";
    priorityValue=3;
  }
  else if(e.target.innerHTML=="L"){
    e.target.innerHTML="H";
    alink.className="pri1";
    priorityValue=1;
  }

  var li = alink.parentNode;
  var id = li.id;

  for (var i = 0; i < notes.length; i++) {
    if(notes[i].newNoteId==id){
      notes[i].priority=priorityValue;
      break;
    }
  };
  localStorage.setItem("noteList" ,JSON.stringify(notes));
}
//The notes in the ul are sorted based on priority. notes is sorted. ul is made empty and then the notes are created
//for the ul again, in sorted manner.
document.getElementById("sort").addEventListener("click",function sort(){
  notes = notes.sort(function(a,b){
    return b.priority - a.priority;
  });
  var parent = document.getElementById("noteList");
  parent.innerHTML="";
  for (var i = 0; i < notes.length; i++) {
    create(notes[i]);
  };
  localStorage.setItem("noteList" ,JSON.stringify(notes));
});

//new note is created and put into local storage
document.getElementById("new").addEventListener("click",function newNote(){
  var input= document.getElementById("note").value;
  if(input!=""){
    var priority = document.getElementById("priority");
    var priorityValue = priority.options[priority.selectedIndex].value;
    var Nid = "newNote" + noteNumber.toString();
    var obj ={ newNoteId : "newNote"+noteNumber.toString() ,id : noteNumber ,  text : input , priority : priorityValue };
    create(obj);
    notes.push(obj);
    localStorage.setItem("noteList" ,JSON.stringify(notes));
    noteNumber=noteNumber+1;
    document.getElementById("note").value="";
  }
});

//elements in the note are added and inserted into the ul
function create(obj){
  var number = obj.id;
  var input = obj.text;
  var priorityValue = obj.priority;
  var newDiv = document.createElement("LI");
  newDiv.id = obj.newNoteId;

  var a = document.createElement("a");
  a.setAttribute('href',"#");
  a.onclick=function(){return false;};

  var text = document.createElement("p");
  text.innerHTML=input;
  text.id="text"+number.toString();
  text.contentEditable="false";

  var deleteButton , editButton, priButton;
  deleteButton = buttonCreate(deleteButton,"delete", number, deleteFn);
  editButton = buttonCreate(editButton,"edit", number, editFn);
  priButton = buttonCreate(priButton, "pri", number, priFn);

  setColor(a,priorityValue);
  setPriText(priButton,priorityValue);

  a.appendChild(text);
  a.appendChild(deleteButton);
  a.appendChild(priButton);
  a.appendChild(editButton);
  newDiv.appendChild(a);
  var parent =document.getElementById("noteList");
  parent.insertBefore(newDiv, parent.childNodes[0]);
}

//When page is reloaded, the notes previously created are generated.
window.addEventListener("load", function(){
  notes= JSON.parse(localStorage.getItem("noteList"));
  if(notes){
    for (var i = 0; i < notes.length; i++) {
      create(notes[i]);
    };
    noteNumber = notes[i-1].id + 1;
  }
  else{
    notes=[];
    noteNumber = 1;
  }
  //localStorage.clear();

});
