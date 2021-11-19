const paragraphs = document.getElementsByTagName('p');

console.log("parrafos en el documento: ",paragraphs);

if(paragraphs.length>0){
let paragraph = paragraphs[0];
paragraph.innerText = "Welcome!";
}