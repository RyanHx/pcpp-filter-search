// ==UserScript==
// @name        PCPP Filters Search
// @namespace   Violentmonkey Scripts
// @include     /https:\/\/([a-z]+\.)?pcpartpicker.com\/products\//
// @include     /https:\/\/([a-z]+\.)?pcpartpicker.com\/builds\//
// @grant       none
// @version     1.0
// @author      RyanHx
// @description Easily search through items in PC Part Picker filter sidebar.
// ==/UserScript==

const listFilters = window.datafilters.filter(f => f.style == 'list' && !['Rating'].includes(f.heading));
const filterDefaults = []
for (const fdata of listFilters) {
    const listId = `${fdata.prefix}_set`;
    filterDefaults[listId] = [];
    const list = document.getElementById(listId);
    for (const filter of list.children) {
        // Save default shown filters for when search box is empty
        if (filter.style.display !== 'none') {
            filterDefaults[listId].push(filter);
        }
    }
    const searchForm = document.createElement("form");
    // Using existing search box styling from PCPP
    searchForm.innerHTML = `<label class="form-label xs-inline"><svg class="icon shape-search"><use xlink:href="#shape-search"></use></svg></label>
            <input type="text" class="text-input" placeholder="${fdata.heading}" id="${fdata.heading}_search">`; 
    const searchBox = list.insertAdjacentElement('beforebegin', searchForm);
    searchBox.addEventListener('input', (e) => {
        const list = e.currentTarget.nextSibling;
        const filterSearchInput = e.currentTarget.querySelector('input');
        if (filterSearchInput.value == '') {
            for (const filter of list.children) {
                if (filter.querySelector('a')) { // Reached 'Show more' button
                    continue;
                }
                if (filterDefaults[list.id].includes(filter) || filter.querySelector('input').checked) {
                    filter.style.display = '';
                } else {
                    filter.style.display = 'none';
                }
            }
            return;
        }
        for (const filter of list.children) {
            if (filter.querySelector('a')) { // Reached 'Show more' button
                continue;
            }
            if (filter.querySelector('label').textContent.toLowerCase().includes(filterSearchInput.value.toLowerCase())) {
                filter.style.display = '';
            } else {
                filter.style.display = 'none';
            }
        }
    })
}