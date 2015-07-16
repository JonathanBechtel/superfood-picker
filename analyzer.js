var state;

//master data object to hold the information for the program
var init = function() {
	state = {
		greens: [],
		desired: ["caffeine", "algaes", "probiotics"],
		forbidden: ["lecithin"],
		price: null,
		taste: {
			greens: null,
			sweetness: null,
			flavors: null
		},
		features: ["Organic", "NonGMO", "GlutenFree"],
		priority: []
	}
};

//Calculation Functions


//****To Determine Price Score ****//
var price = {
	difference: function(desiredPrice, productPrice) {
		return ((productPrice.pricePer30 - desiredPrice)/desiredPrice) * 100;
	},

	multiply: function(desiredPrice, productPrice) {
		if (state.priority[0] === "price") {
			return this.difference(desiredPrice, productPrice) * 1.5;
		}

		else if (state.priority[1] === "price") {
			return this.difference(desiredPrice, productPrice);
		}

		else {
			return this.difference(desiredPrice, productPrice) * 0.5;
		}
	},

	compare: function(desiredPrice, productPrice) {
		if (productPrice.pricePer30 <= desiredPrice) {
			return 100;
		}

		else if (100 - (this.multiply(desiredPrice, productPrice)) < 0 ) {
			return 0;
		}

		else {
			return  100 - (this.multiply(desiredPrice, productPrice));
		}
	},

	modify: function(desiredPrice, productPrice) {
		if (state.priority[0] === "price") {
			return this.compare(desiredPrice, productPrice) * 0.5;
		}

		else if (state.priority[1] === "price") {
			return this.compare(desiredPrice, productPrice) * 0.3;
		}

		else {
			return this.compare(desiredPrice, productPrice) * 0.2;
		}
	}

}

//****** To Determine Taste Score ******//

var taste = {
	preference: function(desiredTaste, productTaste) {
		if (desiredTaste === productTaste) {
			return 5;
		}

		else if (Math.abs(desiredTaste - productTaste) === 1) {
			return 4.5;
		}

		else if (Math.abs(desiredTaste - productTaste) === 2) {
			return 3.75;
		}

		else if (Math.abs(desiredTaste - productTaste) === 3) {
			return 2.5;
		}

		else {
			return 1;
		}
	},

	set: function(desiredTaste, productTaste) {
		if (desiredTaste === 1 || 2 || 4 || 5 ) {
			return this.preference(desiredTaste, productTaste);
		}

		else {
			return 5;
		}
	},

	flavors: function(desiredFlavor, productFlavor) {
		if (desiredFlavor === productFlavor || desiredFlavor === "Don't Care") {
			return 3;
		}
		else {
			return 1.5;
		}
	},

	total: function(desiredGreens, productGreens, desiredSweetness, productSweetness, desiredFlavors, productFlavors) {
		return ((this.set(desiredGreens, productGreens) + this.set(desiredSweetness, productSweetness) + this.flavors(desiredFlavors, productFlavors))/13) * 100;
	},

	modify: function(desiredGreens, productGreens, desiredSweetness, productSweetness, desiredFlavors, productFlavors) {
		if (state.priority[0] === "taste") {
			return this.total(desiredGreens, productGreens, desiredSweetness, productSweetness, desiredFlavors, productFlavors) * 0.5;
		}

		else if (state.priority[1] === "taste") {
			return this.total(desiredGreens, productGreens, desiredSweetness, productSweetness, desiredFlavors, productFlavors) * 0.3;
		}

		else {
			return this.total(desiredGreens, productGreens, desiredSweetness, productSweetness, desiredFlavors, productFlavors) * 0.2;
		}
	}
}

//*******To Determine Nutrient Score******

