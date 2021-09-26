"use strict"

const spollersArray = document.querySelectorAll('[data-spollers]');

if(spollersArray.length > 0){
	// Oтримання звичайних спойлерів
	const spollersRegular = Array.from(spollersArray).filter(function(item,index,self){
		return !item.dataset.spollers.split(",")[0];
	});

	// Ініціалізація звичайних спойлерів
	if(spollersRegular.length > 0){
		initSpollers(spollersRegular);
	}

	// Отримання спойлерів з медіа запитами
	const spollersMedia = Array.from(spollersArray).filter(function(item,index,self){
		return item.dataset.spollers.split(",")[0];
	});
	
	// Ініціалізація спойлерів з медіа запитами
	if(spollersMedia.length > 0){
		const  breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});			
      // Отримуєм унікальні брейкпоінти
		let mediaQueries = breakpointsArray.map(function(item){
			return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
		});

		mediaQueries = mediaQueries.filter(function(item,index,self){
			return self.indexOf(item) === index;
		});
		// Працюєм з потрібним брейкпоінтом
      mediaQueries.forEach(breakpoint => {
         const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);
		// Обєкти з потрібним умовами
			const spollersArray = breakpointsArray.filter(function(item){
				if(item.value === mediaBreakpoint && item.type === mediaType){
					return true;
				}
			});
      // Події
		matchMedia.addListener(function(){
			initSpollers(spollersArray,matchMedia);
		});
		initSpollers(spollersArray,matchMedia);		
		});
	}
	// Ініціалізація
	function initSpollers(spollersArray,matchMedia = false){
		spollersArray.forEach(spollersBlock =>{
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if(matchMedia.matches || !matchMedia){
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener('click',setSpollerAction);
			}else{
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock,false);
				spollersBlock.removeEventListener('click',setSpollerAction);
			}
		});
	}
	// Робота з контентом
	function initSpollerBody(spollersBlock,hideSpollerBody = true){
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if(spollerTitles.length > 0){
			spollerTitles.forEach(spollerTitle => {
				if(hideSpollerBody){
					spollerTitle.removeAttribute('tabindex');
					if(!spollerTitle.classList.contains('_active')){
						spollerTitle.nextElementSibling.hidden = true;
					}
				}else{
					spollerTitle.setAttribute('tabindex','-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e){
		const el = e.target;
		if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')){
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if(!spollersBlock.querySelectorAll('._slide').length){
				if(oneSpoller && !spollerTitle.classList.contains('_active')){
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock){
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if(spollerActiveTitle){
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

let _slideUp = (target,duration = 500)  => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = "margin , padding , height";
		target.style.transitionDuration = duration +'ms';
		target.style.height = 'height + px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
		target.hidden = true;
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margine-top');
		target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide')
		},duration);
	}
}


let _slideDown = (target,duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if(target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "margin , padding , height";
		target.style.transitionDuration = duration +'ms';
		target.style.height = height + 'px';
		target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margine-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty('height');
         target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide')
		},duration);
	}
}

let _slideToggle = (target,duration = 500) => {
	if (target.hidden){
		return _slideDown(target,duration);
	}else{
		return _slideUp(target,duration);
	}
};


//isMobile function

let ua = window.navigator.userAgent;
let msie = ua.indexOf("MSIE");

let isMobile = {
	 Android:function() {
		 return navigator.userAgent.match(/Android/i);
		 },
	 BlackBerry: function() {
		 return navigator.userAgent.match(/BlackBerry/i);
		 },
	 iOS: function() {
		 return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		 },
	 Opera: function() {
		 return navigator.userAgent.match(/Opera Mini/i);
		 },
	 Windows: function() {
		 return navigator.userAgent.match(/IEMobile/i);
		 },
	 any: function() {
		 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	 }
	};
	 function isIE() {
		 ua = navigator.userAgent;
		 let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
		 return is_ie;
	 }
	 if (isIE) {
		 document.querySelector('html').classList.add('ie');
	 }
	 if (isMobile.any()) {
		 document.querySelector('html').classList.add('_touch');
	 }


   // images function
	 function ibg(){
let ibg=document.querySelectorAll("._ibg");
    for (var i = 0; i < ibg.length; i++) {
    if(ibg[i].querySelector('img')){
   ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
    }
  } 
}
ibg();
//Swiper slider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
	let slider = sliders[index];
	if (!slider.classList.contains('swiper-bild')) {
		let slider_items = slider.children;
		if (slider_items) {
			for (let index = 0; index < slider_items.length; index++) {
			let el = slider_items[index];
				el.classList.add('swiper-slide');
			}
		}
		let slider_content = slider.innerHTML;
		let slider_wrapper = document.createElement('div');
		slider_wrapper.classList.add('swiper-wrapper');
		slider_wrapper.innerHTML = slider_content;
		slider.innerHTML = "";
		slider.appendChild(slider_wrapper);
		slider.classList.add('swiper-bild');

		if (slider.classList.contains('_swiper_scroll')) {
			let sliderScroll = document.createElement('div');
			sliderScroll.classList.add('swiper-scrollbar');
			sliderScroll.appendChild(sliderScroll);			
		}
	}
	if (slider.classList.contains('_gallary')) {
		//fini
	}	
	}
	sliders_bild_callback();
}
function sliders_bild_callback(params) {}

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
	for (let index = 0; index < sliderScrollItems.length; index++) {
		const sliderScrollItem = sliderScrollItems[index];
		const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollItem,{
			observer:true,
			observeParents:true,
			direction: 'horizontal',
			slidesPerView:auto,
			freeMode:true,
			scrollbar:{
         el:sliderScrollBar,
			draggable:true,
			snapOnRelease:false,
			},
			mousewheel:{
         releaseOnEdges:true,
			},
		});
		sliderScroll.scrollBar.updateSize();
		
	}
}

