$(document).ready(function(){
	 offline.init(function(){
		fetchData(function(list){
			display(list);
		});
	 });
	  
	if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
	self.addEventListener('install', function(event) {
    // Perform some task
	});
  })
  .catch(function(error) {
    console.log('Service worker registration failed, error:', error);
  });
}
});
function fetchData(done){
	if(offline.checkOfflineStatus()){
		offline.getAll(offline.constants.registerbook,
		function(res) {
           done(res);
        });
	}else{
	$.ajax({
		url:'http://localhost:8000/api/events',
		method: 'GET',
        dataType: 'JSON',
        success: function(res) {
           done(res);
        },
        error: function() {
           alert("error fetching data");
        }
	
	});
	}
}
function display(list){
	  var template = _.template($( "#reg-table" ).html());
	  $("#app-root").html(template({eventRecords:list}));
	  
		   saveOffline(list);
	  
}
 function saveOffline(eventRecords){
  	eventRecords.forEach(eventRecord =>{
  		offline.addData(offline.constants.registerbook,eventRecord,function(){
  			console.log("inserted"+eventRecord);
  		});
  	});
  }
  