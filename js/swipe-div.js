//Variables necesarias para hacer swipe
var start = false; 		//Indica si ha empezado el movimiento
var direccion = false; 	//por defecto izq-der
var factor = 1;			//Unidad minima de factor
var factor_izq = 2;		//Incrementos de izq-der
var factor_der = 3;		//Incrementos de der-izq
var max_alpha = 0.5;	//Maximo alpha para colores
var maxvRGBA = 255;		//Maximo valor para un color
var valor_base = 200;	//Valor de base para los colores
var pos_init;			//Posicion inicial del div
var pos_min; 			//Posicion máxima a la que se puede desplazar der-izq
var pos_max;			//Posicion máxima a la que se puede desplazar izq-der
var alpha_inc;			//Incrementos de alpha para ver el color
var ancho;				//Ancho de los div swipe

function haceralgo(){

}

function movestartHandler(e){
	//Deshabilitamos cualquier evento que pueda interferir
	//$(this).unbind("taphold");
}

function moveendHandler(e){
	init_val();
	var pos = $(this).offset().left;

	if(pos != (pos_max+1) && pos != pos_min) volver_posInit(this);
	else {
		$(this).unbind();
		haceralgo();
	}
}

function moveHandler(e){
	var posA = $(this).position().left;

	if(posA > pos_min && posA < pos_max){
		//distX es lo que se ha movido el touch
		if(!start){ 
			direccion = (e.distX >= 0)? false : true;
			factor = (e.distX >= 0)? factor_izq : factor_der;
			start = true;
		}

		if(e.distX >= 0){
			//Tocamos de izq-der hasta pos_max
			if(!direccion){ 
				var nuevof = ((posA+factor) > pos_max)? pos_max - posA : factor;
				var cantidad = Math.abs(pos_max - (posA+nuevof));
				var nuevo_valor = valor_base + Math.floor(cantidad*incremento_colores);
				var nuevo_alpha = max_alpha-(cantidad*alpha_inc);

				$(this).animate({left:"+="+nuevof},0);
				$(this).children(".swipe-center").animate({ backgroundColor: 'rgba('+ nuevo_valor +',255,'+ nuevo_valor +','+ nuevo_alpha +')'}, 1);
			} else volver_posInit(this);
		} else {
			//Tocamos de der-izq hasta pos_min
			if(direccion){ 
				var nuevof = ((Math.abs(pos_min)+posA) > factor)? factor : Math.abs(pos_min)+posA;
				var cantidad = Math.abs(pos_min - (posA-nuevof));
				var nuevo_valor = valor_base + Math.floor(cantidad*incremento_colores);
				var nuevo_alpha = max_alpha-(cantidad*alpha_inc);
				
				$(this).animate({left:"-="+nuevof},0);
				$(this).children(".swipe-center").animate({ backgroundColor: 'rgba('+ nuevo_valor +','+ nuevo_valor +',255,'+ nuevo_alpha +')'}, 1);
			} else volver_posInit(this);
		}
	} else {
		init_val();
		$(this).unbind();
		haceralgo();
	}
}

//Volvemos a la posicion inicial el div
function volver_posInit(div){
	$(div).unbind("move");
	$(div).animate({left:-ancho},function(){
		$(div).bind("move",moveHandler);
		//$(div).bind("taphold",tapholdHandler);
	});
	$(div).children(".swipe-center").animate({ backgroundColor: 'rgba(255,255,255,1.0)'});
}

//Inicializar valores cambiados
function init_val(){
	start = false;
	factor = 1;
}

$(document).ready(function(){
	//Inicializamos variables
	ancho = $(".swipe-div").width();
	pos_init = $(".contenedor-swipe").position().left;
	pos_min = pos_init - ancho;
	pos_max = pos_init + ancho;
	alpha_inc = max_alpha/ancho;
	incremento_colores = (maxvRGBA-valor_base)/ancho;
	
	//Indicamos los eventos para simular el swipe     
	$(".contenedor-swipe").bind("movestart",movestartHandler);
	$(".contenedor-swipe").bind("moveend",moveendHandler);
	$(".contenedor-swipe").bind("move",moveHandler);
});