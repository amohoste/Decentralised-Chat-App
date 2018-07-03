function build_url(object) {
    let url = object.base + '?endpoint=' + encodeURIComponent(object.endpoint) + '&query=' + encodeURIComponent(object.query);
    if (object.graph) {
        url += '&graph=' + encodeURIComponent(object.graph);
    }
    return url;
}

function get_base_url(url) {
    let index = 0;
    index = url.indexOf('?');
    if(index === -1){
        index = url.indexOf('#');
    }
    if(index !== -1){
        return url.substring(0, index);
    } else {
        return url;
    }
}

export default { build_url, get_base_url }
