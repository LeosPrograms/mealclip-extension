// load font
var link = document.createElement('link');
link.href = "https://fonts.googleapis.com/css?family=Nunito:400,600";
link.rel = "stylesheet";
document.body.prepend(link);



// function saveRecipe(ingredients, instructions) {

	// // Default export is a4 paper, portrait, using milimeters for units
	// var doc = new jsPDF();

	// doc.setFont("helvetica");

	// doc.text(20, 20, 'Ingredients');
	// doc.text(20, 30, ingredients);

	// doc.text(120, 20, 'Instructions');
	// doc.text(120, 30, instructions);

	// // doc.text('Hello world!', 10, 10)
	// doc.save('recipe.pdf')
// };