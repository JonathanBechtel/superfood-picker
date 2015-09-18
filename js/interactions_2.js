//**object that stores methods for dynamically generating output based on data in the 'state' object in analyzer.js **//

var display = {

    //**returns string based on price difference between product and user input**//
	difference: function(a) {
		return Math.abs(state.price - state.greens[a].pricePer30);
	},

	aboveBelow: function(num) {
		if ((state.greens[num].pricePer30 - state.price) >= 0) {
			return "above";
		}

		else {
			return "below";
		}
	},
	
	//**generates string to be placed into '.info' css class in index.html describing product characteristics**//
	info: function(x) {
		if (state.greens[x].score !== null) {
			$(".info").html("<p>Best Price: $" + state.greens[x].pricePer30 + ", $" + this.difference(x).toFixed(2) + " " + this.aboveBelow(x) + " your target price of $" + state.price + " for a 30 day supply.</p><p>Contains " + this.contains(x) + "</p><p>Taste is " + this.taste.grassy(x) + " and " + this.taste.sweetness(x) + ". </p><p>" + this.flavors(x) +" flavors added to it.</p>");
		}
		
		else {
			$(".info").html("<p>Best Price: $" + state.greens[x].pricePer30 + ".</p><p>Contains " + this.contains(x) + "</p><p>Taste is " + this.taste.grassy(x) + " and " + this.taste.sweetness(x) + ". </p><p>" + this.flavors(x) +" flavors added to it.</p>");
		}
	},

	//** generates string that lists all ingredients in state.greens[x].ingredients that's a grammatically correct sentence **//
	contains: function(num) {
		var output = "";
		var ing = [];

		for (var i = 0; i < state.greens[num].ingredients.length; i++) {
			if (state.greens[num].ingredients[i] !== false) {
				ing.push(state.greens[num].ingredients[i]);
			}
		}

		for (var i = 0; i < ing.length - 1; i++) {
				output += "" + ing[i] + ', ';
		}

		if (ing.length > 2) {
			return output.slice(0, -2) + " and " + ing[ing.length - 1] + ".";
		}

		else if (ing.length === 2) {
			return ing[0] + " and " + ing[1] + ".";
		}

		else {
			return ing[0] + ".";
		}
	},

	//** matches string that describes a product flavor with flavor characteristics stored in state.greens[x].taste object - has two methods: grassy and sweetness. **//
	taste: {
		grassy: function(num) {
			var grass_strings = ["very grassy", "moderately grassy", "neutral", "moderately non-grassy (for a greens powder)", "not grassy at all (for a greens powder)"];
			var i = 0;
			for (i = 0; i < grass_strings.length; i++) {
				if(state.greens[num].taste.greens === i + 1)
					return grass_strings[i];
					}
				},

		sweetness: function(num) {
			var sweet_strings = ["not sweet at all", "not sweet, but not too bitter", "has sweet ingredients, but is not sweet in general", "pretty sweet", "very sweet"];
			var i = 0;

			for(i = 0; i < sweet_strings.length; i++) {
				if(state.greens[num].taste.sweetness === i + 1)
					return sweet_strings[i];
				}
			}
		},

	//** generates html buttons with links to product reviews, amazon page and company website that are stored in state.greens[x] **//	
	buttons: function(num) {
		$(".button-class").html("<div class='text-center'><ul class='list-inline'><li><a class='link-btn-success' href='" + state.greens[num].website + "' target='_blank'>Company Website</a></li> <li><button class='btn btn-success' data-toggle='modal' data-target='#myModal'>View the Label</button></li></ul></div>");
		if (state.greens[num].link !== false) {
			$(".button-class ul").append("<li><a class='link-btn-success' href='" + state.greens[num].link + "' rel='nofollow' target='_blank'>Get It On Amazon</a></li>");
		}

		if (state.greens[num].review !== false) {
			$(".button-class ul").append("<li><a class='link-btn-success' href='" + state.greens[num].review + "' target='_blank'>Read The Review</a></li>");
		}
	},

	//**returns string based on presence of flavors of product, used in display.info **//
	flavors: function(num) {
		if (state.greens[num].taste.flavors === true) {
			return "Has";
		}

		else {
			return "Doesn't have";
		}
	},

	scroll: function() {
		$("a[href='#top']").click(function() {
			$("html, body").animate({scrollTop: 0 }, "slow");
			return false;
		});
	},

	//** generates an html table that lists various product qualities.  Inserted into #tableinfo in index.html **//
	table: function(num) {
		$("#tableInfo > tbody").append("<tr><td> " + state.greens[num].numberIngredients + "</td><td> " + state.greens[num].total + " oz </td><td> $" + state.greens[num].pricePerOz + " </td></tr>");
	},

	//** generates icons based on product characteristics stored in state.greens[x].features **//
	icons: function(num) {
		var pics = {
			Organic: "http://www.healthkismet.com/img/picker/Organic.png",
			Vegan: "http://www.healthkismet.com/img/picker/vegan.png",
			Paleo: "http://www.healthkismet.com/img/picker/Paleo.png",
			WildCrafted: "http://www.healthkismet.com/img/picker/wildcrafted.png",
			DairyFree: "http://www.healthkismet.com/img/picker/Dairy.png",
			NonGMO: "http://www.healthkismet.com/img/picker/GMO.png",
			GlutenFree: "http://www.healthkismet.com/img/picker/Gluten.png",
			Kosher: "http://www.healthkismet.com/img/picker/Kosher.png",
			SoyFree: "http://www.healthkismet.com/img/picker/Soy.png"
		}

		for (var j = 0; j < state.greens[num].features.length; j++) {
			if (state.greens[num].features[j] !== false) {
				$(".icons ul").append("<li><img src=" + pics[state.greens[num].features[j]] + "></img></li>");
			}
		}
	},

	//**removes icons generated in display.icons - useful when regenerating page **//
	iconsNoRepeat: function() {
		$(".icons ul li").remove();
	},

	//** generates html to display product score or nutrient score, depending on whether or not the latter exists **//
	title: function(num) {
		if (state.greens[num].score === null) {
			$(".chart-title").html("<h3 class ='text-center'>Nutrient Score: " + nutrients.internal(state.greens[num]).toFixed(0) + "%</h3>");
		}

		else {
			$(".chart-title").html("<h3>Match Score: " + state.greens[num].score.toFixed(0) + "%</h3>");
			$(".chart-info").html("<h4>Components: </h4><p><strong>Nutrients:</strong> " + nutrients.blend(state.features, state.greens[num].features, state.desired, state.greens[num].ingredients, state.forbidden, state.greens[num]).toFixed(0) + "%,    <strong>  Price:</strong> " + price.compare(state.price, state.greens[num]).toFixed(0) + "%,      <strong>Taste: </strong>" + taste.total(state.taste.greens, state.greens[num].taste.greens, state.taste.sweetness, state.greens[num].taste.sweetness, state.taste.flavors, state.greens[num].taste.flavors).toFixed(0) + "%</p>");
		}
	},

	//** generates the html and algorithm for displaying products in the 'you might also consider' section at bottom of page **//
	related: function(num) {
		var random = [];

		for (var i = 0; i < state.greens.length; i++) {
			if (i !== num) {
				random.push(i);
			}
		}

		shuffle(random);

		var a = random.pop();
		var b = random.pop();
		var c = random.pop();

		if (state.greens[num].score !== null) {

			$(".runner-up").off("click");
			$(".runner-up-2").off("click");
			$(".runner-up-3").off("click");

			if (num === 0) {
				$(".runner-up").html("<div class='text-center'><h4> " + state.greens[1].name + " </h4><img class='img img-rounded' src=" + state.greens[1].img + "></img><p>Match: " + state.greens[1].score.toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");
				$(".runner-up-2").html("<div class='text-center'><h4> " + state.greens[2].name + " </h4><img class='img img-rounded' src=" + state.greens[2].img + "></img><p>Match: " + state.greens[2].score.toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");
				$(".runner-up-3").html("<div class='text-center'><h4> " + state.greens[3].name + " </h4><img class='img img-rounded' src=" + state.greens[3].img + "></img><p>Match: " + state.greens[3].score.toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");

				$(".runner-up").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(1);
					});
				$(".runner-up-2").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(2);
					});
				$(".runner-up-3").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(3);
					});
			}


			else {
				$(".runner-up").html("<div class='text-center'><h4> " + state.greens[a].name + " </h4><img class='img img-rounded' src=" + state.greens[a].img + "></img><p>Match: " + state.greens[a].score.toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");
				$(".runner-up-2").html("<div class='text-center'><h4> " + state.greens[b].name + " </h4><img class='img img-rounded' src=" + state.greens[b].img + "></img><p>Match: " + state.greens[b].score.toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");
				$(".runner-up-3").html("<div class='text-center'><h4> " + state.greens[c].name + " </h4><img class='img img-rounded' src=" + state.greens[c].img + "></img><p>Match: " + state.greens[c].score.toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");

				$(".runner-up").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(a);
				  });
				$(".runner-up-2").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(b);
				  });
				$(".runner-up-3").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(c);
				  });
			}

		}
		
		else {
			
			$(".runner-up").off("click");
			$(".runner-up-2").off("click");
			$(".runner-up-3").off("click");
			
				$(".runner-up").html("<div class='text-center'><h4> " + state.greens[a].name + " </h4><img class='img img-rounded' src=" + state.greens[a].img + "></img><p>Nutrient Score: " + nutrients.internal(state.greens[a]).toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");
				$(".runner-up-2").html("<div class='text-center'><h4> " + state.greens[b].name + " </h4><img class='img img-rounded' src=" + state.greens[b].img + "></img><p>Nutrient Score: " + nutrients.internal(state.greens[b]).toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");
				$(".runner-up-3").html("<div class='text-center'><h4> " + state.greens[c].name + " </h4><img class='img img-rounded' src=" + state.greens[c].img + "></img><p>Nutrient Score: " + nutrients.internal(state.greens[c]).toFixed(0) + "%</p><button class='btn btn-success'><a href='#top'>Find Out More</a></button></div>");

				$(".runner-up").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(a);
				  });
				$(".runner-up-2").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(b);
				  });
				$(".runner-up-3").click(function() {
					display.iconsNoRepeat();
					$("#tableInfo > tbody > tr").remove();
					display.arrange(c);
				  });
		}

	},

	//** function that calls all functions necessary to display html in #part2 in index.html when user chooses 'get my superfood powder' **//
	arrange: function(x) {
		$("#part1").hide();
		$("#part2").show();
		$(".headline").html("<h1 class='text-center'> " + state.greens[x].name + "</h1>");
		$(".img").html("<img src=" + state.greens[x].img + " class='img-polaroid'>");
		//$(".info").html("<p>Best Price: $" + state.greens[x].pricePer30 + ", $" + this.difference(x).toFixed(2) + " " + this.aboveBelow(x) + " your target price of $" + state.price + " for a 30 day supply.</p><p>Contains " + this.contains(x) + "</p><p>Taste is " + this.taste.grassy(x) + " and " + this.taste.sweetness(x) + ". </p><p>" + this.flavors(x) +" flavors added to it.</p>");
		$(".modal1-body").html("<img src=" + state.greens[x].label + "></img>");
		this.info(x);
		this.buttons(x);
		this.title(x);
		this.icons(x);
		this.related(x);
		this.statsModal(x);
		this.table(x);
		drawChart(x);
	},

	//** generates dropdown list in section 2 of #part1 on index.html that allows users to choose greens powders to compare **//
	selectLoad: function() {
		$.each(state.greens, function(index, value) {
			$(".select1, .select2").append("<option value =' " + index + " '>" + state.greens[index].name + "</option>");
		});
	},
	
	//** generates product blocks on bottom section of #part1 in index.html **//
	productLoad: function() {
		for (var i = 0; i < state.greens.length; i++) {
			$(".product-list ul").append("<li><a href='#top' class='product-link'><div class='product'><p> " + state.greens[i].name + " </p></div></a></li>");
		}
	},

	//** generates modal and table when products are compared on part1 **//
	compare: function() {
		var a = parseInt($(".select1").val());
		var b = parseInt($(".select2").val());

		$(".table-compare > tbody").html("<tr><td> " + state.greens[a].name + "</td><td><strong>Name</strong></td><td> " + state.greens[b].name + "</td></tr><tr><td> <a class='load1' href='#top'>Go To</a></td><td><strong>Detail Page</strong></td><td><a class='load2' href='#top'>Go To</a></td></tr><tr><td> $" + parseFloat(state.greens[a].pricePer30).toFixed(2) + "</td><td><strong>Best Price</strong></td><td> $" + parseFloat(state.greens[b].pricePer30).toFixed(2) + "</td></tr><tr><td> $" + parseFloat(state.greens[a].pricePerOz).toFixed(2) + "</td><td><strong>Price Per Ounce</strong></td><td> $" + parseFloat(state.greens[b].pricePerOz).toFixed(2) + "</td></tr><tr><td> " + nutrients.internal(state.greens[a]) + "</td><td><strong>Nutrient Score</strong></td><td> " + nutrients.internal(state.greens[b]) + "</td><tr><td> " + state.greens[a].total + " oz</td><td><strong>Size of Container</strong></td><td> " + state.greens[b].total + " oz</td></tr><tr><td> " + state.greens[a].numberIngredients + "</td><td><strong>Number of Ingredients</strong></td><td> " +  state.greens[b].numberIngredients + "</td></tr><tr><td> " + this.features(a, 0) + "</td><td><strong>Organic</strong></td><td> " +  this.features(b, 0) + "</td></tr><tr><td> " + this.features(a, 1) + "</td><td><strong>Non GMO</strong></td><td> " +  this.features(b, 1) + "</td></tr><tr><td> " + this.features(a, 2) + "</td><td><strong>Gluten Free</strong></td><td> " +  this.features(b, 2) + "</td></tr><tr><td> " + this.features(a, 3) + "</td><td><strong>Soy Free</strong></td><td> " +  this.features(b, 3) + "</td></tr><tr><td> " + this.features(a, 5) + "</td><td><strong>Vegan</strong></td><td> " +  this.features(b, 5) + "</td></tr><tr><td><a href='" + state.greens[a].website + "' target='_blank'>Link</a></td><td><strong>Company Website</strong></td><td><a href='" + state.greens[b].website + "' target='blank'>Link</a></td></tr><tr><td> " + this.ifExists(a, 'review') + "</td><td><strong>Product Review</strong></td><td> " + this.ifExists(b, 'review') + "</td></tr><tr><td> " + this.ifExists(a, 'link') + "</td><td><strong>Amazon Page</strong></td><td> " + this.ifExists(b, 'link') + "</td></tr>");

		$(".load1").click(function() {
			$('#myModal2').modal('hide');
			display.iconsNoRepeat();
			$("#tableInfo > tbody > tr").remove();
			display.arrange(a);
		});

		$(".load2").click(function() {
			$('#myModal2').modal('hide');
			display.iconsNoRepeat();
			$("#tableInfo > tbody > tr").remove();
			display.arrange(b);
		});
	},

	//** used to generate data in product tables, checks to see if product has specific features **//
	features: function(index1, index2) {
		if (state.greens[index1].features[index2] !== false) {
			
			return "Yes";
		}

		else {
			return "No";
		}
	},
	
	//**similar to display.features - checks to see if specific ingredients exist **//
	ingredients: function(index1, index2) {
		if (state.greens[index1].ingredients[index2] !== false) {
			
			return "Yes";
		}
		
		else {
			return "No";
		}
	},

	//** generates link to product information if it exists - used in product tables **//
	ifExists: function(index1, index2) {
		if (state.greens[index1][index2] !== false) {
			return "<a href='" + state.greens[index1][index2] + "' target='_blank' rel='nofollow'>Link</a>"
		}

		else {
			return "N/A";
		}
	},
	
	//**generates modal for greens stats when button that says 'view complete stats' is clicked on index.html **//
	statsModal: function(num) {
		$(".stats").click(function() {
			$(".modal3-body").html("<div class='col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-1'><table class='table table-striped table-responsive'><tbody><tr><td><strong>Price</strong></td><td> $" + state.greens[num].pricePer30 + "</td></tr><tr><td><strong>Price Per Ounce</strong></td><td> $" + state.greens[num].pricePerOz + "</td></tr><tr><td><strong>Size of Container</strong></td><td> " + state.greens[num].total + "oz</td></tr><tr><td><strong># of Ingredients</strong></td><td> " + state.greens[num].numberIngredients + "</td></tr><tr><td><strong>Organic</strong></td><td> " + display.features(num, 0) + " </td></tr><tr><td><strong>Non GMO</strong></td><td> " + display.features(num, 1) + " </td></tr><tr><td><strong>Gluten Free</strong></td><td> " + display.features(num, 2) + " </td></tr><tr><td><strong>Soy Free</strong></td><td> " + display.features(num, 3) + " </td></tr><tr><td><strong>Dairy Free</strong></td><td> " + display.features(num, 4) + " </td><tr><td><strong>Vegan</strong></td><td> " + display.features(num, 5) + " </td></tr><tr><td><strong>Paleo</strong></td><td> " + display.features(num, 6) + " </td></tr><tr><td><strong>Kosher</strong></td><td> " + display.features(num, 7) + " </td></tr><tr><td><strong>Wild Crafted</strong></td><td> " + display.features(num, 8) + " </td></tr><tr><td><strong>Lecithin:</strong></td><td> " + display.ingredients(num, 0) + " </td></tr><tr><td><strong>Fiber:</strong></td><td> " + display.ingredients(num, 1) + " </td></tr><tr><td><strong>Vitamin Add-Ins:</strong></td><td> " + display.ingredients(num, 2) + " </td></tr><tr><td><strong>Caffeinated Ingredients:</strong></td><td> " + display.ingredients(num, 3) + " </td></tr><tr><td><strong>Grasses:</strong></td><td> " + display.ingredients(num, 4) + " </td></tr><tr><td><strong>Algaes:</strong></td><td> " + display.ingredients(num, 5) + " </td></tr><tr><td><strong>Sea Vegetables:</strong></td><td> " + display.ingredients(num, 6) + " </td></tr><tr><td><strong>Fruits:</strong></td><td> " + display.ingredients(num, 7) + " </td></tr><tr><td><strong>Probiotics:</strong></td><td> " + display.ingredients(num, 8) + " </td></tr><tr><td><strong>Digestive Enzymes:</strong></td><td> " + display.ingredients(num, 9) + " </td></tr><tr><td><strong>Mushrooms:</strong></td><td> " + display.ingredients(num, 10) + " </td></tr><tr><td><strong>Herbs:</strong></td><td> " + display.ingredients(num, 11) + " </td></tr></tbody></table></div>");
		});
	}
}

$(document).ready(function() {

	//** generates comparison table when two products are compared in #part1 in index.html **//
	$(".compare").click(function() {
		display.compare();
	});
	
	//** calls display.arrange for appropriate spot in index when product blocks are clicked in #part1 **//
	$(".product-pick > li").each(function(index) {
		$(this).click(function() {
			display.arrange(index);
		})
	});

	//** calculates product scores, sorts them according to their scores and displays product with the highest score on #part2 **//
	$(".analyze").click(function() {
		total.loop();
		state.greens.sort(compare.score);
		display.arrange(0);
	});

	//**resets html when user goes back to change user input on #part1 **//
	$(".redo").click(function() {
		$("#part2").hide();
		$("#part1").show();
		total.reset();
		display.iconsNoRepeat();
		$("#tableInfo > tbody > tr").remove();
		$(".chart-info").remove();
		state.greens.sort(compare.name);
	});
	
});
