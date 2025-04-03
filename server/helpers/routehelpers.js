function isActiveRoute(route, currentRoute){
    return route === currentRoute ? 'active' : '' //for css
}
module.exports = {isActiveRoute}