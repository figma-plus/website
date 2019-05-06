import { TweenMax, TimelineMax } from 'gsap';

window.addEventListener('load', () => {
	new App();
});

class App {
	constructor() {
		this.os = navigator.platform;
		this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		this.handleOS();
		this.handleIsChrome();
		this.handleDisabledLinks();
		this.handleVersion();
		this.handlePageLoading();
		this.handleModal();
		this.handelVideo();
	}

	handleOS() {
		let osLabel = document.querySelector('.js-os');
		let downloadOrSoon = document.querySelector('.js-download-or-soon');
		let downloadLink = document.querySelector('.download-link');

		switch (this.os) {
			case 'MacIntel' || 'Mac68K' || 'MacPPC' || 'iPhone' || 'iPad':
				osLabel.innerHTML = 'Mac';
				downloadOrSoon.innerHTML = 'Download on';
				osLabel.parentElement.classList.add('is-mac');
				fetch('https://api.github.com/repos/figma-plus/installer/releases', { cache: 'no-cache' })
					.then(response => response.json())
					.then(releases => {
						downloadLink.href = releases[0].assets.find(asset =>
							asset.name.toLowerCase().includes('mac')
						).browser_download_url;
					});
				break;
			case 'Win32' || 'Win16' || 'Windows':
				osLabel.innerHTML = 'Windows';
				downloadOrSoon.innerHTML = 'Download on';
				osLabel.parentElement.classList.add('is-windows');
				fetch('https://api.github.com/repos/figma-plus/installer/releases', { cache: 'no-cache' })
					.then(response => response.json())
					.then(releases => {
						downloadLink.href = releases[0].assets.find(asset =>
							asset.name.toLowerCase().includes('windows')
						).browser_download_url;
					});
				break;
			case 'Linux':
				osLabel.innerHTML = 'Linux';
				downloadOrSoon.innerHTML = 'Coming soon to';
				osLabel.parentElement.classList.add('is-linux');
				break;
			default:
				break;
		}
	}

	handleIsChrome() {
		let chromeButton = document.querySelector('.is-chrome');
		if (!this.isChrome) chromeButton.style.display = 'none';
	}

	handleDisabledLinks() {
		let links = document.querySelectorAll('.is-disabled');

		links.forEach(el => {
			el.addEventListener('click', event => {
				event.preventDefault();
			});
		});
	}

	handleVersion() {
		let version = document.querySelector('.version');
		fetch('https://api.github.com/repos/figma-plus/figma-plus/releases', { cache: 'no-cache' })
			.then(response => response.json())
			.then(releases => {
				version.innerHTML = version.innerHTML.replace('v 1.0.0', 'v ' + releases[0].tag_name);
			});
	}

	handlePageLoading() {
		let masterTL = new TimelineMax({
			force3D: true,
			delay: 1,
			onStart: () => {
				document.body.style.pointerEvents = 'none';
			},
			onComplete: () => {
				document.body.style.pointerEvents = 'auto';
			}
		});

		let logos = document.querySelector('.c-logos'),
			figmaLogo = logos.children[0],
			divider = logos.children[1],
			panelLogo = logos.children[2],
			panelShot = document.querySelector('.c-shot'),
			content = document.querySelector('.l-text'),
			bg = document.querySelector('.bg'),
			body = document.body;

		masterTL
			.to(body, 0.2, { opacity: 1 })
			.from(figmaLogo, 1, { opacity: 0, x: -40 }, 's-logo')
			.from(divider, 1, { opacity: 0 }, 's-logo')
			.from(panelLogo, 1, { opacity: 0, x: 40 }, 's-logo')
			.from(logos, 0.5, { y: window.innerHeight / 2 - logos.clientHeight - 80, delay: 0.5 });

		masterTL
			.from(panelShot, 0.5, { opacity: 0, y: 40, scale: 0.95, transformOrigin: 'center bottom' }, 's-shot')
			.from(bg, 1, { opacity: 0, scale: 0.9, transformOrigin: 'center bottom' }, 's-shot');

		masterTL
			.staggerFrom(content.children, 0.5, { opacity: 0, y: 40 }, 0.1)
			.from(['header', 'footer'], 1, { opacity: 0 });
	}

	handleModal() {
		let modalsLinks = {
			team: {
				open: '[data-team]',
				node: '.team'
			},
			video: {
				open: '[data-video]',
				node: '.video-teaser'
			},
			guide: {
				open: '[data-guide]',
				node: '.installation-guide'
			}
		};

		let doodle = document.querySelector('css-doodle');

		Object.keys(modalsLinks).forEach(el => {
			let modalOpen = document.querySelector(modalsLinks[el].open),
				modalTarget = document.querySelector(modalsLinks[el].node),
				modalClose = modalTarget.querySelector('.modal-close');

			modalOpen.addEventListener('click', () => {
				doodle.style.display = 'none';
				modalTarget.classList.add('is-open');
				if (el === 'video') this.player.play();
			});

			modalClose.addEventListener('click', () => {
				doodle.style.display = 'block';
				modalTarget.classList.remove('is-open');
				if (el === 'video') this.player.stop();
			});
		});
	}

	handelVideo() {
		this.player = new Plyr('#player');
		this.player.on('ended', event => {
			let doodle = document.querySelector('css-doodle');
			let modalTarget = document.querySelector('.video-teaser');
			doodle.style.display = 'block';
			modalTarget.classList.remove('is-open');
		});
	}
}
