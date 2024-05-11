Data.Once("WhileDataLoading", async () => {
    await FAQ.Init();
});


class FAQ
{
    static #loaded = false;
    
    static async Init ()
    {
        if (this.#loaded) return;
        
        const content = document.querySelector("#faq");
        
        const response = await fetch("/data/faq.json");
        const data = await response.json();
        
        for (let i = 0; i < data.length; i++)
        {
            const question = document.createElement("strong");
            const answer = document.createElement("blockquote");
            
            question.classList.add("faq-question");
            question.append(data[i].question);
            
            answer.classList.add("faq-answer");
            answer.append(data[i].answer);
            
            content.append(question, answer);
        }
        
        this.#loaded = true;
    }
}