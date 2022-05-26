function FAQ ()
{
    ThrowError(1);
}

FAQ.load = function ()
{
    let request = new XMLHttpRequest();
    
    request.onload = () => {
        if (request.status < 400)
        {
            this.faqData = JSON.parse(request.responseText);
            this.setFaq();
        }
    };
    
    request.onerror = () => {
        ThrowError(3);
    };
    
    request.open("GET", "/data/faq.json");
    request.overrideMimeType("application/json");
    request.send();
};

FAQ.setFaq = function ()
{
    this.mainContent = document.querySelector("#faq");
    
    for (let i = 0; i < this.faqData.length; i++)
    {
        this.mainContent.innerHTML += `<h3 class="faq-question">${this.faqData[i].question}</h3><div class="faq-answer quote">${this.faqData[i].answer}</div>`;
    }
};