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
        let question = document.createElement("h3");
        let answer = document.createElement("div");
        
        question.classList.add("faq-question");
        question.innerHTML = this.faqData[i].question;
        
        answer.classList.add("faq-answer", "quote");
        answer.innerHTML = this.faqData[i].answer;
        
        this.mainContent.append(question, answer);
    }
};