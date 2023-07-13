const handleSubmit = (event) => {
  event.preventDefault();

  const myForm = event.target;
  const formData = new FormData(myForm);
  const messageContainer = document.querySelector(".contact-submit-message");
  const messageSuccess = `<p>Thank you for your message. I'll get back to you as soon as possible.</p>`;
  const messageFail = `<p>Sorry, there was a problem submitting your message. Please try again.</p>`;
  
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => console.log("Form successfully submitted"))
    .then(() => {
      myForm.reset();
      messageContainer.innerHTML = messageSuccess;
      messageContainer.classList.add("contact-submit-message--reveal");
    })
    .catch((error) => {
      messageContainer.innerHTML = messageFail;
      messageContainer.classList.add("contact-submit-message--reveal");
      console.log(error);
    });
};

document
  .getElementById("formContact")
  .addEventListener("submit", handleSubmit);