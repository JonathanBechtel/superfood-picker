$(function () {
  /*Page slider--------------------------------------------------------------------------------------*/
  $('.bxslider').bxSlider({
    nextSelector: '#slider-next',
    prevSelector: '#slider-prev',
    nextText: 'NEXT',
    prevText: 'PREVIOUS',
    adaptiveHeight: true,
    speed: 100,
    infiniteLoop: false,
    hideControlOnEnd: true,
    touchEnabled:false,
    mode: 'fade'
  });
/*---------------------------------------------------------------------------------------------------*/
  /*Page  centering  to question---------------------------------------------------------------------*/
  $('.next-btn , .previous-btn').click(function() {
	  var divPosition = $('.taras').offset();
    $("html, body").animate({ scrollTop: divPosition.top }, "slow");
  });
  /*---------------------------------------------------------------------------------------------------------*/
  /*DRAGGABLE elements - Part5-----------------------------------------------------------------------*/
  $( "#sortable" ).sortable({
     placeholder: "ui-state-highlight",
     distance: 5,
     delay: 0,
     opacity: 0.7,
     cursor: 'move',
     axis: "y" ,
     update: function() {},
     stop: function(e,ui) {
      /*Please Rank The Following Priorities For Your Selection (Highest First) - push to array*/
       foodData.priorities.length=0;
       $('.priorities').children().each(function(){
        var priorities =  $(this).attr('data-name');
         foodData.priorities.push({
           prioritiesItem:priorities
         })
       });
     }
   });
   $( "#sortable" ).disableSelection();
   /*------------------------------------------------------------------------------------------------*/

/*APPEND BTN  "Get my superfood powder"--------------------------------------------------------------*/

  $('#slider-next').append("<a href='#'  class='btn nav-item finish-btn'>Get my superfood powder</a>");
  $('.finish-btn').bind('click', function(){
     // $( ".modal-template" ).remove(); -----removed because I'm not using modal
      $('#foodTmpl').tmpl([foodData]).appendTo('#food-template');
	  storage.set();
	  total.loop();
	  state.greens.sort(compare.score);
	  display.arrange(0);
  });
/*----------------------------------------------------------------------------------------------------*/
/*Add class active to choose items--------------------------------------------------------------------*/
  $('.select-box li').click(function() {
      $('.select-box li').removeClass('active');
    $(this).addClass('active');
  })
/*----------------------------------------------------------------------------------------------------*/
/*Push data from Any ingredients You Want To Include? to main store object----------------------------*/
  $('.ingredients-include .pushitem').click(function() {
      $(".select-box.additem-box li.active").appendTo($(this).parents('.section-wrap').find(".select-box.removeitem-box"));
      var itemName = $(".select-box.removeitem-box li.active").attr("data-name");
      var itemId = $(".select-box.removeitem-box li.active").attr("data-id");
      if(itemName != undefined){
        foodData.ingredientsToInclude.push({
          id:itemId,
          name:itemName
        })
      }
      $('.select-box li').removeClass('active');

  })
  /*----------------------------------------------------------------------------------------------------*/
  /*Remove  item  Any ingredients You Want To Include? from main store object----------------------------*/
  $('.ingredients-include .removeitem').click(function() {
    var itemName = $(".select-box.removeitem-box li.active").attr("data-name");
    var itemId = $(".select-box.removeitem-box li.active").attr("data-id");
      $(".select-box.removeitem-box li.active").appendTo($(this).parents('.section-wrap').find(".select-box.additem-box"));
      for(var i = 0; i < foodData.ingredientsToInclude.length; i++){
        if(parseInt(foodData.ingredientsToInclude[i].id) === parseInt(itemId)){
          foodData.ingredientsToInclude.splice(i, 1);
          break;
        }
      }

      $('.select-box li').removeClass('active');
  })
  /*----------------------------------------------------------------------------------------------------*/

/*Push data from Any ingredients You Want To Avoide? to main store object----------------------------*/
  $('.ingredients-avoid .pushitem').click(function() {
      $(".select-box.additem-box li.active").appendTo($(this).parents('.section-wrap').find(".select-box.removeitem-box"));
      var itemName = $(".select-box.removeitem-box li.active").attr("data-name");
      var itemId = $(".select-box.removeitem-box li.active").attr("data-id");
      if(itemName != undefined){
      foodData.ingredientsToAvoide.push({
        id:itemId,
        name:itemName
      })
    }
      $('.select-box li').removeClass('active');

  })
  /*----------------------------------------------------------------------------------------------------*/
    /*Remove  item Any ingredients You Want To Avoide? from main store object----------------------------*/
  $('.ingredients-avoid .removeitem').click(function() {
    var itemName = $(".select-box.removeitem-box li.active").attr("data-name");
    var itemId = $(".select-box.removeitem-box li.active").attr("data-id");
      $(".select-box.removeitem-box li.active").appendTo($(this).parents('.section-wrap').find(".select-box.additem-box"));
      for(var i = 0; i < foodData.ingredientsToAvoide.length; i++){
        if(parseInt(foodData.ingredientsToAvoide[i].id) === parseInt(itemId)){
          foodData.ingredientsToAvoide.splice(i, 1);
          break;
        }
      }
      $('.select-box li').removeClass('active');
  })
/*----------------------------------------------------------------------------------------------------*/
/*Push What's the most you're willing to pay for a 30 day supply? to main store object----------------*/
  $('.slider-with-pips').click(function() {
  var price = $('.section-price .ui-slider-tip').text();
    foodData.price = price;
  });
/*----------------------------------------------------------------------------------------------------*/
/*Push How Much of a "Greens" Taste do You Want?  to main store object---------------------------------*/
  $('.greens-radio').click(function() {
    greens = $('input[name=radio]:checked').val();
    foodData.greens = greens;
  });
/*----------------------------------------------------------------------------------------------------*/
/*Push How Sweet do you Want It? to main store object-------------------------------------------------*/
   $('.sweets-radio').click(function() {
	  sweet = $('input[name=radio2]:checked').val();
	  foodData.sweet = sweet;
   });
 /* $('.slider-with-pips').click(function() { ---removed because I'm not using slider.
  var sweet = $('.section-sweet .ui-slider-tip').text();
    foodData.sweet = sweet;
  });------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
   $('.flavors-radio').click(function() {
	  flavors = $('input[name=radio3]:checked').val();
	  foodData.flavors = flavors;
   });
/*Push Flavors: Yaye or Naye? to main store object----------------------------------------------------*/
/*  $('.slider-with-pips').click(function() { ---removed because I'm not using slider.
  var flavors = $('.section-flavors .ui-slider-tip').text();
    foodData.flavors = flavors;
  }); ------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
/*Push data from What Features Do You Want? to main store object--------------------------------------*/
  $('.section-features .pushitem').click(function() {
      $(".select-box.additem-box li.active").appendTo($(this).parents('.section-wrap').find(".select-box.removeitem-box"));
      var itemName = $(".select-box.removeitem-box li.active").attr("data-name");
      var itemId = $(".select-box.removeitem-box li.active").attr("data-id");
      if(itemName != undefined){
          foodData.features.push({
          id:itemId,
          name:itemName
        })
      }
      $('.select-box li').removeClass('active');
  })
  /*Remove  item What Features Do You Want? from main store object--------------------------------------*/
  /*----------------------------------------------------------------------------------------------------*/
  $('.section-features .removeitem').click(function() {
    var itemName = $(".select-box.removeitem-box li.active").attr("data-name");
    var itemId = $(".select-box.removeitem-box li.active").attr("data-id");
      $(".select-box.removeitem-box li.active").appendTo($(this).parents('.section-wrap').find(".select-box.additem-box"));
      for(var i = 0; i < foodData.features.length; i++){
        if(parseInt(foodData.features[i].id) === parseInt(itemId)){
          foodData.features.splice(i, 1);
          break;
        }
      }
      $('.select-box li').removeClass('active');
  })
/*----------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------*/
  /*SLIDER How Sweet do you Want It?--------------------------------------------------------------------*/
/*  var hanzi = ["Not at all", "A little is okay", "Don't Care", "I like it sweet", "The more, the better"];
    $(".slider-horizontal")
    .slider({
        orientation: "horizontal",
        range: "min",
        value: 60,
        step:25,
        min:0,
        max:100,
        slide: function (event, ui){
            $("#amount").val(ui.value);
        }
    })
    .slider("pips", {
      rest: "label",
      first: "pip",
      last: "pip",
     labels: hanzi
    })

    .slider("float", {
      rest: "label",
   labels: hanzi
    });
    $("#amount").val($(".slider-horizontal").slider("value"));
    function UpdateSlider(PhaseInStatusReportVal) {
        $(".slider-horizontal").slider("value", PhaseInStatusReportVal);
    }  ------removed because I'm not using slider ---------------------------------------------------*/
/*---------------------------------------------------------------------------------------------------*/

/* slider Flavors: Yaye or Naye?---------------------------------------------------------------------*/
/*var hanzi2 = ["Don't Want","Don't Care", "Want"];
  $(".slider-flavors")
  .slider({
      orientation: "horizontal",
      range: "min",
      value: 50,
      step:50,
      min:0,
      max:100,
      slide: function (event, ui){
          $("#amount").val(ui.value);
      }
  })
  .slider("pips", {
    rest: "label",
    first: "pip",
    last: "pip",
   labels: hanzi2
  })

  .slider("float", {
    rest: "label",
 labels: hanzi2
  });
  $("#amount").val($(".slider-flavors").slider("value"));
  function UpdateSlider(PhaseInStatusReportVal) {
      $(".slider-flavors").slider("value", PhaseInStatusReportVal);
  } -----------removed because I'm not using slider -----------------------------------------------*/
  /*-----------------------------------------------------------------------------------------------*/
  /*slide What's the most you're willing to pay for a 30 day supply?-------------------------------*/
    $(".slider-with-pips")
    .slider({
        orientation: "horizontal",
        range: "min",
        value: 50,
        step:1,
        min:0,
        max:150,
        slide: function (event, ui){
            $("#amount").val(ui.value);
        }
    })
    .slider("pips", {
      rest: "label",
        prefix: "$"
    })

    .slider("float", {
      rest: "label",
        prefix: "$"
    });
    $("#amount").val($(".slider-with-pips").slider("value"));

  });

  function UpdateSlider(PhaseInStatusReportVal) {
      $(".slider-with-pips").slider("value", PhaseInStatusReportVal);
  }
/*------------------------------------------------------------------------------------------------*/

/*Objects initialization which store all data ---------------------------------------------- -----*/
var foodData = {
  'ingredientsToInclude':[
    {
    }
  ],
  'ingredientsToAvoide':[
    {
    }
  ],
    'price':'50',
    'greens':'3',
    'sweet':'3',
   'flavors':'2',
    'features':[
      {

      }

    ],
    'priorities':[
      {
        'prioritiesItem' : 'Taste'
      },
      {
        'prioritiesItem' : 'Nutrients'
      },
      {
      'prioritiesItem' : 'Price'
      }
    ]
};
/*------------------------------------------------------------------------------------------*/
