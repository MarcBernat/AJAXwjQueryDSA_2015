var API_BASE_URL = "https://api.themoviedb.org/3/";
var api_key = "###########";
var request_key;
var session_ID;
var user_ID;
var USERNAME = "########";
var PASSWORD = "#######";

$.ajaxSetup({
    //No hay en esta APIheaders: { 'Authorization': "Basic "+ btoa(USERNAME+':'+PASSWORD) }
});

$(document).ready(function(){
	getRequestToken();
});

/*
Details about themoviedb API 
http://docs.themoviedb.apiary.io/
*/

//Clicks
$("#button_sacar_peliculas_por_ID").click(function(e) {
	e.preventDefault();
	getPeliculasContienenNombre($("#sacar_peliculas_name").val(), 5);
});

$("#button_post_lista").click(function(e) {
	e.preventDefault();
    
    //USERNAME = $("#input_usuario").val();
    //PASSWORD = $("#input_password").val();
    var name = $("#sacar_lista_name").val();
    var descrip = $("#sacar_descripcion_lista_name").val();
    var Listanueva = new Object();
    Listanueva.name = name;
    Listanueva.description = descrip;
    
    var data = JSON.stringify(Listanueva);
    crearLista(data, session_ID);
    
    
});

$("#button_post_IDlista").click(function(e) {
	e.preventDefault();
    var IDlista = $("#sacar_ID_Lista").val();
    var IDPeli = $("#sacar_ID_Pelicula").val();
    
    var media = new Object();
    media.media_id = IDPeli;
    
    var data = JSON.stringify(media);
    
    anadiraLista(data, IDlista);
});

$("#button_remove_IDlista").click(function(e) {
	e.preventDefault();
    var IDlista = $("#sacar_ID_Lista_eliminar").val();
    var IDPeli = $("#sacar_ID_Pelicula_eliminar").val();
    
    var media = new Object();
    media.media_id = IDPeli;
    
    var data = JSON.stringify(media);
    
    removerdeLista(data, IDlista);
});

$("#button_get_lista").click(function(e) {
	e.preventDefault();
    getListas();
});

//Peticion de Tokens/Cuentas
function getRequestToken(){
    var url = API_BASE_URL + 'authentication/token/new?api_key=' + api_key;
    
    $.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
        request_key = data.request_token;
        getRequestwithAuthfromTempRequestKey(request_key);

    }).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Intento Fallido de Iniciar Sessión (Token Request Temporal) </div>').appendTo($("#span_errores"));
	});
}
function getRequestwithAuthfromTempRequestKey(request_key){
    var url = API_BASE_URL + 'authentication/token/validate_with_login?api_key=' + api_key + '&request_token=' + request_key + '&username=' + USERNAME + '&password=' + PASSWORD;
    
    $.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
        request_key = data.request_token;
        getSession_ID(request_key);

    }).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Intento Fallido de Iniciar Sessión (TokenAuthUser) </div>').appendTo($("#span_errores"));
	});
}
function getSession_ID(request_key){
    var url = API_BASE_URL + 'authentication/session/new?api_key=' + api_key + '&request_token=' + request_key;
    
    $.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
        session_ID = data.session_id;
        getInfoCuenta();

    }).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Intento Fallido de Iniciar Sessión (session_id) </div>').appendTo($("#span_errores"));
	});
}
function getInfoCuenta(){
    var url = API_BASE_URL + 'account?api_key=' + api_key + '&session_id=' + session_ID;
    $("#span_userID").text('');
    $.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
        user_ID = data.id;
        $('<br><strong> User_ID: ' + data.id + '</strong><br>').appendTo($('#span_userID'));

    }).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Intento Fallido de Sacar Información de la Cuenta </div>').appendTo($("#span_errores"));
	});
    
}
//Búsqueda
function getPeliculasContienenNombre(pelicula_name) {
	var url = API_BASE_URL + 'search/movie?api_key=' + api_key + '&query=' + pelicula_name;
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {

				var peliculas = data.results;
				$("#span_resultado_peliculas_por_ID").text('');
        
                $.each(peliculas, function(i, v) {
					var peli = v;
					$('<br><strong> Título: ' + peli.original_title + '</strong><br>').appendTo($('#span_resultado_peliculas_por_ID'));
					$('<strong> ID: </strong> ' + peli.id + '<br>').appendTo($('#span_resultado_peliculas_por_ID'));
					$('<strong> Año: </strong> ' + peli.release_date + '<br>').appendTo($('#span_resultado_peliculas_por_ID'));
                    var urlimage = 'https://image.tmdb.org/t/p/w185/'+ peli.poster_path;
					$('<img src="' + urlimage + '"> <br>').appendTo($('#span_resultado_peliculas_por_ID'));
				});

			}).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Película no encontrada </div>').appendTo($("#span_resultado_peliculas_por_ID"));
	});

}
//Listas
function crearLista(data, session_id){
    var url = API_BASE_URL + 'list?api_key=' + api_key + '&session_id=' + session_ID;
    
	$("#span_resultado_crearlista").text('');

	$.ajax({
		url : url,
		type : 'POST',
		crossDomain : true,
		dataType : 'json',
        contentType : 'application/json',
		data : data,
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Hecho</strong> Lista Creada</div>').appendTo($("#span_resultado_crearlista"));				
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#span_resultado_crearlista"));
	});
}
function anadiraLista(data, IDlista){
    var url = API_BASE_URL + 'list/' + IDlista + '/add_item?api_key=' + api_key + '&session_id=' + session_ID;
    
    $("#span_resultado_añadir_PeliaLista").text('');

	$.ajax({
		url : url,
		type : 'POST',
		crossDomain : true,
		dataType : 'json',
        contentType : 'application/json',
		data : data,
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Hecho</strong> Película Añadida </div>').appendTo($("#span_resultado_añadir_PeliaLista"));				
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#span_resultado_añadir_PeliaLista"));
	});
}
function removerdeLista(data, IDlista){
    var url = API_BASE_URL + 'list/' + IDlista + '/remove_item?api_key=' + api_key + '&session_id=' + session_ID;
    
    $("#span_resultado_eliminar_PeliaLista").text('');

	$.ajax({
		url : url,
		type : 'POST',
		crossDomain : true,
		dataType : 'json',
        contentType : 'application/json',
		data : data,
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Hecho</strong> Película Eliminada </div>').appendTo($("#span_resultado_eliminar_PeliaLista"));				
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#span_resultado_eliminar_PeliaLista"));
	});
}
function getListas(){
    var url = API_BASE_URL + 'account/' + user_ID + '/lists?api_key=' + api_key + '&session_id=' + session_ID;
    
    $.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {

				var listas = data.results;
				$("#span_resultado_getlistas").text('');
        
                $.each(listas, function(i, v) {
					var lista = v;
					$('<br><strong> Título: ' + lista.description + '</strong><br>').appendTo($('#span_resultado_getlistas'));
					$('<strong> ID: </strong> ' + lista.id + '<br>').appendTo($('#span_resultado_getlistas'));
				});

			}).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Sin Listas/Error </div>').appendTo($("#span_resultado_getlistas"));
	});

  
}