var nutrients = {
	organic: function(product) {
		if (product.features[0] === "organic" || product.features[8] === "wild crafted") {
			return 10;
		}

		else {
			return 0;
		}
	},

	filler: function(product) {
		var overage = product.filler - 0.10;

		if (product.filler <= 0.10) {
			return 30;
		}

		else if (overage > 0.3) {
			return 0;
		}

		else {
			return 30 - (overage*100);
		}
	},

	composition: function(product) {
		var counter = 0;
		for (var i = 4; i < 12; i++ ) {
			if (product.ingredients[i] !== false) {
				counter++;
			}
		}

		return ((counter++/8)*100)*0.6;
	},

	internal: function(product) {
		return this.organic(product) + this.filler(product) + this.composition(product);
	},

	precision: {

		match: function(array1, array2) {
			counter = 0;
			if (array1.length > 0) {
				for (var i = 0; i < array1.length; i++) {
					for (var j = 0; j < array2.length; j++) {
						if (array1[i] === array2[j]) {
							counter++;
						}
					}
				}

				if (array1 === state.forbidden) {
					return array1.length - counter;
				}

				else {
					return counter;
				}
			}

			else {
				return 0;
			}
		},

		score: function(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product) {
			var numerator = this.match(desiredFeatures, productFeatures) + this.match(desiredIngredients, productIngredients) + this.match(forbiddenIngredients, productIngredients);
			var denominator = desiredFeatures.length + desiredIngredients.length + forbiddenIngredients.length;

			if (denominator > 0) {
				return (numerator/denominator) * 100;
			}

			else {
				return nutrients.internal(product);
			}

		}
	},

	blend: function(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product) {
		var internal = this.internal(product);
		var external = this.precision.score(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product);

		return (internal + external)/2;
	},

	modify: function(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product) {
		if (state.priority[0] === "nutrients") {
			return this.blend(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product) * 0.5;
		}

		else if (state.priority[1] === "nutrients") {
			return this.blend(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product) * 0.3;
		}

		else {
			return this.blend(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product) * 0.2;
		}
	}
}

var total = {
	score: function(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product, desiredGreens, productGreens, desiredSweetness, productSweetness, desiredFlavors, productFlavors, desiredPrice) {
		return nutrients.modify(desiredFeatures, productFeatures, desiredIngredients, productIngredients, forbiddenIngredients, product) + taste.modify(desiredGreens, productGreens, desiredSweetness, productSweetness, desiredFlavors, productFlavors) + price.modify(desiredPrice, product);
	},

	loop: function() {
		for (var i = 0; i < state.greens.length; i++) {
			state.greens[i].score = this.score(state.features, state.greens[i].features, state.desired, state.greens[i].ingredients, state.forbidden, state.greens[i], state.taste.greens, state.greens[i].taste.greens, state.taste.sweetness, state.greens[i].taste.sweetness, state.taste.flavors, state.greens[i].taste.flavors, state.price);
		}
	},

	reset: function() {
		for (var i = 0; i < state.greens.length; i++) {
			state.greens[i].score = null;
		}
	}
}

//******Storage Functions ******//
var storage = {
	pack: function(name, price, oz, number, filler, total, lecithin, fiber, vitamins, caffeine, grasses, algaes, seaVegetables, fruits, probiotics, enzymes, mushrooms, herbs, greensTaste, sweetness, flavors, organic, nonGMO, glutenFree, soyFree, dairyFree, vegan, paleo, kosher, wildCrafted, img, link, website, review, label) {
		var greensPowder = {
			name: name,
			pricePer30: price,
			pricePerOz: oz,
			numberIngredients: number,
			filler: filler,
			total: total,
			ingredients: [lecithin, fiber, vitamins, caffeine, grasses, algaes, seaVegetables, fruits, probiotics, enzymes, mushrooms, herbs],
			taste: {
				greens: greensTaste,
				sweetness: sweetness,
				flavors: flavors
			},
			features: [organic, nonGMO, glutenFree, soyFree, dairyFree, vegan, paleo, kosher, wildCrafted],
			img: img,
			link: link,
			website: website,
			review: review,
			label: label,
			score: null
			}

			state.greens.push(greensPowder);
	},

	set: function(price, greens, sweetness, flavors, nutrients, cost, taste) {
		state.price = price;
		state.taste.greens = greens;
		state.taste.sweetness = sweetness;
		state.taste.flavors = flavors;

		state.priority.push(nutrients, cost, taste);
	}
}

