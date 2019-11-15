/**
 * 
 */var offline = offline||(function() {
	var constants = {
		depotList : 'depot_list',
		reg_db : 'mytoll_db',
		registerbook : 'registerbook',
		accounts:"accounts",
		functionSettings:"function_Settings",
		config:"config",
		db_version:1,
		offline_status:'offline_status',
		wcm:'web_content'
	};
	var db;
	var checkOfflineStatus=function(){return !navigator.onLine;};
	var init = function(done) {
		if (!('indexedDB' in window)) {
			console.log('This browser doesn\'t support IndexedDB');
			return;
		} else {
			var dbExists = true;
			var request = window.indexedDB.open(constants.reg_db, constants.db_version);
			request.onupgradeneeded = function(e) {
				db = e.target.result;
				console.log('running onupgradeneeded');
				debugger;
				
				if (!db.objectStoreNames.contains(constants.registerbook)) {
					var regOS = db.createObjectStore(constants.registerbook, {
						keyPath : '_id'
					});
					regOS.createIndex('title', 'title', {
						unique : false
					});
				}
				if (!db.objectStoreNames.contains(constants.config)) {
					var fsOS = db.createObjectStore(constants.config, {
						keyPath : 'db_versionId',
					});
					
					
				}
				
			}
			request.onsuccess = function(e) {
				db = e.target.result;
				console.log('DB complete');
				done();
			};
			request.onerror = function(e) {
				console.log('error');
				console.dir(e);
			};
		}
	}
	var addData = function(objectStoreName, data, done) {
		
		if (data) {
			var transaction = db.transaction([objectStoreName], 'readwrite');
			  var store = transaction.objectStore(objectStoreName);
			 var request = store.add(data);
					 request.onerror = function(e) {
					    console.log('Error', e.target.error.name);
					  };
					  request.onsuccess = function(e) {
						  done(e.target.result);
					  };
				}
	}
	var getDataById = function(objectStoreName, primaryKey, done) {
		if (primaryKey) {
			var transaction = db.transaction([objectStoreName], 'readonly');
			  var store = transaction.objectStore(objectStoreName);
		
			var request=store.get(primaryKey);
			 request.onerror = function(e) {
				    console.log('Error', e.target.error.name);
				  };
				  request.onsuccess = function(e) {
					  done(e.target.result);
				   // console.log('Woot! Did it');
				  };
		}
	}
	var getDataByIndex = function(objectStoreName, indexFilter,IndexRange,done) {
		if (indexFilter) {
			debugger;
			var transaction = db.transaction([objectStoreName], 'readonly');
			  var store = transaction.objectStore(objectStoreName);
			  var index = store.index(indexFilter);
			var request=index.getAll(IndexRange);
			 request.onerror = function(e) {
				    console.log('Error', e.target.error.name);
				  };
				  request.onsuccess = function(e) {
					  done(e.target.result);
				  };
		}
	}

	var getAll=function(objectStoreName,done){
		var a = [];
		var transaction = db.transaction([objectStoreName], 'readonly');
		  var store = transaction.objectStore(objectStoreName);
	
		var request=store.getAll();
		 request.onerror = function(e) {
			    console.log('Error', e.target.error.name);
			  };
			  request.onsuccess = function(e) {
				  done(e.target.result);
			  };
	}
	/*var searchAll=function(objectStoreName,query,done){
		var a = [];
		var objS = $.indexedDB(constants.mytoll_db).objectStore(
				objectStoreName);
		var promise = objS.each(function(item) {
			console.log(item);
			if(query(item.value)){
				a.push(item.value);
			}
		});
		promise.done(function(result, event) {
			debugger;
			console.log(a.length);
			done(a);
		});

		promise.fail(function(error, event) {

			console.log(error);
			console.log(event);
			return a;
		});
	}*/
	var updateData=function(objectStoreName,data,done){
		
		if (data) {
			var transaction = db.transaction([objectStoreName], 'readwrite');
			  var store = transaction.objectStore(objectStoreName);
			 var request = store.put(data);
			 debugger;
			 request.onerror = function(e) {
			    console.log('Error', e.target.error.name);
			  };
			  request.onsuccess = function(e) {
				  done(e.target.result);
			  };
		}
	}
	var deleteData=function(objectStoreName,primaryKey,done){
	
		if (primaryKey) {
			var transaction = db.transaction([objectStoreName], 'readwrite');
			  var store = transaction.objectStore(objectStoreName);
			
			 var request = store.delete(primaryKey);

			 request.onerror = function(e) {
			    console.log('Error', e.target.error.name);
			  };
			  request.onsuccess = function(e) {
				  done(e);
			  };
		}
	}
/*	var clearTable=function(objectStoreName){
		var objS = $.indexedDB(constants.mytoll_db).objectStore(
				objectStoreName);
	
			var promise=objS.clear();
			promise.done(function(result, event) {
				console.log(result);
				done(result);
			});

			promise.fail(function(error, event) {
				console.log(error);
				console.log(event);
				done();
			});
	
	}*/
	return {
		init : init,
		addData : addData,
		constants : constants,
		getDataByIndex : getDataByIndex,
		getDataById : getDataById,
		getAll:getAll,
		updateData:updateData,
		deleteData:deleteData,
		checkOfflineStatus:checkOfflineStatus
	}
})($);