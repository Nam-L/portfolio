import { projects, showreel } from '../../data/projects.js';
import { initTheme, initNav } from './ui.js';
import { initProjects, initShowreel } from './projects.js';
import { initContactForm } from './contact.js';

initTheme();
initNav();
initShowreel(showreel);
initProjects(projects);
initContactForm();