var compare = {
	score: function(a, b) {
		if (a.score > b.score) {
			return -1;
		}

		if (a.score < b.score) {
			return 1;
		}

		return 0;
	},

	name: function(a, b) {
		if (a.name < b.name) {
			return -1;
		}

		if (a.name > b.name) {
			return 1;
		}

		return 0;
	}
}

var shuffle = function(array) {

	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

//calling functions to load the program
init();
storage.pack("Amazing Grass", 19.99, 2.35, 26, 0.1335, 8.47, false, "fiber", "vitamins", "caffeine", "grasses", "algaes", false, "fruits", "probiotics", "enzymes", false, false, 1, 2, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/amg_grass_bottle.jpg", "http://www.amazon.com/gp/product/B00112ILZM/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00112ILZM&linkCode=as2&tag=webdevelopm00-20&linkId=BZ5FZIKBYEFNNEWD", "http://www.amazinggrass.com", "http://blog.healthkismet.com/amazing-grass-green-superfood-review", "http://www.healthkismet.com/img/superfood-picker/amg_grass_label.jpg");
storage.pack("Vitamineral Green", 44.95, 4.28, 38, 0, 10.58, false, false, false, false, "grasses", "algaes", "sea vegetables", "fruits", "probiotics", "enzymes", false, "herbs", 2, 2, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, "WildCrafted", "http://www.healthkismet.com/img/superfood-picker/vg_bottle.jpg", false, "www.healthforce.com", "http://blog.healthkismet.com/vitamineral-green-review-price-taste-value", "http://www.healthkismet.com/img/superfood-picker/vg_label.jpg");
storage.pack("Macro Greens", 28.84, 2.88, 38, 27.25, 10, "lecithin", "fiber", false, "caffeine", "grasses", "algaes", "sea vegetables", "fruits", "probiotics", "enzymes", false, "herbs", 4, 4, false, false, "NonGMO", "GlutenFree", false, "DairyFree", "Vegan", false, false, false, "http://www.healthkismet.com/img/superfood-picker/macro_greens_bottle.jpg", "http://www.amazon.com/gp/product/B000F4H5UO/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B000F4H5UO&linkCode=as2&tag=webdevelopm00-20&linkId=VYGP2H6ZCGTPD57B", "http://macrolifenaturals.com/macro-greens-superfood/", "http://blog.healthkismet.com/macro-greens-review", "http://www.healthkismet.com/img/superfood-picker/macro_greens_label.jpg");
storage.pack("All Day Energy Greens", 39.99, 4.26, 41, 25, 11.36, "lecithin", "fiber", false, false, "grasses", "algaes", "sea vegetables", "fruits", false, "enzymes", false, "herbs", 4, 4, true, false, false, false, false, "DairyFree", "Vegan", false, false, false, "http://www.healthkismet.com/img/superfood-picker/adeg_bottle.jpg", "http://amzn.to/1TrmeWt", "http://www.ivlproducts.com/Superfoods/All-Day-Energy-Greens-174---Original---Hi-Octane-Energy-Drink-For-Health-Life.axd", "http://blog.healthkismet.com/all-day-energy-greens-review", "http://www.healthkismet.com/img/superfood-picker/adeg_label.PNG");
storage.pack("Green Vibrance", 37.96, 2.97, 77, 25, 12.8, "lecithin", "fiber", "vitamins", false, "grasses", "algaes", "sea vegetables", "fruits", "probiotics", "enzymes", false, "herbs", 2, 2, false, false, "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/greenvibrance_bottle.jpg", "http://amzn.to/1RpyLMr", "http://www.vibranthealth.com/green-vibrance/product-pages/green-vibrance/", "http://blog.healthkismet.com/green-vibrance-review", "http://www.healthkismet.com/img/superfood-picker/greenvibrance_label.jpg");
storage.pack("Pure Synergy", 54.95, 4.40.toFixed(2), 64, 0, 12.5, false, false, false, false, "grasses", "algaes", "sea vegetables", "fruits", "probiotics", "enzymes", "mushrooms", "herbs", 3, 2, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/pure_synergy_bottle.jpg", "http://amzn.to/1JYpUxd", "http://www.thesynergycompany.com/pure-synergy.html", "http://blog.healthkismet.com/pure-synergy-review-a-very-robust-superfood-powder", "http://www.healthkismet.com/img/superfood-picker/pure_synergy_label.PNG");
storage.pack("Barleans Greens", 30.45, 3.60, 33, 0.1747, 8.46, false, "fiber", false, false, "grasses", "algaes", "sea vegetables", "fruits", "probiotics", "enzymes", false, "herbs", 1, 4, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/barleans_bottle.jpg", "http://amzn.to/1Mocisy", "https://www.barleans.com/greens.asp", "http://blog.healthkismet.com/superfood-smackdown-essential-greens-vs-gogreens-vs-barleans", "http://www.healthkismet.com/img/superfood-picker/barleans_label.jpg");
storage.pack("Boku Superfuel", 55.95, 5.28, 10, 0, 10.6, false, false, false, "caffeine", false, false, "sea vegetables", "fruits", false, false, "mushrooms", "herbs", 4, 4, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/boku_bottle.png", false, "http://bokusuperfood.com/product/super-fuel/", "http://blog.healthkismet.com/boku-superfuel-review", "http://www.healthkismet.com/img/superfood-picker/boku_label.PNG");
storage.pack("Garden of Life Perfect Food RAW", 23.65, 2.93, 34, 0, 8.46, false, false, false, false, "grasses", false, false, "fruits", "probiotics", "enzymes", false, false, 2, 2, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/perfectfood_bottle.jpg", "http://amzn.to/1CysV4K", "http://www.gardenoflife.com/Products-for-Life/Foundational-Nutrition/Perfect-Food-RAW.aspx", "http://blog.healthkismet.com/review-garden-of-life-perfect-food-raw", "http://www.healthkismet.com/img/superfood-picker/perfectfood_label.jpg");
storage.pack("Greens Plus Original Superfood", 21.30, 2.52, 21, 0, 8.46, false, false, false, false, "grasses", "algaes", "sea vegetables", "fruits", "probiotics", false, false, false, 2, 3, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/greensplus_bottle.jpg", "http://amzn.to/1TtGmHq", "http://www.greensplus.com/organic-superfood-raw/", "http://blog.healthkismet.com/greens-plus-superfood-the-redwood-oak-of-superfood-powders", "http://www.healthkismet.com/img/superfood-picker/greensplus_label.jpg");
storage.pack("Vitamineral Earth", 44.95, 4.28, 32, 0, 10.58, false, "fiber", false, "caffeine", false, false, false, false, false, false, false, "herbs", 3, 3, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, false, "http://www.healthkismet.com/img/superfood-picker/vearth_bottle.jpg", false, "https://healthforce.com/superfoods-rejuvenation/earth", "http://blog.healthkismet.com/vitamineral-earth-review", "http://www.healthkismet.com/img/superfood-picker/vearth_label.jpg");
storage.pack("Dr. Schulze's Superfood Plus", 40.00.toFixed(2), 2.86, 15, 0, 14, false, false, "vitamins", false, "grasses", "algaes", "sea vegetables", "fruits", false, false, false, "herbs", 2, 1, false, "Organic", "NonGMO", "GlutenFree", "SoyFree", "DairyFree", "Vegan", "Paleo", false, "WildCrafted", "http://www.healthkismet.com/img/superfood-picker/schulze_bottle.jpg", "http://amzn.to/1SgXr4X", "https://www.herbdoc.com/superfood-plus-powder.html?___SID=U", "http://blog.healthkismet.com/dr-schulze-superfood-plus-review", "http://www.healthkismet.com/img/superfood-picker/schulze_label.jpg");
storage.set(60, 4, 4, false, "nutrients", "price", "taste");
state.greens.sort(compare.name);
$(function() { display.compare(); });
