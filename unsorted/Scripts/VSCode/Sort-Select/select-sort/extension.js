// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Window = vscode.window;
const Range = vscode.Range;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "select-sort" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let disposable = vscode.commands.registerCommand('extension.sort', function () {
        // The code you place here will be executed every time your command is executed

        // (pos, name, dim, color, userData)
        let parenReg = /\([\s\S]*?\)/;
        // let objectReg = /var [\s\S]*? = \{([\s\S]*?)\}/;
        let varReg = /var [\s\S]*;/;
        let testArray = [parenReg, varReg];
        let PAREN = 0;
        // let OBJECT = 1;
        let VAR = 1;
        let editor = Window.activeTextEditor;
        let document = editor.document;
        let selection = editor.selections;
        console.log(selection);
        let newRange = new Range(selection[0].start, selection[0].end);
        let txt = document.getText(newRange);
        let newTxt = "";
        let typeText;
        let index = -1;
        let stringSortArray = [];
        let SPACE = "    ";
        let anchor = selection[0].start.character;
        let repeatVal = parseInt(anchor/4);
        // console.log("text type:", typeof txt);
        testArray.forEach( (item, idx) => {
            // console.log("idx", idx);
            if (item.test(txt)) {
                index = idx;
                // console.log("index", index);
            }
        });
        
        let compareArray = ( a, b ) => {
            let aL = a.trim().toLowerCase();
            let bL = b.trim().toLowerCase();
            if (aL < bL) {
                return -1;
            }
            if (aL > bL) {
                return 1;
            }
            return 0;
        };

        let trimArray = a => {
            return a.trim();
        };

        function returnVal(m, p1, p2) { 
            name = p1;
            return p2;
        }

        function handleObj(obj, indentLevl) {
            // var reg = /(var [\s\S]*? = ){([\s\S]*?)};/;
            //     var name;
            //     newTxt = txt.replace(reg, returnVal);
            //     console.log("newTxt OBJ:", newTxt);
            //     stringSortArray = newTxt.split(",").map(trimArray).sort(compareArray);
            //     newTxt = `${SPACE.repeat(repeatVal)}${name}{\n${SPACE.repeat(repeatVal)}${stringSortArray.join(`,\n${SPACE.repeat(repeatVal)}`)}\n};`;
            //     typeText = "OBJECT";
            //     break;
        }

        var indent = [];
        switch (index) {
            case PAREN:
                var reg = /(\()([\s\S]*)(\))/;
                newTxt = txt.replace(reg, "$2");
                stringSortArray = newTxt.split(",").map(trimArray).sort(compareArray);
                newTxt = `(${stringSortArray.join(", ")})`;
                typeText = "PAREN";
                break;
            // case OBJECT:
            //     var reg = /(var [\s\S]*? = ){([\s\S]*?)};/;
            //     var name;
            //     newTxt = txt.replace(reg, returnVal);
            //     console.log("newTxt OBJ:", newTxt);
            //     stringSortArray = newTxt.split(",").map(trimArray).sort(compareArray);
            //     newTxt = `${SPACE.repeat(repeatVal)}${name}{\n${SPACE.repeat(repeatVal)}${stringSortArray.join(`,\n${SPACE.repeat(repeatVal)}`)}\n};`;
            //     typeText = "OBJECT";
            //     break;
            case VAR:
                var reg = /(var [\s\S]*? = )([\s\S]*?);/;
                var name;
                console.log("getting replace in VAR")
                newTxt = txt.replace(reg, returnVal);
                console.log("name:", name);
                console.log("newTxt:", newTxt);
                stringSortArray = newTxt.split(",").map(trimArray).sort(compareArray);
                newTxt = `var ${stringSortArray.join(`,\n${SPACE}`)};`;
                typeText = "VAR";
                break;
            default:
                typeText = " Couldn't FIND";
        }

        editor.edit( edit => {
            edit.replace(newRange, newTxt);
        });
        
        vscode.window.showInformationMessage(typeText);


        /*
        editor.selection

        [{
            "start": {"line":0,"character":0},
            "end": {"line":1,"character":4},
            "active":{"line":1,"character":4},
            "anchor":{"line":0,"character":0}
        }]
        */
        /*
        editor.edit( edit => {
            for (var x = 0; x < selection.length; x++) {
                let txt = document.getText(new Range(selection[x].start, selection[x].end));
                
            }
        })
        */
        // function toUpper(e: TextEditor, d: TextDocument, sel: Selection[]) {
        //     e.edit(function (edit) {
        //         // itterate through the selections and convert all text to Upper
        //         for (var x = 0; x < sel.length; x++) {
        //             let txt: string = d.getText(new Range(sel[x].start, sel[x].end));
        //             edit.replace(sel[x], txt.toUpperCase());
        //         }
        //     });
        // }

        // Display a message box to the user
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;