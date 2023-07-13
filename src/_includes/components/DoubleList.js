const { html } = require("common-tags");

function DoubleList({ list1, list2 }) {
    console.log(list1);
  const makeArray = (list) => {
    return list.split(",").map(item => item.trim());
  };

  const arr1 = makeArray(list1);
  const arr2 = makeArray(list2);


  return html`
    <div class="benefits flex">
      <div class="benefits__first flow">
        <p><em>Ease:</em></p>
        <ul class="benefits__list">
          ${arr1.forEach(item => `<li>${item}</li>`)}
        </ul>
      </div>
      <div class="benefits__second flow">
        <p><em>Increase:</em></p>
        <ul class="benefits__list">
        ${arr2.forEach(item => `<li>${item}</li>`)}
        </ul>
      </div>
    </div>
  `;
}

module.exports = DoubleList;
