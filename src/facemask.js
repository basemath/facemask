// this is running on an interval to pick up new content as it gets
// loaded via ajax for infinity scrolling, etc
// a more elegant solution would hook into events but that would also
// introduce complexity and this is working well enough so far
setInterval(() => {
    Array.from(getFeedItems()).forEach(item => {
        if (feedItemIsShared(item) && item.style.display !== 'none') {
            console.log(item)
            item.style.display = 'none';
        }
    });
}, 1000);

const body = document.getElementsByTagName('body')[0];

function getFeedItems() {
    return body.querySelectorAll('div[role="feed"] div[data-pagelet]');
}

// the simplist heuristic I could find to identify if a feed item is shared
// is that a shared item has two icons inside it indicating the level that it
// was shared at. One at the top beside the poster's name, and one below
// the content indicating the share level of the original author/page/user
function feedItemIsShared(item) {
    const ariaLabelElements = Array.from(item.querySelectorAll('*[aria-label]'));
    const sharedIcons = ariaLabelElements.filter(el => {
        return el.getAttribute('aria-label').toLowerCase().startsWith('shared with');
    });
    return sharedIcons.length > 1;
}