window.samplePWA = typeof window.samplePWA === 'undefined' ? {} : window.samplePWA;
window.samplePWA.functions = typeof window.samplePWA.functions === 'undefined' ? {} : window.samplePWA.functions;

window.samplePWA.functions.startEnviroment = function startEnviroment() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js')
		.then(reg => console.log('SW: Registered. Scope: ', reg.scope))
		.catch(err => console.warn('SW: Error while registering. Error: ', err))
	}
	let pwa = true;
	if (pwa) {
		window.samplePWA.functions.PWAController();
	}
};
window.samplePWA.functions.PWAController = function PWAController() {
	let deferredPrompt;
	const userAgent = window.navigator.userAgent.toLowerCase();
	const ios = /iphone|ipod|ipad/.test(userAgent);
	window.addEventListener('beforeinstallprompt', (e) => {
		deferredPrompt = e;
		localStorage.setItem('event_fired', true);
	});
	setTimeout(() => {
		if (!deferredPrompt && localStorage.getItem('event_fired') == 'true' && !ios || window.matchMedia('(display-mode: standalone)').matches) {
			window.location.replace("https://staging.stationmd.com/zoom-token");
		} else {
			let html = document.createElement('div');
			html.innerHTML = `<img src="/stationMD/img/assets/logo.png" class="img-fluid" alt="Logo" style="max-height: 75px;">
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
			<img src="/stationMD/img/assets/play-store.png" class="small-img img-fluid margin-r-5" alt="get the mobile application by scanning the QR code">
			<img src="/stationMD/img/assets/app-store.png" class="small-img img-fluid" alt="get the mobile application by scanning the QR code">
			</div>
			</div>
			</div>
			</div>
			</div>`;
			document.body.innerHTML = '';
			document.body.appendChild(html);
			let installCard = document.body.querySelector('#pwa-card');
			let installMsg = document.body.querySelector('#pwa-message');
			let installBtn = document.body.querySelector('#pwa-install');
			const safari = /safari/.test(userAgent);
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
			installCard.style.display = 'block';
			installBtn.style.display = 'initial';
			installBtn.addEventListener('click', async () => {
				if (deferredPrompt !== null && deferredPrompt !== 'undefined') {
					deferredPrompt.prompt();
					const { outcome } = await deferredPrompt.userChoice;
					if (outcome === 'accepted') {
						console.log('navigator via deferredPrompt');
						window.location.replace("https://staging.stationmd.com/zoom-token");
						deferredPrompt = null;
						installMsg.innerHTML = 'Thank you for installing our pwa.';
						installBtn.remove(); 
					}
				}
			});
		}
	}, 2500);
};
(function () {
	window.samplePWA.functions.startEnviroment();
})();