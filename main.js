const {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    Tray,
    nativeImage,
    Menu,
    MenuItem,
    webContents,
} = require("electron");

const path = require("path");
const fs = require("fs");


const indexfile = "html/index.html";


let mainWindow;
let tray;


// ===============================
// CREATE WINDOW
// ===============================

function createWindow() {

    mainWindow = new BrowserWindow({

        width: 1200,
        height: 800,

        minWidth: 800,
        minHeight: 600,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    });


    mainWindow.loadFile(indexfile);


    mainWindow.on('minimize', (event) => {

        event.preventDefault();
        mainWindow.setSkipTaskbar(true);

    });


    mainWindow.webContents.on('context-menu', () => {

        const menu = Menu.buildFromTemplate([

            {
                label: 'Select All',
                role: 'selectAll'
            },

            {
                type: 'separator'
            },

            {
                label: 'Close',
                role: 'quit'
            }

        ]);


        menu.popup();

    });


    mainWindow.on("closed", () => {

        mainWindow = null;

    });

}


// ===============================
// OPEN FILE
// ===============================

ipcMain.handle(
    "open-file",
    async () => {


        const result = await dialog.showOpenDialog({

            title: "Apri file",

            properties: [
                "openFile"
            ],

            filters: [

                {
                    name: "Code Files",
                    extensions: [
                        "js",
                        "html",
                        "css",
                        "json",
                        "py",
                        "cpp",
                        "txt"
                    ]
                },

                {
                    name: "All Files",
                    extensions: ["*"]
                }

            ]

        });


        if (result.canceled) {

            return null;

        }


        const filePath = result.filePaths[0];


        const content = fs.readFileSync(
            filePath,
            "utf-8"
        );


        return {

            path: filePath,

            content: content

        };

    }
);


// ===============================
// SAVE FILE
// ===============================

ipcMain.handle(
    "save-file",
    async (event, data) => {


        try {

            fs.writeFileSync(

                data.path,

                data.content,

                "utf-8"

            );


            return true;


        } catch (error) {


            console.error(error);

            return false;

        }


    });


// ===============================
// SAVE AS
// ===============================

ipcMain.handle(
    "save-as",
    async (event, content) => {


        const result = await dialog.showSaveDialog({

            title: "Salva file",

            filters: [

                {
                    name: "Code Files",
                    extensions: [
                        "js",
                        "html",
                        "css",
                        "txt"
                    ]
                }

            ]

        });


        if (result.canceled) {

            return null;

        }


        fs.writeFileSync(

            result.filePath,

            content,

            "utf-8"

        );


        return result.filePath;


    });


// ===============================
// APP EVENTS
// ===============================

app.whenReady().then(() => {


    createWindow();


    const icon = nativeImage.createFromPath(
        path.join(__dirname, "icons", "app-icon-png.png")
    );


    const template = [

        {
            label: "Close",
            click: () => {

                app.quit();

            }
        }

    ];


    const contextMenu = Menu.buildFromTemplate(template);


    tray = new Tray(icon);


    tray.setContextMenu(contextMenu);


    tray.setToolTip('SuperCode IDE');


    tray.setTitle('SuperCode IDE');


    tray.on('double-click', () => {

        mainWindow.show();

    });



    app.on(
        "activate",
        () => {

            if (BrowserWindow.getAllWindows().length === 0) {

                createWindow();

            }

        }
    );


});


// ===============================
// CLOSE APP
// ===============================

app.on(
    "window-all-closed",
    () => {


        if (process.platform !== "darwin") {

            app.quit();

        }


    });