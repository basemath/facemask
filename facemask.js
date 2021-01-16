// this is running on an interval to pick up new content as it gets
// loaded via ajax for infinity scrolling, etc
// a more elegant solution would hook into events but that would also
// introduce complexity and this is working well enough so far
setInterval(() => {
    Array.from(getFeedItems()).forEach(item => {
        if (feedItemIsShared(item)) {
            item.style.opacity = '0.5';
            traverseElementsAndHideContent(item);
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

// the divs to hide in a shared post
// are only identified by the fact tha they are the latter
// divs in a group of sibling divs > 2, where the first 2
// are used to display the author, which we want to keep displayed
function traverseElementsAndHideContent(el) {
    const divs = [];
    for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if (child.tagName == 'DIV') {
            divs.push(child);
        }
    }
    // this is not the level we are looking for, keep recursing
    if (divs.length < 3) {
        for (let i = 0; i < divs.length; i++) {
            traverseElementsAndHideContent(divs[i]);
        }
    } else {
        // this is it, hide the content & comment divs
        for (let i = 2; i < divs.length; i++) {
            divs[i].style.display = 'none';
        }
    }
}