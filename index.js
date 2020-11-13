class Router {
    constructor(routes = [], config = {}) {
        this.config = config
        this.routes = routes
        this.container = document.querySelector('[data-router=view]')
        
        location.replace('/#/')
        
        setTimeout(() => {
            window.addEventListener('hashchange', this.init.bind(this), false)
            document.addEventListener('click', this.callLink.bind(this), false)
        }, 0)

        this.init()
    }

    init() {
        const route = new URL(location.href).hash.slice(1)
        const [currentRoute] = this.routes.filter(currentRoute => currentRoute.path === route)

        if (currentRoute) {
            this.callRoute(currentRoute)
        } else if (this.config['404']) {
            this.config['404'].call(this, route)
        }
    }

    redirect(path) {
        location.replace(`/#${path}`)
    }

    callLink(e) {
        const path = e.target.dataset.routerLink

        if (path) {
            history.pushState({ path }, '', `/#${path}`)
        }
    }

    callRoute(currentRoute) {
        if (this.config.before) {
            this.config.before.call(this, currentRoute.path, () => {
                this.callComponent(currentRoute.component())
            })
        } else {
            this.callComponent(currentRoute.component())
        }
    }

    callComponent(component) {
        if (component.mounted) {
            component.mounted.call(component.methods)
        }

        if (component.template) {
            if (this.container) {
                this.container.innerHTML = component.template()
            } else {
                throw new Error('router view container is not define [<div data-router="view"></div>]')
            }
        }
    }
}

export default Router