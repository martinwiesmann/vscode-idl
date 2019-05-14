"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const idl_routine_helper_1 = require("./providers/idl-routine-helper");
const idl_document_symbol_manager_1 = require("./providers/idl-document-symbol-manager");
const idl_problem_detector_1 = require("./providers/idl-problem-detector");
const IDL_MODE = { language: "idl", scheme: "file" };
// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = vscode_languageserver_1.createConnection(vscode_languageserver_1.ProposedFeatures.all);
// Create a simple text document manager. The text document manager
// supports full document sync only
let documents = new vscode_languageserver_1.TextDocuments();
// create all of our helper objects for different requests
const routineHelper = new idl_routine_helper_1.IDLRoutineHelper(connection, documents);
const symbolProvider = new idl_document_symbol_manager_1.IDLDocumentSymbolManager(connection, documents);
const problemDetector = new idl_problem_detector_1.IDLProblemDetector(connection, documents, symbolProvider, routineHelper);
// flags for configuration
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = true;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    let capabilities = params.capabilities;
    // Does the client support the `workspace/configuration` request?
    // If not, we will fall back using global settings
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            // Tell the client that the server supports code completion
            completionProvider: {
                resolveProvider: true
            },
            definitionProvider: true,
            workspaceSymbolProvider: true,
            documentSymbolProvider: true
        }
    };
});
connection.onInitialized(() => {
    try {
        if (hasConfigurationCapability) {
            // Register for all configuration changes.
            connection.client.register(vscode_languageserver_1.DidChangeConfigurationNotification.type, undefined);
        }
        // listen for workspace folder event changes and update our serve-side cache
        // TODO: detect when workspace is closed and remove files
        if (hasWorkspaceFolderCapability) {
            // get the list of current workspaces
            connection.workspace
                .getWorkspaceFolders()
                .then(folders => {
                // refresh our index and detect problems on success
                symbolProvider
                    .indexWorkspaces(folders)
                    .then(() => {
                    // detect problems because we had change
                    problemDetector.detectAndSendProblems();
                })
                    .catch(err => {
                    connection.console.log(JSON.stringify(err));
                });
            })
                .then(undefined, err => {
                connection.console.log(JSON.stringify(err));
            });
            connection.workspace.connection.workspace // listen for new workspaces
                .onDidChangeWorkspaceFolders(_event => {
                try {
                    connection.console.log("Workspace folder change event received. " +
                        JSON.stringify(_event));
                    // refresh our index and detect problems on success
                    symbolProvider
                        .indexWorkspaces(_event.added)
                        .then(() => {
                        // detect problems because we had change
                        problemDetector.detectAndSendProblems();
                    })
                        .catch(err => {
                        connection.console.log(JSON.stringify(err));
                    });
                }
                catch (err) {
                    connection.console.log(JSON.stringify(err));
                }
            });
        }
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
    }
});
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
let documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.languageServerExample || defaultSettings));
    }
    // Revalidate all open text documents
    problemDetector.detectAndSendProblems();
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: "IDLLanguageServer"
        });
        documentSettings.set(resource, result);
    }
    return result;
}
// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});
// TODO: work with just the changed parts of a document
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    try {
        // generate new symbols with the update, seems to magically sync when there are changes?
        symbolProvider
            .update(change.document.uri)
            .then(res => {
            // detect problems because we had change
            problemDetector.detectAndSendProblems();
        })
            .catch(err => {
            connection.console.log(JSON.stringify(err));
        });
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
    }
});
documents.onDidOpen(event => {
    try {
        symbolProvider.get
            .documentSymbols(event.document.uri)
            .then(res => {
            // detect problems because we had change
            problemDetector.detectAndSendProblems();
        })
            .catch(err => {
            connection.console.log(JSON.stringify(err));
        });
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
    }
});
connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log("We received an file change event");
});
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    try {
        return routineHelper.completion(_textDocumentPosition);
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
        return [];
    }
});
// when we auto complete, do any custom adjustments to the data before the auto-complete
// request gets back to the client
connection.onCompletionResolve((item) => {
    try {
        return routineHelper.postCompletion(item);
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
        return item;
    }
});
// handle when a user searches for a symbol
connection.onWorkspaceSymbol((params) => {
    try {
        return symbolProvider.searchByName(params.query);
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
        return [];
    }
});
// handle when we want the definition of a symbol
connection.onDefinition((params) => {
    try {
        const res = symbolProvider.searchByLine(params);
        return res;
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
        return null;
    }
});
// connection.onHover(
//   (params: TextDocumentPositionParams): Hover => {
//     const res = symbolProvider.searchByLine(params);
//     return res;
//   }
// )
// handle when we request document symbols
connection.onDocumentSymbol((params) => {
    try {
        symbolProvider.get
            .documentSymbols(params.textDocument.uri)
            .then(res => {
            return res;
        })
            .catch(err => {
            connection.console.log(JSON.stringify(err));
            return [];
        });
    }
    catch (err) {
        connection.console.log(JSON.stringify(err));
        return [];
    }
});
/*
connection.onDidOpenTextDocument((params) => {
    // A text document got opened in VSCode.
    // params.uri uniquely identifies the document. For documents store on disk this is a file URI.
    // params.text the initial full content of the document.
    connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
    // The content of a text document did change in VSCode.
    // params.uri uniquely identifies the document.
    // params.contentChanges describe the content changes to the document.
    connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
    // A text document got closed in VSCode.
    // params.uri uniquely identifies the document.
    connection.console.log(`${params.textDocument.uri} closed.`);
});
*/
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map