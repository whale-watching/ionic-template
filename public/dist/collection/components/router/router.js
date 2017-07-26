var Router = (function () {
    function Router() {
        this.root = '';
        this.routeMatch = {};
        /*
        @Prop()
        navigateTo(url, data={}) {
          window.history.pushState(null, null, url);
          this.routeMatch = {
            url: '/' + url.replace(this.root, '')
          }
          console.log('Route match', this.routeMatch);
      
          console.log('Emitting event');
          Ionic.emit(this.$instance, 'ionRouterNavigation', { detail: this.routeMatch });
        }
      
        ionViewWillLoad() {
          console.log('<ion-router> loaded');
          window.addEventListener('popstate', this.handlePopState.bind(this));
          window.addEventListener('hashchange', this.handleHashChange.bind(this));
      
          const initialPath = window.location.pathname
          const withoutBase = initialPath.replace(this.root, '')
      
          this.routeMatch = {
            url: "/" + withoutBase
          }
          console.log('Route match', this.routeMatch);
        }
      
        handlePopState(e) {
          console.log('Pop state', e)
        }
      
        handleHashChange(e) {
          console.log('Hash change', e)
        }
      
        render() {
          console.log('<ion-router> rendering')
          return (
            <slot></slot>
          );
        }
        */
    }
    Object.defineProperty(Router.prototype, "match", {
        get: function () {
            return this.routeMatch;
        },
        enumerable: true,
        configurable: true
    });
    return Router;
}());
export { Router };
