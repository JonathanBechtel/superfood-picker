var display = {

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

	features: function(num) {
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

	taste: {
		grassy: function(num) {
			var grass_strings = ["very grassy", "moderately grassy", "neutral", "moderately non-grassy (for a greens powder)", "not grassy at all (for a greens powder)"];
			var i = 0;
			for (i = 0; i < grass_strings.length; i++) {
				if(state.greens[num].taste.grassy === i + 1)
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

	buttons: function(num) {
		$(".button-class").html("<div class='text-center'><ul class='list-inline'><li><button class='btn btn-success'><a href=" + state.greens[num].website + " target='_blank'>Company Website</a></button></li> <li><button class='btn btn-success' data-toggle='modal' data-target='#myModal'>View the Label</button></li></ul></div>");
		if (state.greens[num].link !== false) {
			$(".button-class ul").append("<li><button class='btn btn-success'><a href=" + state.greens[num].link + " rel='nofollow' target='_blank'>Get It On Amazon</a></button></li>");
		}

		if (state.greens[num].review !== false) {
			$(".button-class ul").append("<li><button class='btn btn-success'><a href=" + state.greens[num].review + " target='_blank'>Read The Review</a></button></li>");
		}
	},

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

	table: function(num) {
		$("#tableInfo > tbody").append("<tr><td> " + state.greens[num].numberIngredients + "</td><td> " + state.greens[num].total + " oz </td><td> $" + state.greens[num].pricePerOz + " </td></tr>");
	},

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

	iconsNoRepeat: function() {
		$(".icons ul li").remove();
	},

	title: function(num) {
		if (isNaN(state.greens[num].score)) {
			$(".chart-title").html("<h3 class ='text-center'>Nutrient Score: " + nutrients.internal(state.greens[num]).toFixed(0) + "%</h3>");
		}

		else {
			$(".chart-title").html("<h3>Match Score: " + state.greens[num].score.toFixed(0) + "%</h3>");
			$(".chart-info").html("<h4>Components: </h4><p><strong>Nutrients:</strong> " + nutrients.blend(state.features, state.greens[num].features, state.desired, state.greens[num].ingredients, state.forbidden, state.greens[num]).toFixed(0) + "%,    <strong>  Price:</strong> " + price.compare(state.price, state.greens[num]).toFixed(0) + "%,      <strong>Taste: </strong>" + taste.total(state.taste.greens, state.greens[num].taste.greens, state.taste.sweetness, state.greens[num].taste.sweetness, state.taste.flavors, state.greens[num].taste.flavors).toFixed(0) + "%</p>");
		}
	},

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

		if (!isNaN(state.greens[num].score)) {

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

	},

	arrange: function(x) {
		$("#part1").hide();
		$("#part2").show();
		$(".headline").html("<h1 class='text-center'> " + state.greens[x].name + "</h1>");
		$(".img").html("<img src=" + state.greens[x].img + " class='img-polaroid'>");
		$(".info").html("<p>Best Price: $" + state.greens[x].pricePer30 + ", $" + this.difference(x).toFixed(2) + " " + this.aboveBelow(x) + " your target price of $" + state.price + " for a 30 day supply.</p><p>Contains " + this.features(x) + "</p><p>Taste is " + this.taste.grassy(x) + " and " + this.taste.sweetness(x) + ". </p><p>" + this.flavors(x) +" flavors added to it.</p>");
		$(".modal-body").html("<img src=" + state.greens[x].label + "></img>");
		this.buttons(x);
		drawChart(x);
		this.title(x);
		this.buttons(x);
		this.icons(x);
		this.related(x);
		this.table(x);
	},

	compare: function() {
		console.log(state.greens.length);
		$.each(state.greens, function(index, value) {
			$("#select1").append("<option value =' " + index + " '>" + state.greens[index].name + "</option>");
		});
	}

}

$(document).ready(function() {

	$(".analyze").click(function() {
		total.loop();
		state.greens.sort(compare.score);
		display.arrange(0);
	});

	$(".redo").click(function() {
		$("#part2").hide();
		$("#part1").show();
		total.reset();
		display.iconsNoRepeat();
		$("#tableInfo > tbody > tr").remove();
		state.greens.sort(compare.name);
	});
});
