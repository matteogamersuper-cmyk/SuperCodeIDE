const { ipcRenderer } = require("electron");

const textarea = document.getElementById("code-editor");

const savefileButton =
document.getElementById("save-file-button");

const openfileButton =
document.getElementById("open-file-button");

const closefileButton =
document.getElementById("close-file-button");



let currentFile = null;

console.log(savefileButton);
console.log(openfileButton);
console.log(closefileButton);



// OPEN FILE
openfileButton.addEventListener("click", async()=>{


    const result = await ipcRenderer.invoke("open-file");


    if(result){

        currentFile = result.path;

        textarea.value = result.content;

        console.log("File aperto:", currentFile);

    }

});




// SAVE FILE
savefileButton.addEventListener("click", async()=>{


    if(!currentFile){

        alert("Apri prima un file");

        return;

    }


    await ipcRenderer.invoke(
        "save-file",
        {
            path: currentFile,
            content: textarea.value
        }
    );


    alert("File salvato");


});




// CLOSE FILE
closefileButton.addEventListener("click", ()=>{


    console.log("Pulsante Close premuto");

    console.log("File corrente:", currentFile);



    if(currentFile === null){

        alert("Nessun file aperto");

        return;

    }



    if(confirm("Chiudere il file corrente?")){


        currentFile = null;


        textarea.value = "";



        alert("File chiuso");


    }


});