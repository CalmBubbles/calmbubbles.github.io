Data.addEventListener("WhileDataLoading", () => {
    FAQ.Set();
});


class FAQ
{
    static #mainContent = null;
    static #loaded = false;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static Set ()
    {
        this.#mainContent = document.querySelector("#faq");
        
        let request = new XMLHttpRequest();
        
        request.onload = () => {
            if (request.status < 400)
            {
                data.faq = JSON.parse(request.responseText);
                this.setFAQ();
            }
        };
        
        request.onerror = () => { ThrowError(2); };
        
        request.open("GET", "/data/faq.json");
        request.overrideMimeType("application/json");
        request.send();
    }
    
    static setFAQ ()
    {
        for (let i = 0; i < data.faq.length; i++)
        {
            let question = document.createElement("h3");
            let answer = document.createElement("div");
            
            question.classList.add("faq-question");
            question.append(data.faq[i].question);
            
            answer.classList.add("faq-answer", "quote");
            answer.append(data.faq[i].answer);
            
            this.#mainContent.append(question, answer);
        }
        
        this.#loaded = true;
    }
}