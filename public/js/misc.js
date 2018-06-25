(function($) {
	'use strict';
	$(function() {
		var collapse = false;
		var sidebar = $('.sidebar');
		var sidebarCollapse = $('#sidebarCollapse');
		var mainPanel = $('.main-panel');

		// create collapse-expand button on navbar
		sidebarCollapse.on('click', function() {
			if (collapse) { // It is collapsing
				sidebarCollapse.removeClass('mdi-arrow-right-drop-circle-outline');
				sidebarCollapse.addClass('mdi-arrow-left-drop-circle-outline');
				sidebar.css('width', '255px');
				mainPanel.css('width', 'calc(100% - 255px)');
			} else {
				sidebarCollapse.removeClass('mdi-arrow-left-drop-circle-outline');
				sidebarCollapse.addClass('mdi-arrow-right-drop-circle-outline');
				sidebar.css('width', '0px');
				mainPanel.css('width', 'calc(100% - 0px)');
			}
			collapse = !collapse;
		});
		// for dropdown ui li
		$('.combobox ul').hide();
		$('.combobox').hover(
			function(){
				$(this).find('ul').stop().slideDown();
			},
			function(){
				$(this).find('ul').stop().slideUp();
			}
		);
		$('.combobox li').click(function(){
			$(this).parents('.combobox').find('.selector').text($(this).text());
		});

		$('#aLogout').click(function() {
			$.post("/logout", function(data) {
				window.location = data;
			});
		});
		$('#testDelete').on('click', function(){
			$.ajax({
			    url: '/test-delete',
			    type: 'DELETE',
				data: {alo: 'alo'},
			    success: function(result) {
					alert(result.message);
				},
			    error: function(result){
					alert(result.responseJSON);
				}
			});
		})



		//Add active class to nav-link based on url dynamically
		//Active class can be hard coded directly in html file also as required
		var current = location.pathname
		$('.nav li a', sidebar).each(function() {
			var $this = $(this);
			if (current === "") {
				//for root url
				if ($this.attr('href').indexOf("index.html") !== -1) {
					$(this).parents('.nav-item').last().addClass('active');
					if ($(this).parents('.sub-menu').length) {
						$(this).closest('.collapse').addClass('show');
						$(this).addClass('active');
					}
				}
			} else {
				//for other url
				if ($this.attr('href') == current) {
					$(this).parents('.nav-item').last().addClass('active');
					if ($(this).parents('.sub-menu').length) {
						$(this).closest('.collapse').addClass('show');
						$(this).addClass('active');
					}
				}
			}
		})

		//Close other submenu in sidebar on opening any

		sidebar.on('show.bs.collapse', '.collapse', function() {
			sidebar.find('.collapse.show').collapse('hide');
		});


		//Change sidebar and content-wrapper height
		applyStyles();

		function applyStyles() {
			//Applying perfect scrollbar
			if ($('.scroll-container').length) {
				const ScrollContainer = new PerfectScrollbar('.scroll-container');
			}
		}

		//checkbox and radios
		$(".form-check label,.form-radio label").append('<i class="input-helper"></i>');


		$(".purchace-popup .popup-dismiss").on("click", function() {
			$(".purchace-popup").slideToggle();
		});
	});
})(jQuery);
