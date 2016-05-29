/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

'use strict';

if(!getCookie("notification_cookie")) {
	if ('serviceWorker' in navigator) {
	  console.log('Service Worker is supported');
	  navigator.serviceWorker.register('serviceworker.js').then(function() {
		return navigator.serviceWorker.ready;
	  }).then(function(reg) {
		console.log('Service Worker is ready :^)', reg);
		reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
		  //console.log('endpoint:', sub.endpoint);
		  //console.log(sub);
		  var subscriptionId = getGcmRegistrationId(sub);
		  console.log(subscriptionId);
		  
		  $.ajax({
				 type: "POST",
				 url: "gcm.php",
				 data: { 
						register: "1",
						regid: subscriptionId
					 },
			  success: function(data){
				console.log(data);
				//Set cookie to accept and expire date to 1 year
				//setCookie(category_cookie, 1, 365);
				var d = new Date();
				d.setTime(d.getTime() + (365*24*60*60*1000));
				var expires = "expires="+d.toUTCString();
				document.cookie = "notification_cookie=1;" + expires + "; path=/";
			  }
		  });
		});
	  }).catch(function(error) {
		console.log('Service Worker error :^(', error);
	  });
	}
}

function getGcmRegistrationId(sub) {
  if (sub.subscriptionId) {
    return sub.subscriptionId;
  }

  var endpoint = 'https://android.googleapis.com/gcm/send/';
  var parts = sub.endpoint.split(endpoint);

  if(parts.length > 1)
  {
    return parts[1];
  }
} 

//Get cookie by name
function getCookie(name) {
	var nameEQ = name + "=";
	//alert(document.cookie);
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);
		if (c.indexOf(nameEQ) != -1)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}