function sliders_bild_callback(params) {}


// init swiper
if (document.querySelector(".slider-main__body")) {
new Swiper(".slider-main__body", {
   observer: true,
   observeParents: true,
   direction: "horizontal",
   slidesPerView: 1,
   spaceBetween: 32,
   watchOverflow: true,
   speed: 800,
   loop: true,
   loopAdditionalSlides: 5,
   preloadImages: false,
   parallax: true,
    //arrows
   navigation: {
      nextEl: ".slider-main .slider-arrow_next",
      prevEl: ".slider-main .slider-arrow_prev",
   },
});
}

//burger menu

    const IconMenu = document.querySelector('.icon-menu');
        if(IconMenu) {
            const menuBody = document.querySelector('.menu__body');
            IconMenu.addEventListener("click",function (e) {
                IconMenu.classList.toggle('_active');
                menuBody.classList.toggle('_active');
            });
        }
        //header scroll
        const headerElement = document.querySelector('.header');

        const callback = function (entries,observer) {
            if (entries[0].isIntersecting) {
                headerElement.classList.remove('_scroll');
            }else{
                headerElement.classList.add('_scroll');
            }
        };
        const headerObserver = new IntersectionObserver(callback);
        headerObserver.observe(headerElement);


// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
// popup js

"use strict";


const ButtonOpen = document.querySelectorAll(".open");
const body = document.querySelector("body");

if (ButtonOpen) {

const popupBody = document.querySelector(".product");

ButtonOpen.forEach((button) => {

button.addEventListener("click", (e) => {
   body.classList.add("_no-scroll");  
   popupBody.classList.add("_open");
   ButtonOpen.classList.add("_open"); 

   e.preventDefault();
});

});
}

const ButtonClose = document.querySelector(".close");

if (ButtonClose) {
const body = document.querySelector("body");
const popupClose = document.querySelector(".product");

ButtonClose.addEventListener("click", function (e) {
   
   ButtonClose.classList.remove("_open");
   popupClose.classList.remove("_open");
   body.classList.remove("_no-scroll");
   body.style.overflow = "";
});
} 


 // popups js-2

// init slider
// swiper
const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },
  // Navigation arrows
  navigation: {
    nextEl: ".product__button-next",
    prevEl: ".product__button-prev",
  },
});
const CLASS_NAME_SELECT = 'select';
const CLASS_NAME_ACTIVE = 'select_show';
const CLASS_NAME_SELECTED = 'select__option_selected';
const SELECTOR_ACTIVE = '.select_show';
const SELECTOR_DATA = '[data-select]';
const SELECTOR_DATA_TOGGLE = '[data-select="toggle"]';
const SELECTOR_OPTION_SELECTED = '.select__option_selected';

