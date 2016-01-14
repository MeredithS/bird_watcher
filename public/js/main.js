console.log("         _     ")
console.log("        <')_,/ ")
console.log("        (_==/  ")
console.log("birder  ='-    ")
console.log("we're hiring!  ")

var getEditBird = function(){
	console.log(this)
	$.ajax({
		url: '/sightings/'+$('#id').val()+'/edit',
		type: 'GET',
		dataType: 'json'
	}).done(getEditBirdForm)
}

var getEditBirdForm = function(birdToEdit){
	var source = $('#edit-bird-form').html();
	var template = Handlebars.compile(source);
	$('body').append(template(birdToEdit));
	$('#update-bird').on('click', updateBird);
}

var updateBird = function(){
	$.ajax({
		url:'/sightings/edit',
		type: "PUT",
		dataType: 'json',
		data:{
			bird: $('#edit-bird-type').val(),
			Location: $('#edit-location').val(),
			id: $('#_id').val()
		}
	}).done();
}

var getBirds = function(){
	$.ajax({
		url: '/sightings',
		type: 'GET',
		dataType: 'json'
	}).done(showBirds)
};
var showBirds = function(birds){
	var source = $('#bird-list').html();
	var template = Handlebars.compile(source);
	birds.forEach(function(bird){
		$('body').append(template(bird));
	});
	$('#edit-bird').on('click', getEditBird)
};

var addNewBird = function(){
	$.ajax({
		url: '/sightings',
		type: 'GET',
		dataType: 'json'
	}).done(getBirdForm)
};

var getBirdForm = function(form){
	var source = $('#add-sighting').html();
	var template = Handlebars.compile(source);
	$('body').append(template(form));
	$('#add-sighting-btn').on('click', addBird);
}

var addBird = function(event){
	event.preventDefault();
	$.ajax({
		url: '/sightings',
		type: 'POST',
		dataType: 'json',
		data:{
			sighting:{
				location: $('#location').val(),
				bird: $('#bird-type').val()
			}		
		}
	}).done(function(data) {
		var source = $('#bird-list').html();
		var template = Handlebars.compile(source);
		$('body').append(template(data));
		$('#bird-type').val('');
		$('#location').val('')
	})
}



$(document).ready(function(){
	$('#birds-link').on('click', getBirds);
	$('#add-bird-link').on('click', addNewBird);


	});