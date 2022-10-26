window.stationMD = typeof window.stationMD === 'undefined' ? {} : window.stationMD;
window.stationMD.functions = typeof window.stationMD.functions === 'undefined' ? {} : window.stationMD.functions;

window.stationMD.functions.startEnviroment = function startEnviroment() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/stationMD/sw.js')
		.then(reg => console.log('SW: Registered. Scope: ', reg.scope))
		.catch(err => console.warn('SW: Error while registering. Error: ', err));
	}
	let pwa = true;
	if (pwa) {
		window.stationMD.functions.PWAController();
	}
};
window.stationMD.functions.PWAController = function PWAController() {
	let deferredPrompt;
	const userAgent = window.navigator.userAgent.toLowerCase();
	const ios = /iphone|ipod|ipad/.test(userAgent);
	const android = /android/.test(userAgent);
	const safari = /safari/.test(userAgent);
	const firefoxBrowser = /firefox/.test(userAgent);
	const operaBrowser = /opera|opr\//.test(userAgent);
	const safariBrowser = typeof window.GestureEvent === "function";
	const macOS = /(macintosh|macintel|macppc|mac68k|macos)/.test(userAgent);
	const edgeBrowser = /edg\//.test(userAgent);
	window.addEventListener('beforeinstallprompt', (e) => {
		console.log('deferredPrompt assigned with value ' + e);
		deferredPrompt = e;
		localStorage.setItem('event_fired', true);
	});
	setTimeout(() => {
		if (!deferredPrompt && localStorage.getItem('event_fired') == 'true' && !ios || window.matchMedia('(display-mode: standalone)').matches || ios || firefoxBrowser || operaBrowser || safariBrowser) {
			window.location.replace("https://connect.stationmd.com/zoom-token");
		} else {
			let container = document.getElementById('container');
			let html = document.createElement('div');
			html.innerHTML = `<img src="/stationMD/img/assets/logo.png" class="img-fluid items-header" alt="StationMD Logo">
			<div class="container">
			<div class="row">
			<div class="column-0">
			<div class="row">
			<div class="item" id="pwa-card">
			<img src="/stationMD/img/assets/browsers.png" class="big-img img-fluid" alt="Chrome Logo">
			<h2> StationMD Desktop / Laptop Application</h2>
			<p id="pwa-message">To install this application on to your desktop or laptop device, simply click on the <br><strong> ADD TO HOME SCREEN </strong> button below and then click <strong>Install</strong>.</p>
			<button class="pwa-btn install-btn" id="pwa-install">ADD TO HOME SCREEN</button>
			</div>
			<div class="item-divider"></div>
			<div class="item">
			<img src="/stationMD/img/assets/qr.png" class="big-img img-fluid" alt="QR Code">
			<h2>StationMD Mobile Application</h2>
			<p>Open the built-in camera app. Point the camera at the QR code. Tap the banner that appears on your Android or iOS device. Follow the instructions on the screen to finish installation.</p>
			<a href="https://play.google.com/store/apps/details?id=com.stationmd.stationmd&gl=US"><img src="/stationMD/img/assets/play-store.png" class="small-img img-fluid margin-r-5" alt="get the mobile application by scanning the QR code"></a>
			<a href="https://apps.apple.com/us/app/stationmd/id1476404286"><img src="/stationMD/img/assets/app-store.png" class="small-img img-fluid" alt="get the mobile application by scanning the QR code"></a>
			</div>
			</div>
			</div>
			</div>
			</div>`;
			container.innerHTML = '';
			container.appendChild(html);
			let pwaFooter = document.body.querySelector('#pwa-footer');
			let installCard = document.body.querySelector('#pwa-card');
			let installMsg = document.body.querySelector('#pwa-message');
			let installBtn = document.body.querySelector('#pwa-install');
			if (installBtn) {
				if (ios) {
					if (safari) {
						installCard.style.display = 'block';
						installBtn.style.display = 'initial';
						installMsg.innerHTML = 'To install this pwa on your iphone click <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 640 640"><path fill="currentColor" d="M128 320c0-35.2 28.8-64 64-64h256c35.2 0 64 28.8 64 64v256c0 35.2-28.8 64-64 64h-256c-35.2 0-64-28.8-64-64v-256zM192 320v256h256v-256h-64v-64h-128v64h-64zM288 122.56v389.44h64v-389.44l98.24 98.24 45.44-45.12-175.68-175.68-176 176 45.44 44.8 98.56-97.92z"></path></svg> on safari and choose to add it to the home screen.';
						installBtn.remove();
					} else {
						installCard.style.display = 'block';
						installBtn.style.display = 'initial';
						installMsg.innerHTML = 'Sorry but iphone only supports progressive web apps inside safari browser.';
						installBtn.remove();
					}
				} else {
					installMsg.innerHTML = 'To install this application on to your desktop or laptop device, simply click on the <br><strong> ADD TO HOME SCREEN </strong> button below and then click <strong>Install</strong>.</p>';
				}
			}
			pwaFooter.style.display = 'block';
			installCard.style.display = 'block';
			installBtn.style.display = 'initial';
			installBtn.addEventListener('click', async () => {
				console.log('deferredPrompt not passed ' + deferredPrompt);

				if (deferredPrompt != null && deferredPrompt != 'undefined') {
					console.log('deferredPrompt detected ' + deferredPrompt);
					deferredPrompt.prompt();
					const { outcome } = await deferredPrompt.userChoice;
					if (outcome == 'accepted') {
						if (!android || !ios) {
							if (!edgeBrowser) {
								console.log('no edge');
								window.location.replace("https://connect.stationmd.com/zoom-token");
							} else if (macOS) {
								console.log('mac detected');
								window.location.replace("https://connect.stationmd.com/zoom-token");
							}
							deferredPrompt = null;
							installMsg.innerHTML = 'Thank you for installing our pwa.';
							installBtn.remove();
						} else if (android) {
							console.log('android');
							window.location.replace("https://play.google.com/store/apps/details?id=com.stationmd.stationmd&gl=US");
						} else {
							window.location.replace('https://apps.apple.com/us/app/stationmd/id1476404286');
						}
					}
				}
			});
		}
	}, 3000);
};
(function () {
	window.stationMD.functions.startEnviroment();
})();