class CustomSelect {
  constructor(target, params) {
    this._elRoot = typeof target === 'string' ? document.querySelector(target) : target;
    this._params = params || {};
    if (this._params['options']) {
      this._elRoot.classList.add(CLASS_NAME_SELECT);
      this._elRoot.innerHTML = CustomSelect.template(this._params);
    }
    this._elToggle = this._elRoot.querySelector(SELECTOR_DATA_TOGGLE);
    this._elRoot.addEventListener('click', this._onClick.bind(this));
  }
  _onClick(e) {
    const target = e.target;
    const type = target.closest(SELECTOR_DATA).dataset.select;
    switch (type) {
      case 'toggle':
        this.toggle();
        break;
      case 'option':
        this._changeValue(target);
        break;
    }
  }
  _update(option) {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    option.classList.add(CLASS_NAME_SELECTED);
    this._elToggle.textContent = option.textContent;
    this._elToggle.value = option.dataset['value'];
    this._elToggle.name = option.dataset["name"];
    this._elToggle.dataset.index = option.dataset['index'];
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, option) : null;
    return option.dataset['value'];
  }
  _reset() {
    const selected = this._elRoot.querySelector(SELECTOR_OPTION_SELECTED);
    if (selected) {
      selected.classList.remove(CLASS_NAME_SELECTED);
    }
    this._elToggle.textContent = 'Выберите из списка';
    this._elToggle.value = '';
    this._elToggle.name = '';
    this._elToggle.dataset.index = -1;
    this._elRoot.dispatchEvent(new CustomEvent('select.change'));
    this._params.onSelected ? this._params.onSelected(this, null) : null;
    return '';
  }
  _changeValue(option) {
    if (option.classList.contains(CLASS_NAME_SELECTED)) {
      return;
    }
    this._update(option);
    this.hide();
  }
  show() {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
    this._elRoot.classList.add(CLASS_NAME_ACTIVE);
  }
  hide() {
    this._elRoot.classList.remove(CLASS_NAME_ACTIVE);
  }
  toggle() {
    if (this._elRoot.classList.contains(CLASS_NAME_ACTIVE)) {
      this.hide();
    } else {
      this.show();
    }
  }
  dispose() {
    this._elRoot.removeEventListener('click', this._onClick);
  }
  get value() {
    return this._elToggle.value;
  }
  set value(value) {
    let isExists = false;
    this._elRoot.querySelectorAll('.select__option').forEach((option) => {
      if (option.dataset['value'] === value) {
        isExists = true;
        return this._update(option);
      }
      if (option.dataset["name"] === value) {
        isExists = true;
        return this._update(option);
      }
    });
    if (!isExists) {
      return this._reset();
    }
  }
  get selectedIndex() {
    return this._elToggle.dataset['index'];
  }
  set selectedIndex(index) {
    const option = this._elRoot.querySelector(`.select__option[data-index="${index}"]`);
    if (option) {
      return this._update(option);
    }
    return this._reset();
  }
}

CustomSelect.template = params => {
  const name = params['name'];
  const options = params['options'];
  const targetValue = params['targetValue'];
  let items = [];
  let selectedIndex = -1;
  let selectedValue = '';
  let selectedContent = 'Выберите из списка';
  options.forEach((option, index) => {
    let selectedClass = '';
    if (option[0] === targetValue) {
      selectedClass = ' select__option_selected';
      selectedIndex = index;
      selectedValue = option[0];
      selectedContent = option[1];
    }
    items.push(`<li class="select__option${selectedClass}" data-select="option" data-value="${option[0]}" data-index="${index}">${option[1]}</li>`);
  });
  return `<button type="button" class="select__toggle" name="${name}" value="${selectedValue}" data-select="toggle" data-index="${selectedIndex}">${selectedContent}</button>
  <div class="select__dropdown">
    <ul class="select__options">${items.join('')}</ul>
  </div>`;
};


