/**
 * Component Loader for Pokemon TCG Pocket Simulator
 * Loads HTML components dynamically into the main application
 */

export class ComponentLoader {
    constructor() {
        this.components = new Map();
    }

    /**
     * Load a component from a file
     * @param {string} componentPath - Path to the component file
     * @returns {Promise<string>} - HTML content of the component
     */
    async loadComponent(componentPath) {
        if (this.components.has(componentPath)) {
            return this.components.get(componentPath);
        }

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            const html = await response.text();
            this.components.set(componentPath, html);
            return html;
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            return `<div class="alert alert-danger">Failed to load component: ${componentPath}</div>`;
        }
    }

    /**
     * Load and inject a component into a DOM element
     * @param {string} componentPath - Path to the component file
     * @param {string} targetId - ID of the target DOM element
     */
    async loadComponentIntoElement(componentPath, targetId) {
        console.log(`Loading component: ${componentPath} into ${targetId}`);
        const html = await this.loadComponent(componentPath);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = html;
            console.log(`Successfully loaded ${componentPath} into ${targetId}`);
        } else {
            console.error(`Target element not found: ${targetId}`);
        }
    }

    /**
     * Load all components for the application
     */
    async loadAllComponents() {
        const componentMappings = [
            { path: './components/navigation.html', target: 'navigation-tabs' },
            { path: './components/pack-simulator.html', target: 'pack-simulator-content' },
            { path: './components/collection-simulator.html', target: 'collection-simulator-content' },
            { path: './components/specific-card.html', target: 'specific-card-content' },
            { path: './components/gold-calculator.html', target: 'gold-calculator-content' },
            { path: './components/evolve-simulator.html', target: 'evolve-simulator-content' }
        ];

        const loadPromises = componentMappings.map(mapping => 
            this.loadComponentIntoElement(mapping.path, mapping.target)
        );

        try {
            await Promise.all(loadPromises);
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }
}

// Create a global instance
window.componentLoader = new ComponentLoader();
