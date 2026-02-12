document.addEventListener('DOMContentLoaded', function() {

	//td button menu
	const buttons = document.querySelectorAll('.js-td-button-menu');
	const menu = document.querySelector('.tbl-menu-popup-box.dropdown-box');
	
	// Функция для позиционирования меню
	function positionMenu(button) {
		const buttonRect = button.getBoundingClientRect();
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		
		menu.style.top = (buttonRect.bottom + scrollTop - 100) + 'px';
		menu.style.left = (buttonRect.left + scrollLeft) + 'px';
	}
	
	// Функция для открытия меню
	function openMenu(button) {
		positionMenu(button);
		menu.classList.add('active-dotted');
	}
	
	// Функция для закрытия меню
	function closeMenu() {
		menu.classList.remove('active-dotted');
	}
	
	// Обработчик клика по кнопкам
	buttons.forEach(button => {
		button.addEventListener('click', function(e) {
			e.stopPropagation(); // Предотвращаем всплытие события
			
			if (menu.classList.contains('active-dotted')) {
				closeMenu();
			} else {
				openMenu(this);
			}
		});
	});
	
	// Обработчик клика вне меню
	document.addEventListener('click', function(e) {
		const isClickInsideMenu = menu.contains(e.target);
		const isClickOnButton = Array.from(buttons).some(button => button.contains(e.target));
		
		if (!isClickInsideMenu && !isClickOnButton) {
			closeMenu();
		}
	});
	
	// Обновляем позицию при скролле
	window.addEventListener('scroll', function() {
		if (menu.classList.contains('active-dotted')) {
			const activeButton = Array.from(buttons).find(button => 
				button.classList.contains('active-button') // Добавьте класс для активной кнопки
			);
			
			if (activeButton) {
				positionMenu(activeButton);
			}
		}
	});
	
	// Обновляем позицию при ресайзе окна
	window.addEventListener('resize', function() {
		if (menu.classList.contains('active-dotted')) {
			const activeButton = Array.from(buttons).find(button => 
				button.classList.contains('active-button')
			);
			
			if (activeButton) {
				positionMenu(activeButton);
			}
		}
	});





	


	//select style
	document.querySelectorAll('select.select-search').forEach(function(select) {
		new Choices(select);
	});


	//reviews form toggle
	document.querySelectorAll('.js-review-form-toggle').forEach(button => {
		button.addEventListener('click', function(e) {
			e.preventDefault();
			const formWrap = this.closest('.tile-form-wrap');
			if (formWrap) {
				formWrap.classList.add('active-dotted');
				const input = formWrap.querySelector('.form-input');
				if (input) input.focus();
			}
		});
	});


	//select toggle content visibility
	const inputs = document.querySelectorAll(
	"input[data-content], input[data-content-check], input[data-content-uncheck]"
	);
	console.log(inputs)

	inputs.forEach(function (input) {
	toggleContent(input);
	});

	inputs.forEach((input) => {
	input.addEventListener("click", function () {
		document.querySelectorAll(".frm-content").forEach((content) => {
		content.classList.remove("active");
			});

		inputs.forEach(toggleContent);
		});
	});

	document.querySelectorAll(".btn[data-content]").forEach((button) => {
	button.addEventListener("click", function () {
		let dataContent = this.getAttribute("data-content");
		this.disabled = true;
		document
		.querySelectorAll('.frm-content[data-content="' + dataContent + '"]')
		.forEach((content) => {
			content.classList.add("active");
			});
		return false;
		});
	});

	function toggleContent(input) {
	let selectContent;
	if (input.checked) {
		selectContent =
		input.getAttribute("data-content-check") ||
		input.getAttribute("data-content");
		} else {
		selectContent = input.getAttribute("data-content-uncheck");
		}
	document
		.querySelectorAll('.frm-content[data-content="' + selectContent + '"]')
		.forEach((content) => {
		content.classList.add("active");
		});
	}


	//form input clear
	const inputFields = document.querySelectorAll(".frm-field-input .form-input");
	const clearButtons = document.querySelectorAll(".button-field-clear");
	function checkInputStatus(inputField) {
		const form = inputField.closest(".frm-field-input");
		if (inputField.value.length > 0) {
			form.classList.add("inp-valid");
		} else {
			form.classList.remove("inp-valid");
		}
	}
	if (inputFields) {
		inputFields.forEach(inputField => {
			checkInputStatus(inputField);
		});
		for (let i = 0; i < inputFields.length; i++) {
			const inputField = inputFields[i];
			
			inputField.addEventListener("input", function () {
				checkInputStatus(inputField);
			});
		}
		for (let i = 0; i < clearButtons.length; i++) {
			const clearButton = clearButtons[i];
			clearButton.addEventListener("click", function (event) {
				const input = this.closest(".frm-field-input").querySelector(".form-input");
				input.value = "";
				checkInputStatus(input);
				event.preventDefault();
			});
		}
	}
	
	
	
    // side menu toggle and search button
    document.querySelectorAll('.frm-main-search').forEach(form => {
        form.addEventListener('submit', function(event) {
            const sideWrap = this.closest('.side-wrap');
            if (!sideWrap) return;
            
            const sideMenuBox = sideWrap.querySelector('.side-menu-box');
            if (!sideMenuBox) return;
            
            const toggleButton = sideMenuBox.querySelector('.btn-menu-toggle');
            if (!toggleButton) return;
            if (toggleButton.classList.contains('active-dotted')) {
                event.preventDefault();
                toggleButton.classList.remove('active-dotted');
            }
        });
    });


	//slider title menu
	const slidersmenu = document.querySelectorAll(".slider-menu");

	slidersmenu.forEach((container) => {
		const swiperEl = container.querySelector(".swiper");
		const paginationEl = container.querySelector(".slider-menu-pagination");
		const nextEl = container.querySelector(".button-slider-menu-next");
		const prevEl = container.querySelector(".button-slider-menu-prev");

		if (!swiperEl) return;

		const swiperInstance = new Swiper(swiperEl, {
			loop: false,
			slidesPerGroup: 1,
			slidesPerView: 'auto',
			spaceBetween: 0,
			autoHeight: false,
			speed: 400,
			pagination: false,
			autoplay: false,
			navigation: {
				nextEl: nextEl,
				prevEl: prevEl,
			},
			on: {
				init: function () {
					updateActiveSlide(this);
				},
				slideChange: function () {
					updateActiveSlide(this);
				}
			}
		});

		function updateActiveSlide(swiper) {
			if (window.innerWidth < 768) {
				container.querySelectorAll('.btn-menu').forEach(btn => {
					btn.classList.remove('active-dotted');
				});
				const activeSlide = swiper.slides[swiper.activeIndex];
				const activeBtn = activeSlide.querySelector('.btn-menu');
				if (activeBtn) {
					activeBtn.click();
				}
			} else {
				// На экранах шире 768px удаляем все классы active
				// container.querySelectorAll('.btn-menu').forEach(btn => {
				// 	btn.classList.remove('active-dotted');
				// });
			}
		}
		let resizeTimeout;
		window.addEventListener('resize', function() {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				updateActiveSlide(swiperInstance);
			}, 250);
		});

		updateActiveSlide(swiperInstance);
	});
});
