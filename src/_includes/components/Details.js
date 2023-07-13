const {html} = require('common-tags');

function Details({name, location, work}) {
    console.log(name, location, work);
    return html`
        <figcaption>${name}, <span>${location}</span>
        <span>${work}</span>
        </figcaption>
        `;
}

module.exports = Details;