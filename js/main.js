
var titleInput = document.querySelector("#title");
var descriptionInput = document.querySelector("#description");
var addButton = document.querySelector("#add");
var updateButton = document.querySelector("#update");
var id=0;
var elementsValues = [];
var currentElementEdit = null;
var titleError = document.querySelector(".title_error");
var descriptionError = document.querySelector(".description_error");


// add element function
function addElement(){
    var valuesObject={
        "title": "",
        "description": "",
        "completed": false,
        "id": ++id
    }

    //title validation
    var regexTitle = /^[A-Z]{1}[a-z]{3,8}$/;
    var regexDescription = /.{20,}/;
    if (regexTitle.test(titleInput.value)) {
        titleError.style.visibility = "hidden";
    } else {
        titleError.style.visibility = "visible";
    }

    // Description validation
    if (regexDescription.test(descriptionInput.value)) {
        descriptionError.style.visibility = "hidden";
    } else {
        descriptionError.style.visibility = "visible";
    }

    // If both are valid, add element
    if (regexTitle.test(titleInput.value) && regexDescription.test(descriptionInput.value)) {
        valuesObject.title = titleInput.value;
        valuesObject.description = descriptionInput.value;
        elementsValues.push(valuesObject);
        console.log(elementsValues);
        setLocalStorage();
        displayElements();
        titleInput.value = "";
        descriptionInput.value = "";
    }
   

    
}

// display elements function
function displayElements(itemsToDisplay = elementsValues){
    
    var elementsDiv = document.querySelector(".elements");
    elementsDiv.innerHTML = "";

    for(var i=0; i<itemsToDisplay.length; i++){
        //create element div
        var elementDiv = document.createElement("div");
        elementDiv.classList.add("element");
        elementsDiv.append(elementDiv);

        //create h3 inside element
        var elementH3 = document.createElement("h3");
        elementH3.innerText = elementsValues[i].title;
        elementDiv.append(elementH3);

        //create icons div
        var iconsDiv = document.createElement("div");
        iconsDiv.classList.add("icons");
        elementDiv.append(iconsDiv);

        //create 3 icons inside icons div
        var iconCompleted = document.createElement("i");
        iconCompleted.classList.add("fa-solid", "fa-check");
        iconsDiv.append(iconCompleted);

        var iconEdit = document.createElement("i");
        iconEdit.classList.add("fa-solid", "fa-pen-to-square");
        iconsDiv.append(iconEdit);

        var iconDelete = document.createElement("i");
        iconDelete.classList.add("fa-solid", "fa-trash", "delete");
        iconsDiv.append(iconDelete);
        
        
        //delete invoke
        (function(itemId){
            iconDelete.addEventListener("click", function(){
            deleteElement(itemId)
            } )
        }(elementsValues[i].id));


        //function completed invoke
        (function(itemId, elementDiv){
            iconCompleted.addEventListener("click", function(){
                completedElement(itemId, elementDiv)
            })

        })(elementsValues[i].id, elementDiv);

        if(elementsValues[i].completed){
            elementDiv.classList.add("completed");
        }

        //function edit invoke
        (function(itemId){
            iconEdit.addEventListener("click",function(){
                editElement(itemId)
            })
        })(elementsValues[i].id)

    }
}
//function delete
function deleteElement(itemId ) {
    
        var indexToDelete = elementsValues.findIndex(function(item) {
            return item.id === itemId;
        });

        if (indexToDelete !== -1) {
            elementsValues.splice(indexToDelete, 1);
            setLocalStorage();
            displayElements();
        }
    
};

//function completed
function completedElement(itemId, elementDiv){
    var indexCompleted = elementsValues.findIndex(function(item) {
        return item.id === itemId;
    });
    if(indexCompleted !== -1){
        elementDiv.classList.add("completed");
        elementsValues[indexCompleted].completed = true;
        setLocalStorage();
        displayElements();
    }
}

//function edit
function editElement(itemId){
    var indexToUpdate = elementsValues.findIndex(function(item) {
        return item.id === itemId;
    });
    if(indexToUpdate !== -1){
        titleInput.value = elementsValues[indexToUpdate].title;
        descriptionInput.value = elementsValues[indexToUpdate].description;
        currentElementEdit = indexToUpdate;
        addButton.style.display = "none";
        updateButton.style.display = "block";
        console.log(currentElementEdit)
    }
}

//function update
function updateElement(){   
        elementsValues[currentElementEdit].title = titleInput.value;
        elementsValues[currentElementEdit].description = descriptionInput.value;
        displayElements();
        updateButton.style.display = "none";
        addButton.style.display = "block";
        titleInput.value = "";
        descriptionInput.value = "";
}

//function search 
var searchInput = document.querySelector("#search_input");
function searchElements(searchTerm){
    var filteredElements = [];
    var searchTermLower = searchTerm.toLowerCase();

    for(var i=0; i<elementsValues.length; i++){
        titleLower = elementsValues[i].title.toLowerCase();

        if(titleLower.includes(searchTermLower)){
            filteredElements.push(elementsValues[i])
        }
    }
    displayElements(filteredElements);

}
searchInput.addEventListener("input", function(){
    searchElements(this.value);
})

// function to set in local storage
function setLocalStorage(){
    localStorage.setItem("elements", JSON.stringify(elementsValues))
}

addButton.addEventListener("click", addElement);
updateButton.addEventListener("click", updateElement);

function loadElementsFromLocalStorage() {
    const storedElements = localStorage.getItem('elements');
    if (storedElements) {
        elementsValues = JSON.parse(storedElements);
        if (elementsValues.length > 0) {
            const lastElementId = elementsValues[elementsValues.length - 1].id;
            id = lastElementId;
        }
        displayElements();
    }
}

loadElementsFromLocalStorage();