//Pruebas
function PeliCollections(peliCollection){
	this.pelis = peliCollection;
	var instance = this;

	this.buildLinks = function(header){
		if (header != null ) {
			this.links = weblinking.parseHeader(header);
		} else {
			this.links = weblinking.parseHeader('');
		}
	}

	this.getLink = function(rel){
                return this.links.getLinkValuesByRel(rel);
	}

	this.toHTML = function(){
		var html = '';
		$.each(this.pelis, function(i, v) {
			var peli = v;
            
            html = html.concat('<br><strong> Título: ' + peli.original_title + '</strong><br>');
            html = html.concat('<strong> ID: </strong> ' + peli.id + '<br>');
            html = html.concat('<strong> Año: </strong> ' + peli.release_date + '<br>');
            var urlimage = 'https://image.tmdb.org/t/p/w185/'+ peli.poster_path;
            html = html.concat('<img src="' + urlimage + '"> <br>');
		});
		
		html = html.concat(' <br> ');

                var prev = this.getLink('prev');
		if (prev.length == 1) {
			html = html.concat(' <a onClick="getPeliculasContienenNombre_Pag(\'' + prev[0].href + '\');" style="cursor: pointer; cursor: hand;">[Prev]</a> ');
		}
                var next = this.getLink('next');
		if (next.length == 1) {
			html = html.concat(' <a onClick="getPeliculasContienenNombre_Pag(\'' + next[0].href + '\');" style="cursor: pointer; cursor: hand;">[Next]</a> ');
		}

 		return html;	
	}

}
function getPeliculasContienenNombre_Pag(pelicula_name, page) {
	var url = API_BASE_URL + 'search/movie?api_key=' + api_key + '&query=' + pelicula_name + '&page=' + page;
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
        
        var response = data;
		var PeliCollection = new PeliCollections(response);
        var linkHeader = jqxhr.getResponseHeader('Link');
        PeliCollection.buildLinks(linkHeader);

		var html = PeliCollection.toHTML();
		$("#span_resultado_peliculas_por_ID").html(html);

        }).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Película no encontrada </div>').appendTo($("#span_resultado_peliculas_por_ID"));
	});

}


