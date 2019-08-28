// Copyright (c) 2019 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
//
// WSO2 Inc. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import vscode, { workspace, OpenDialogOptions, QuickPickItem, Uri, window} from 'vscode';
import data from './templateDetails.json';
import ProjectTemplates from './projectTemplates';
import { getHomeView } from './homeView';
import { getFormView } from './formView';
import { mapToObj } from './utils';

/**
 * Displays the set of templates available and once a template is selected, 
 * the required parameters will be obtained to create a new project from the 
 * template after replacing the placeholder values. If a workspace is not 
 * open the user will be informed to open a folder first. If multiple workspaces 
 * are open, the user will be prompted to select the desired workspace. 
 * @param currentPanel WebView panel that is opened through the extension.
 * @param context ExtensionContext of the extension. 
 */
export async function createTemplateProject(currentPanel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    let templateSelected = undefined;
    let projectTemplates = new ProjectTemplates(context, workspace.getConfiguration('projectTemplates'));
    // get workspace folder
    let workspaceSelected = await ProjectTemplates.selectWorkspace();
    // generate the home page to display templates
    currentPanel.webview.html = getHomeView();
    let moduleName = undefined;
    let projectName = undefined;
    let folderPath = undefined;
    let projectPath = undefined;
    currentPanel.webview.onDidReceiveMessage(
        async homePageMessage => {
            // if (!workspaceSelected) {
            //     window.showErrorMessage("No Workspace Selected!");
            //     return;
            // }
            templateSelected = homePageMessage.command;
            if (templateSelected == "new_project"){
                projectName = await window.showInputBox({
                    value: "new_project",
                    prompt: "Enter value for project name",
                    placeHolder: "new_project"
                }).then(text => text);
                projectPath = await openDialogForFolder();
                let projectUri = vscode.Uri.parse(projectPath);
                const cp = require('child_process')
                    await cp.exec('cd ' + projectUri.path + ' && ballerina new ' + projectName, (err, stdout, stderr) => {
                        console.log('stdout: ' + stdout);
                        console.log('err: ' + err);
                        var message = "Created new ballerina project";
                        if (stderr.search(message) != -1 || stdout.search(message)) { 
                            vscode.commands.executeCommand('vscode.openFolder', projectUri);
                            window.showInformationMessage("Successfully created a new Ballerina project at " + projectUri.path);
                        } else {
                            window.showErrorMessage(stderr); 
                            console.log(stderr);
                        }
                    });
            } else {
                moduleName = await window.showInputBox({
                        value: templateSelected,
                        prompt: "Enter value for module name",
                        placeHolder: templateSelected
                }).then(text => text);
                let workspacePath = vscode.workspace.rootPath;
                folderPath = await openDialogForFolder();
                // folderPath = await window.showInputBox({
                //     value: workspacePath,
                //     prompt: "Folder Path",
                //     placeHolder: workspacePath
                // }).then(text => text);
                let uri = vscode.Uri.parse(folderPath);
                // let task = await new vscode.Task(
                //     { type: 'ballerina', task: 'add' },
                //     'add',
                //     'ballerina',
                //     new vscode.ShellExecution(`ballerina add irushi/module0`)
                //   );
    
    
                // let rakePromise: Thenable<vscode.Task[]> | undefined = undefined;
                // const taskProvider = vscode.tasks.registerTaskProvider('rake', {
                // provideTasks: () => {
                //     if (!rakePromise) {
                //     rakePromise = getRakeTasks();
                //     }
                //     return rakePromise;
                // },
                // resolveTask(_task: vscode.Task): vscode.Task | undefined {
                //     const task = _task.definition.task;
                //     // A Rake task consists of a task and an optional file as specified in RakeTaskDefinition
                //     // Make sure that this looks like a Rake task by checking that there is a task.
                //     if (task) {
                //     // resolveTask requires that the same definition object be used.
                //     const definition: RakeTaskDefinition = <any>_task.definition;
                //     return new vscode.Task(
                //         definition,
                //         definition.task,
                //         'rake',
                //         new vscode.ShellExecution(`rake ${definition.task}`)
                //     );
                //     }
                //     return undefined;
                // }
                // });
    
                
                // let task = await new vscode.ShellExecution(`ballerina add irushi/module0`);
                // console.log('folderPath: ' + task);
                
                console.log("folder: " + uri.path);
                // vscode.commands.executeCommand('vscode.openFolder', uri);
                if (folderPath != null && moduleName != null) {
                    const cp = require('child_process')
                    var addCommand = 'cd ' + uri.path + ' && ballerina add ' + moduleName + ' -t wso2/' + templateSelected;
                    console.log("addCommand: " + addCommand);
                    await cp.exec(addCommand, (err, stdout, stderr) => {
                        console.log('stdout: ' + stdout);
                        console.log('err: ' + err);
                        if (err) {
                            console.log('error: ' + err);
                            window.showErrorMessage("Error: " + err);
                        } else if (stderr) {
                            console.log('error: ' + stderr);
                            var message = "not a ballerina project";
                            var successMessage = "Added new ballerina module";
                            if (stderr.search(successMessage) != -1 ) { 
                                console.log(stderr);
                                window.showInformationMessage(stderr); 
                                vscode.commands.executeCommand('vscode.openFolder', uri);
                            } 
                            else if (stderr.search(message) != -1 ) { 
                                console.log("Error: " + stderr);
                                window.showErrorMessage("Please select a Ballerina project!"); 
                            } else { 
                                window.showErrorMessage(stderr); 
                                console.log(stderr); 
                            } 
                        }
                    });
                }
                
                currentPanel.dispose();
                vscode.commands.executeCommand("ballerinaIntegrator.projectTemplates");
                // }
                // generate the placeholder form for a specific template
        //         currentPanel.webview.html = getFormView(templateSelected);
        //         currentPanel.webview.onDidReceiveMessage(
        //             async formPageMessage => {
        //                 if (formPageMessage.command === "back") {
        //                     currentPanel.dispose();
        //                     vscode.commands.executeCommand("ballerinaIntegrator.projectTemplates");
        //                     return;
        //                 } else {
        //                     projectTemplates.updateConfiguration(workspace.getConfiguration('projectTemplates'));
        //                     let templateObject = data.find(x => x.id === homePageMessage.command);
        //                     let templatePlaceholders = templateObject.placeholders;
        //                     let placeholderMap = new Map();
        //                     templatePlaceholders.forEach(element => {
        //                         placeholderMap.set(element.name, formPageMessage[element.id]);
        //                     });
        //                     let placeholders = mapToObj(placeholderMap);
        //                     currentPanel.dispose();
        //                     projectTemplates.createFromTemplate(workspaceSelected, homePageMessage.command, placeholders).then(
        //                         (template: string | undefined) => {
        //                             if (template) {
        //                                 window.showInformationMessage("New template project created for '" +
        //                                     templateObject.name + "'!");
    
        //                             }
        //                         },
        //                         (reason: any) => {
        //                             if (reason === "false") {
        //                                 window.showInformationMessage("Project creation aborted!");
        //                             } else {
        //                                 window.showErrorMessage("Failed to create project from template: " + reason);
        //                             }
        //                         }
        //                     );
        //                 }
        //             },
        //             console.log("cccc");
        //             undefined,
        //             context.subscriptions
        //         );
            }
        },
        undefined,
        context.subscriptions
    );
    return templateSelected;
}

async function createNewProject(folderPath:vscode.Uri, moduleName:string){
    const cp = require('child_process')
    await cp.exec('cd ' + folderPath + '&& ballerina new ' + moduleName, (err, stdout, stderr) => {
        console.log('stdout: ' + stdout);
        console.log('err: ' + err);
        if (err) {
            console.log('error: ' + err);
            window.showErrorMessage("Error: " + err);
        } else if (stderr) {
            console.log('error: ' + stderr);
            window.showErrorMessage("Error: " + err);
        }
    });
}

export async function openDialogForFolder(): Promise<Uri | null> {
    const options: OpenDialogOptions = {
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false
        };
    const result: Uri[] | undefined = await window.showOpenDialog(Object.assign(options));
    if (result && result.length > 0) {
        console.log(result);
        return Promise.resolve(result[0]);
    } else {
        return Promise.resolve(null);
    }
}
