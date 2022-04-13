const localStorageDB = require('localstoragedb')

function getDatabase(localStorage: any) {
    if (!localStorage) return;
    try {
        const DB = new localStorageDB("bobaNftifyDb", localStorage);
        return DB;
    } catch (error) {
        const DB = new localStorageDB("bobaNftifyDb", localStorage);
        // create the "books" table
        DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);
        return DB;

    }

}

function getFiles(DB: any) {
    try {
            // select all files
    return DB.queryAll("files");
    } catch (error) {
                   // create the "books" table
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


function insertFileEntry(DB: any, fileEntry: any) {
    // Check if the database was just created. Useful for initial database setup
if( DB.isNew() ) {

    // create the "books" table
	DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);

	// insert some data
	DB.insert("files", {name: fileEntry.name, size: fileEntry.size, modifiedDate: fileEntry.modifiedDate, mimeType: fileEntry.mime, link: fileEntry.link, cid: fileEntry.cid, minted: false});

	// commit the database to localStorage
	// all create/drop/insert/update/delete operations should be committed
	DB.commit();
} else {

    try {
    // insert some data
	DB.insert("files", {name: fileEntry.name, size: fileEntry.size, modifiedDate: fileEntry.modifiedDate, mimeType: fileEntry.mimeType, link: fileEntry.link, cid: fileEntry.cid, minted: false});

	// commit the database to localStorage
	// all create/drop/insert/update/delete operations should be committed
	DB.commit();   

    } catch (error) {

    // create the "books" table
	DB.createTable("files", ["name", "size", "modifiedDate", "mimeType", "link", "cid", "minted", "contractAddress", "tokenId", "accountAddress", "linkToken"]);

    // insert some data
	DB.insert("files", {name: fileEntry.name, size: fileEntry.size, modifiedDate: fileEntry.modifiedDate, mimeType: fileEntry.mimeType, link: fileEntry.link, cid: fileEntry.cid, minted: false});

	// commit the database to localStorage
	// all create/drop/insert/update/delete operations should be committed
	DB.commit();        
        
    }

}

}

export { getDatabase, getFiles, insertFileEntry, getFilesByName, getFilesByID };