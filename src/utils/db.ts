const localStorageDB = require('localstoragedb')

function getDatabase(localStorage: any) {
    if (!localStorage) return;
    try {
        const DB = new localStorageDB("bobaNftifyDb", localStorage);
        return DB;
    } catch (error) {
        const DB = new localStorageDB("bobaNftifyDb", localStorage);
        // create the "files" table
        DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);
        return DB;

    }

}

function getFiles(DB: any) {
    try {
            // select all files
    return DB.queryAll("files");
    } catch (error) {
        // create the "files" table
        DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);
        return DB.queryAll("files");
    }

}

function getFilesByName(DB: any, filename: string) {
    // select all files
    return DB.queryAll("files", {query: {name: filename}});
}

function getFilesByID(DB: any, id: number) {
    // select all files
    return DB.queryAll("files", {query: {ID: id}});
}

function getFilesByAccountAddress(DB: any, address: string) {

    try {
    // select all files
    return DB.queryAll("files", {query: {accountAddress: address}});
    } catch (error) {
        // create the "files" table
        DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);
        return DB.queryAll("files", {query: {accountAddress: address}});
    }

}


function insertFileEntry(DB: any, fileEntry: any, accountAddress: string) {
    // Check if the database was just created. Useful for initial database setup
if( DB.isNew() ) {

    // create the "files" table
	DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);

	// insert some data
	DB.insert("files", {accountAddress: accountAddress, name: fileEntry.name, size: fileEntry.size, modifiedDate: fileEntry.modifiedDate, mimeType: fileEntry.mime, link: fileEntry.link, cid: fileEntry.cid, minted: false});

	// commit the database to localStorage
	// all create/drop/insert/update/delete operations should be committed
	DB.commit();
} else {

    try {
    // insert some data
	DB.insert("files", {accountAddress: accountAddress, name: fileEntry.name, size: fileEntry.size, modifiedDate: fileEntry.modifiedDate, mimeType: fileEntry.mimeType, link: fileEntry.link, cid: fileEntry.cid, minted: false});

	// commit the database to localStorage
	// all create/drop/insert/update/delete operations should be committed
	DB.commit();   

    } catch (error) {

    // create the "files" table
	DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);

    // insert some data
	DB.insert("files", {accountAddress: accountAddress, name: fileEntry.name, size: fileEntry.size, modifiedDate: fileEntry.modifiedDate, mimeType: fileEntry.mimeType, link: fileEntry.link, cid: fileEntry.cid, minted: false});

	// commit the database to localStorage
	// all create/drop/insert/update/delete operations should be committed
	DB.commit();        
        
    }

}

}

export { getDatabase, getFiles, insertFileEntry, getFilesByAccountAddress, getFilesByName, getFilesByID };