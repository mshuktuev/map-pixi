import './style.css';
import { App } from './lib/App';

document.addEventListener('DOMContentLoaded', () => {
	const app = new App({
		imageUrl: './images/map.jpg',
		rootElement: '#app',
		maxZoom: 2,
	});
});
