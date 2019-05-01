function updateBadges(){
	$('.accordion').each(function(){
		var selectionCount = $(this).next().find('p[data-style]').length;
		$(this).find('.badge').text(selectionCount);
	});
}

function clearFormatting(dataStyle) {
	if(!dataStyle){
		var selector = "[data-style='"+dataStyle+"']";
		$(selector).removeAttr('data-style');
	} else {
		$('[data-style]').removeAttr('data-style');
	}
}

$( function() {
  $( "#formatter" ).dialog({
		autoOpen: false,
		modal: true,
		buttons: [{
			id: "Cancel",
			text: "Cancel",
			click: function () {
				$(this).dialog('close');
			}
		}]
	});
});

/*Convert a TEI document to HTML and insert into #TEI.*/
var CETEI;
if (CETEI) {
	var CETEIcean = new CETEI()
	CETEIcean.getHTML5("tei/gen1-15_master.xml", function(data) {
		document.getElementById("TEI").appendChild(data);
		
		$('tei-anchor').wrap(function(){
			var ID = $(this).attr('id');
			var selector = 'tei-note[target="#'+ID+'"]';
			var respID = $(selector).attr("resp");
			var name = $(respID).find("tei-name").text();
			var html = $(selector).find('[hidden]').html();
			if(html){
				html = '<i class= "small">' + name + '</i>: ' + html;
				html = html.replace(/"/g, "&quot;");
				return '<a tabindex="0" data-toggle="popover" data-trigger="focus" data-content="' + html + '" />' ;
			}
			return false;
		});  
		$('tei-persname').tooltip({
			items: 'tei-persname',
			content: function () {
				var selector = $(this).attr('ref');
				var name = ($(selector).text());
				var birth = ($(selector).find('tei-birth').attr('when-custom'));
				var birthString = birth > 0 && birth < 9999 ? birth : "";
				var death = ($(selector).find('tei-death').attr('when-custom'));
				var deathString = death > 0 && death < 9999 ? death : "";
				var gender = ($(selector).attr('sex'));
				var dates = birthString || deathString ? birthString+'-'+deathString : "";
				return name+' ('+gender+') ' + dates
			}
		})
		// Handle bug #10689 Memory Leak
		.each(function(idx, element) {
			var ele = $(element);
			ele.tooltip({
				"close": function(evt, ui) {
					ele.data("ui-tooltip").liveRegion.children().remove();         
				} 
			});  
		});     
		$('tei-placename').tooltip({
			items: 'tei-placename',
			content: function () {
				var selector = $(this).attr('ref');

				return $(selector).text();
			}
		})// Handle bug #10689 Memory Leak
		.each(function(idx, element) {
			var ele = $(element);
			ele.tooltip({
				"close": function(evt, ui) {
					ele.data("ui-tooltip").liveRegion.children().remove();         
				} 
			});  
		});  
		$("tei-seg[type='verse']").wrap("<sup />");
		$("tei-anchor").html("<sup><i class='far fa-comment-alt light'></i><sup>");
	});	
}	

$(document).ready(function(){
	if($('#comment-toggle').is(':checked')) {
		$('#comment').show();
	} 
	if($('#interp-toggle').is(':checked')) {
		$('#interp').show();
	} 
	$('#notes-filter').change(function(){ 
		var resp = $(this).val();
		if(resp === "all"){
			$("tei-anchor").show();
		} else {
			$("tei-anchor").hide();
			var noteSelector = 'tei-note[resp="#'+resp+'"]';
			$(noteSelector).each(function(){
				anchorSelector = $(this).attr("target");
				$(anchorSelector).show();
			});
		}
	});
	$(function () {
		$('[data-toggle="popover"]')
			.popover({
				container: "#TEI", 
				html: true, 
				placement: "bottom", 
				sanitize: false
			});
	})
})

$( document ).on("click",".accordion", function() {	
    var panel = $(this).next();
    var arrow = $(this).find('.arrow');
    if (panel.css('max-height')==="0px"){
      var height = panel.prop('scrollHeight')+ "px"
      panel.css('max-height',height);
      arrow.removeClass('fa-chevron-down');
      arrow.addClass('fa-chevron-up');
    } else {
    	panel.css('max-height','0px');
    	arrow.removeClass('fa-chevron-up');
      	arrow.addClass('fa-chevron-down');
    } 
});

$( document ).on( "click", ".interp", function() {
	var targetID = $(this).attr('id');
	$('#target').attr('data-target',targetID);
	$("#formatter").dialog( "option", "position", { my: "left top", at: "left bottom", of: $(this), collision: "fit" } );
	$("#formatter").dialog('open');
});
	
$( document).on( "click", ".formatter", function() {
	var newStyle= $(this).attr('id');
	var target = $('#target').attr('data-target');
	var targetID = "#"+target;
      
	if (newStyle === "none"){
		var currentStyle = $(targetID).attr('data-style');
		clearFormatting(currentStyle);
	} else {
		var selector = '[ana="'+targetID+'"]';
		$(targetID).attr('data-style', newStyle);
		$(selector).attr('data-style', newStyle);
	}
	var panel = $(targetID).parent();
		var height = panel.prop('scrollHeight')+ "px"
		panel.css('max-height',height);
	$( "#formatter" ).dialog( "close" );
	updateBadges();
});
	 
$( document).on( "change", ".menu-item", function() {
	var section= $(this).attr('data-for');
	var selector= '#'+section;
	if($(this).is(':checked')) {
		$(selector).show();
	} else {
		$(selector).hide();
	}
});

$( document).on( "click", ".close", function() {
	var section= $(this).attr('data-for');
	var selector= '#'+section;
	var toggle = '#'+section+'-toggle';
	$(toggle).prop('checked',false);
	$(selector).hide();
});

$(document).on("click", ".nav-item", function() {
	$('.nav-item').removeClass('active');
	$(this).addClass('active');
	var section = $(this).attr('data-section');
	console.log(section);
	if (["about","bibliography"].indexOf(section) >= 0){
		var html = "includes/"+section+".html"
		console.log(html);
		$("#page").load(html);
		$("#page").show();
		$("#text").hide();
	} else {
		$("#page").hide();
		$("#text").show();
	}
});

$(document).on("click", ".help", function() {
	$(this).parent().parent().next().show();
})

$(document).on("click", ".ok", function() {
	$(this).parent().hide();
})

$(document).on("click", "#clear-formatting", function() {
	clearFormatting();
	updateBadges();
})


