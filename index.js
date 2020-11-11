class Router {
    constructor(routes = [], config = {}) {
        this.config = config
        this.routes = routes

        location.replace('/#/')
        
        setTimeout(() => {
            window.addEventListener('hashchange', this.init.bind(this))
        }, 0)

        this.init()
    }

    init() {
        const hash = new URL(location.href).hash
        const [currentRoute] = this.routes.filter(route => route.path === hash.slice(1))
       
        if (currentRoute) {
            const component = currentRoute.component()
        
            component.mounted.call(component.methods)
        } else if (this.config['404']) {
            this.config['404'].call(this, hash)
        }
    }

    redirect(path) {
        location.replace(`/#${path}`)
    }
}

export default Router