document.addEventListener('click', (e) => {
  if (!e.target.closest('.select')) {
    document.querySelectorAll(SELECTOR_ACTIVE).forEach(select => {
      select.classList.remove(CLASS_NAME_ACTIVE);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
    // инициализируем #select-1 как CustomSelect

    const select1 = new CustomSelect("#select-1", {});
    const select2 = new CustomSelect("#select-2", {});
    const select3 = new CustomSelect("#select-3", {});
});
 
/*
/*
 * Функция подсчета стоимости услуг на создания дизайна сайта
 */
  
    const SelectProjectType = document.querySelector(".select-project-type");

    const SelectProjectColor = document.querySelector(".select-project-color");

    const SelectProjectOption = document.querySelector(".select-project-option");

    const BtnsCheckbox = document.querySelectorAll(".btn-checkbox");

    const BtnsCheckboxDesing = document.querySelectorAll(".btn-checkbox-desing");

    const squareInput = document.querySelector(".square-input");

    const squareRange = document.querySelector(".square-range");

    let BtnsSelectType = document.querySelector(".select-type");

    let BtnsSelectColor = document.querySelector(".select-color");

    let BtnsSelectOption = document.querySelector(".select-option");

    let previousCost = document.getElementById("previous-cost");
    
    // навішуєм подію на кнопку select  project type

    SelectProjectType.addEventListener("select.change", (e) => {

      BtnsSelectType.classList.add("_selected");

      calculation();

    });

    // навішуєм подію на кнопку select project color

    SelectProjectColor.addEventListener("select.change", (e) => {

        BtnsSelectColor.classList.add("_selected");

        calculation();

      });

    // навішуєм подію на кнопку select option project
  
    SelectProjectOption.addEventListener("select.change", (e) => {

        BtnsSelectOption.classList.add("_selected");

        calculation();

      });

    // встановлюєм вартість сторінки

    const pagePrice = 50;

    // вибираєм значення з кнопок типу range

    squareRange.addEventListener("input", () => {

      squareInput.value = squareRange.value;

    });

    squareInput.addEventListener("input", () => {

      squareRange.value = squareInput.value;

    });

     // вибираєм значення з кнопок типу checkbox desing

    let BtnCheckboxDesing = 0;

    for (let btnCheckboxDesing of BtnsCheckboxDesing) {

      btnCheckboxDesing.addEventListener("input", () => {

        if (btnCheckboxDesing.checked === true) {
                    
          BtnCheckboxDesing += parseInt(btnCheckboxDesing.value);
      
          calculation();
        }else{

          BtnCheckboxDesing -= parseInt(btnCheckboxDesing.value);

          calculation(BtnCheckboxDesing);

        }
       //console.log(BtnCheckboxDesing);
      });
    }

  // вибираєм значення з кнопок типу checkbox

    let BtnCheckbox = 0;

    for (let btnCheckbox of BtnsCheckbox) {

      btnCheckbox.addEventListener("input", () => {
        if (btnCheckbox.checked === true) {
          BtnCheckbox += parseInt(btnCheckbox.value);

          calculation();
        } else {
          BtnCheckbox -= parseInt(btnCheckbox.value);

          calculation();
        }
        console.log(BtnCheckbox);
      });
    }

    // визначаєм загальну вартість

    const calculation = () => {

      let totalPagePrice = pagePrice * parseInt(squareInput.value);

      let previousPrice = 0;
    
      previousPrice += totalPagePrice;

      previousPrice += BtnCheckboxDesing;

      previousPrice += BtnCheckbox;

      previousPrice += parseInt(BtnsSelectColor.value);

      previousPrice += parseInt(BtnsSelectType.value);

      previousPrice += parseInt(BtnsSelectOption.value);

      const formatter = new Intl.NumberFormat("en");

      if (previousPrice > 0) {

        previousCost.innerHTML = `Price: <span>${formatter.format(previousPrice)}</span><span>$</span>`;

      } else {

        previousCost.innerHTML = `Price: <span>0</span><span>$</span>`; 

      }
    };
  
  





















window.onload = function(){
	
	document.addEventListener("click",documentActions);

	function documentActions(e) {
		const  targetElement = e.target;
		if(window.innerWidth > 768 && isMobile.any()){			
			if(targetElement.classList.contains('menu_arrow')){
				targetElement.closest('.menu_item').classList.toggle('_hover');
			}
			if(!targetElement.closest('.menu_item') && document.querySelectorAll('.menu_item._hover') ,length > 0){
               document.querySelectorAll('.menu_item._hover').classList.remove("_hover");
			}
		}
		/*if(targetElement.classList.contains('search_form_icon')){
            document.querySelector('.search_form').classList.toggle('_active');
		}else if(!targetElement.closest('.search_form') && document.querySelectorAll('.search_form ._active')){
            document.querySelector('.search_form').classList.remove('_active'); 
      }*/                  
	}
}

